import useUser from "../authentication/useUser";
import LoopsExerciseInstructorsPage from "./LoopsExerciseInstructorsPage";
import LoopsExerciseStudentsPage from "./LoopsExerciseStudentsPage";

function LoopsExercise() {
  const { role } = useUser();

  if (role === "instructor") return <LoopsExerciseInstructorsPage />;
  else return <LoopsExerciseStudentsPage />;
}

export default LoopsExercise;
