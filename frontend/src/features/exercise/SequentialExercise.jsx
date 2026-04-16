import useUser from "../authentication/useUser";
import ExerciseStudents from "./ExerciseStudents";
import SequentialExerciseInstructorsPage from "./SequentialExerciseInstructorsPage";
import SequentialExerciseStudentsPage from "./SequentialExerciseStudentsPage";

function SequentialExercise() {
  const { role } = useUser();

  if (role === "instructor") return <SequentialExerciseInstructorsPage />;
  else return <ExerciseStudents />;
}

export default SequentialExercise;
