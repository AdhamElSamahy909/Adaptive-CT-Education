import { useState } from "react";

function LoopsLectureVisual({ numOfBackClicks, setNumOfBackClicks }) {
  const [currentPart, setCurrentPart] = useState(0);

  const parts = [
    {
      title: "Part 1: Why Do We Need Loops?",
      content: (
        <div className="space-y-6">
          <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="font-bold text-red-800 mb-2">WITHOUT LOOPS:</p>
            <pre className="bg-dark_blue text-offwite p-4 rounded overflow-x-auto text-xs">
              {`Write this:      Does this:

┌─────────┐      ┌─────────────────────────┐
│ Grade   │ ───► │ Grade assignment #1     │
│ Student │      └─────────────────────────┘
│ #1      │      
└─────────┘      ┌─────────────────────────┐
┌─────────┐      │ Grade assignment #2     │
│ Grade   │ ───► │                         │
│ Student │      └─────────────────────────┘
│ #2      │      
└─────────┘      ┌─────────────────────────┐
┌─────────┐      │ Grade assignment #3     │
│ Grade   │ ───► │                         │
│ Student │      └─────────────────────────┘
│ #3      │                    ...
└─────────┘              (and so on)

PROBLEM: 30 assignments = 30 blocks of code`}
            </pre>
          </div>

          <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded-lg">
            <p className="font-bold text-green-800 mb-2">WITH LOOPS:</p>
            <pre className="bg-dark_blue text-offwite p-4 rounded overflow-x-auto text-xs">
              {`Write this:                   Does this:
┌─────────────────┐
│                 │        ┌─────────────────────────┐
│   FOR each      │        │ Grade assignment #1    │
│   student:      │ ───►   └─────────────────────────┘
│   grade(student)│               │
│                 │               ▼
└─────────────────┘        ┌─────────────────────────┐
                           │ Grade assignment #2    │
1 block of code            └─────────────────────────┘
30 executions                   │
                               ▼
                        ┌─────────────────────────┐
                        │ Grade assignment #3    │
                        └─────────────────────────┘
                                  ...

BENEFIT: 30 assignments = 1 block repeated 30 times`}
            </pre>
          </div>
        </div>
      ),
    },
    {
      title: "Part 2: Two Main Types of Loops",
      content: (
        <div className="space-y-4">
          <pre className="bg-dark_blue text-offwite p-4 rounded overflow-x-auto text-xs">
            {`                ┌─────────────────────────────────────┐
                │       DECISION: HOW MANY TIMES?     │
                └─────────────────────────────────────┘
                                  │
                ┌─────────────────┴─────────────────┐
                │                                   │
                ▼                                   ▼
    ┌───────────────────────┐         ┌───────────────────────┐
    │   "I KNOW EXACTLY"    │         │   "I KNOW WHEN TO     │
    │                       │         │    STOP"              │
    │     for loop          │         │     while loop        │
    └───────────────────────┘         └───────────────────────┘`}
          </pre>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-medium_blue bg-opacity-10 p-4 rounded-lg">
              <h4 className="font-bold text-medium_blue mb-2">for loop</h4>
              <pre className="bg-dark_blue text-offwite p-3 rounded overflow-x-auto text-xs">
                {`For each item
  in the list:
    do this

Item 1
Item 2
Item 3
...`}
              </pre>
            </div>

            <div className="bg-medium_blue bg-opacity-10 p-4 rounded-lg">
              <h4 className="font-bold text-medium_blue mb-2">while loop</h4>
              <pre className="bg-dark_blue text-offwite p-3 rounded overflow-x-auto text-xs">
                {`While condition
  is True:
    do this
    │
    ├─ Check: True?
    │  └─► continue
    │
    └─ Check: False?
       └─► exit`}
              </pre>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Part 3: Anatomy of a Loop",
      content: (
        <div className="space-y-4">
          <pre className="bg-dark_blue text-offwite p-4 rounded overflow-x-auto text-xs">
            {`① INITIALIZATION               count = 0
          ↓
② CONDITION CHECK          while count < 5:
          │                     ↓
          ├─ True?  ────────┐   continue
          │                 │
          └─ False? ─────► EXIT

③ BODY + ④ UPDATE
          print(count)    (BODY - work)
          count += 1      (UPDATE - progress)
          │
          └──► back to ②

THE INFINITE LOOP TRAP:
──────────────────────
count = 0
while count < 5:
    print(count)
    # UPDATE MISSING!

Result: count never changes → ∞`}
          </pre>

          <div className="bg-yellow-100 border-l-4 border-yellow-600 p-4 rounded-lg">
            <p className="text-sm text-yellow-900">
              <strong>Key Insight:</strong> All 4 components must work together.
              Missing the UPDATE component causes infinite loops!
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Part 4: The range() Function",
      content: (
        <div className="space-y-4">
          <div className="bg-light_blue bg-opacity-30 p-4 rounded-lg">
            <pre className="bg-dark_blue text-offwite p-3 rounded overflow-x-auto text-xs">
              {`range(5)
Start: 0 (default)   Stop: 5   Step: 1 (default)
[0]───[1]───[2]───[3]───[4]   stops before 5

range(2, 7)
Start: 2   Stop: 7   Step: 1
[2]───[3]───[4]───[5]───[6]   stops before 7

range(1, 10, 2)
Start: 1   Stop: 10   Step: 2
[1]───[3]───[5]───[7]───[9]   skip by 2

range(5, 0, -1)
Start: 5   Stop: 0   Step: -1 (counting down)
[5]───[4]───[3]───[2]───[1]   stops before 0`}
            </pre>
          </div>

          <p className="font-semibold text-dark_blue">Visual Timeline:</p>
          <pre className="bg-dark_blue text-offwite p-3 rounded overflow-x-auto text-xs">
            {`range(5):
┌───┬───┬───┬───┬───┬───┐
│ 0 │ 1 │ 2 │ 3 │ 4 │   │  (stop at 5, so 5 is empty)
└───┴───┴───┴───┴───┴───┘

range(2, 6):
┌───┬───┬───┬───┬───┬───┬───┐
│   │ 2 │ 3 │ 4 │ 5 │   │   │  (starts at 2, ends before 6)
└───┴───┴───┴───┴───┴───┴───┘`}
          </pre>
        </div>
      ),
    },
    {
      title: "Part 5: Loop Patterns",
      content: (
        <div className="space-y-4">
          <pre className="bg-dark_blue text-offwite p-3 rounded overflow-x-auto text-xs">
            {`① COUNTING (ACCUMULATION)
   total = 0
   for each number:
       total = total + number

   [1] → [+1] → [2] → [+2] → [4] → [+3] → [7] ...

② FILTERING
   Input:  [1]  [2]  [3]  [4]  [5]  [6]
            ↓    ↓    ↓    ↓    ↓    ↓
         condition? (even?)
            ↓    ↓    ↓    ↓    ↓    ↓
   Output:       [2]       [4]       [6]

③ SEARCHING
   [A] → [B] → [C] → [D]
    ↓     ↓     ↓     ↓
   "Is this 'C'?"
    ↓     ↓     ↓     ↓
   No    No    Yes → STOP! Found!

④ NESTED LOOPS (Grid Pattern)
   Row 0: [0,0] [0,1] [0,2] [0,3]
   Row 1: [1,0] [1,1] [1,2] [1,3]
   Row 2: [2,0] [2,1] [2,2] [2,3]
   
   Outer loop: ROW | Inner loop: COLUMN`}
          </pre>
        </div>
      ),
    },
    {
      title: "Part 6: Common Mistakes",
      content: (
        <div className="space-y-4">
          <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg mb-4">
            <p className="font-bold text-red-800 mb-2">
              MISTAKE 1: INFINITE LOOP
            </p>
            <pre className="bg-dark_blue text-offwite p-3 rounded overflow-x-auto text-xs">
              {`count = 0
while count < 5:
    print("Hello")
    # count never changes

Result: Hello → Hello → Hello → ... (never ends!)`}
            </pre>
          </div>

          <div className="bg-yellow-100 border-l-4 border-yellow-600 p-4 rounded-lg mb-4">
            <p className="font-bold text-yellow-900 mb-2">
              MISTAKE 2: OFF-BY-ONE
            </p>
            <pre className="bg-dark_blue text-offwite p-3 rounded overflow-x-auto text-xs">
              {`Want: 1 2 3 4 5

range(5)    →  0 1 2 3 4    ✗ (starts too early)
range(1,5)  →  1 2 3 4      ✗ (ends too early)
range(1,6)  →  1 2 3 4 5    ✓

Visual fence-post analogy:
│ 1 │ 2 │ 3 │ 4 │ 5 │
└───┴───┴───┴───┴───┘
5 items need 6 positions`}
            </pre>
          </div>

          <div className="bg-orange-100 border-l-4 border-orange-600 p-4 rounded-lg">
            <p className="font-bold text-orange-900 mb-2">
              MISTAKE 3: MODIFYING DURING ITERATION
            </p>
            <pre className="bg-dark_blue text-offwite p-3 rounded overflow-x-auto text-xs">
              {`Original:  [1] [2] [3] [4] [5]
            ↓
Process 1:  [1] [2] [3] [4] [5]
            ↓
Remove 2:   [1] [3] [4] [5]  ← list shifted!
            ↓
Next item may be skipped!`}
            </pre>
          </div>
        </div>
      ),
    },
    {
      title: "Part 7: Loop Selection Flowchart",
      content: (
        <div className="space-y-4">
          <pre className="bg-dark_blue text-offwite p-3 rounded overflow-x-auto text-xs">
            {`                ┌─────────────────────┐
                │   START: I need to  │
                │   repeat something  │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ Do I know BEFORE    │
                │ how many times?     │
                └──────────┬──────────┘
                           │
          ┌────────────────┴────────────────┐
          │                                 │
          ▼                                 ▼
 ┌────────────────┐               ┌────────────────┐
 │      YES       │               │      NO        │
 └───────┬────────┘               └───────┬────────┘
         │                                │
         ▼                                ▼
 ┌────────────────┐               ┌────────────────┐
 │   Use for loop │               │  Use while     │
 │                │               │  loop          │
 │ "For each item │               │ "While the     │
 │  in my list..."│               │  condition is  │
 └────────────────┘               │  true..."      │
                                  └────────────────┘`}
          </pre>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-light_blue bg-opacity-30 p-4 rounded-lg">
              <h4 className="font-bold text-dark_blue mb-2">for loop uses:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Print 1 to 100</li>
                <li>Average 5 scores</li>
                <li>Process all files</li>
              </ul>
            </div>

            <div className="bg-light_blue bg-opacity-30 p-4 rounded-lg">
              <h4 className="font-bold text-dark_blue mb-2">
                while loop uses:
              </h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Ask until valid</li>
                <li>Add until {">"} 1000</li>
                <li>Play until lost</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Part 8: Hands-On Execution Visualization",
      content: (
        <div className="space-y-4">
          <p className="font-semibold text-dark_blue mb-3">
            Problem: Print "Hello!" 5 times
          </p>

          <pre className="bg-dark_blue text-offwite p-3 rounded overflow-x-auto text-xs">
            {`for i in range(5):
    print("Hello!")`}
          </pre>

          <p className="font-semibold text-dark_blue mb-2">
            Step-by-Step Execution:
          </p>
          <pre className="bg-dark_blue text-offwite p-3 rounded overflow-x-auto text-xs">
            {`Iteration 1: i = 0  ──► Hello!
Iteration 2: i = 1  ──► Hello!
Iteration 3: i = 2  ──► Hello!
Iteration 4: i = 3  ──► Hello!
Iteration 5: i = 4  ──► Hello!

Loop ends when i reaches 5`}
          </pre>

          <p className="font-semibold text-dark_blue mb-2">Final Output:</p>
          <div className="bg-offwite border-2 border-medium_blue p-4 rounded">
            <div className="font-mono text-sm text-dark_blue">
              Hello!
              <br />
              Hello!
              <br />
              Hello!
              <br />
              Hello!
              <br />
              Hello!
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Summary: Key Takeaways",
      content: (
        <div className="space-y-6">
          <div className="bg-light_blue bg-opacity-50 p-4 rounded-lg">
            <pre className="bg-dark_blue text-offwite p-3 rounded overflow-x-auto text-xs">
              {`Concept                 Summary
─────────────────────────────────────────────────────
Why loops?              Avoid repetition, write code once
for loop                Use when you know the iterations
while loop              Use when you check a condition
range()                 Creates number sequences
Infinite loop           Update condition = ∞
Off-by-one              range(stop) stops BEFORE stop
Common patterns         Counting, filtering, searching`}
            </pre>
          </div>

          <div className="bg-medium_blue text-white p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Ready to Practice?</h3>
            <div className="space-y-3">
              <p className="text-base">You've learned:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>What loops are and why they matter</li>
                <li>Visual differences: for vs while loops</li>
                <li>How to structure loops correctly</li>
                <li>Common visual patterns and mistakes</li>
              </ul>
              <p className="text-base mt-4">
                You are now ready to attempt the loop exercises! The platform
                will adapt to your responses based on your learning style.
              </p>
              <p className="text-xl font-bold mt-4">
                Good luck, and happy coding! 🚀
              </p>
            </div>
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
                    : "bg-light_blue w-2 cursor-pointer hover:bg-medium_blue"
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

export default LoopsLectureVisual;
