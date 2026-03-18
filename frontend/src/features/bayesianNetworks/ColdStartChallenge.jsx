import { useState } from "react";

const ShapeCell = ({ shape, fill }) => {
  const renderShape = () => {
    const shapeProps =
      fill === "striped" ? { fill: "url(#stripePattern)" } : {};

    switch (shape) {
      case "circle":
        if (fill === "solid")
          return <circle cx="40" cy="40" r="30" fill="#112D4E" />;
        if (fill === "striped")
          return (
            <>
              <defs>
                <pattern
                  id="stripePattern"
                  x="0"
                  y="0"
                  width="8"
                  height="8"
                  patternUnits="userSpaceOnUse"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="8"
                    y2="8"
                    stroke="#112D4E"
                    strokeWidth="2"
                  />
                </pattern>
              </defs>
              <circle
                cx="40"
                cy="40"
                r="30"
                fill="url(#stripePattern)"
                stroke="#112D4E"
                strokeWidth="2"
              />
            </>
          );
        return (
          <circle
            cx="40"
            cy="40"
            r="30"
            fill="none"
            stroke="#112D4E"
            strokeWidth="2"
          />
        );

      case "square":
        if (fill === "solid")
          return <rect x="10" y="10" width="60" height="60" fill="#112D4E" />;
        if (fill === "striped")
          return (
            <>
              <defs>
                <pattern
                  id="stripePattern2"
                  x="0"
                  y="0"
                  width="8"
                  height="8"
                  patternUnits="userSpaceOnUse"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="8"
                    y2="8"
                    stroke="#112D4E"
                    strokeWidth="2"
                  />
                </pattern>
              </defs>
              <rect
                x="10"
                y="10"
                width="60"
                height="60"
                fill="url(#stripePattern2)"
                stroke="#112D4E"
                strokeWidth="2"
              />
            </>
          );
        return (
          <rect
            x="10"
            y="10"
            width="60"
            height="60"
            fill="none"
            stroke="#112D4E"
            strokeWidth="2"
          />
        );

      case "triangle":
        if (fill === "solid")
          return <polygon points="40,10 70,70 10,70" fill="#112D4E" />;
        if (fill === "striped")
          return (
            <>
              <defs>
                <pattern
                  id="stripePattern3"
                  x="0"
                  y="0"
                  width="8"
                  height="8"
                  patternUnits="userSpaceOnUse"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="8"
                    y2="8"
                    stroke="#112D4E"
                    strokeWidth="2"
                  />
                </pattern>
              </defs>
              <polygon
                points="40,10 70,70 10,70"
                fill="url(#stripePattern3)"
                stroke="#112D4E"
                strokeWidth="2"
              />
            </>
          );
        return (
          <polygon
            points="40,10 70,70 10,70"
            fill="none"
            stroke="#112D4E"
            strokeWidth="2"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center w-24 h-24 bg-light_blue rounded-lg border-2 border-medium_blue">
      <svg width="80" height="80" viewBox="0 0 80 80">
        {renderShape()}
      </svg>
    </div>
  );
};

const OptionCell = ({
  shape,
  fill,
  label,
  isSelected,
  isCorrect,
  onSelect,
}) => {
  return (
    <button
      onClick={() => onSelect(label)}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
        isSelected
          ? isCorrect
            ? "border-green-500 bg-green-50"
            : "border-red-500 bg-red-50"
          : "border-light_blue hover:border-medium_blue"
      }`}
    >
      <ShapeCell shape={shape} fill={fill} />
      <span className="font-semibold text-dark_blue">{label}</span>
    </button>
  );
};

function ColdStartChallenge() {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const correctAnswer = "A";

  const handleSelectAnswer = (label) => {
    setSelectedAnswer(label);
    setShowResult(true);
  };

  return (
    <div className="min-h-screen bg-offwite p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-dark_blue mb-2 text-center">
            Matrix Puzzle
          </h1>
          <p className="text-gray-600 text-center mb-8">(Visual Challenge)</p>

          <div className="bg-light_blue rounded-2xl p-8 mb-8">
            <p className="text-dark_blue mb-6 leading-relaxed">
              Look at the 3×3 grid below. Each cell contains a shape (circle,
              square, triangle) and a fill pattern (striped, solid, empty). The
              shapes and fills follow a pattern across rows and columns. One
              cell is missing.
            </p>

            <div className="flex justify-center mb-8">
              <div className="inline-flex gap-1 border-2 border-dark_blue rounded-lg overflow-hidden">
                {/* Row 1 */}
                <div className="flex flex-col gap-1 bg-white p-1">
                  <ShapeCell shape="circle" fill="striped" />
                  <ShapeCell shape="square" fill="empty" />
                  <ShapeCell shape="triangle" fill="solid" />
                </div>

                {/* Row 2 */}
                <div className="flex flex-col gap-1 bg-white p-1">
                  <ShapeCell shape="square" fill="solid" />
                  <ShapeCell shape="triangle" fill="striped" />
                  <ShapeCell shape="circle" fill="empty" />
                </div>

                {/* Row 3 */}
                <div className="flex flex-col gap-1 bg-white p-1">
                  <ShapeCell shape="triangle" fill="empty" />
                  <ShapeCell shape="circle" fill="solid" />
                  <div className="flex items-center justify-center w-24 h-24 bg-medium_blue rounded-lg border-2 border-dashed border-dark_blue">
                    <span className="text-white text-4xl font-bold">?</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-dark_blue space-y-1 bg-white p-4 rounded-lg">
              <p>
                <strong>Legend:</strong>
              </p>
              <p>● = circle &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ╳╳╳ = striped</p>
              <p>■ = square &nbsp;&nbsp;&nbsp;&nbsp; ███ = solid</p>
              <p>▲ = triangle &nbsp;&nbsp;&nbsp; (blank) = empty</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-dark_blue mb-6">
              QUESTION: Which option correctly fills the missing cell?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <OptionCell
                shape="square"
                fill="striped"
                label="A"
                isSelected={selectedAnswer === "A"}
                isCorrect={correctAnswer === "A"}
                onSelect={handleSelectAnswer}
              />
              <OptionCell
                shape="circle"
                fill="solid"
                label="B"
                isSelected={selectedAnswer === "B"}
                isCorrect={correctAnswer === "B"}
                onSelect={handleSelectAnswer}
              />
              <OptionCell
                shape="triangle"
                fill="empty"
                label="C"
                isSelected={selectedAnswer === "C"}
                isCorrect={correctAnswer === "C"}
                onSelect={handleSelectAnswer}
              />
              <OptionCell
                shape="square"
                fill="solid"
                label="D"
                isSelected={selectedAnswer === "D"}
                isCorrect={correctAnswer === "D"}
                onSelect={handleSelectAnswer}
              />
              <OptionCell
                shape="circle"
                fill="striped"
                label="E"
                isSelected={selectedAnswer === "E"}
                isCorrect={correctAnswer === "E"}
                onSelect={handleSelectAnswer}
              />
              <OptionCell
                shape="triangle"
                fill="striped"
                label="F"
                isSelected={selectedAnswer === "F"}
                isCorrect={correctAnswer === "F"}
                onSelect={handleSelectAnswer}
              />
            </div>
          </div>

          {showResult && (
            <div
              className={`p-6 rounded-xl text-center font-semibold text-lg transition-all ${
                selectedAnswer === correctAnswer
                  ? "bg-green-100 border-2 border-green-500 text-green-700"
                  : "bg-red-100 border-2 border-red-500 text-red-700"
              }`}
            >
              {selectedAnswer === correctAnswer
                ? "🎉 Correct! The answer is A (Square with Striped fill). Each row and column contains different shapes and different fill patterns."
                : `❌ Incorrect. The correct answer is A (Square with Striped fill). Each row and column should have different shapes and different fill patterns.`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ColdStartChallenge;
