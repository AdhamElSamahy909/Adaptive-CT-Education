import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetExercises from "./useGetExercises";
import useUpdateExercise from "./useUpdateExercise";
import useDeleteExercise from "./useDeleteExercise";
import useCreateExercises from "./useCreateExercises";
import Loader from "../../ui/Loader";

const emptyExercise = {
  title: "",
  description: "",
  difficulty: "easy",
  topic: "conditionals",
  starterCode: "",
  testCases: [
    { input: "", output: "", explanation: "", outputMultiline: false },
  ],
  verbalSteps: [""],
  visualSteps: [{ text: "", shape: "oval", directedTowards: [] }],
};

function ConditionalsExerciseInstructorsPage() {
  const navigate = useNavigate();
  const { exercises, isLoading, error } = useGetExercises();
  const { updateExercise, isLoading: isUpdating } = useUpdateExercise();
  const { deleteExercise, isLoading: isDeleting } = useDeleteExercise();
  const { createExercises, isLoading: isCreating } = useCreateExercises();

  const [mode, setMode] = useState("view"); // "view" or "edit"
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editingExercises, setEditingExercises] = useState([]);
  const [newExercises, setNewExercises] = useState([]);

  const isNewExercise = currentIndex >= exercises.length;
  const currentExercises = isNewExercise ? newExercises : editingExercises;
  const localIndex = isNewExercise
    ? currentIndex - exercises.length
    : currentIndex;
  const currentEx = currentExercises[localIndex];

  const handleEdit = () => {
    setEditingExercises(
      exercises.map((ex) => ({
        ...ex,
        verbalSteps: ex.wayToSolve?.verbal || [],
        visualSteps: ex.wayToSolve?.visual || [],
      })),
    );
    setMode("edit");
  };

  const handleCancelEdit = () => {
    setMode("view");
    setCurrentIndex(0);
    setNewExercises([]);
  };

  const handleAddNewExercise = () => {
    const updatedNewExercises = [...newExercises, { ...emptyExercise }];
    setNewExercises(updatedNewExercises);
    setCurrentIndex(exercises.length + updatedNewExercises.length - 1);
  };

  const updateEx = (field, value) => {
    const updated = [...currentExercises];
    updated[localIndex] = {
      ...updated[localIndex],
      [field]: value,
    };

    if (isNewExercise) {
      setNewExercises(updated);
    } else {
      setEditingExercises(updated);
    }
  };

  const handleSaveExercise = () => {
    const exerciseData = {
      title: currentEx.title,
      description: currentEx.description,
      difficulty: currentEx.difficulty,
      topic: currentEx.topic,
      starterCode: currentEx.starterCode,
      testCases: currentEx.testCases,
      wayToSolve: {
        verbal: currentEx.verbalSteps.filter((step) => step.trim() !== ""),
        visual: currentEx.visualSteps.filter((step) => step.text.trim() !== ""),
      },
    };

    if (isNewExercise) {
      createExercises({ exercises: [exerciseData] });
      navigate(-1);
    } else {
      updateExercise({
        exerciseId: currentEx._id,
        exerciseData,
      });
    }
  };

  const handleDeleteExercise = (id) => {
    if (window.confirm("Are you sure you want to delete this exercise?")) {
      deleteExercise(id);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 font-semibold">{error.message}</p>
        </div>
      </div>
    );
  }

  if (mode === "view") {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 text-dark_blue font-bold hover:text-medium_blue transition-colors flex items-center gap-2"
        >
          ← Back
        </button>
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-dark_blue">
              Manage Exercises
            </h1>
            <p className="text-medium_blue mt-2">
              View, edit, or create your computational thinking exercises.
            </p>
          </div>
          <button
            onClick={handleEdit}
            className="px-6 py-2 bg-dark_blue text-white font-bold rounded-lg hover:bg-medium_blue transition-colors"
          >
            Edit Exercises
          </button>
        </div>

        {exercises.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl p-8">
            <p className="text-gray-500 text-lg mb-4">No exercises found.</p>
            <button
              onClick={handleEdit}
              className="px-6 py-2 bg-medium_blue text-white font-bold rounded-lg hover:bg-dark_blue transition-colors"
            >
              Create Your First Exercise
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise) => (
              <div
                key={exercise._id}
                className="bg-white rounded-lg shadow-md border-l-4 border-medium_blue p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-bold text-dark_blue mb-2">
                  {exercise.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {exercise.description}
                </p>
                <div className="flex gap-2 mb-4">
                  <span className="px-2 py-1 bg-medium_blue text-white text-xs font-bold rounded capitalize">
                    {exercise.topic}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded capitalize ${
                      exercise.difficulty === "easy"
                        ? "bg-green-100 text-green-800"
                        : exercise.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {exercise.difficulty}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  {exercise.testCases?.length || 0} test cases
                </p>
                <button
                  onClick={() => handleDeleteExercise(exercise._id)}
                  disabled={isDeleting}
                  className="w-full px-3 py-2 text-sm text-red-600 hover:text-white hover:bg-red-600 font-bold rounded transition-colors"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <button
        onClick={handleCancelEdit}
        className="mb-6 px-4 py-2 text-dark_blue font-bold hover:text-medium_blue transition-colors flex items-center gap-2"
      >
        ← Back
      </button>
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div className="flex justify-between items-end w-full">
          <div>
            <h1 className="text-3xl font-bold text-dark_blue">
              {isNewExercise ? "Create New Exercise" : "Edit Exercise"}
            </h1>
            <p className="text-medium_blue mt-2">
              {isNewExercise
                ? "Design a new computational thinking challenge."
                : "Update the exercise details below."}
            </p>
          </div>
          <div className="flex items-center gap-2 pb-1">
            {(() => {
              const total = exercises.length + newExercises.length;
              const pageSize = 5;
              const startIdx = Math.floor(currentIndex / pageSize) * pageSize;
              const endIdx = Math.min(startIdx + pageSize, total);

              return (
                <>
                  <button
                    onClick={() => setCurrentIndex(Math.max(0, startIdx - 1))}
                    disabled={startIdx === 0}
                    className={`text-lg font-bold px-1 ${startIdx === 0 ? "text-gray-300 cursor-not-allowed" : "text-medium_blue hover:text-dark_blue"}`}
                    title="Previous exercises"
                  >
                    &lsaquo;
                  </button>
                  {Array.from({ length: endIdx - startIdx }).map((_, i) => {
                    const idx = startIdx + i;
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          currentIndex === idx
                            ? "bg-dark_blue scale-125"
                            : "bg-gray-300 hover:bg-medium_blue"
                        }`}
                        title={`Exercise ${idx + 1}`}
                        aria-label={`Go to exercise ${idx + 1}`}
                      />
                    );
                  })}
                  <button
                    onClick={() => setCurrentIndex(Math.min(total - 1, endIdx))}
                    disabled={endIdx === total}
                    className={`text-lg font-bold px-1 ${endIdx === total ? "text-gray-300 cursor-not-allowed" : "text-medium_blue hover:text-dark_blue"}`}
                    title="Next exercises"
                  >
                    &rsaquo;
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm mb-8 border border-light_blue">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className={`px-4 py-2 font-bold rounded-lg transition-colors ${
            currentIndex === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-medium_blue text-white hover:bg-dark_blue"
          }`}
        >
          &larr; Previous
        </button>

        <div className="flex items-center gap-4">
          <span className="font-bold text-dark_blue text-lg">
            {isNewExercise ? "New" : "Exercise"} {currentIndex + 1} of{" "}
            {exercises.length + newExercises.length}
          </span>
        </div>

        <button
          onClick={() =>
            setCurrentIndex(
              Math.min(
                exercises.length + newExercises.length - 1,
                currentIndex + 1,
              ),
            )
          }
          disabled={currentIndex === exercises.length + newExercises.length - 1}
          className={`px-4 py-2 font-bold rounded-lg transition-colors ${
            currentIndex === exercises.length + newExercises.length - 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-medium_blue text-white hover:bg-dark_blue"
          }`}
        >
          Next &rarr;
        </button>
      </div>

      <div className="space-y-8">
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
                value={currentEx?.title}
                onChange={(e) => updateEx("title", e.target.value)}
                placeholder="e.g., Simple If-Else Statement"
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
                value={currentEx?.description}
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
                value={currentEx?.topic}
                onChange={(e) => updateEx("topic", e.target.value)}
              >
                <option value="conditionals">Conditionals</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark_blue mb-1">
                Difficulty
              </label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-medium_blue bg-offwite"
                value={currentEx?.difficulty}
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
                value={currentEx?.starterCode}
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
            {currentEx?.testCases.map((tc, index) => (
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
                            className="flex-1 px-3 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-medium_blue font-mono"
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
                {currentEx?.testCases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTestCase(index)}
                    className="text-red-500 hover:text-red-700 h-fit self-center p-2"
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

        {/* Verbal Steps */}
        <section className="bg-white p-6 rounded-xl shadow-md border-t-4 border-medium_blue">
          <div className="mb-4 border-b pb-2">
            <h2 className="text-xl font-bold text-dark_blue">
              Verbal Solution Guide
            </h2>
          </div>
          <div className="space-y-3">
            {currentEx?.verbalSteps.map((step, index) => (
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

        {/* Visual Steps */}
        <section className="bg-white p-6 rounded-xl shadow-md border-t-4 border-dark_blue">
          <div className="mb-4 border-b pb-2">
            <h2 className="text-xl font-bold text-dark_blue">
              Visual Flowchart Nodes
            </h2>
          </div>
          <div className="space-y-6">
            {currentEx?.visualSteps.map((vStep, vIndex) => (
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
                      placeholder="e.g., Start, or x > 0?"
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

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSaveExercise}
            disabled={isUpdating || isCreating}
            className={`flex-1 py-4 text-xl font-bold rounded-xl shadow-lg transition-colors ${
              isUpdating || isCreating
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-dark_blue text-white hover:bg-medium_blue"
            }`}
          >
            {isUpdating || isCreating
              ? "Saving..."
              : isNewExercise
                ? "Create Exercise"
                : "Update Exercise"}
          </button>
          <button
            onClick={handleCancelEdit}
            className="flex-1 py-4 text-xl font-bold rounded-xl shadow-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Add New Exercise Button */}
        {isNewExercise === false || newExercises.length === 0 ? (
          <button
            onClick={handleAddNewExercise}
            className="w-full py-3 text-lg font-bold rounded-lg bg-light_blue text-dark_blue hover:bg-medium_blue hover:text-white transition-colors"
          >
            + Add Another New Exercise
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default ConditionalsExerciseInstructorsPage;
