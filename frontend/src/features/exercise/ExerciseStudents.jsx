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
import useGetTopicName from "../../hooks/useGetTopicName";

function ExerciseStudents() {
  const { userId, solvedProblems } = useUser();
  const topic = useGetTopicName();
  const {
    exercises,
    isLoading: exercisesLoading,
    error: exercisesError,
  } = useGetExercises(topic);
  const {
    easyScore,
    mediumScore,
    hardScore,
    predictedDifficulty,
    refetch: refetchDifficulty,
  } = useInferDifficulty(userId, topic);
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
  const timeDeltaRef = useRef();

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
        topic,
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

                    <div className="relative w-full flex flex-col items-center group">
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

                      {/* Dashed Loop back line wrap-around for No path */}
                      {node.noLoops && (
                        <>
                          <div className="absolute border-l-2 border-t-2 border-b-2 border-dashed border-red-500 opacity-80 -z-10 rounded-l-xl" style={{ right: 'calc(50% + 2rem)', top: '-5.25rem', bottom: '1.5rem', width: '4.5rem' }}>
                            {/* Arrow head pointing back to the diamond */}
                            <div className="absolute top-[-6px] right-[-2px] w-2.5 h-2.5 border-r-2 border-t-2 border-red-500 transform rotate-45"></div>
                          </div>
                          <div className="absolute top-1/2 right-[calc(50%+4.5rem)] transform -translate-y-1/2 text-red-600 text-[10px] font-bold px-2 py-0.5 whitespace-nowrap bg-white border border-red-200 rounded z-20 shadow-sm">
                            ↺ Loop Back
                          </div>
                        </>
                      )}
                    </div>
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
                    {Array.isArray(selectedExercise?.wayToSolve?.verbal)
                      ? selectedExercise.wayToSolve.verbal.map((step, index) => (
                          <div key={index} className="mb-2">
                            {index + 1}. {step}
                          </div>
                        ))
                      : selectedExercise?.wayToSolve?.verbal}
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
                    {Array.isArray(selectedExercise?.wayToSolve?.verbal)
                      ? selectedExercise.wayToSolve.verbal.map((step, index) => (
                          <div key={index} className="mb-2">
                            {index + 1}. {step}
                          </div>
                        ))
                      : selectedExercise?.wayToSolve?.verbal}
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

export default ExerciseStudents;
