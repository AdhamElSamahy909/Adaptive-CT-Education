from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Any, Optional
import docker
import tempfile
import os
import uuid
import time
import json
import asyncio
from datetime import datetime

app = FastAPI(title="Code Execution Service")

# Initialize Docker client
docker_client = docker.DockerClient(base_url='unix://var/run/docker.sock')

# Problem definitions (in production, store in database)
PROBLEMS = {
    "two-sum": {
        "id": "two-sum",
        "function_name": "twoSum",
        "test_cases": [
            {"input": [[2, 7, 11, 15], 9], "expected": [0, 1]},
            {"input": [[3, 2, 4], 6], "expected": [1, 2]},
            {"input": [[3, 3], 6], "expected": [0, 1]}
        ],
        "starter_code": """class Solution:
    def twoSum(self, nums, target):
        # Write your code here
        pass
"""
    }
}

# Request/Response Models
class ExecuteRequest(BaseModel):
    code: str
    problem_id: str
    timeout: int = 5

class TestResult(BaseModel):
    test_case: int
    passed: bool
    output: Any = None
    expected: Any = None
    error: Optional[str] = None
    execution_time: float = 0

class ExecuteResponse(BaseModel):
    success: bool
    results: List[TestResult]
    total_tests: int
    passed_tests: int
    total_execution_time: float

@app.get("/problems")
async def get_problems():
    """Get all available problems"""
    return list(PROBLEMS.values())

@app.get("/problems/{problem_id}")
async def get_problem(problem_id: str):
    """Get a specific problem"""
    if problem_id not in PROBLEMS:
        raise HTTPException(status_code=404, detail="Problem not found")
    return PROBLEMS[problem_id]

@app.post("/execute", response_model=ExecuteResponse)
async def execute_code(request: ExecuteRequest):
    """Execute user code in isolated Docker container"""
    
    if request.problem_id not in PROBLEMS:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    problem = PROBLEMS[request.problem_id]
    start_time = time.time()
    results = []
    
    # Execute each test case
    for idx, test_case in enumerate(problem["test_cases"]):
        print(f"Running test case {idx + 1} for {request.problem_id}")
        
        result = await run_test_case_in_docker(
            code=request.code,
            function_name=problem["function_name"],
            test_case=test_case,
            timeout=request.timeout,
            test_case_number=idx + 1
        )
        
        results.append(TestResult(
            test_case=idx + 1,
            passed=result["passed"],
            output=result.get("output"),
            expected=test_case["expected"] if not result["passed"] else None,
            error=result.get("error"),
            execution_time=result.get("execution_time", 0)
        ))
        
        # Stop on first failure
        if not result["passed"]:
            print(f"Test case {idx + 1} failed, stopping execution")
            break
    
    total_time = time.time() - start_time
    
    return ExecuteResponse(
        success=all(r.passed for r in results),
        results=results,
        total_tests=len(problem["test_cases"]),
        passed_tests=sum(1 for r in results if r.passed),
        total_execution_time=total_time
    )

async def run_test_case_in_docker(code: str, function_name: str, test_case: dict, 
                                  timeout: int, test_case_number: int):
    """Run a single test case in a Docker container"""
    
    execution_id = str(uuid.uuid4())
    container = None
    
    # Create test runner script
    test_runner_code = create_test_runner(code, function_name, test_case)
    
    # Create temporary file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(test_runner_code)
        temp_file_path = f.name
    
    try:
        print(f"Starting Docker container for execution {execution_id}")
        test_start_time = time.time()
        
        # Run Docker container for THIS test case only
        container = docker_client.containers.run(
            image="python-sandbox",  # Use our custom image
            command=f"python /code/{os.path.basename(temp_file_path)}",
            volumes={
                os.path.dirname(temp_file_path): {"bind": "/code", "mode": "ro"}
            },
            mem_limit="256m",           # 256MB memory limit
            memswap_limit="256m",       # No swap
            cpu_period=100000,          # CPU period
            cpu_quota=50000,            # 50% of one CPU
            network_disabled=True,      # No network access
            read_only=True,             # Read-only filesystem
            security_opt=["no-new-privileges:true"],  # No privilege escalation
            cap_drop=["ALL"],           # Drop all Linux capabilities
            detach=True,
            remove=False                # We'll remove manually
        )
        
        # Wait for container to finish with timeout
        try:
            # Use asyncio to handle timeout
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None, 
                lambda: container.wait(timeout=timeout)
            )
            
            # Get logs
            logs = container.logs(stdout=True, stderr=True).decode('utf-8')
            execution_time = time.time() - test_start_time
            
            print(f"Container {execution_id} completed in {execution_time:.2f}s")
            
            # Parse the output
            if result["StatusCode"] == 0:
                # Try to parse JSON output
                try:
                    # Find the JSON output in logs
                    for line in logs.strip().split('\n'):
                        if line.startswith('{'):
                            output_data = json.loads(line)
                            return {
                                "passed": output_data.get("passed", False),
                                "output": output_data.get("output"),
                                "error": output_data.get("error"),
                                "execution_time": execution_time
                            }
                    
                    # If no JSON found but exit code 0, it might still be valid
                    return {
                        "passed": True,
                        "output": logs.strip(),
                        "execution_time": execution_time
                    }
                    
                except json.JSONDecodeError:
                    return {
                        "passed": False,
                        "error": f"Invalid output format. Raw output:\n{logs}",
                        "execution_time": execution_time
                    }
            else:
                # Container failed
                return {
                    "passed": False,
                    "error": f"Execution failed with code {result['StatusCode']}:\n{logs}",
                    "execution_time": execution_time
                }
                
        except Exception as e:
            # Timeout or other error
            execution_time = time.time() - test_start_time
            return {
                "passed": False,
                "error": f"Timeout after {timeout} seconds" if "timeout" in str(e).lower() else str(e),
                "execution_time": execution_time
            }
            
    except Exception as e:
        return {
            "passed": False,
            "error": f"Docker execution error: {str(e)}",
            "execution_time": 0
        }
        
    finally:
        # Clean up container and temp file
        if container:
            try:
                container.remove(force=True)
                print(f"Removed container {execution_id}")
            except:
                pass
        
        # Clean up temp file
        try:
            os.unlink(temp_file_path)
        except:
            pass

def create_test_runner(code: str, function_name: str, test_case: dict) -> str:
    """Create Python script that runs the user code against a test case"""
    
    return f'''
import json
import sys
import traceback

# User's code
{code}

try:
    # Create solution instance
    solution = Solution()
    
    # Get the function
    func = getattr(solution, '{function_name}')
    
    # Run the test case
    input_data = {json.dumps(test_case["input"])}
    expected = {json.dumps(test_case["expected"])}
    
    # Call the function
    result = func(*input_data)
    
    # Convert to JSON-serializable format
    if isinstance(result, (list, tuple)):
        result = list(result)
    
    # Compare results
    if result == expected:
        output = {{"passed": True, "output": result}}
    else:
        output = {{"passed": False, "output": result}}
    
    print(json.dumps(output))
    
except Exception as e:
    error_msg = traceback.format_exc()
    output = {{"passed": False, "error": error_msg}}
    print(json.dumps(output))
'''

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Check if Docker is available
        docker_client.ping()
        docker_status = "healthy"
    except:
        docker_status = "unhealthy"
    
    return {
        "status": "healthy",
        "docker": docker_status,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)