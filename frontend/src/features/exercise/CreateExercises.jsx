import { useState } from "react";
import useCreateExercises from "../exercise/useCreateExercises";

const emptyExercise = {
  title: "",
  description: "",
  difficulty: "easy",
  topic: "loops",
  starterCode: "",
  testCases: [
    { input: "", output: "", explanation: "", outputMultiline: false },
  ],
  verbalSteps: [""],
  visualSteps: [{ text: "", shape: "oval", directedTowards: [] }],
};

function CreateExercises() {
  const { createExercises, isLoading } = useCreateExercises();

  // Manage multiple exercises
  const [exercises, setExercises] = useState([{ ...emptyExercise }]);
  const [currentStep, setCurrentStep] = useState(0);

  const currentEx = exercises[currentStep];

  const updateEx = (field, value) => {
    const newExs = [...exercises];
    newExs[currentStep] = { ...newExs[currentStep], [field]: value };
    setExercises(newExs);
  };

  const handleAddExercise = () => {
    setExercises([...exercises, { ...emptyExercise }]);
    setCurrentStep(exercises.length); // Navigate to newly created exercise
  };

  const handleRemoveExercise = (index) => {
    if (exercises.length === 1) return;
    const newExs = exercises.filter((_, i) => i !== index);
    setExercises(newExs);
    if (currentStep >= newExs.length) {
      setCurrentStep(newExs.length - 1);
    } else if (currentStep === index && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddTestCase = () =>
    updateEx("testCases", [
      ...currentEx.testCases,
      { input: "", output: "", explanation: "", outputMultiline: false },
    ]);
  const handleUpdateTestCase = (index, field, value) => {
    const updated = [...currentEx.testCases];
    updated[index][field] = value;
    updateEx("testCases", updated);
  };
  const handleRemoveTestCase = (index) =>
    updateEx(
      "testCases",
      currentEx.testCases.filter((_, i) => i !== index),
    );

  const handleAddVerbalStep = () =>
    updateEx("verbalSteps", [...currentEx.verbalSteps, ""]);
  const handleUpdateVerbalStep = (index, value) => {
    const updated = [...currentEx.verbalSteps];
    updated[index] = value;
    updateEx("verbalSteps", updated);
  };
  const handleRemoveVerbalStep = (index) =>
    updateEx(
      "verbalSteps",
      currentEx.verbalSteps.filter((_, i) => i !== index),
    );

  const handleAddVisualStep = () => {
    updateEx("visualSteps", [
      ...currentEx.visualSteps,
      { text: "", shape: "oval", directedTowards: [] },
    ]);
  };
  const handleUpdateVisualStep = (index, field, value) => {
    const updated = [...currentEx.visualSteps];
    updated[index][field] = value;
    updateEx("visualSteps", updated);
  };
  const handleRemoveVisualStep = (index) => {
    updateEx(
      "visualSteps",
      currentEx.visualSteps.filter((_, i) => i !== index),
    );
  };

  const handleAddDirectedTowards = (visualIndex) => {
    const updated = [...currentEx.visualSteps];
    updated[visualIndex].directedTowards.push({
      direction: "next",
      requiredStep: "",
    });
    updateEx("visualSteps", updated);
  };
  const handleUpdateDirectedTowards = (visualIndex, dtIndex, field, value) => {
    const updated = [...currentEx.visualSteps];
    updated[visualIndex].directedTowards[dtIndex][field] = value;
    updateEx("visualSteps", updated);
  };
  const handleRemoveDirectedTowards = (visualIndex, dtIndex) => {
    const updated = [...currentEx.visualSteps];
    updated[visualIndex].directedTowards = updated[
      visualIndex
    ].directedTowards.filter((_, i) => i !== dtIndex);
    updateEx("visualSteps", updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const exercisesData = exercises.map((ex) => {
      return {
        title: ex.title,
        description: ex.description,
        difficulty: ex.difficulty,
        topic: ex.topic,
        starterCode: ex.starterCode,
        testCases: ex.testCases,
        wayToSolve: {
          verbal: ex.verbalSteps.filter((step) => step.trim() !== ""),
          visual: ex.visualSteps.filter((step) => step.text.trim() !== ""),
        },
      };
    });

    console.log("Submitting exercises: ", exercisesData);
    createExercises({ exercises: exercisesData });

    // Reset after publishing
    setExercises([{ ...emptyExercise }]);
    setCurrentStep(0);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark_blue">
            Create Exercises
          </h1>
          <p className="text-medium_blue mt-2">
            Design new computational thinking challenges for your students.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleAddExercise}
            className="px-4 py-2 bg-light_blue text-dark_blue font-bold rounded-lg shadow hover:bg-medium_blue hover:text-white transition-colors"
          >
            + Add Another Exercise
          </button>
        </div>
      </div>

      {/* Pagination / Stepper Navigation */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm mb-8 border border-light_blue">
        <button
          type="button"
          onClick={() => setCurrentStep((p) => p - 1)}
          disabled={currentStep === 0}
          className={`px-4 py-2 font-bold rounded-lg transition-colors ${
            currentStep === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-medium_blue text-white hover:bg-dark_blue"
          }`}
        >
          &larr; Previous Exercise
        </button>

        <div className="flex items-center gap-4">
          <span className="font-bold text-dark_blue text-lg">
            Exercise {currentStep + 1} of {exercises.length}
          </span>
          {exercises.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveExercise(currentStep)}
              className="text-red-500 hover:text-red-700 font-semibold text-sm bg-red-50 px-2 py-1 rounded"
            >
              Delete This Exercise
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setCurrentStep((p) => p + 1)}
          disabled={currentStep === exercises.length - 1}
          className={`px-4 py-2 font-bold rounded-lg transition-colors ${
            currentStep === exercises.length - 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-medium_blue text-white hover:bg-dark_blue"
          }`}
        >
          Next Exercise &rarr;
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <section className="bg-white p-6 rounded-xl shadow-md border-t-4 border-medium_blue">
          <h2 className="text-xl font-bold text-dark_blue mb-4 border-b pb-2">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-dark_blue mb-1">
                Title
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-medium_blue bg-offwite"
                value={currentEx.title}
                onChange={(e) => updateEx("title", e.target.value)}
                placeholder="e.g., Sum of Even Numbers"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-dark_blue mb-1">
                Description
              </label>
              <textarea
                required
                rows="3"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-medium_blue bg-offwite"
                value={currentEx.description}
                onChange={(e) => updateEx("description", e.target.value)}
                placeholder="Describe the problem to be solved..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark_blue mb-1">
                Topic
              </label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-medium_blue bg-offwite"
                value={currentEx.topic}
                onChange={(e) => updateEx("topic", e.target.value)}
              >
                <option value="loops">Loops</option>
                <option value="conditionals">Conditionals</option>
                <option value="sequential">Sequential</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark_blue mb-1">
                Difficulty
              </label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-medium_blue bg-offwite"
                value={currentEx.difficulty}
                onChange={(e) => updateEx("difficulty", e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-dark_blue mb-1">
                Starter Code (Python)
              </label>
              <textarea
                required
                rows="4"
                className="w-full px-4 py-2 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-medium_blue bg-gray-900 text-gray-100"
                value={currentEx.starterCode}
                onChange={(e) => updateEx("starterCode", e.target.value)}
                placeholder="def my_function():&#10;    pass"
              />
            </div>
          </div>
        </section>

        {/* Test Cases */}
        <section className="bg-white p-6 rounded-xl shadow-md border-t-4 border-light_blue">
          <div className="mb-4 border-b pb-2">
            <h2 className="text-xl font-bold text-dark_blue">Test Cases</h2>
          </div>
          <div className="space-y-4">
            {currentEx.testCases.map((tc, index) => (
              <div
                key={index}
                className="p-4 bg-offwite rounded-lg border flex gap-4"
              >
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Input
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-medium_blue"
                        value={tc.input}
                        onChange={(e) =>
                          handleUpdateTestCase(index, "input", e.target.value)
                        }
                        placeholder="e.g., N = 10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Expected Output
                      </label>
                      <div className="flex gap-2 items-end">
                        {tc.outputMultiline ? (
                          <textarea
                            required
                            rows="3"
                            className="flex-1 px-3 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-medium_blue"
                            value={tc.output}
                            onChange={(e) =>
                              handleUpdateTestCase(
                                index,
                                "output",
                                e.target.value,
                              )
                            }
                            placeholder="e.g., 30"
                          />
                        ) : (
                          <input
                            type="text"
                            required
                            className="flex-1 px-3 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-medium_blue"
                            value={tc.output}
                            onChange={(e) =>
                              handleUpdateTestCase(
                                index,
                                "output",
                                e.target.value,
                              )
                            }
                            placeholder="e.g., 30"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateTestCase(
                              index,
                              "outputMultiline",
                              !tc.outputMultiline,
                            )
                          }
                          className="px-2 py-1 my-auto bg-light_blue text-dark_blue text-xs font-bold rounded hover:bg-medium_blue hover:text-white transition-colors whitespace-nowrap"
                          title="Toggle multi-line output"
                        >
                          {tc.outputMultiline ? "Single" : "Multi"}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Explanation
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-medium_blue"
                      value={tc.explanation}
                      onChange={(e) =>
                        handleUpdateTestCase(
                          index,
                          "explanation",
                          e.target.value,
                        )
                      }
                      placeholder="Why does this output occur?"
                    />
                  </div>
                </div>
                {currentEx.testCases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTestCase(index)}
                    className="text-red-500 hover:text-red-700 h-fit self-center p-2"
                    title="Remove Test Case"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={handleAddTestCase}
              className="text-sm bg-medium_blue text-white px-3 py-1 rounded hover:bg-dark_blue transition-colors"
            >
              + Add Test Case
            </button>
          </div>
        </section>

        {/* Way To Solve - Verbal */}
        <section className="bg-white p-6 rounded-xl shadow-md border-t-4 border-medium_blue">
          <div className="mb-4 border-b pb-2">
            <h2 className="text-xl font-bold text-dark_blue">
              Verbal Solution Guide
            </h2>
          </div>
          <div className="space-y-3">
            {currentEx.verbalSteps.map((step, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="font-bold text-medium_blue w-6">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  required
                  className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-medium_blue bg-offwite"
                  value={step}
                  onChange={(e) =>
                    handleUpdateVerbalStep(index, e.target.value)
                  }
                  placeholder="Describe this step..."
                />
                <button
                  type="button"
                  onClick={() => handleRemoveVerbalStep(index)}
                  className="text-red-500 hover:text-red-700 px-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={handleAddVerbalStep}
              className="text-sm bg-medium_blue text-white px-3 py-1 rounded hover:bg-dark_blue transition-colors"
            >
              + Add Step
            </button>
          </div>
        </section>

        {/* Way To Solve - Visual */}
        <section className="bg-white p-6 rounded-xl shadow-md border-t-4 border-dark_blue">
          <div className="mb-4 border-b pb-2">
            <h2 className="text-xl font-bold text-dark_blue">
              Visual Flowchart Nodes
            </h2>
          </div>
          <div className="space-y-6">
            {currentEx.visualSteps.map((vStep, vIndex) => (
              <div
                key={vIndex}
                className="p-4 border-2 border-light_blue rounded-xl bg-offwite"
              >
                <div className="flex justify-between mb-3">
                  <h3 className="font-bold text-dark_blue">
                    Node {vIndex + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleRemoveVisualStep(vIndex)}
                    className="text-red-500 hover:text-red-700 text-sm font-bold"
                  >
                    Remove Node
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Node Text
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-medium_blue"
                      value={vStep.text}
                      onChange={(e) =>
                        handleUpdateVisualStep(vIndex, "text", e.target.value)
                      }
                      placeholder="e.g., Start, or i < N?"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Shape
                    </label>
                    <select
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-medium_blue"
                      value={vStep.shape}
                      onChange={(e) =>
                        handleUpdateVisualStep(vIndex, "shape", e.target.value)
                      }
                    >
                      <option value="oval">Oval (Start/End)</option>
                      <option value="rectangle">Rectangle (Process)</option>
                      <option value="parallelogram">Parallelogram (I/O)</option>
                      <option value="diamond">Diamond (Condition)</option>
                    </select>
                  </div>
                </div>

                {/* Directed Towards */}
                <div className="mt-4 p-3 bg-white border rounded">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-bold text-medium_blue">
                      Edges / Directed Towards
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleAddDirectedTowards(vIndex)}
                      className="text-xs bg-light_blue text-dark_blue px-2 py-1 rounded hover:bg-medium_blue hover:text-white transition-colors"
                    >
                      + Add Edge
                    </button>
                  </div>

                  {vStep.directedTowards.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">
                      No outgoing edges (e.g., End node)
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {vStep.directedTowards.map((dt, dtIndex) => (
                        <div key={dtIndex} className="flex gap-3 items-center">
                          <select
                            className="text-sm px-2 py-1 border rounded focus:outline-none"
                            value={dt.direction}
                            onChange={(e) =>
                              handleUpdateDirectedTowards(
                                vIndex,
                                dtIndex,
                                "direction",
                                e.target.value,
                              )
                            }
                          >
                            <option value="next">Next</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                          <span className="text-gray-400">→</span>
                          <select
                            required
                            className="flex-1 text-sm px-2 py-1 border rounded focus:outline-none"
                            value={dt.requiredStep}
                            onChange={(e) =>
                              handleUpdateDirectedTowards(
                                vIndex,
                                dtIndex,
                                "requiredStep",
                                e.target.value,
                              )
                            }
                          >
                            <option value="" disabled>
                              Select target node...
                            </option>
                            {currentEx.visualSteps.map((targetStep, idx) => (
                              <option
                                key={idx}
                                value={targetStep.text}
                                disabled={!targetStep.text}
                              >
                                {targetStep.text || `Node ${idx + 1} (empty)`}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveDirectedTowards(vIndex, dtIndex)
                            }
                            className="text-red-500 hover:text-red-700 font-bold px-2 text-xl"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={handleAddVisualStep}
              className="text-sm bg-medium_blue text-white px-3 py-1 rounded hover:bg-dark_blue transition-colors"
            >
              + Add Node
            </button>
          </div>
        </section>

        {/* Submit */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 text-xl font-bold rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 ${
              isLoading
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-dark_blue text-white hover:bg-medium_blue"
            }`}
          >
            {isLoading
              ? "Publishing Exercises..."
              : `Publish All ${exercises.length} Exercise(s)`}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateExercises;
