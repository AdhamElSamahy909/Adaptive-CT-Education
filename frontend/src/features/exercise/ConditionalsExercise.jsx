import useUser from "../authentication/useUser";
import ConditionalsExerciseInstructorsPage from "./ConditionalsExerciseInstructorsPage";
import ConditionalsExerciseStudentsPage from "./ConditionalsExerciseStudentsPage";
import ExerciseStudents from "./ExerciseStudents";

function ConditionalsExercise() {
  const { role } = useUser();

  if (role === "instructor") return <ConditionalsExerciseInstructorsPage />;
  else return <ExerciseStudents />;
}

export default ConditionalsExercise;
