const fs = require('fs');
const file = 'frontend/src/features/exercise/LoopsExercise.jsx';
let content = fs.readFileSync(file, 'utf8');

// The new components
const componentsCode = `
const parseFlowchart = (visualGuide) => {
  if (!visualGuide) return [];
  const steps = visualGuide.split("→").map((s) => s.trim());
  const nodes = [];

  let i = 0;
  let fallbackId = 1000;
  while (i < steps.length) {
    if (steps[i].endsWith("?")) {
      const decision = {
        id: fallbackId++,
        label: steps[i],
        type: "decision",
        yesPath: [],
        noPath: [],
        yesLoops: false,
        noLoops: false,
      };
      i++;

      let currentPath = null;

      while (i < steps.length) {
        const step = steps[i];
        if (step === "Yes") {
          currentPath = decision.yesPath;
          i++;
        } else if (step === "No") {
          currentPath = decision.noPath;
          i++;
        } else if (step === "loop") {
          if (currentPath === decision.yesPath) decision.yesLoops = true;
          if (currentPath === decision.noPath) decision.noLoops = true;
          i++;
          if (i < steps.length && steps[i] === "No") {
            currentPath = decision.noPath;
            i++;
          } else {
            break;
          }
        } else {
          if (currentPath) {
            currentPath.push({
              id: fallbackId++,
              label: step,
              type: "normal",
            });
            i++;
          } else {
            break; // loop ended or exit strategy
          }
        }
      }
      nodes.push(decision);
    } else if (steps[i] === "loop") {
      nodes.push({ id: fallbackId++, type: "loopBack" });
      i++;
    } else {
      nodes.push({ id: fallbackId++, label: steps[i], type: "normal", next: null });
      i++;
    }
  }
  return nodes;
};

const FlowchartDiagram = ({ visualGuide }) => {
  if (!visualGuide) return null;
  const nodes = parseFlowchart(visualGuide);

  return (
    <div className="w-full flex-col flex items-center justify-center font-sans text-sm relative pb-10">
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
            <div key={node.id} className="flex flex-col items-center w-full mt-2">
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
                    <div key={child.id} className="flex flex-col items-center w-full relative z-10">
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
                  <div className="absolute left-[calc(50%+112px)] top-0 flex flex-col items-center w-40 z-0">
                    {/* Vertical line from the horizontal Yes arm */}
                    <div className="h-8 w-0.5 bg-blue-500 relative">
                      <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-blue-500 transform rotate-45"></div>
                    </div>

                    <div className="relative w-full flex flex-col items-center group">
                      {node.yesPath.map((child, j) => (
                        <div key={child.id} className="flex flex-col items-center w-full">
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
                          <div className="absolute -right-4 top-[-6.5rem] bottom-4 w-10 border-r-2 border-t-2 border-b-2 border-dashed border-red-400 opacity-70 -z-10 rounded-r-xl"></div>
                          <div className="text-red-500 text-[10px] font-bold px-2 py-0.5 whitespace-nowrap bg-white border border-red-200 rounded mt-3 z-20 relative shadow-sm">
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
`;

// Insert the components before function LoopsExercise()
content = content.replace("function LoopsExercise() {", componentsCode + "\nfunction LoopsExercise() {");

// Remove the old definitions from inside LoopsExercise
const p1Start = content.indexOf("const parseFlowchart = (visualGuide) => {", content.indexOf("function LoopsExercise() {"));
const p1End = content.indexOf("  };", p1Start) + 4;
// wait, the old one is duplicated and messy, let's just regex remove it carefully.
