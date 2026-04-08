import { useState, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import Loader from "../../ui/Loader";
import useRunCode from "./useRunCode";
import useUser from "../authentication/useUser";
import useInferDifficulty from "../bayesianNetworks/useInferDifficulty";
import useInferLearningStyle from "../bayesianNetworks/useInferLearningStyle";
import { useNavigate } from "react-router-dom";
import useDetectStruggle from "../struggle_detection/useDetectStruggle";
import useGetExercises from "./useGetExercises";

// const exercises = [
//   {
//     id: 1,
//     title: "Sum of Even Numbers",
//     description:
//       "Calculate the sum of all even numbers from 2 up to a given number N (inclusive). Even numbers are those divisible by 2 without a remainder.",
//     difficulty: "easy",
//     starterCode: `def sum_of_even_numbers(N: int) -> int:
//     # Write your code here
//     pass`,
//     testCases: [
//       { input: "N = 10", output: "30", explanation: "2 + 4 + 6 + 8 + 10 = 30" },
//       { input: "N = 7", output: "12", explanation: "2 + 4 + 6 = 12" },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Initialize a variable 'total' to 0.\n2. Loop through numbers from 2 to N (inclusive).\n3. For each number, check if it is even (number % 2 == 0).\n4. If even, add it to 'total'.\n5. After the loop, return 'total'.",
//       visual:
//         "Start → total=0 → i=2 → i<=N? → Yes → i%2==0? → Yes → total+=i → i++ → loop → No → return total",
//     },
//   },
//   {
//     id: 2,
//     title: "Print Squares",
//     description:
//       "For each number from 1 to N, calculate and print its square. Print each square on a new line.",
//     difficulty: "easy",
//     starterCode: `def print_squares(N: int) -> None:
//     # Write your code here
//     pass`,
//     testCases: [
//       {
//         input: "N = 5",
//         output: "1\n4\n9\n16\n25",
//         explanation: "1²=1, 2²=4, 3²=9, 4²=16, 5²=25",
//       },
//       { input: "N = 3", output: "1\n4\n9", explanation: "1²=1, 2²=4, 3²=9" },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Loop through numbers from 1 to N.\n2. For each number, calculate its square (i * i).\n3. Print the square on a new line.",
//       visual:
//         "Start → i=1 → i<=N? → Yes → square = i*i → print(square) → i++ → loop → No → end",
//     },
//   },
//   {
//     id: 3,
//     title: "Count Vowels",
//     description:
//       "Count how many vowels (a, e, i, o, u) appear in a given word. Consider both lowercase and uppercase vowels.",
//     difficulty: "easy",
//     starterCode: `def count_vowels(word: str) -> int:
//     # Write your code here
//     pass`,
//     testCases: [
//       {
//         input: 'word = "Hello World"',
//         output: "3",
//         explanation: "e, o, o = 3 vowels",
//       },
//       {
//         input: 'word = "PYTHON Programming"',
//         output: "4",
//         explanation: "O, o, a, i = 4 vowels",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Initialize count = 0.\n2. Define a set of vowels: 'aeiouAEIOU'.\n3. Loop through each character in the word.\n4. If character is in the vowel set, increment count.\n5. Return count.",
//       visual:
//         "Start → count=0 → for each char in word → char in vowels? → Yes → count++ → next char → end → return count",
//     },
//   },
//   {
//     id: 4,
//     title: "Factorial (While Loop)",
//     description:
//       "Calculate the factorial of a positive integer N. Factorial of N (written as N!) is the product of all positive integers less than or equal to N. Use a while loop for this calculation.",
//     difficulty: "easy",
//     starterCode: `def factorial(N: int) -> int:
//     # Write your code here using a while loop
//     pass`,
//     testCases: [
//       { input: "N = 5", output: "120", explanation: "5 × 4 × 3 × 2 × 1 = 120" },
//       { input: "N = 4", output: "24", explanation: "4 × 3 × 2 × 1 = 24" },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Initialize result = 1.\n2. Initialize counter = N.\n3. While counter > 0:\n   - Multiply result by counter.\n   - Decrement counter by 1.\n4. Return result.",
//       visual:
//         "Start → result=1, i=N → i>0? → Yes → result*=i → i-- → loop → No → return result",
//     },
//   },
//   {
//     id: 5,
//     title: "Number Pyramid",
//     description:
//       "Print a pyramid pattern where row number i contains the digit i repeated i times. The pyramid has height H.",
//     difficulty: "easy",
//     starterCode: `def number_pyramid(H: int) -> None:
//     # Write your code here
//     pass`,
//     testCases: [
//       {
//         input: "H = 4",
//         output: "1\n22\n333\n4444",
//         explanation:
//           "Row 1: '1' repeated once, Row 2: '2' repeated twice, Row 3: '3' repeated thrice, Row 4: '4' repeated four times",
//       },
//       {
//         input: "H = 3",
//         output: "1\n22\n333",
//         explanation: "Row 1: '1', Row 2: '22', Row 3: '333'",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Loop row from 1 to H.\n2. For each row, print the digit 'row' repeated 'row' times.\n3. Use print(str(row) * row) to achieve repetition.",
//       visual:
//         "Start → row=1 → row<=H? → Yes → print(str(row)*row) → row++ → loop → No → end",
//     },
//   },
//   {
//     id: 6,
//     title: "Power Calculator",
//     description:
//       "Calculate base raised to the power of exponent (base^exponent) using a loop. Do not use the ** operator or built-in power functions. Both base and exponent are positive integers.",
//     difficulty: "easy",
//     starterCode: `def power(base: int, exponent: int) -> int:
//     # Write your code here without using ** operator
//     pass`,
//     testCases: [
//       {
//         input: "base = 2, exponent = 5",
//         output: "32",
//         explanation: "2 × 2 × 2 × 2 × 2 = 32",
//       },
//       {
//         input: "base = 3, exponent = 4",
//         output: "81",
//         explanation: "3 × 3 × 3 × 3 = 81",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Initialize result = 1.\n2. Loop from 1 to exponent.\n3. Multiply result by base each time.\n4. Return result.",
//       visual:
//         "Start → result=1, i=1 → i<=exponent? → Yes → result*=base → i++ → loop → No → return result",
//     },
//   },
//   {
//     id: 7,
//     title: "List of Multiples",
//     description:
//       "Print all multiples of X that are less than N. Print each multiple on a new line.",
//     difficulty: "easy",
//     starterCode: `def list_multiples(X: int, N: int) -> None:
//     # Write your code here
//     pass`,
//     testCases: [
//       {
//         input: "X = 3, N = 20",
//         output: "3\n6\n9\n12\n15\n18",
//         explanation: "Multiples of 3 less than 20: 3, 6, 9, 12, 15, 18",
//       },
//       {
//         input: "X = 5, N = 30",
//         output: "5\n10\n15\n20\n25",
//         explanation: "Multiples of 5 less than 30: 5, 10, 15, 20, 25",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Start with multiple = X.\n2. While multiple < N:\n   - Print multiple.\n   - Increase multiple by X.",
//       visual: "Start → m=X → m<N? → Yes → print(m) → m+=X → loop → No → end",
//     },
//   },
//   {
//     id: 8,
//     title: "Guessing Game (Fixed Secret)",
//     description:
//       "The secret number is 7. Keep asking the user to guess the number until they get it right. After each wrong guess, print 'Try again!'. When correct, print 'Correct!' and end the program.",
//     difficulty: "easy",
//     starterCode: `def guessing_game(guesses: list) -> None:
//     # Write your code here
//     # Note: In actual implementation, you would use input()
//     # For testing, guesses list is provided
//     pass`,
//     testCases: [
//       {
//         input: "3, 5, 7",
//         output: "Try again!\nTry again!\nCorrect!",
//         explanation:
//           "First guess 3 (wrong), second guess 5 (wrong), third guess 7 (correct)",
//       },
//       {
//         input: "10, 2, 8, 7",
//         output: "Try again!\nTry again!\nTry again!\nCorrect!",
//         explanation: "Three wrong guesses followed by the correct guess",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Secret = 7.\n2. Loop forever:\n   - Read guess.\n   - If guess == secret: print('Correct!') and break.\n   - Else: print('Try again!').",
//       visual:
//         "Start → secret=7 → read guess → guess==7? → Yes → print('Correct!') → end\n                  → No → print('Try again!') → loop",
//     },
//   },
//   {
//     id: 9,
//     title: "Sum of Series 2",
//     description:
//       "Calculate the sum of the series: 1 + 1/2² + 1/3² + ... + 1/N². Print the result with 6 decimal places.",
//     difficulty: "easy",
//     starterCode: `def sum_series(N: int) -> float:
//     # Write your code here
//     pass`,
//     testCases: [
//       {
//         input: "N = 3",
//         output: "1.361111",
//         explanation: "1 + 1/4 + 1/9 = 1 + 0.25 + 0.111111 = 1.361111",
//       },
//       {
//         input: "N = 5",
//         output: "1.463611",
//         explanation: "1 + 1/4 + 1/9 + 1/16 + 1/25 = 1.463611",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Initialize total = 0.0.\n2. Loop i from 1 to N.\n3. Add 1/(i*i) to total.\n4. After loop, print total formatted to 6 decimal places.",
//       visual:
//         "Start → total=0, i=1 → i<=N? → Yes → total+=1/(i*i) → i++ → loop → No → print(f'{total:.6f}')",
//     },
//   },
//   {
//     id: 10,
//     title: "Character Repeater",
//     description:
//       "For each character in a given string, print that character repeated N times on a new line.",
//     difficulty: "easy",
//     starterCode: `def character_repeater(text: str, N: int) -> None:
//     # Write your code here
//     pass`,
//     testCases: [
//       {
//         input: 'text = "Hi", N = 3',
//         output: "HHH\niii",
//         explanation:
//           "'H' repeated 3 times = 'HHH', 'i' repeated 3 times = 'iii'",
//       },
//       {
//         input: 'text = "Cat", N = 2',
//         output: "CC\naa\ntt",
//         explanation:
//           "'C' repeated twice, 'a' repeated twice, 't' repeated twice",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Loop through each character in the string.\n2. For each character, print the character repeated N times.\n3. Use print(char * N) to repeat.",
//       visual: "Start → for each char in text → print(char*N) → next char → end",
//     },
//   },
//   {
//     id: 11,
//     title: "Floyd's Triangle",
//     description:
//       "Print Floyd's Triangle with R rows. Floyd's Triangle is a right-angled triangular array of natural numbers, filled with consecutive numbers starting from 1.",
//     difficulty: "medium",
//     starterCode: `def floyds_triangle(R: int) -> None:
//     # Write your code here
//     pass`,
//     testCases: [
//       {
//         input: "R = 4",
//         output: "1\n2 3\n4 5 6\n7 8 9 10",
//         explanation: "Row 1: 1; Row 2: 2,3; Row 3: 4,5,6; Row 4: 7,8,9,10",
//       },
//       {
//         input: "R = 3",
//         output: "1\n2 3\n4 5 6",
//         explanation: "Row 1: 1; Row 2: 2,3; Row 3: 4,5,6",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Initialize current = 1.\n2. For row from 1 to R:\n   - For col from 1 to row:\n       - Print current, then increment current.\n   - Print newline.",
//       visual:
//         "Start → curr=1 → row=1→row<=R? → Yes → col=1→col<=row? → Yes → print(curr) → curr++ → col++ → loop col → newline → row++",
//     },
//   },
//   {
//     id: 12,
//     title: "Prime Factors",
//     description:
//       "Find and print all prime factors of a given number N. Print each factor on a new line.",
//     difficulty: "medium",
//     starterCode: `def prime_factors(N: int) -> list:
//     # Return a list of prime factors
//     pass`,
//     testCases: [
//       {
//         input: "N = 84",
//         output: "2\n2\n3\n7",
//         explanation: "84 = 2 × 2 × 3 × 7",
//       },
//       {
//         input: "N = 60",
//         output: "2\n2\n3\n5",
//         explanation: "60 = 2 × 2 × 3 × 5",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Initialize factors = [] and i = 2.\n2. While i * i <= N:\n   - While N % i == 0:\n        append i to factors, N //= i.\n   - i += 1.\n3. If N > 1, append N.\n4. Return factors.",
//       visual:
//         "Start → factors=[], i=2 → i*i<=N? → Yes → N%i==0? → Yes → factors.append(i), N/=i → loop → i++ → after loop → if N>1 append N → return factors",
//     },
//   },
//   {
//     id: 13,
//     title: "Pattern - Hollow Square",
//     description:
//       "Print a hollow square of asterisks (*) with side length S. The border should be asterisks, and the inside should be spaces.",
//     difficulty: "medium",
//     starterCode: `def hollow_square(S: int) -> None:
//     # Write your code here
//     pass`,
//     testCases: [
//       {
//         input: "S = 5",
//         output: "*****\n*   *\n*   *\n*   *\n*****",
//         explanation: "5x5 square with border of asterisks and hollow interior",
//       },
//       {
//         input: "S = 4",
//         output: "****\n*  *\n*  *\n****",
//         explanation: "4x4 square with border of asterisks and hollow interior",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. For row from 1 to S:\n   - For col from 1 to S:\n        - If row==1 or row==S or col==1 or col==S: print '*', else print space.\n   - Print newline.",
//       visual:
//         "Start → row=1→row<=S? → Yes → col=1→col<=S? → Yes → if border: print('*') else print(' ') → col++ → newline → row++",
//     },
//   },
//   {
//     id: 14,
//     title: "GCD (Euclidean Algorithm)",
//     description:
//       "Find the Greatest Common Divisor (GCD) of two numbers using the Euclidean algorithm. The GCD is the largest number that divides both numbers without a remainder.",
//     difficulty: "medium",
//     starterCode: `def gcd(a: int, b: int) -> int:
//     # Write your code here using Euclidean algorithm
//     pass`,
//     testCases: [
//       {
//         input: "a = 48, b = 18",
//         output: "6",
//         explanation:
//           "GCD(48, 18) = 6. Euclidean algorithm: 48%18=12, 18%12=6, 12%6=0",
//       },
//       {
//         input: "a = 56, b = 98",
//         output: "14",
//         explanation:
//           "GCD(56, 98) = 14. Euclidean algorithm: 98%56=42, 56%42=14, 42%14=0",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. While b != 0:\n   - Set temp = b.\n   - Set b = a % b.\n   - Set a = temp.\n2. Return a.",
//       visual: "Start → while b≠0: temp=b, b=a%b, a=temp → loop → return a",
//     },
//   },
//   {
//     id: 15,
//     title: "Remove Duplicates",
//     description:
//       "Given a word, build a new string that contains only the first occurrence of each character, preserving the original order.",
//     difficulty: "medium",
//     starterCode: `def remove_duplicates(word: str) -> str:
//     # Write your code here
//     pass`,
//     testCases: [
//       {
//         input: 'word = "hello"',
//         output: "helo",
//         explanation: "First occurrence: h, e, l, o. The second l is removed.",
//       },
//       {
//         input: 'word = "programming"',
//         output: "progamin",
//         explanation:
//           "First occurrence: p, r, o, g, a, m, i, n. Duplicate letters removed.",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Initialize empty result string and empty set seen.\n2. For each char in word:\n   - If char not in seen: add to result and seen.\n3. Return result.",
//       visual:
//         "Start → result='', seen=set() → for each char → char in seen? → No → result+=char, seen.add(char) → next char → return result",
//     },
//   },
//   {
//     id: 16,
//     title: "Collatz Sequence Step Counter",
//     description:
//       "The Collatz sequence starts with a number n. If n is even, divide by 2. If n is odd, multiply by 3 and add 1. Repeat until reaching 1. Count and print how many steps it takes to reach 1.",
//     difficulty: "medium",
//     starterCode: `def collatz_steps(start: int) -> int:
//     # Write your code here
//     pass`,
//     testCases: [
//       {
//         input: "start = 6",
//         output: "8",
//         explanation: "6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1 (8 steps)",
//       },
//       {
//         input: "start = 12",
//         output: "9",
//         explanation: "12 → 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1 (9 steps)",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Initialize steps = 0, n = start.\n2. While n != 1:\n   - If n % 2 == 0: n //= 2.\n   - Else: n = 3*n + 1.\n   - steps++.\n3. Return steps.",
//       visual:
//         "Start → steps=0, n=start → n≠1? → Yes → n%2==0? → Yes → n/=2 → No → n=3n+1 → steps++ → loop → return steps",
//     },
//   },
//   {
//     id: 17,
//     title: "Number Search",
//     description:
//       "Given a target number, then 10 numbers entered one by one. Determine if the target appears among them and count how many times it appears.",
//     difficulty: "medium",
//     starterCode: `def number_search(target: int, numbers: list) -> tuple:
//     # Return (found: bool, count: int)
//     pass`,
//     testCases: [
//       {
//         input: "target = 5\nNumbers: 3, 5, 2, 5, 7, 1, 5, 4, 6, 5",
//         output: "Found: Yes\nCount: 4",
//         explanation: "The number 5 appears 4 times in the sequence",
//       },
//       {
//         input: "target = 10\nNumbers: 1, 2, 3, 4, 5, 6, 7, 8, 9, 0",
//         output: "Found: No\nCount: 0",
//         explanation: "The number 10 does not appear in the sequence",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Initialize count = 0.\n2. For each number in the list of 10 numbers:\n   - If number == target: count++.\n3. After loop, if count>0: found=True else False.\n4. Return (found, count).",
//       visual:
//         "Start → count=0 → for each num in numbers → num==target? → Yes → count++ → next num → found = count>0 → return (found, count)",
//     },
//   },
//   {
//     id: 18,
//     title: "Multiplication Table Grid",
//     description:
//       "Print an N × N multiplication table in a grid format. Each number should be right-aligned in a field width of 4 spaces.",
//     difficulty: "medium",
//     starterCode: `def multiplication_table(N: int) -> None:
//     # Write your code here
//     pass`,
//     testCases: [
//       {
//         input: "N = 4",
//         output:
//           "   1   2   3   4\n   2   4   6   8\n   3   6   9  12\n   4   8  12  16",
//         explanation: "4x4 multiplication table with numbers right-aligned",
//       },
//       {
//         input: "N = 3",
//         output: "   1   2   3\n   2   4   6\n   3   6   9",
//         explanation: "3x3 multiplication table with numbers right-aligned",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. For i from 1 to N:\n   - For j from 1 to N:\n        - Print i*j right-aligned in width 4.\n   - Print newline.",
//       visual:
//         "Start → i=1→i<=N? → Yes → j=1→j<=N? → Yes → print(f'{i*j:4d}') → j++ → newline → i++",
//     },
//   },
//   {
//     id: 19,
//     title: "Inverted Pyramid",
//     description:
//       "Print an inverted pyramid of asterisks (*) with height H. The top row should have H asterisks, and each subsequent row should have one fewer asterisk.",
//     difficulty: "medium",
//     starterCode: `def inverted_pyramid(H: int) -> None:
//     # Write your code here
//     pass`,
//     testCases: [
//       {
//         input: "H = 5",
//         output: "*****\n****\n***\n**\n*",
//         explanation:
//           "Row 1: 5 asterisks, Row 2: 4, Row 3: 3, Row 4: 2, Row 5: 1",
//       },
//       {
//         input: "H = 3",
//         output: "***\n**\n*",
//         explanation: "Row 1: 3 asterisks, Row 2: 2, Row 3: 1",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. For row from H down to 1:\n   - Print '*' repeated row times.\n   - Move to next line.",
//       visual:
//         "Start → row=H → row>=1? → Yes → print('*'*row) → row-- → loop → No → end",
//     },
//   },
//   {
//     id: 20,
//     title: "Palindrome Check (Loop Method)",
//     description:
//       "Check if a given word is a palindrome (reads the same forwards and backwards). Use a loop to compare characters from the beginning and end. Ignore case.",
//     difficulty: "medium",
//     starterCode: `def is_palindrome(word: str) -> str:
//     # Return "Palindrome" or "Not Palindrome"
//     pass`,
//     testCases: [
//       {
//         input: 'word = "racecar"',
//         output: "Palindrome",
//         explanation: "racecar reversed is racecar",
//       },
//       {
//         input: 'word = "hello"',
//         output: "Not Palindrome",
//         explanation: "hello reversed is olleh, which is different",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Convert word to lowercase.\n2. Initialize left = 0, right = len(word)-1.\n3. While left < right:\n   - If word[left] != word[right]: return 'Not Palindrome'.\n   - left++, right--.\n4. Return 'Palindrome'.",
//       visual:
//         "Start → word_lower → left=0, right=len-1 → left<right? → Yes → chars equal? → No → return 'Not Palindrome' → Yes → left++, right-- → loop → return 'Palindrome'",
//     },
//   },
//   {
//     id: 21,
//     title: "Dice Game Simulation",
//     description:
//       "Simulate a dice game multiple times. Rules: Start with 0 points. Roll a die (values 1-6). If you roll a 1, the game ends with score 0. If you roll 2-6, add that value to your score and continue rolling. Simulate the specified number of games and calculate the average score across all games.",
//     difficulty: "hard",
//     starterCode: `import random

// def dice_game_simulation(games: int) -> float:
//     # Write your code here
//     # Use random.randint(1, 6) to simulate dice roll
//     pass`,
//     testCases: [
//       {
//         input: "games = 1000",
//         output: "6.15",
//         explanation:
//           "Due to randomness, the average score typically converges around 6.0-6.2. This is an approximate expected output.",
//       },
//       {
//         input: "games = 10000",
//         output: "6.12",
//         explanation:
//           "With more simulations, the average score becomes more stable around the theoretical value.",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Initialize total_score = 0.\n2. For each game from 1 to games:\n   - score = 0\n   - While True:\n        roll = random.randint(1,6)\n        if roll == 1: break\n        else: score += roll\n   - total_score += score\n3. Return total_score / games.",
//       visual:
//         "Start → total=0 → for game in range(games): score=0 → loop: roll=randint(1,6) → roll==1? → Yes → break → No → score+=roll → continue → total+=score → next game → return total/games",
//     },
//   },
//   {
//     id: 22,
//     title: "Pascal's Triangle",
//     description:
//       "Generate and print Pascal's Triangle with R rows. Each number is the sum of the two numbers directly above it.",
//     difficulty: "hard",
//     starterCode: `def pascals_triangle(R: int) -> None:
//     # Write your code here
//     pass`,
//     testCases: [
//       {
//         input: "R = 5",
//         output: "    1\n   1 1\n  1 2 1\n 1 3 3 1\n1 4 6 4 1",
//         explanation: "Pascal's Triangle with 5 rows, centered formatting",
//       },
//       {
//         input: "R = 4",
//         output: "   1\n  1 1\n 1 2 1\n1 3 3 1",
//         explanation: "Pascal's Triangle with 4 rows, centered formatting",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Initialize triangle as list of lists.\n2. For each row from 0 to R-1:\n   - Create a new row with first element 1.\n   - For each column from 1 to row-1: new_row.append(prev_row[col-1]+prev_row[col])\n   - If row>0: append 1 at end.\n   - Append row to triangle.\n3. Print each row centered.",
//       visual:
//         "Start → triangle=[] → for i in range(R): row=[1]; if i>0: for j in range(1,i): row.append(triangle[i-1][j-1]+triangle[i-1][j]); row.append(1); triangle.append(row) → print with spacing",
//     },
//   },
//   {
//     id: 23,
//     title: "Roman Numeral Converter (to integer)",
//     description:
//       "Convert a Roman numeral string to an integer. Roman numerals: I=1, V=5, X=10, L=50, C=100, D=500, M=1000. When a smaller value appears before a larger value, subtract it (e.g., IV = 4). Otherwise, add the values.",
//     difficulty: "hard",
//     starterCode: `def roman_to_int(roman: str) -> int:
//     # Write your code here
//     pass`,
//     testCases: [
//       {
//         input: 'roman = "XIV"',
//         output: "14",
//         explanation: "X(10) + IV(4) = 14",
//       },
//       {
//         input: 'roman = "MCMXCIV"',
//         output: "1994",
//         explanation: "M(1000) + CM(900) + XC(90) + IV(4) = 1994",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Create a mapping of Roman symbols to values.\n2. Initialize total = 0, prev_value = 0.\n3. Loop through characters from right to left:\n   - Get current value.\n   - If current < prev_value: subtract current from total.\n   - Else: add current to total.\n   - Update prev_value = current.\n4. Return total.",
//       visual:
//         "Start → mapping = {'I':1,...} → total=0, prev=0 → for char in reversed(roman): curr=mapping[char]; if curr<prev: total-=curr else: total+=curr; prev=curr → return total",
//     },
//   },
//   {
//     id: 24,
//     title: "Sort Three Numbers (without lists)",
//     description:
//       "Sort three numbers in ascending order using only conditionals and loops (no built-in sort functions or lists). Use a bubble-sort style approach with swap logic.",
//     difficulty: "hard",
//     starterCode: `def sort_three(a: int, b: int, c: int) -> tuple:
//     # Return the three numbers in ascending order as a tuple
//     pass`,
//     testCases: [
//       {
//         input: "a = 15, b = 7, c = 22",
//         output: "7, 15, 22",
//         explanation: "Numbers sorted in ascending order",
//       },
//       {
//         input: "a = -3, b = 0, c = -10",
//         output: "-10, -3, 0",
//         explanation: "Negative numbers sorted correctly",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Compare a and b, swap if a > b.\n2. Compare b and c, swap if b > c.\n3. Compare a and b again, swap if a > b.\n4. Return (a, b, c).",
//       visual:
//         "Start → if a>b: swap(a,b) → if b>c: swap(b,c) → if a>b: swap(a,b) → return (a,b,c)",
//     },
//   },
//   {
//     id: 25,
//     title: "Tic-Tac-Toe Winner Checker",
//     description:
//       "A 3×3 Tic-Tac-Toe board is represented by a single string of 9 characters (e.g., 'XOXOXOXOX'). Check if 'X' or 'O' has won by getting 3 in a row, column, or diagonal. Print the winner or 'No winner'.",
//     difficulty: "hard",
//     starterCode: `def tic_tac_toe_winner(board: str) -> str:
//     # Return 'X', 'O', or 'No winner'
//     pass`,
//     testCases: [
//       {
//         input: 'board = "XXXOOOXXX"',
//         output: "X",
//         explanation: "Top row has XXX (positions 0,1,2)",
//       },
//       {
//         input: 'board = "XOXOXOXXO"',
//         output: "No winner",
//         explanation: "No three in a row, column, or diagonal",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Define winning combinations: rows (0-2,3-5,6-8), columns (0,3,6;1,4,7;2,5,8), diagonals (0,4,8;2,4,6).\n2. For each combination, check if all three are 'X' or all 'O'.\n3. If found, return that player; else return 'No winner'.",
//       visual:
//         "Start → win_patterns = [(0,1,2),...] → for pattern in patterns: if board[p0]==board[p1]==board[p2] and board[p0]!='_': return board[p0] → return 'No winner'",
//     },
//   },
//   {
//     id: 26,
//     title: "Prime Number Generator (Sieve of Eratosthenes)",
//     description:
//       "Find all prime numbers up to a given limit N using the Sieve of Eratosthenes algorithm. Print all primes in ascending order.",
//     difficulty: "hard",
//     starterCode: `def sieve_of_eratosthenes(N: int) -> list:
//     # Return a list of all prime numbers up to N
//     pass`,
//     testCases: [
//       {
//         input: "N = 30",
//         output: "2, 3, 5, 7, 11, 13, 17, 19, 23, 29",
//         explanation: "All prime numbers less than or equal to 30",
//       },
//       {
//         input: "N = 50",
//         output: "2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47",
//         explanation: "All prime numbers less than or equal to 50",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Create a boolean list 'is_prime' of size N+1, initialize all True.\n2. Set is_prime[0] = is_prime[1] = False.\n3. For i from 2 to sqrt(N):\n   - If is_prime[i]:\n        - For j from i*i to N step i: set is_prime[j] = False.\n4. Collect all i where is_prime[i] is True.\n5. Return list.",
//       visual:
//         "Start → is_prime = [True]*(N+1) → is_prime[0]=is_prime[1]=False → for i=2 to sqrt(N): if is_prime[i]: for j=i*i to N step i: is_prime[j]=False → return [i for i,prime in enumerate(is_prime) if prime]",
//     },
//   },
//   {
//     id: 27,
//     title: "Caesar Cipher",
//     description:
//       "Encrypt a message using the Caesar cipher. Shift each letter by a given shift value (1-25). Wrap around from z to a. Preserve case (uppercase stays uppercase, lowercase stays lowercase). Non-letters remain unchanged.",
//     difficulty: "hard",
//     starterCode: `def caesar_cipher(message: str, shift: int) -> str:
//     # Write your code here
//     pass`,
//     testCases: [
//       {
//         input: 'message = "Hello World", shift = 3',
//         output: "Khoor Zruog",
//         explanation:
//           "H→K, e→h, l→o, l→o, o→r, (space), W→Z, o→r, r→u, l→o, d→g",
//       },
//       {
//         input: 'message = "Python", shift = 13',
//         output: "Clguba",
//         explanation: "P→C, y→l, t→g, h→u, o→b, n→a (ROT13)",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Initialize result = ''.\n2. For each char in message:\n   - If char is uppercase: result += chr((ord(char) - 65 + shift) % 26 + 65).\n   - Else if char is lowercase: result += chr((ord(char) - 97 + shift) % 26 + 97).\n   - Else: result += char.\n3. Return result.",
//       visual:
//         "Start → result='' → for char in message: if char.isupper(): shift_char = (ord(char)-65+shift)%26+65; result+=chr(shift_char); elif char.islower(): similar; else: result+=char → return result",
//     },
//   },
//   {
//     id: 28,
//     title: "Digital Root",
//     description:
//       "Find the digital root of a large integer by repeatedly summing its digits until a single-digit number is obtained.",
//     difficulty: "hard",
//     starterCode: `def digital_root(number: int) -> int:
//     # Write your code here
//     pass`,
//     testCases: [
//       { input: "number = 987", output: "6", explanation: "9+8+7=24, 2+4=6" },
//       {
//         input: "number = 123456789",
//         output: "9",
//         explanation: "1+2+3+4+5+6+7+8+9=45, 4+5=9",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. While number >= 10:\n   - Convert number to string, sum digits.\n   - Replace number with the sum.\n2. Return number.",
//       visual: "Start → while n>=10: n = sum(int(d) for d in str(n)) → return n",
//     },
//   },
//   {
//     id: 30,
//     title: "Conway's Game of Life (Single Generation)",
//     description:
//       "Implement one generation of Conway's Game of Life on a 5×5 grid. Rules: A live cell (1) with 2 or 3 live neighbors survives. A dead cell (0) with exactly 3 live neighbors becomes alive. All other cells die or remain dead. Print the starting grid and the next generation grid.",
//     difficulty: "hard",
//     starterCode: `def game_of_life(grid: list) -> list:
//     # grid is a 5x5 list of lists (0 for dead, 1 for alive)
//     # Return the next generation grid
//     pass`,
//     testCases: [
//       {
//         input: "00000\n00100\n00100\n00100\n00000",
//         output:
//           "Starting Grid:\n00000\n00100\n00100\n00100\n00000\n\nNext Generation:\n00000\n00000\n01110\n00000\n00000",
//         explanation:
//           "The vertical line of 3 cells (blinker) becomes a horizontal line of 3 cells",
//       },
//       {
//         input: "01000\n01100\n00100\n00000\n00000",
//         output:
//           "Starting Grid:\n01000\n01100\n00100\n00000\n00000\n\nNext Generation:\n00100\n01100\n00100\n00000\n00000",
//         explanation:
//           "A small pattern rotates orientation according to Game of Life rules",
//       },
//     ],
//     wayToSolve: {
//       verbal:
//         "1. Create a new grid of same size, all zeros.\n2. For each cell (r,c) in the grid:\n   - Count live neighbors (8 directions, handle boundaries).\n   - Apply rules: if cell is alive and neighbors in (2,3): new grid[r][c]=1; if cell is dead and neighbors==3: new grid[r][c]=1.\n3. Return new grid.",
//       visual:
//         "Start → new_grid = [[0]*5 for _ in range(5)] → for r in 0..4: for c in 0..4: neighbors = sum over dr,dc of grid[r+dr][c+dc] (if inside) → if grid[r][c]==1 and neighbors in (2,3): new=1; elif grid[r][c]==0 and neighbors==3: new=1 → return new_grid",
//     },
//   },
// ];

function LoopsExerciseStudentsPage() {
  const { userId, solvedProblems } = useUser();
  const {
    exercises,
    isLoading: exercisesLoading,
    error: exercisesError,
  } = useGetExercises();
  const {
    easyScore,
    mediumScore,
    hardScore,
    predictedDifficulty,
    refetch: refetchDifficulty,
  } = useInferDifficulty(userId);
  const { detectStruggle, data: struggleDetectionData } = useDetectStruggle();
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [status, setStatus] = useState("idle");
  const [code, setCode] = useState(selectedExercise?.starterCode || "");
  const [showStruggleModal, setShowStruggleModal] = useState(false);
  const { runCode, isLoading, data } = useRunCode(refetchDifficulty);
  const time = useRef(null);
  const isFirstRender = useRef(true);
  const navigate = useNavigate();
  const { verbalScore, visualScore } = useInferLearningStyle(userId);
  const [struggleModalShown, setStruggleModalShown] = useState(false);
  const [showWayToSolve, setShowWayToSolve] = useState(false);
  const [attemptNum, setAttemptNum] = useState(1);
  // const [timeDelta, setTimeDelta] = useState(Date.now());
  const timeDeltaRef = useRef();
  const [testProgress, setTestProgress] = useState(0);

  const isStruggling = struggleDetectionData?.struggling;

  useEffect(() => {
    if (
      predictedDifficulty &&
      solvedProblems !== undefined &&
      exercises.length > 0
    ) {
      if (isFirstRender.current) {
        timeDeltaRef.current = Date.now();
        const nextExercise = exercises.find(
          (ex) =>
            ex.difficulty === predictedDifficulty?.toLowerCase() &&
            !solvedProblems?.map(String).includes(ex._id),
        );
        if (nextExercise) {
          setSelectedExercise(nextExercise);
        }

        isFirstRender.current = false;
      }
    }

    if (isLoading) {
      setStatus("loading");
    } else if (data) {
      setStatus(data.success ? "success" : "failed");
    } else {
      setStatus("idle");
    }
  }, [predictedDifficulty, solvedProblems, isLoading, data, exercises]);

  console.log(
    "Solved problems in exercises array: ",
    exercises.filter((ex) => solvedProblems?.includes(ex._id)),
  );

  console.log("Selected Exercise: ", selectedExercise);
  console.log(`User ${userId} - Solved Problems:`, solvedProblems);
  console.log("Difficulty Scores:", {
    easyScore,
    mediumScore,
    hardScore,
    predictedDifficulty,
  });

  useEffect(() => {
    if (selectedExercise?.starterCode) {
      setCode(selectedExercise.starterCode);
    }

    if (!time.current) {
      time.current = Date.now();
    }
  }, [selectedExercise?._id, setCode, selectedExercise]);

  useEffect(() => {
    if (isStruggling) {
      setTimeout(() => {
        setShowStruggleModal(true);
      }, 2000);
    }
  }, [isStruggling]);

  useEffect(() => {
    if (showStruggleModal || showWayToSolve) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showStruggleModal, showWayToSolve]);

  const handleRunCode = () => {
    runCode(
      {
        code,
        problemId: selectedExercise?._id,
        userId,
        timeTaken: (Date.now() - time.current) / 60000,
        problemLevel: selectedExercise?.difficulty,
      },
      {
        onSuccess: (data) => {
          detectStruggle({
            userId,
            attemptNum,
            timeDelta: (Date.now() - timeDeltaRef.current) / 1000,
            testProgress:
              data?.results?.reduce(
                (acc, curr) => acc + (curr.passed ? 1 : 0),
                0,
              ) / data?.results?.length,
          });
          setAttemptNum((prev) => prev + 1);
          timeDeltaRef.current = Date.now();
          setTestProgress(0);
        },
      },
    );
  };

  const handleClickNextExercise = () => {
    navigate(0);
  };

  const handleClearCode = () => {
    setCode("");
  };

  const parseFlowchart = (visualGuide) => {
    if (!visualGuide || !Array.isArray(visualGuide)) return [];

    let fallbackId = 1000;
    const nodesMap = new Map();
    const pointedTo = new Set();

    visualGuide.forEach((node) => {
      nodesMap.set(node.text, node);
      if (node.directedTowards) {
        node.directedTowards.forEach((dir) => {
          pointedTo.add(dir.requiredStep);
        });
      }
    });

    // Find the start node (one that no other node points to)
    const startNode =
      visualGuide.find((node) => !pointedTo.has(node.text)) || visualGuide[0];

    if (!startNode) return [];

    const nodes = [];
    let current = startNode;
    const mainVisited = new Set();

    const traverseBranch = (startStepText, decisionText) => {
      const path = [];
      let loops = false;
      const visited = new Set();
      const stack = [startStepText];

      while (stack.length > 0) {
        const currentText = stack.shift();

        if (currentText === decisionText) {
          loops = true;
          continue;
        }

        if (visited.has(currentText)) continue;
        visited.add(currentText);

        path.push({
          id: fallbackId++,
          label: currentText,
          type: "normal",
        });

        const currDoc = nodesMap.get(currentText);
        if (currDoc && currDoc.directedTowards) {
          // Push "no" branch first, so "yes" / "next" branch gets explored first (DFS left-to-right)
          const noDir = currDoc.directedTowards.find(
            (d) => d.direction === "no",
          );
          const yesDir = currDoc.directedTowards.find(
            (d) => d.direction === "yes",
          );
          const nextDir = currDoc.directedTowards.find(
            (d) => d.direction === "next",
          );

          // unshift adds to front. So if we want 'next', 'yes', 'no' order on pop:
          // push 'no', then 'yes', then 'next' to stack front
          if (noDir && nodesMap.has(noDir.requiredStep))
            stack.unshift(noDir.requiredStep);
          if (yesDir && nodesMap.has(yesDir.requiredStep))
            stack.unshift(yesDir.requiredStep);
          if (nextDir && nodesMap.has(nextDir.requiredStep))
            stack.unshift(nextDir.requiredStep);
        }
      }
      return { path, loops };
    };

    while (current) {
      if (mainVisited.has(current.text)) break;
      mainVisited.add(current.text);

      if (current.shape === "diamond") {
        const decisionNode = {
          id: fallbackId++,
          label: current.text,
          type: "decision",
          yesPath: [],
          noPath: [],
          yesLoops: false,
          noLoops: false,
        };

        const yesDir = current.directedTowards?.find(
          (d) => d.direction === "yes",
        );
        const noDir = current.directedTowards?.find(
          (d) => d.direction === "no",
        );

        if (yesDir && nodesMap.has(yesDir.requiredStep)) {
          const res = traverseBranch(yesDir.requiredStep, current.text);
          decisionNode.yesPath = res.path;
          decisionNode.yesLoops = res.loops;
        }

        if (noDir && nodesMap.has(noDir.requiredStep)) {
          const res = traverseBranch(noDir.requiredStep, current.text);
          decisionNode.noPath = res.path;
          decisionNode.noLoops = res.loops;
        }

        nodes.push(decisionNode);
        break; // In this component's structure, decision nodes absorb the rest of the flow into their yes/no paths
      } else {
        nodes.push({
          id: fallbackId++,
          label: current.text,
          type: "normal",
          next: null,
        });

        const nextDir =
          current.directedTowards?.find((d) => d.direction === "next") ||
          current.directedTowards?.[0];
        const nextText = nextDir ? nextDir.requiredStep : null;
        current = nextText ? nodesMap.get(nextText) : null;
      }
    }
    return nodes;
  };

  const closeStruggleModal = () => {
    setShowStruggleModal(false);
    setStruggleModalShown(true);
    document.body.style.overflow = "auto";
  };

  const FlowchartDiagram = ({ visualGuide }) => {
    if (!visualGuide) return null;
    const nodes = parseFlowchart(visualGuide);

    return (
      <div className="w-full flex-col flex items-center justify-center font-sans text-sm relative pb-24 pr-48">
        {nodes.map((node, i) => {
          if (node.type === "normal") {
            return (
              <div key={node.id} className="flex flex-col items-center">
                {i > 0 && (
                  <div className="h-6 w-0.5 bg-blue-500 relative">
                    <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-blue-500 transform rotate-45"></div>
                  </div>
                )}
                <div className="px-4 py-2 border-2 border-blue-500 bg-blue-100 rounded-lg shadow-sm z-10 my-1 max-w-48 text-center text-blue-900 font-medium">
                  {node.label}
                </div>
              </div>
            );
          } else if (node.type === "decision") {
            return (
              <div
                key={node.id}
                className="flex flex-col items-center w-full mt-2"
              >
                {i > 0 && (
                  <div className="h-6 w-0.5 bg-blue-500 relative">
                    <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-blue-500 transform rotate-45"></div>
                  </div>
                )}

                {/* Diamond Shape Wrapper with Yes Branch branching out */}
                <div className="relative flex items-center justify-center my-2 w-full max-w-xs z-10">
                  {/* Yes Branch horizontal line out from the center */}
                  {node.yesPath.length > 0 && (
                    <div className="absolute top-1/2 left-1/2 w-48 h-0.5 bg-blue-500 -z-10">
                      <div className="absolute -top-5 left-16 text-xs font-bold text-blue-700 bg-white px-1">
                        Yes
                      </div>
                    </div>
                  )}

                  <div className="w-28 h-28 relative flex items-center justify-center">
                    <div className="absolute w-20 h-20 bg-yellow-100 border-2 border-yellow-500 transform rotate-45 shadow-sm"></div>
                    <span className="relative z-10 text-yellow-900 font-bold text-center px-2">
                      {node.label}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row w-full justify-center relative">
                  {/* The Main path (No) going straight down */}
                  <div className="flex flex-col items-center w-64">
                    <div className="h-8 w-0.5 bg-blue-500 relative">
                      <div className="absolute top-1 ml-2 text-xs font-bold text-blue-700 bg-white px-1 z-20">
                        No
                      </div>
                      <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-blue-500 transform rotate-45 z-10"></div>
                    </div>

                    {node.noPath.map((child, j) => (
                      <div
                        key={child.id}
                        className="flex flex-col items-center w-full relative z-10"
                      >
                        {j > 0 && (
                          <div className="h-6 w-0.5 bg-blue-500 relative">
                            <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-blue-500 transform rotate-45"></div>
                          </div>
                        )}
                        <div className="px-4 py-2 border-2 border-blue-500 bg-blue-100 rounded-lg shadow-sm my-1 max-w-48 text-center text-blue-900 font-medium">
                          {child.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* The Loop branch (Yes) going down parallel on the right */}
                  {node.yesPath.length > 0 && (
                    <div className="absolute left-[calc(50%+112px)] top-[-4rem] flex flex-col items-center w-40 z-0">
                      {/* Vertical line from the horizontal Yes arm */}
                      <div className="h-[4.5rem] w-0.5 bg-blue-500 relative">
                        <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-blue-500 transform rotate-45"></div>
                      </div>

                      <div className="relative w-full flex flex-col items-center group">
                        {node.yesPath.map((child, j) => (
                          <div
                            key={child.id}
                            className="flex flex-col items-center w-full"
                          >
                            {j > 0 && (
                              <div className="h-6 w-0.5 bg-blue-500 relative">
                                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-blue-500 transform rotate-45"></div>
                              </div>
                            )}
                            <div className="px-3 py-2 border-2 border-green-500 bg-green-50 rounded shadow-sm my-1 max-w-36 text-center text-green-900 text-xs font-semibold z-20 w-11/12 relative">
                              {child.label}
                            </div>
                          </div>
                        ))}

                        {/* Dashed Loop back line wrap-around */}
                        {node.yesLoops && (
                          <>
                            <div className="absolute -right-8 top-[-2rem] bottom-6 w-28 border-r-2 border-t-2 border-b-2 border-dashed border-red-500 opacity-80 -z-10 rounded-r-xl">
                              {/* Arrow head pointing back to the vertical line at the top */}
                              <div className="absolute top-[-5px] left-[-2px] w-2.5 h-2.5 border-l-2 border-t-2 border-red-500 transform -rotate-45"></div>
                            </div>
                            <div className="absolute -right-20 top-1/2 transform -translate-y-1/2 text-red-600 text-[10px] font-bold px-2 py-0.5 whitespace-nowrap bg-white border border-red-200 rounded z-20 shadow-sm">
                              ↺ Loop Back
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          } else if (node.type === "loopBack") {
            return null; // Handled visually in the Yes branch above
          }
          return null;
        })}
      </div>
    );
  };

  if (exercisesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (exercisesError) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 font-semibold">{exercisesError.message}</p>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center justify-between mb-4 gap-6">
              <h2 className="text-3xl font-bold text-dark_blue">
                Problem: {selectedExercise?.title}
              </h2>
              <span
                className={`px-4 py-2 rounded-lg font-bold text-sm text-white ${
                  selectedExercise?.difficulty === "easy"
                    ? "bg-green-500"
                    : selectedExercise?.difficulty === "medium"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              >
                {selectedExercise?.difficulty?.toUpperCase()}
              </span>
            </div>

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
            <div className="flex gap-4">
              <button
                onClick={handleClickNextExercise}
                disabled={status !== "success"}
                className="flex-1 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md disabled:hover:bg-gray-400 text-lg"
              >
                ▶ Next Exercise
              </button>
              {struggleModalShown && (
                <button
                  onClick={() => setShowWayToSolve(true)}
                  className="flex-1 px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-all duration-200 shadow-md text-lg"
                >
                  💡 Way To Solve
                </button>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-dark_blue text-offwite px-6 py-4">
                <h3 className="text-lg font-bold">Python Code Editor</h3>
              </div>

              <CodeMirror
                value={code}
                onChange={(value) => setCode(value)}
                height="320px"
                extensions={[python()]}
                theme={oneDark}
                className="w-full"
                basicSetup={{
                  lineNumbers: true,
                  highlightActiveLineGutter: true,
                  foldGutter: true,
                  dropCursor: true,
                  allowMultipleSelections: true,
                  indentOnInput: true,
                  bracketMatching: true,
                  closeBrackets: true,
                }}
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
                    : status === "failed"
                      ? "bg-red-600"
                      : "bg-dark_blue"
                }`}
              >
                {status === "success"
                  ? "✓ All Tests Passed"
                  : status === "failed"
                    ? "✗ Some Tests Failed"
                    : "Output"}
              </div>

              <div
                className={`p-6 font-mono text-sm min-h-48 max-h-48 overflow-y-auto ${
                  status === "failed"
                    ? "bg-red-50 text-red-800"
                    : "bg-dark_blue text-offwite"
                }`}
              >
                {isLoading ? (
                  <div className="space-y-2">
                    <div className="text-light_blue animate-pulse text-sm">
                      $ Running code execution...
                    </div>
                    <div className="flex gap-1 items-center h-6">
                      <span className="text-light_blue">▌</span>
                      <span
                        className="inline-block w-1 h-4 bg-light_blue"
                        style={{
                          animation: "pulse 0.6s ease-in-out infinite",
                        }}
                      ></span>
                    </div>
                  </div>
                ) : data?.success ? (
                  <pre className="whitespace-pre-wrap break-words text-green-600 font-bold">
                    ✓ All tests passed!
                  </pre>
                ) : data && !data.success ? (
                  <div className="space-y-4">
                    {data.results?.map(
                      (result, idx) =>
                        !result.passed && (
                          <div
                            key={idx}
                            className="border-b border-red-200 pb-3"
                          >
                            <p className="font-bold mb-2">
                              Test {result.testCase}:
                            </p>
                            <p className="mb-1">Expected:</p>
                            <pre className="bg-red-100 p-2 rounded mb-2 text-xs overflow-x-auto">
                              {result.expected}
                            </pre>
                            <p className="mb-1">Got:</p>
                            <pre className="bg-red-100 p-2 rounded text-xs overflow-y-auto max-h-24 whitespace-pre-wrap break-all">
                              {result.error || result.output || "No output"}
                            </pre>
                          </div>
                        ),
                    )}
                  </div>
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

      {showStruggleModal && !struggleModalShown && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-8 flex-shrink-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-indigo-600">
                  💡 Let's Work Through This Together
                </h2>
                <button
                  onClick={closeStruggleModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all flex-shrink-0"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-700 text-lg text-center">
                Here is some helpful approach to tackle this exercise this
                challenge:
              </p>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 px-8 py-4">
              {visualScore > verbalScore ? (
                <div className="bg-light_blue bg-opacity-30 p-6 rounded-lg overflow-x-auto">
                  <h3 className="text-lg font-bold text-medium_blue mb-4">
                    Flowchart Guide
                  </h3>
                  <div>
                    <FlowchartDiagram
                      visualGuide={selectedExercise?.wayToSolve?.visual}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-light_blue bg-opacity-30 p-6 rounded-lg overflow-x-auto overflow-y-visible">
                  <h3 className="text-lg font-bold text-medium_blue mb-4">
                    Step-by-Step Guide
                  </h3>
                  <div className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed font-mono">
                    {selectedExercise?.wayToSolve?.verbal}
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 flex-shrink-0 border-t border-gray-200">
              <button
                onClick={closeStruggleModal}
                className="w-full px-4 py-3 bg-medium_blue text-white font-bold rounded-lg hover:bg-dark_blue transition-all duration-200"
              >
                Got it, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}

      {showWayToSolve && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-8 flex-shrink-0 pb-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-medium_blue">
                  💡 Way To Solve
                </h2>
                <button
                  onClick={() => {
                    setShowWayToSolve(false);
                    document.body.style.overflow = "auto";
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all flex-shrink-0"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 px-8 py-4">
              {visualScore > verbalScore ? (
                <div className="bg-light_blue bg-opacity-30 p-6 rounded-lg overflow-x-auto overflow-y-visible">
                  <h3 className="text-lg font-bold text-medium_blue mb-4">
                    Flowchart Guide
                  </h3>
                  <div>
                    <FlowchartDiagram
                      visualGuide={selectedExercise?.wayToSolve?.visual}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-light_blue bg-opacity-30 p-6 rounded-lg overflow-x-auto overflow-y-visible">
                  <h3 className="text-lg font-bold text-medium_blue mb-4">
                    Step-by-Step Guide
                  </h3>
                  <div className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed font-mono">
                    {selectedExercise?.wayToSolve?.verbal}
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 flex-shrink-0 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowWayToSolve(false);
                  document.body.style.overflow = "auto";
                }}
                className="w-full px-4 py-3 bg-medium_blue text-white font-bold rounded-lg hover:bg-dark_blue transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoopsExerciseStudentsPage;
