import { useState } from "react";
import Loader from "../../ui/Loader";
import useRunCode from "./useRunCode";

const exercises = [
  {
    id: 1,
    title: "Sum of Even Numbers",
    description:
      "Calculate the sum of all even numbers from 2 up to a given number N (inclusive). Even numbers are those divisible by 2 without a remainder.",
    difficulty: "easy",
    testCases: [
      {
        input: "N = 10",
        output: "30",
        explanation: "2 + 4 + 6 + 8 + 10 = 30",
      },
      {
        input: "N = 7",
        output: "12",
        explanation: "2 + 4 + 6 = 12",
      },
    ],
  },
  {
    id: 2,
    title: "Print Squares",
    description:
      "For each number from 1 to N, calculate and print its square. Print each square on a new line.",
    difficulty: "easy",
    testCases: [
      {
        input: "N = 5",
        output: "1\n4\n9\n16\n25",
        explanation: "1²=1, 2²=4, 3²=9, 4²=16, 5²=25",
      },
      {
        input: "N = 3",
        output: "1\n4\n9",
        explanation: "1²=1, 2²=4, 3²=9",
      },
    ],
  },
  {
    id: 3,
    title: "Count Vowels",
    description:
      "Count how many vowels (a, e, i, o, u) appear in a given word. Consider both lowercase and uppercase vowels.",
    difficulty: "easy",
    testCases: [
      {
        input: 'word = "Hello World"',
        output: "3",
        explanation: "e, o, o = 3 vowels",
      },
      {
        input: 'word = "PYTHON Programming"',
        output: "4",
        explanation: "O, o, a, i = 4 vowels",
      },
    ],
  },
  {
    id: 4,
    title: "Factorial (While Loop)",
    description:
      "Calculate the factorial of a positive integer N. Factorial of N (written as N!) is the product of all positive integers less than or equal to N. Use a while loop for this calculation.",
    difficulty: "easy",
    testCases: [
      {
        input: "N = 5",
        output: "120",
        explanation: "5 × 4 × 3 × 2 × 1 = 120",
      },
      {
        input: "N = 4",
        output: "24",
        explanation: "4 × 3 × 2 × 1 = 24",
      },
    ],
  },
  {
    id: 5,
    title: "Number Pyramid",
    description:
      "Print a pyramid pattern where row number i contains the digit i repeated i times. The pyramid has height H.",
    difficulty: "easy",
    testCases: [
      {
        input: "H = 4",
        output: "1\n22\n333\n4444",
        explanation:
          "Row 1: '1' repeated once, Row 2: '2' repeated twice, Row 3: '3' repeated thrice, Row 4: '4' repeated four times",
      },
      {
        input: "H = 3",
        output: "1\n22\n333",
        explanation: "Row 1: '1', Row 2: '22', Row 3: '333'",
      },
    ],
  },
  {
    id: 6,
    title: "Power Calculator",
    description:
      "Calculate base raised to the power of exponent (base^exponent) using a loop. Do not use the ** operator or built-in power functions. Both base and exponent are positive integers.",
    difficulty: "easy",
    testCases: [
      {
        input: "base = 2, exponent = 5",
        output: "32",
        explanation: "2 × 2 × 2 × 2 × 2 = 32",
      },
      {
        input: "base = 3, exponent = 4",
        output: "81",
        explanation: "3 × 3 × 3 × 3 = 81",
      },
    ],
  },
  {
    id: 7,
    title: "List of Multiples",
    description:
      "Print all multiples of X that are less than N. Print each multiple on a new line.",
    difficulty: "easy",
    testCases: [
      {
        input: "X = 3, N = 20",
        output: "3\n6\n9\n12\n15\n18",
        explanation: "Multiples of 3 less than 20: 3, 6, 9, 12, 15, 18",
      },
      {
        input: "X = 5, N = 30",
        output: "5\n10\n15\n20\n25",
        explanation: "Multiples of 5 less than 30: 5, 10, 15, 20, 25",
      },
    ],
  },
  {
    id: 8,
    title: "Guessing Game (Fixed Secret)",
    description:
      "The secret number is 7. Keep asking the user to guess the number until they get it right. After each wrong guess, print 'Try again!'. When correct, print 'Correct!' and end the program.",
    difficulty: "easy",
    testCases: [
      {
        input: "3, 5, 7",
        output: "Try again!\nTry again!\nCorrect!",
        explanation:
          "First guess 3 (wrong), second guess 5 (wrong), third guess 7 (correct)",
      },
      {
        input: "10, 2, 8, 7",
        output: "Try again!\nTry again!\nTry again!\nCorrect!",
        explanation: "Three wrong guesses followed by the correct guess",
      },
    ],
  },
  {
    id: 9,
    title: "Sum of Series 2",
    description:
      "Calculate the sum of the series: 1 + 1/2² + 1/3² + ... + 1/N². Print the result with 6 decimal places.",
    difficulty: "easy",
    testCases: [
      {
        input: "N = 3",
        output: "1.361111",
        explanation: "1 + 1/4 + 1/9 = 1 + 0.25 + 0.111111 = 1.361111",
      },
      {
        input: "N = 5",
        output: "1.463611",
        explanation: "1 + 1/4 + 1/9 + 1/16 + 1/25 = 1.463611",
      },
    ],
  },
  {
    id: 10,
    title: "Character Repeater",
    description:
      "For each character in a given string, print that character repeated N times on a new line.",
    difficulty: "easy",
    testCases: [
      {
        input: 'text = "Hi", N = 3',
        output: "HHH\niii",
        explanation:
          "'H' repeated 3 times = 'HHH', 'i' repeated 3 times = 'iii'",
      },
      {
        input: 'text = "Cat", N = 2',
        output: "CC\naa\ntt",
        explanation:
          "'C' repeated twice, 'a' repeated twice, 't' repeated twice",
      },
    ],
  },
  {
    id: 11,
    title: "Floyd's Triangle",
    description:
      "Print Floyd's Triangle with R rows. Floyd's Triangle is a right-angled triangular array of natural numbers, filled with consecutive numbers starting from 1.",
    difficulty: "medium",
    testCases: [
      {
        input: "R = 4",
        output: "1\n2 3\n4 5 6\n7 8 9 10",
        explanation: "Row 1: 1; Row 2: 2,3; Row 3: 4,5,6; Row 4: 7,8,9,10",
      },
      {
        input: "R = 3",
        output: "1\n2 3\n4 5 6",
        explanation: "Row 1: 1; Row 2: 2,3; Row 3: 4,5,6",
      },
    ],
  },
  {
    id: 12,
    title: "Prime Factors",
    description:
      "Find and print all prime factors of a given number N. Print each factor on a new line.",
    difficulty: "medium",
    testCases: [
      {
        input: "N = 84",
        output: "2\n2\n3\n7",
        explanation: "84 = 2 × 2 × 3 × 7",
      },
      {
        input: "N = 60",
        output: "2\n2\n3\n5",
        explanation: "60 = 2 × 2 × 3 × 5",
      },
    ],
  },
  {
    id: 13,
    title: "Pattern - Hollow Square",
    description:
      "Print a hollow square of asterisks (*) with side length S. The border should be asterisks, and the inside should be spaces.",
    difficulty: "medium",
    testCases: [
      {
        input: "S = 5",
        output: "*****\n*   *\n*   *\n*   *\n*****",
        explanation: "5x5 square with border of asterisks and hollow interior",
      },
      {
        input: "S = 4",
        output: "****\n*  *\n*  *\n****",
        explanation: "4x4 square with border of asterisks and hollow interior",
      },
    ],
  },
  {
    id: 14,
    title: "GCD (Euclidean Algorithm)",
    description:
      "Find the Greatest Common Divisor (GCD) of two numbers using the Euclidean algorithm. The GCD is the largest number that divides both numbers without a remainder.",
    difficulty: "medium",
    testCases: [
      {
        input: "a = 48, b = 18",
        output: "6",
        explanation:
          "GCD(48, 18) = 6. Euclidean algorithm: 48%18=12, 18%12=6, 12%6=0",
      },
      {
        input: "a = 56, b = 98",
        output: "14",
        explanation:
          "GCD(56, 98) = 14. Euclidean algorithm: 98%56=42, 56%42=14, 42%14=0",
      },
    ],
  },
  {
    id: 15,
    title: "Remove Duplicates",
    description:
      "Given a word, build a new string that contains only the first occurrence of each character, preserving the original order.",
    difficulty: "medium",
    testCases: [
      {
        input: 'word = "hello"',
        output: "helo",
        explanation: "First occurrence: h, e, l, o. The second l is removed.",
      },
      {
        input: 'word = "programming"',
        output: "progamin",
        explanation:
          "First occurrence: p, r, o, g, a, m, i, n. Duplicate letters removed.",
      },
    ],
  },
  {
    id: 16,
    title: "Collatz Sequence Step Counter",
    description:
      "The Collatz sequence starts with a number n. If n is even, divide by 2. If n is odd, multiply by 3 and add 1. Repeat until reaching 1. Count and print how many steps it takes to reach 1.",
    difficulty: "medium",
    testCases: [
      {
        input: "start = 6",
        output: "8",
        explanation: "6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1 (8 steps)",
      },
      {
        input: "start = 12",
        output: "9",
        explanation: "12 → 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1 (9 steps)",
      },
    ],
  },
  {
    id: 17,
    title: "Number Search",
    description:
      "Given a target number, then 10 numbers entered one by one. Determine if the target appears among them and count how many times it appears.",
    difficulty: "medium",
    testCases: [
      {
        input: "target = 5\nNumbers: 3, 5, 2, 5, 7, 1, 5, 4, 6, 5",
        output: "Found: Yes\nCount: 4",
        explanation: "The number 5 appears 4 times in the sequence",
      },
      {
        input: "target = 10\nNumbers: 1, 2, 3, 4, 5, 6, 7, 8, 9, 0",
        output: "Found: No\nCount: 0",
        explanation: "The number 10 does not appear in the sequence",
      },
    ],
  },
  {
    id: 18,
    title: "Multiplication Table Grid",
    description:
      "Print an N × N multiplication table in a grid format. Each number should be right-aligned in a field width of 4 spaces.",
    difficulty: "medium",
    testCases: [
      {
        input: "N = 4",
        output:
          "   1   2   3   4\n   2   4   6   8\n   3   6   9  12\n   4   8  12  16",
        explanation: "4x4 multiplication table with numbers right-aligned",
      },
      {
        input: "N = 3",
        output: "   1   2   3\n   2   4   6\n   3   6   9",
        explanation: "3x3 multiplication table with numbers right-aligned",
      },
    ],
  },
  {
    id: 19,
    title: "Inverted Pyramid",
    description:
      "Print an inverted pyramid of asterisks (*) with height H. The top row should have H asterisks, and each subsequent row should have one fewer asterisk.",
    difficulty: "medium",
    testCases: [
      {
        input: "H = 5",
        output: "*****\n****\n***\n**\n*",
        explanation:
          "Row 1: 5 asterisks, Row 2: 4, Row 3: 3, Row 4: 2, Row 5: 1",
      },
      {
        input: "H = 3",
        output: "***\n**\n*",
        explanation: "Row 1: 3 asterisks, Row 2: 2, Row 3: 1",
      },
    ],
  },
  {
    id: 20,
    title: "Palindrome Check (Loop Method)",
    description:
      "Check if a given word is a palindrome (reads the same forwards and backwards). Use a loop to compare characters from the beginning and end. Ignore case.",
    difficulty: "medium",
    testCases: [
      {
        input: 'word = "racecar"',
        output: "Palindrome",
        explanation: "racecar reversed is racecar",
      },
      {
        input: 'word = "hello"',
        output: "Not Palindrome",
        explanation: "hello reversed is olleh, which is different",
      },
    ],
  },
  {
    id: 21,
    title: "Dice Game Simulation",
    description:
      "Simulate a dice game multiple times. Rules: Start with 0 points. Roll a die (values 1-6). If you roll a 1, the game ends with score 0. If you roll 2-6, add that value to your score and continue rolling. Simulate the specified number of games and calculate the average score across all games.",
    difficulty: "hard",
    testCases: [
      {
        input: "games = 1000",
        output: "6.15",
        explanation:
          "Due to randomness, the average score typically converges around 6.0-6.2. This is an approximate expected output.",
      },
      {
        input: "games = 10000",
        output: "6.12",
        explanation:
          "With more simulations, the average score becomes more stable around the theoretical value.",
      },
    ],
  },
  {
    id: 22,
    title: "Pascal's Triangle",
    description:
      "Generate and print Pascal's Triangle with R rows. Each number is the sum of the two numbers directly above it.",
    difficulty: "hard",
    testCases: [
      {
        input: "R = 5",
        output: "    1\n   1 1\n  1 2 1\n 1 3 3 1\n1 4 6 4 1",
        explanation: "Pascal's Triangle with 5 rows, centered formatting",
      },
      {
        input: "R = 4",
        output: "   1\n  1 1\n 1 2 1\n1 3 3 1",
        explanation: "Pascal's Triangle with 4 rows, centered formatting",
      },
    ],
  },
  {
    id: 23,
    title: "Roman Numeral Converter (to integer)",
    description:
      "Convert a Roman numeral string to an integer. Roman numerals: I=1, V=5, X=10, L=50, C=100, D=500, M=1000. When a smaller value appears before a larger value, subtract it (e.g., IV = 4). Otherwise, add the values.",
    difficulty: "hard",
    testCases: [
      {
        input: 'roman = "XIV"',
        output: "14",
        explanation: "X(10) + IV(4) = 14",
      },
      {
        input: 'roman = "MCMXCIV"',
        output: "1994",
        explanation: "M(1000) + CM(900) + XC(90) + IV(4) = 1994",
      },
    ],
  },
  {
    id: 24,
    title: "Sort Three Numbers (without lists)",
    description:
      "Sort three numbers in ascending order using only conditionals and loops (no built-in sort functions or lists). Use a bubble-sort style approach with swap logic.",
    difficulty: "hard",
    testCases: [
      {
        input: "a = 15, b = 7, c = 22",
        output: "7, 15, 22",
        explanation: "Numbers sorted in ascending order",
      },
      {
        input: "a = -3, b = 0, c = -10",
        output: "-10, -3, 0",
        explanation: "Negative numbers sorted correctly",
      },
    ],
  },
  {
    id: 25,
    title: "Tic-Tac-Toe Winner Checker",
    description:
      "A 3×3 Tic-Tac-Toe board is represented by a single string of 9 characters (e.g., 'XOXOXOXOX'). Check if 'X' or 'O' has won by getting 3 in a row, column, or diagonal. Print the winner or 'No winner'.",
    difficulty: "hard",
    testCases: [
      {
        input: 'board = "XXXOOOXXX"',
        output: "X",
        explanation: "Top row has XXX (positions 0,1,2)",
      },
      {
        input: 'board = "XOXOXOXXO"',
        output: "No winner",
        explanation: "No three in a row, column, or diagonal",
      },
    ],
  },
  {
    id: 26,
    title: "Prime Number Generator (Sieve of Eratosthenes)",
    description:
      "Find all prime numbers up to a given limit N using the Sieve of Eratosthenes algorithm. Print all primes in ascending order.",
    difficulty: "hard",
    testCases: [
      {
        input: "N = 30",
        output: "2, 3, 5, 7, 11, 13, 17, 19, 23, 29",
        explanation: "All prime numbers less than or equal to 30",
      },
      {
        input: "N = 50",
        output: "2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47",
        explanation: "All prime numbers less than or equal to 50",
      },
    ],
  },
  {
    id: 27,
    title: "Caesar Cipher",
    description:
      "Encrypt a message using the Caesar cipher. Shift each letter by a given shift value (1-25). Wrap around from z to a. Preserve case (uppercase stays uppercase, lowercase stays lowercase). Non-letters remain unchanged.",
    difficulty: "hard",
    testCases: [
      {
        input: 'message = "Hello World", shift = 3',
        output: "Khoor Zruog",
        explanation:
          "H→K, e→h, l→o, l→o, o→r, (space), W→Z, o→r, r→u, l→o, d→g",
      },
      {
        input: 'message = "Python", shift = 13',
        output: "Clguba",
        explanation: "P→C, y→l, t→g, h→u, o→b, n→a (ROT13)",
      },
    ],
  },
  {
    id: 28,
    title: "Digital Root",
    description:
      "Find the digital root of a large integer by repeatedly summing its digits until a single-digit number is obtained.",
    difficulty: "hard",
    testCases: [
      {
        input: "number = 987",
        output: "6",
        explanation: "9+8+7=24, 2+4=6",
      },
      {
        input: "number = 123456789",
        output: "9",
        explanation: "1+2+3+4+5+6+7+8+9=45, 4+5=9",
      },
    ],
  },
  {
    id: 29,
    title: "Loan Amortization Schedule",
    description:
      "Calculate a loan amortization schedule. Given loan amount, annual interest rate (%), and number of years, calculate the monthly payment. Then for each month, calculate interest paid, principal paid, and remaining balance. Print the first 12 months and the final total interest paid.",
    difficulty: "hard",
    testCases: [
      {
        input: "loan = 10000, rate = 5, years = 3",
        output:
          "Month 1: Interest = 41.67, Principal = 257.15, Balance = 9742.85\nMonth 2: Interest = 40.60, Principal = 258.22, Balance = 9484.63\n...\nMonth 12: Interest = 34.54, Principal = 264.28, Balance = 6894.12\nTotal Interest Paid = 792.45",
        explanation:
          "Amortization schedule for a $10,000 loan at 5% over 3 years",
      },
      {
        input: "loan = 200000, rate = 4.5, years = 30",
        output:
          "Month 1: Interest = 750.00, Principal = 263.28, Balance = 199736.72\nMonth 2: Interest = 749.01, Principal = 264.27, Balance = 199472.45\n...\nMonth 12: Interest = 737.58, Principal = 275.70, Balance = 196875.23\nTotal Interest Paid = 164813.42",
        explanation:
          "Amortization schedule for a $200,000 mortgage at 4.5% over 30 years",
      },
    ],
  },
  {
    id: 30,
    title: "Conway's Game of Life (Single Generation)",
    description:
      "Implement one generation of Conway's Game of Life on a 5×5 grid. Rules: A live cell (1) with 2 or 3 live neighbors survives. A dead cell (0) with exactly 3 live neighbors becomes alive. All other cells die or remain dead. Print the starting grid and the next generation grid.",
    difficulty: "hard",
    testCases: [
      {
        input: "00000\n00100\n00100\n00100\n00000",
        output:
          "Starting Grid:\n00000\n00100\n00100\n00100\n00000\n\nNext Generation:\n00000\n00000\n01110\n00000\n00000",
        explanation:
          "The vertical line of 3 cells (blinker) becomes a horizontal line of 3 cells",
      },
      {
        input: "01000\n01100\n00100\n00000\n00000",
        output:
          "Starting Grid:\n01000\n01100\n00100\n00000\n00000\n\nNext Generation:\n00100\n01100\n00100\n00000\n00000",
        explanation:
          "A small pattern rotates orientation according to Game of Life rules",
      },
    ],
  },
];

function LoopsExercise() {
  const [code, setCode] = useState(
    "# Write your Python code here\n# Example: Print numbers using a loop\nfor i in range(5):\n    print(i)",
  );
  const { runCode, isLoading, data, status } = useRunCode();

  const selectedExercise = exercises.find((ex) => ex.id === 24);

  const handleRunCode = () => {
    runCode({ code, problemId: 24 });
  };

  const handleClearCode = () => {
    setCode("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-offwite to-light_blue p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-dark_blue mb-2">
            Loops Exercise
          </h1>
          <p className="text-lg text-medium_blue font-semibold">
            Practice loops by writing and running Python code
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 h-fit">
            <h2 className="text-3xl font-bold text-dark_blue mb-2">
              Problem: {selectedExercise?.title}
            </h2>

            <div className="space-y-6 text-base text-dark_blue leading-relaxed">
              <div>
                <h3 className="text-lg font-bold text-medium_blue mb-2">
                  Description
                </h3>
                <p>{selectedExercise?.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-medium_blue mb-3">
                  Test Cases
                </h3>
                <div className="space-y-4">
                  {selectedExercise?.testCases.map((testCase, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-medium_blue bg-light_blue bg-opacity-30 p-4 rounded"
                    >
                      <div className="mb-2">
                        <p className="font-bold text-medium_blue">Input:</p>
                        <p className="font-mono text-sm bg-dark_blue text-offwite p-2 rounded mt-1">
                          {testCase.input}
                        </p>
                      </div>
                      <div className="mb-2">
                        <p className="font-bold text-medium_blue">
                          Expected Output:
                        </p>
                        <p className="font-mono text-sm bg-dark_blue text-offwite p-2 rounded mt-1 whitespace-pre-wrap break-words">
                          {testCase.output}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-medium_blue">
                          Explanation:
                        </p>
                        <p className="text-sm mt-1">{testCase.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-dark_blue text-offwite px-6 py-4">
                <h3 className="text-lg font-bold">Python Code Editor</h3>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-80 p-4 font-mono text-sm bg-dark_blue text-offwite resize-none focus:outline-none focus:ring-2 focus:ring-medium_blue"
                placeholder="Write your Python code here..."
                spellCheck="false"
              />

              <div className="flex gap-4 p-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={handleRunCode}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-medium_blue text-offwite font-bold rounded-lg hover:bg-dark_blue transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {isLoading ? "Running..." : "▶ Run Code"}
                </button>

                <button
                  onClick={handleClearCode}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-gray-400 text-white font-bold rounded-lg hover:bg-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div
                className={`px-6 py-4 text-offwite font-bold text-lg ${
                  status === "success"
                    ? "bg-green-600"
                    : status === "error"
                      ? "bg-red-600"
                      : "bg-dark_blue"
                }`}
              >
                {status === "success"
                  ? "✓ Execution Successful"
                  : status === "error"
                    ? "✗ Execution Error"
                    : "Output"}
              </div>

              <div
                className={`p-6 font-mono text-sm min-h-48 max-h-48 overflow-y-auto ${
                  status === "error"
                    ? "bg-red-50 text-red-800"
                    : "bg-dark_blue text-offwite"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader size="md" />
                  </div>
                ) : data ? (
                  <pre className="whitespace-pre-wrap break-words">{data}</pre>
                ) : (
                  <p className="text-gray-400">
                    {status === "idle"
                      ? "Click 'Run Code' to see output..."
                      : "No output"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoopsExercise;
