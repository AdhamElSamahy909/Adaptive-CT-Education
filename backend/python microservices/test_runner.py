import re
import json

def parse_inputs(input_str: str) -> list[str]:
    results = []

    for line in input_str.split("\n"):
        line = line.strip()
        if not line:
            continue

        assignment_matches = list(re.finditer(
            r'\w+\s*=\s*("(?:[^"\\]|\\.)*"|\'(?:[^\'\\]|\\.)*\'|[^,]+?)(?=\s*,\s*\w+\s*=|$)',
            line
        ))

        if assignment_matches:
            for m in assignment_matches:
                val = re.sub(r'^\w+\s*=\s*', '', m.group(0).strip()).strip()

                if (val.startswith('"') and val.endswith('"')) or \
                    (val.startswith("'") and val.endswith("'")):
                    val = val[1:-1]
                results.append(val)
        else:
            label_match = re.match(r'^\w[\w\s]*:\s*(.+)$', line)
            if label_match:
                for v in label_match.group(1).split(','):
                    results.append(v.strip())

            elif ',' in line:
                for v in line.split():
                    results.append(v.strip())
            
            else:
                results.append(line)
    return [r for r in results if r]

def create_test_runner(code: str, function_name: str, test_case: dict) -> str:
    input_values = parse_inputs(test_case["input"])
    expected_output = test_case["output"].strip()

    return f'''
import json
import sys
import traceback
import builtins
from io import StringIO

input_queue = {json.dumps(input_values)}
input_index = [0]

def mock_input(prompt=""):
    if input_index[0] < len(input_queue):
        val = input_queue[input_index[0]]
        input_index[0] += 1
        return val
    raise EOFError(f"Student code requested more inputs than provided (exhausted after {{len(input_queue)}} values)")
    
builtins.input = mock_input

captured = StringIO()
sys.stdout = captured

try:
    exec(compile({repr(code)}, "<solution>", "exec"), {{}})
    
except SystemExit:
    pass
    
except Exception:
    sys.stdout = sys.__stdout__
    error_msg = traceback.format_exc()
    print(json.dumps({{"passed": False, "error": error_msg}}))
    sys.exit(1)
    
finally:
    sys.stdout = sys.__stdout__
    
actual_output = captured.getvalue().strip()
expected = {json.dumps(expected_output)}

passed = actual_output == expected
print(json.dumps({{
    "passed": passed,
    "output": actual_output,
    "expected": expected
}}))'''