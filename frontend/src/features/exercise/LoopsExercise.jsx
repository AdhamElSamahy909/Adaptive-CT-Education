import useUser from "../authentication/useUser";
import LoopsExerciseInstructorsPage from "./LoopsExerciseInstructorsPage";
import ExerciseStudents from "./ExerciseStudents";

function LoopsExercise() {
  const { role } = useUser();

  if (role === "instructor") return <LoopsExerciseInstructorsPage />;
  else return <ExerciseStudents />;
}

export default LoopsExercise;
