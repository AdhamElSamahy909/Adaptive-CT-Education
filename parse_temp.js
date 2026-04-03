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
              break;
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
