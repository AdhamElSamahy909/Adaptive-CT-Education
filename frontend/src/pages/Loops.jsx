import { Link } from "react-router-dom";

function Loops() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h1 className="text-4xl font-bold text-dark_blue mb-6">Loops</h1>

      {/* Mode Selector */}
      <div className="flex gap-3 mb-8">
        <Link
          to="lecture"
          className="px-6 py-2 rounded-lg font-semibold transition-all duration-200 bg-medium_blue text-white shadow-md hover:bg-dark_blue"
        >
          Lecture
        </Link>
        <Link
          to="exercise"
          className="px-6 py-2 rounded-lg font-semibold transition-all duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Exercise
        </Link>
      </div>
    </div>
  );
}

export default Loops;
