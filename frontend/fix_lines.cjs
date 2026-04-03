const fs = require('fs');
const file = 'src/features/exercise/LoopsExercise.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '<div className="absolute left-[calc(50%+112px)] top-0 flex flex-col items-center w-40 z-0">',
  '<div className="absolute left-[calc(50%+112px)] top-[-4rem] flex flex-col items-center w-40 z-0">'
);
content = content.replace(
  '{/* Vertical line from the horizontal Yes arm */}\n                      <div className="h-8 w-0.5 bg-blue-500 relative">',
  '{/* Vertical line from the horizontal Yes arm */}\n                      <div className="h-[4.5rem] w-0.5 bg-blue-500 relative">'
);

fs.writeFileSync(file, content);
