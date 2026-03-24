import { useState } from "react";

function LoopsLectureVerbal({ numOfBackClicks, setNumOfBackClicks }) {
  const [currentPart, setCurrentPart] = useState(0);

  const parts = [
    {
      title: "Part 1: Why Do We Need Loops?",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-dark_blue mb-3">
              The Problem of Repetition
            </h3>
            <p className="text-base leading-relaxed mb-4">
              Imagine you're a teacher and you need to grade 30 assignments. You
              have to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2 text-base">
              <li>Pick up the first assignment</li>
              <li>Read it</li>
              <li>Assign a grade</li>
              <li>Write it down</li>
              <li>Move to the next assignment</li>
            </ul>
            <p className="text-base leading-relaxed mt-4">
              You repeat these same steps 30 times. Now imagine you had 300
              assignments. Writing the instructions 300 times would be tedious
              and error-prone.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-dark_blue mb-3">
              The Solution: Loops
            </h3>
            <p className="text-base leading-relaxed mb-4">
              A loop is a programming structure that allows you to repeat a
              block of instructions multiple times. Instead of writing the same
              code 30 times, you write it once and tell the computer, "Do this
              30 times."
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-dark_blue mb-3">
              Real-World Examples of Loops
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-2 text-base">
              <li>
                <strong>A microwave:</strong> "Heat for 3 minutes" — it repeats
                the heating cycle for 180 seconds
              </li>
              <li>
                <strong>A music playlist:</strong> Plays songs one after another
                until the playlist ends
              </li>
              <li>
                <strong>A factory assembly line:</strong> Each robot arm
                performs the same motion for every car
              </li>
              <li>
                <strong>A clock:</strong> The second hand ticks 60 times for
                each minute, endlessly
              </li>
            </ul>
          </div>

          <div className="bg-light_blue bg-opacity-50 p-4 rounded-lg">
            <h3 className="text-2xl font-bold text-dark_blue mb-3">
              Why Loops Matter
            </h3>
            <div className="space-y-2">
              <div>
                <p className="font-semibold text-dark_blue">Efficiency:</p>
                <p className="text-base">Write less code, do more work</p>
              </div>
              <div>
                <p className="font-semibold text-dark_blue">Consistency:</p>
                <p className="text-base">
                  The same instructions execute exactly the same way every time
                </p>
              </div>
              <div>
                <p className="font-semibold text-dark_blue">Scalability:</p>
                <p className="text-base">
                  Handle 10 items or 10,000 items with the same code
                </p>
              </div>
              <div>
                <p className="font-semibold text-dark_blue">Automation:</p>
                <p className="text-base">
                  Let the computer handle repetitive tasks
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Part 2: Two Main Types of Loops",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-dark_blue mb-3">
              The Fork in the Road
            </h3>
            <p className="text-base leading-relaxed">
              When you need to repeat instructions, you must answer one
              question: <strong>How many times?</strong>
            </p>
            <p className="text-base leading-relaxed mt-4">
              This gives us two families of loops:
            </p>
          </div>

          <div className="bg-medium_blue bg-opacity-10 p-4 rounded-lg">
            <h3 className="text-2xl font-bold text-medium_blue mb-3">
              1. The for Loop: "I Know Exactly How Many Times"
            </h3>
            <p className="text-base leading-relaxed mb-4">
              Use a for loop when you know in advance how many repetitions you
              need.
            </p>
            <p className="text-sm italic text-gray-700 mb-4">
              Mental Model: A teacher with a class roster. You know there are 25
              students, so you'll take attendance exactly 25 times.
            </p>
            <p className="font-semibold text-dark_blue mb-2">When to use:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-base mb-4">
              <li>
                Processing items in a list (5 groceries, 100 test scores, 31
                days)
              </li>
              <li>Repeating a fixed number of times (count from 1 to 10)</li>
              <li>Iterating through characters in a word</li>
            </ul>
            <p className="font-semibold text-dark_blue mb-2">Python Syntax:</p>
            <div className="bg-dark_blue text-offwite p-3 rounded font-mono text-sm overflow-x-auto">
              for item in collection:
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;# do something with item
            </div>
            <p className="font-semibold text-dark_blue mt-4 mb-2">Example:</p>
            <div className="bg-dark_blue text-offwite p-3 rounded font-mono text-sm overflow-x-auto">
              groceries = ["eggs", "milk", "bread", "cheese", "apples"]
              <br />
              for item in groceries:
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;print("Buying:", item)
            </div>
          </div>

          <div className="bg-medium_blue bg-opacity-10 p-4 rounded-lg">
            <h3 className="text-2xl font-bold text-medium_blue mb-3">
              2. The while Loop: "I Repeat Until a Condition is Met"
            </h3>
            <p className="text-base leading-relaxed mb-4">
              Use a while loop when you don't know the exact number of
              repetitions, but you know when to stop.
            </p>
            <p className="text-sm italic text-gray-700 mb-4">
              Mental Model: A hiker searching for a waterfall. You don't know
              how many steps it will take, but you'll stop when you hear the
              water.
            </p>
            <p className="font-semibold text-dark_blue mb-2">When to use:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-base mb-4">
              <li>Waiting for user input (guess until correct)</li>
              <li>
                Processing until a condition changes (keep adding until total
                exceeds 100)
              </li>
              <li>Games and simulations (play until game over)</li>
            </ul>
            <p className="font-semibold text-dark_blue mb-2">Python Syntax:</p>
            <div className="bg-dark_blue text-offwite p-3 rounded font-mono text-sm overflow-x-auto">
              while condition:
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;# do something
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;# eventually, condition becomes False
            </div>
            <p className="font-semibold text-dark_blue mt-4 mb-2">Example:</p>
            <div className="bg-dark_blue text-offwite p-3 rounded font-mono text-sm overflow-x-auto">
              secret_number = 7<br />
              guess = 0<br />
              while guess != secret_number:
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;guess = int(input("Guess the number: "))
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;print("Try again!")
              <br />
              print("Correct!")
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Part 3: Anatomy of a Loop",
      content: (
        <div className="space-y-6">
          <p className="text-lg font-semibold text-dark_blue">
            The Four Essential Components
          </p>
          <p className="text-base leading-relaxed">
            Every loop, whether for or while, has four key parts. Missing any
            one can cause problems.
          </p>

          <div className="bg-light_blue bg-opacity-30 p-4 rounded-lg border-l-4 border-medium_blue">
            <h4 className="text-xl font-bold text-dark_blue mb-2">
              Component 1: Initialization
            </h4>
            <p className="text-base mb-3">
              Where does the loop start? You need to set up your starting point.
            </p>
            <div className="bg-dark_blue text-offwite p-3 rounded font-mono text-sm overflow-x-auto">
              count = 0 # ← INITIALIZATION
              <br />
              while count &lt; 5:
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;print(count)
            </div>
          </div>

          <div className="bg-light_blue bg-opacity-30 p-4 rounded-lg border-l-4 border-medium_blue">
            <h4 className="text-xl font-bold text-dark_blue mb-2">
              Component 2: Condition
            </h4>
            <p className="text-base mb-3">
              When does the loop stop? The condition is checked before each
              repetition.
            </p>
            <ul className="text-base mb-3 list-disc list-inside">
              <li>If True → execute the loop body</li>
              <li>If False → exit the loop</li>
            </ul>
            <div className="bg-dark_blue text-offwite p-3 rounded font-mono text-sm overflow-x-auto">
              while count &lt; 5: # ← CONDITION
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;print(count)
            </div>
          </div>

          <div className="bg-light_blue bg-opacity-30 p-4 rounded-lg border-l-4 border-medium_blue">
            <h4 className="text-xl font-bold text-dark_blue mb-2">
              Component 3: Body
            </h4>
            <p className="text-base mb-3">
              What work gets repeated? This is the code block that executes on
              each iteration.
            </p>
            <div className="bg-dark_blue text-offwite p-3 rounded font-mono text-sm overflow-x-auto">
              while count &lt; 5:
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;print(count) # ← BODY (work to repeat)
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;count = count + 1 # ← also part of body
            </div>
          </div>

          <div className="bg-light_blue bg-opacity-30 p-4 rounded-lg border-l-4 border-medium_blue">
            <h4 className="text-xl font-bold text-dark_blue mb-2">
              Component 4: Update
            </h4>
            <p className="text-base mb-3">
              How do we make progress toward stopping? Without an update, the
              condition never changes.
            </p>
            <div className="bg-dark_blue text-offwite p-3 rounded font-mono text-sm overflow-x-auto">
              while count &lt; 5:
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;print(count)
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;count = count + 1 # ← UPDATE (changes
              condition)
            </div>
            <p className="text-sm italic mt-3 text-gray-700">
              The Infinite Loop Trap: If you forget the update, the condition
              never becomes False.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Part 4: The range() Function",
      content: (
        <div className="space-y-6">
          <p className="text-lg font-semibold text-dark_blue">
            Your Best Friend for Counting Loops
          </p>
          <p className="text-base leading-relaxed">
            Python's range() function is a powerful tool for creating sequences
            of numbers. It's most commonly used with for loops when you need to
            repeat something a specific number of times.
          </p>

          <div className="bg-light_blue bg-opacity-50 p-4 rounded-lg">
            <h4 className="font-semibold text-dark_blue mb-3">
              Three Forms of range():
            </h4>
            <div className="space-y-2 text-base">
              <div className="flex justify-between">
                <span>
                  <strong>range(5)</strong>
                </span>
                <span>→ 0, 1, 2, 3, 4</span>
              </div>
              <div className="flex justify-between">
                <span>
                  <strong>range(2, 6)</strong>
                </span>
                <span>→ 2, 3, 4, 5</span>
              </div>
              <div className="flex justify-between">
                <span>
                  <strong>range(1, 10, 2)</strong>
                </span>
                <span>→ 1, 3, 5, 7, 9</span>
              </div>
            </div>
          </div>

          <div className="bg-medium_blue bg-opacity-10 p-4 rounded-lg">
            <h4 className="font-semibold text-dark_blue mb-3">
              Important Rules:
            </h4>
            <ul className="list-disc list-inside space-y-2 ml-2 text-base">
              <li>stop is exclusive — it stops before reaching that number</li>
              <li>If you give one number, it starts at 0</li>
              <li>
                Step can be positive (counting up) or negative (counting down)
              </li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-dark_blue mb-3">Examples:</p>
            <div className="space-y-3">
              <div className="bg-dark_blue text-offwite p-3 rounded font-mono text-sm overflow-x-auto">
                # Repeat 10 times
                <br />
                for i in range(10):
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;print("Iteration:", i) # Prints 0
                through 9
              </div>
              <div className="bg-dark_blue text-offwite p-3 rounded font-mono text-sm overflow-x-auto">
                # Count from 1 to 10
                <br />
                for i in range(1, 11):
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;print(i) # Prints 1 through 10
              </div>
              <div className="bg-dark_blue text-offwite p-3 rounded font-mono text-sm overflow-x-auto">
                # Count backwards
                <br />
                for i in range(10, 0, -1):
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;print(i) # Prints 10 down to 1
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Part 5: Loop Patterns",
      content: (
        <div className="space-y-6">
          <p className="text-lg font-semibold text-dark_blue">
            Common Patterns You'll Use
          </p>

          <div className="bg-light_blue bg-opacity-30 p-4 rounded-lg">
            <h4 className="font-bold text-dark_blue mb-2">
              Pattern 1: Counting (Accumulation)
            </h4>
            <p className="text-base mb-2">Keep a running total as you loop.</p>
            <div className="bg-dark_blue text-offwite p-3 rounded font-mono text-sm overflow-x-auto">
              total = 0<br />
              for i in range(1, 6):
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;total = total + i<br />
              print("Sum of 1-5:", total) # Output: 15
            </div>
          </div>

          <div className="bg-light_blue bg-opacity-30 p-4 rounded-lg">
            <h4 className="font-bold text-dark_blue mb-2">
              Pattern 2: Filtering
            </h4>
            <p className="text-base mb-2">
              Select only items that meet a condition.
            </p>
            <div className="bg-dark_blue text-offwite p-3 rounded font-mono text-sm overflow-x-auto">
              for number in range(1, 11):
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;if number % 2 == 0: # if even
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;print(number, "is
              even")
            </div>
          </div>

          <div className="bg-light_blue bg-opacity-30 p-4 rounded-lg">
            <h4 className="font-bold text-dark_blue mb-2">
              Pattern 3: Searching
            </h4>
            <p className="text-base mb-2">Find if something exists.</p>
            <div className="bg-dark_blue text-offwite p-3 rounded font-mono text-sm overflow-x-auto">
              found = False
              <br />
              for item in ["apple", "banana", "cherry"]:
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;if item == "banana":
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;found = True
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;break
            </div>
          </div>

          <div className="bg-light_blue bg-opacity-30 p-4 rounded-lg">
            <h4 className="font-bold text-dark_blue mb-2">
              Pattern 4: Transformation
            </h4>
            <p className="text-base mb-2">
              Change each item as you process it.
            </p>
            <div className="bg-dark_blue text-offwite p-3 rounded font-mono text-sm overflow-x-auto">
              for i in range(5):
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;square = i * i<br />
              &nbsp;&nbsp;&nbsp;&nbsp;print(f"The square of {"{"}i{"}"} is {"{"}
              square{"}"} ")
            </div>
          </div>

          <div className="bg-light_blue bg-opacity-30 p-4 rounded-lg">
            <h4 className="font-bold text-dark_blue mb-2">
              Pattern 5: Nested Loops
            </h4>
            <p className="text-base mb-2">
              Loops inside loops — great for grids and tables.
            </p>
            <div className="bg-dark_blue text-offwite p-3 rounded font-mono text-sm overflow-x-auto">
              for row in range(3):
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;for col in range(4):
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;print(f"({"{"}row
              {"}"} , {"{"}col{"}"} )", end=" ")
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Part 6: Common Mistakes",
      content: (
        <div className="space-y-6">
          <p className="text-lg font-semibold text-dark_blue">
            Common Mistakes and How to Avoid Them
          </p>

          <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg">
            <h4 className="font-bold text-red-800 mb-2">
              Mistake 1: The Infinite Loop
            </h4>
            <p className="text-base mb-2">
              <strong>What happens:</strong> Your program runs forever and never
              stops.
            </p>
            <div className="bg-dark_blue text-offwite p-3 rounded font-mono text-sm overflow-x-auto mb-3">
              count = 1<br />
              while count &lt;= 5:
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;print(count)
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;# OOPS! Forgot to update count
            </div>
            <p className="text-base">
              <strong>How to fix:</strong> Always ensure your loop has a way to
              reach the stopping condition.
            </p>
          </div>

          <div className="bg-yellow-100 border-l-4 border-yellow-600 p-4 rounded-lg">
            <h4 className="font-bold text-yellow-900 mb-2">
              Mistake 2: Off-by-One Errors
            </h4>
            <p className="text-base mb-2">
              <strong>What happens:</strong> Your loop runs one too many times
              or one too few times.
            </p>
            <div className="bg-dark_blue text-offwite p-3 rounded font-mono text-sm overflow-x-auto mb-3">
              # Want to print 1-5, but prints 0-4
              <br />
              for i in range(5):
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;print(i) # 0, 1, 2, 3, 4
            </div>
            <p className="text-base">
              <strong>How to fix:</strong> Remember that range(stop) stops
              before stop.
            </p>
          </div>

          <div className="bg-orange-100 border-l-4 border-orange-600 p-4 rounded-lg">
            <h4 className="font-bold text-orange-900 mb-2">
              Mistake 3: Modifying What You're Looping Over
            </h4>
            <p className="text-base mb-2">
              <strong>What happens:</strong> Unexpected behavior when you change
              the collection you're iterating through.
            </p>
            <div className="bg-dark_blue text-offwite p-3 rounded font-mono text-sm overflow-x-auto mb-3">
              numbers = [1, 2, 3, 4, 5]
              <br />
              for n in numbers:
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;if n % 2 == 0:
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;numbers.remove(n)
              # DANGEROUS!
            </div>
            <p className="text-base">
              <strong>How to fix:</strong> If you need to modify, loop over a
              copy or collect changes to do later.
            </p>
          </div>

          <div className="bg-pink-100 border-l-4 border-pink-600 p-4 rounded-lg">
            <h4 className="font-bold text-pink-900 mb-2">
              Mistake 4: Forgetting to Initialize
            </h4>
            <p className="text-base mb-2">
              <strong>What happens:</strong> Variable used in condition doesn't
              have a starting value.
            </p>
            <div className="bg-dark_blue text-offwite p-3 rounded font-mono text-sm overflow-x-auto mb-3">
              while count &lt; 10: # ERROR: count not defined
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;print(count)
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;count = count + 1
            </div>
            <p className="text-base">
              <strong>How to fix:</strong> Always initialize variables before
              using them in conditions.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Part 7: When to Use Which Loop",
      content: (
        <div className="space-y-6">
          <p className="text-lg font-semibold text-dark_blue">
            A Simple Decision Guide
          </p>

          <div className="bg-light_blue bg-opacity-50 p-4 rounded-lg">
            <p className="text-base mb-4">Ask yourself these questions:</p>
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-dark_blue">
                    Do I know exactly how many times?
                  </p>
                  <p className="text-base">
                    Yes →{" "}
                    <span className="font-bold text-medium_blue">for loop</span>
                  </p>
                  <p className="text-base">
                    No →{" "}
                    <span className="font-bold text-medium_blue">
                      while loop
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-dark_blue">
                    Am I processing a collection?
                  </p>
                  <p className="text-base">
                    Yes →{" "}
                    <span className="font-bold text-medium_blue">for loop</span>
                  </p>
                  <p className="text-base">
                    No →{" "}
                    <span className="font-bold text-medium_blue">
                      while may work
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-dark_blue">
                    Does it depend on user input?
                  </p>
                  <p className="text-base">
                    Yes →{" "}
                    <span className="font-bold text-medium_blue">
                      while loop
                    </span>
                  </p>
                  <p className="text-base">
                    No →{" "}
                    <span className="font-bold text-medium_blue">
                      for might work
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-medium_blue bg-opacity-10 p-4 rounded-lg">
            <h4 className="font-bold text-dark_blue mb-3">Rule of Thumb:</h4>
            <p className="text-lg font-semibold text-dark_blue">
              Use <span className="text-medium_blue">for</span> when you can
              count it
            </p>
            <p className="text-lg font-semibold text-dark_blue">
              Use <span className="text-medium_blue">while</span> when you must
              check for it
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Part 8: Hands-On Preview",
      content: (
        <div className="space-y-6">
          <p className="text-lg font-semibold text-dark_blue">
            Before You Start the Exercises
          </p>

          <div className="bg-light_blue bg-opacity-30 p-4 rounded-lg">
            <p className="font-semibold text-dark_blue mb-3">
              Problem: Print "Hello!" 5 times.
            </p>

            <p className="font-semibold text-dark_blue mb-2">
              Step 1: Choose the right loop
            </p>
            <p className="text-base mb-4">
              I know exactly how many times (5) → Use for loop
            </p>

            <p className="font-semibold text-dark_blue mb-2">
              Step 2: Write the structure
            </p>
            <div className="bg-dark_blue text-offwite p-3 rounded font-mono text-sm overflow-x-auto mb-4">
              for i in range(5):
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;# body goes here
            </div>

            <p className="font-semibold text-dark_blue mb-2">
              Step 3: Add the body
            </p>
            <div className="bg-dark_blue text-offwite p-3 rounded font-mono text-sm overflow-x-auto mb-4">
              for i in range(5):
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;print("Hello!")
            </div>

            <p className="font-semibold text-dark_blue mb-2">
              Step 5: Make it more informative
            </p>
            <div className="bg-dark_blue text-offwite p-3 rounded font-mono text-sm overflow-x-auto mb-4">
              for i in range(5):
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;print(f"Hello! This is repetition number{" "}
              {"{i+1}"}")
            </div>

            <p className="font-semibold text-dark_blue mb-2">Output:</p>
            <div className="bg-offwite p-3 rounded font-mono text-sm border border-medium_blue">
              Hello! This is repetition number 1<br />
              Hello! This is repetition number 2<br />
              Hello! This is repetition number 3<br />
              Hello! This is repetition number 4<br />
              Hello! This is repetition number 5
            </div>
          </div>

          <div className="bg-medium_blue bg-opacity-10 p-4 rounded-lg">
            <p className="font-semibold text-dark_blue mb-2">Try Modifying:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-base">
              <li>Change 5 to 10 → What happens?</li>
              <li>
                Change print("Hello!") to print("Goodbye!") → What changes?
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Summary: Key Takeaways",
      content: (
        <div className="space-y-6">
          <div className="bg-light_blue bg-opacity-50 p-4 rounded-lg">
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-dark_blue">Why loops?</p>
                <p className="text-base">
                  Avoid repetition, write efficient code
                </p>
              </div>
              <div>
                <p className="font-semibold text-dark_blue">for loop</p>
                <p className="text-base">
                  Use when you know the number of iterations
                </p>
              </div>
              <div>
                <p className="font-semibold text-dark_blue">while loop</p>
                <p className="text-base">
                  Use when you loop until a condition changes
                </p>
              </div>
              <div>
                <p className="font-semibold text-dark_blue">range()</p>
                <p className="text-base">
                  Creates number sequences for counting loops
                </p>
              </div>
              <div>
                <p className="font-semibold text-dark_blue">Infinite loop</p>
                <p className="text-base">
                  Forgetting to update condition → program never ends
                </p>
              </div>
              <div>
                <p className="font-semibold text-dark_blue">Off-by-one</p>
                <p className="text-base">
                  Remember range(stop) stops BEFORE stop
                </p>
              </div>
              <div>
                <p className="font-semibold text-dark_blue">Common patterns</p>
                <p className="text-base">
                  Counting, filtering, searching, nested loops
                </p>
              </div>
            </div>
          </div>

          <div className="bg-medium_blue text-white p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Ready to Practice?</h3>
            <p className="text-base leading-relaxed mb-4">
              You've now learned:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base mb-4">
              <li>What loops are and why they matter</li>
              <li>The difference between for and while loops</li>
              <li>How to structure a loop correctly</li>
              <li>Common patterns and mistakes to avoid</li>
            </ul>
            <p className="text-base leading-relaxed mb-4">
              You are now ready to attempt the loop exercises! The platform will
              adapt to your responses — if you struggle with a concept, you'll
              see more visual explanations. If you grasp things quickly, you'll
              get more challenges.
            </p>
            <p className="text-xl font-bold">Good luck, and happy coding! 🚀</p>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentPart < parts.length - 1) {
      setCurrentPart(currentPart + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentPart > 0) {
      setCurrentPart(currentPart - 1);
      setNumOfBackClicks(numOfBackClicks + 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-offwite to-light_blue p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-dark_blue mb-2">
            Loops Lecture
          </h1>
          <p className="text-lg text-medium_blue font-semibold">
            Part {currentPart + 1} of {parts.length}: {parts[currentPart].title}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 min-h-96">
          {parts[currentPart].content}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={handlePrev}
            disabled={currentPart === 0}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              currentPart === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-medium_blue text-white hover:bg-dark_blue shadow-md"
            }`}
          >
            ← Previous
          </button>

          {/* Progress Indicator */}
          <div className="flex gap-2">
            {parts.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-200 ${
                  index === currentPart
                    ? "bg-medium_blue w-8"
                    : "bg-light_blue w-2 cursor-pointer"
                }`}
                onClick={() => setCurrentPart(index)}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPart === parts.length - 1}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              currentPart === parts.length - 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-medium_blue text-white hover:bg-dark_blue shadow-md"
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoopsLectureVerbal;
