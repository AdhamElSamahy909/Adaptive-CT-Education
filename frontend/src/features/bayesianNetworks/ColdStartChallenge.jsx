import { useState } from "react";
import useColdStart from "./useColdStart";
import useUser from "../authentication/useUser";

const ShapeCell = ({ shape, fill }) => {
  const renderShape = () => {
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

const OptionCell = ({ shape, fill, label, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(label)}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
        isSelected
          ? "border-medium_blue bg-light_blue"
          : "border-light_blue hover:border-medium_blue"
      }`}
    >
      <ShapeCell shape={shape} fill={fill} />
      <span className="font-semibold text-dark_blue">{label}</span>
    </button>
  );
};

const MatrixPuzzle = ({ selectedAnswer, setSelectedAnswer, onComplete }) => {
  const handleSelectAnswer = (label) => {
    setSelectedAnswer(label);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <h1 className="text-4xl font-bold text-dark_blue mb-8 text-center">
        Matrix Puzzle
      </h1>
      {/* <p className="text-gray-600 text-center mb-8">(Visual Challenge)</p> */}

      <div className="bg-light_blue rounded-2xl p-8 mb-8">
        <p className="text-dark_blue mb-6 leading-relaxed">
          Look at the 3×3 grid below. Each cell contains a shape (circle,
          square, triangle) and a fill pattern (striped, solid, empty). The
          shapes and fills follow a pattern across rows and columns. One cell is
          missing.
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
          Which option correctly fills the missing cell?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <OptionCell
            shape="square"
            fill="striped"
            label="A"
            isSelected={selectedAnswer === "A"}
            onSelect={handleSelectAnswer}
          />
          <OptionCell
            shape="circle"
            fill="solid"
            label="B"
            isSelected={selectedAnswer === "B"}
            onSelect={handleSelectAnswer}
          />
          <OptionCell
            shape="triangle"
            fill="empty"
            label="C"
            isSelected={selectedAnswer === "C"}
            onSelect={handleSelectAnswer}
          />
          <OptionCell
            shape="square"
            fill="solid"
            label="D"
            isSelected={selectedAnswer === "D"}
            onSelect={handleSelectAnswer}
          />
          <OptionCell
            shape="circle"
            fill="striped"
            label="E"
            isSelected={selectedAnswer === "E"}
            onSelect={handleSelectAnswer}
          />
          <OptionCell
            shape="triangle"
            fill="striped"
            label="F"
            isSelected={selectedAnswer === "F"}
            onSelect={handleSelectAnswer}
          />
        </div>
      </div>

      {selectedAnswer && (
        <button
          onClick={onComplete}
          className="mt-8 w-full bg-gradient-to-r from-medium_blue to-dark_blue text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-shadow"
        >
          Continue to Next Challenge →
        </button>
      )}
    </div>
  );
};

const KnightsAndKnaves = ({
  selectedAnswer,
  setSelectedAnswer,
  onComplete,
}) => {
  const handleSelectAnswer = (label) => {
    setSelectedAnswer(label);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <h1 className="text-4xl font-bold text-dark_blue mb-8 text-center">
        Island of Knights & Knaves
      </h1>
      {/* <p className="text-gray-600 text-center mb-8">(Verbal Challenge)</p> */}

      <div className="bg-light_blue rounded-2xl p-8 mb-8">
        <p className="text-dark_blue mb-6 leading-relaxed">
          On a remote island, there are two types of people:
        </p>

        <div className="bg-white p-4 rounded-lg mb-6 space-y-2">
          <p className="text-dark_blue">
            <strong>Knights</strong> – always tell the truth.
          </p>
          <p className="text-dark_blue">
            <strong>Knaves</strong> – always lie.
          </p>
        </div>

        <p className="text-dark_blue mb-6 leading-relaxed">
          You meet two inhabitants, Alex and Bailey. They make the following
          statements:
        </p>

        <div className="bg-white p-4 rounded-lg mb-6 space-y-4 border-l-4 border-medium_blue">
          <div>
            <p className="font-semibold text-dark_blue mb-2">Alex says:</p>
            <p className="text-dark_blue italic">"Bailey is a knight."</p>
          </div>
          <div>
            <p className="font-semibold text-dark_blue mb-2">Bailey says:</p>
            <p className="text-dark_blue italic">
              "Alex and I are of different types."
            </p>
          </div>
        </div>

        <p className="text-sm text-dark_blue bg-white p-3 rounded-lg">
          (A "type" means knight or knave.)
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-dark_blue mb-6">
          Based on these statements, what must be true?
        </h2>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => handleSelectAnswer("A")}
            className={`text-left p-4 rounded-xl border-2 transition-all font-semibold ${
              selectedAnswer === "A"
                ? "border-medium_blue bg-light_blue text-dark_blue"
                : "border-light_blue text-dark_blue hover:border-medium_blue"
            }`}
          >
            A) Alex is a knight, Bailey is a knight.
          </button>
          <button
            onClick={() => handleSelectAnswer("B")}
            className={`text-left p-4 rounded-xl border-2 transition-all font-semibold ${
              selectedAnswer === "B"
                ? "border-medium_blue bg-light_blue text-dark_blue"
                : "border-light_blue text-dark_blue hover:border-medium_blue"
            }`}
          >
            B) Alex is a knight, Bailey is a knave.
          </button>
          <button
            onClick={() => handleSelectAnswer("C")}
            className={`text-left p-4 rounded-xl border-2 transition-all font-semibold ${
              selectedAnswer === "C"
                ? "border-medium_blue bg-light_blue text-dark_blue"
                : "border-light_blue text-dark_blue hover:border-medium_blue"
            }`}
          >
            C) Alex is a knave, Bailey is a knight.
          </button>
          <button
            onClick={() => handleSelectAnswer("D")}
            className={`text-left p-4 rounded-xl border-2 transition-all font-semibold ${
              selectedAnswer === "D"
                ? "border-medium_blue bg-light_blue text-dark_blue"
                : "border-light_blue text-dark_blue hover:border-medium_blue"
            }`}
          >
            D) Alex is a knave, Bailey is a knave.
          </button>
          <button
            onClick={() => handleSelectAnswer("E")}
            className={`text-left p-4 rounded-xl border-2 transition-all font-semibold ${
              selectedAnswer === "E"
                ? "border-medium_blue bg-light_blue text-dark_blue"
                : "border-light_blue text-dark_blue hover:border-medium_blue"
            }`}
          >
            E) The statements are contradictory – no consistent assignment
            exists.
          </button>
          <button
            onClick={() => handleSelectAnswer("F")}
            className={`text-left p-4 rounded-xl border-2 transition-all font-semibold ${
              selectedAnswer === "F"
                ? "border-medium_blue bg-light_blue text-dark_blue"
                : "border-light_blue text-dark_blue hover:border-medium_blue"
            }`}
          >
            F) Both assignments (knight/knight and knave/knave) are logically
            possible.
          </button>
        </div>
      </div>

      {selectedAnswer && (
        <button
          onClick={onComplete}
          className="mt-8 w-full bg-gradient-to-r from-medium_blue to-dark_blue text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-shadow"
        >
          🎊 Challenge Complete!
        </button>
      )}
    </div>
  );
};

function ColdStartChallenge() {
  const [currentChallenge, setCurrentChallenge] = useState(1);
  const [challenge1Answer, setChallenge1Answer] = useState(null);
  const [challenge2Answer, setChallenge2Answer] = useState(null);
  const { submitColdStart } = useColdStart();
  const { userId } = useUser();

  const handleChallenge1Complete = () => {
    setCurrentChallenge(2);
  };

  const handleChallenge2Complete = () => {
    setCurrentChallenge(3);
  };

  const handleSubmitResults = (e) => {
    e.preventDefault();
    console.log("Clicked");
    submitColdStart({
      userId,
      challenge1Answer,
      challenge2Answer,
    });
  };

  return (
    <div className="min-h-screen bg-offwite p-8">
      <div className="max-w-4xl mx-auto">
        {/* Challenge Counter */}
        {currentChallenge <= 2 && (
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-dark_blue">
              Challenge {currentChallenge} of 2
            </h2>
            <div className="flex gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  currentChallenge >= 1 ? "bg-medium_blue" : "bg-light_blue"
                }`}
              ></div>
              <div
                className={`w-3 h-3 rounded-full ${
                  currentChallenge >= 2 ? "bg-medium_blue" : "bg-light_blue"
                }`}
              ></div>
            </div>
          </div>
        )}

        {/* Render Current Challenge */}
        {currentChallenge === 1 && (
          <MatrixPuzzle
            selectedAnswer={challenge1Answer}
            setSelectedAnswer={setChallenge1Answer}
            onComplete={handleChallenge1Complete}
          />
        )}
        {currentChallenge === 2 && (
          <KnightsAndKnaves
            selectedAnswer={challenge2Answer}
            setSelectedAnswer={setChallenge2Answer}
            onComplete={handleChallenge2Complete}
          />
        )}

        {/* Completion Popup Modal */}
        {currentChallenge === 3 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold text-dark_blue mb-4">
                Challenges Complete!
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Congratulations! You've successfully completed all reasoning
                challenges.
              </p>
              <button
                onClick={handleSubmitResults}
                className="w-full cursor-pointer bg-gradient-to-r from-medium_blue to-dark_blue text-white font-semibold py-3 rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                Submit Results
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ColdStartChallenge;
