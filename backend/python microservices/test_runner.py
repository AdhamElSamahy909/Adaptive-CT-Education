import re
import json

def extract_function_name(code: str) -> str:
    """Extract the function name from the code using regex."""
    match = re.search(r'def\s+(\w+)\s*\(', code)
    if match:
        return match.group(1)
    raise ValueError("No function definition found in the code")

def parse_function_parameters(input_str: str) -> dict:
    """
    Parse input string to extract function parameters.
    Expected format: "a = 15, b = 7, c = 22" or "N = 10"
    Returns: dict like {"a": 15, "b": 7, "c": 22}
    """
    params = {}
    input_str = input_str.strip()
    
    if not input_str:
        return params
    
    # Split by commas that are not inside quotes
    parts = re.split(r',\s*(?=\w+\s*=)', input_str)
    
    for part in parts:
        part = part.strip()
        if '=' in part:
            # Split on the first '=' to handle strings with '=' in them
            name, value = part.split('=', 1)
            name = name.strip()
            value = value.strip()
            
            # Try to evaluate the value (handles strings, integers, floats, etc.)
            try:
                params[name] = eval(value)
            except:
                # If eval fails, treat as string
                params[name] = value
    
    return params

def create_test_runner(code: str, title: str, test_case: dict) -> str:
    """
    Create a test runner script that executes a function and compares output.
    Handles both functions that return values and functions that print to stdout.
    """
    try:
        function_name = extract_function_name(code)
    except ValueError:
        function_name = "unknown"
    
    params = parse_function_parameters(test_case["input"])
    expected_output = test_case["output"].strip()
    params_json = json.dumps(params)

    return f'''
import json
import sys
import traceback
from io import StringIO

params = {params_json}
func_name = {json.dumps(function_name)}

captured = StringIO()
sys.stdout = captured
namespace = {{}}

try:
    # Execute the code to define the function
    exec(compile({repr(code)}, "<solution>", "exec"), namespace)
    
    # Get the function from the namespace
    if func_name not in namespace:
        raise ValueError(f"Function '{{func_name}}' not found in the submitted code")
    
    func = namespace[func_name]
    
    # Call the function with the parsed parameters
    result = func(**params)
    
except SystemExit:
    pass
    
except Exception:
    sys.stdout = sys.__stdout__
    error_msg = traceback.format_exc()
    print(json.dumps({{"passed": False, "error": error_msg}}))
    sys.exit(1)
    
finally:
    sys.stdout = sys.__stdout__
    
# Get stdout output
stdout_output = captured.getvalue().strip()

# Determine the actual output: use returned value if not None, otherwise use stdout
if result is not None:
    # Special handling for tuples: format as comma-separated without parentheses
    if isinstance(result, tuple):
        actual_output = ", ".join(str(item) for item in result)
    else:
        actual_output = str(result).strip()
else:
    actual_output = stdout_output

expected = {json.dumps(expected_output)}

passed = actual_output == expected
print(json.dumps({{
    "passed": passed,
    "output": actual_output,
    "expected": expected
}}))'''