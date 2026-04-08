import { useState } from "react";
import { Link } from "react-router-dom";
import useGetExercises from "../exercise/useGetExercises";
import Loader from "../../ui/Loader";

function InstructorHomePage() {
  const { exercises, isLoading, error } = useGetExercises();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExercises = exercises.filter(
    (ex) =>
      ex.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.topic?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stats = [
    {
      label: "Total Exercises",
      value: exercises.length,
      color: "bg-light_blue",
    },
    {
      label: "Easy",
      value: exercises.filter((ex) => ex.difficulty === "easy").length,
      color: "bg-green-100",
    },
    {
      label: "Medium",
      value: exercises.filter((ex) => ex.difficulty === "medium").length,
      color: "bg-yellow-100",
    },
    {
      label: "Hard",
      value: exercises.filter((ex) => ex.difficulty === "hard").length,
      color: "bg-red-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-offwite via-white to-light_blue">
      {/* Header */}
      <div className="bg-white border-b-4 border-dark_blue shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-dark_blue">
                Instructor Dashboard
              </h1>
              <p className="text-medium_blue mt-2">
                Create and manage your computational thinking exercises
              </p>
            </div>
            <Link
              to="/instructor/create-exercises"
              className="px-6 py-3 bg-dark_blue text-white font-bold rounded-lg shadow-lg hover:bg-medium_blue transition-colors text-center"
            >
              + Create New Exercise
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`${stat.color} rounded-lg p-6 shadow-md border-l-4 border-dark_blue`}
            >
              <p className="text-gray-600 font-semibold text-sm">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-dark_blue mt-2">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Exercises Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md border-t-4 border-medium_blue p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-dark_blue mb-4">
              Your Exercises
            </h2>
            <input
              type="text"
              placeholder="Search by title, description, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-medium_blue bg-offwite"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700 font-semibold">{error.message}</p>
            </div>
          ) : filteredExercises.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                {exercises.length === 0
                  ? "No exercises yet."
                  : "No exercises match your search."}
              </p>
              {exercises.length === 0 && (
                <Link
                  to="/instructor/create-exercises"
                  className="inline-block px-6 py-2 bg-medium_blue text-white font-bold rounded-lg hover:bg-dark_blue transition-colors"
                >
                  Create Your First Exercise
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light_blue border-b-2 border-medium_blue">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-dark_blue">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-dark_blue">
                      Topic
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-dark_blue">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-dark_blue">
                      Test Cases
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-bold text-dark_blue">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light_blue">
                  {filteredExercises.map((exercise) => (
                    <tr
                      key={exercise._id}
                      className="hover:bg-offwite transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-dark_blue">
                            {exercise.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {exercise.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-medium_blue text-white rounded-full text-xs font-bold capitalize">
                          {exercise.topic}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${
                            exercise.difficulty === "easy"
                              ? "bg-green-100 text-green-800"
                              : exercise.difficulty === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {exercise.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-700 font-semibold">
                        {exercise.testCases?.length || 0}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="px-3 py-1 text-sm text-medium_blue hover:text-dark_blue font-bold hover:bg-light_blue rounded transition-colors">
                          Edit
                        </button>
                        <button className="px-3 py-1 text-sm text-red-500 hover:text-red-700 font-bold hover:bg-red-50 rounded transition-colors ml-2">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-medium_blue rounded-lg p-6 text-white">
          <h3 className="text-lg font-bold mb-2">💡 Tip</h3>
          <p>
            Create exercises with clear descriptions, multiple test cases, and
            step-by-step solution guides to help your students learn
            computational thinking effectively.
          </p>
        </div>
      </div>
    </div>
  );
}

export default InstructorHomePage;
