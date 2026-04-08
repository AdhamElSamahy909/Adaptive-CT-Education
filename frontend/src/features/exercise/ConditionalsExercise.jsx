import useUser from "../authentication/useUser";
import ConditionalsExerciseInstructorsPage from "./ConditionalsExerciseInstructorsPage";
import ConditionalsExerciseStudentsPage from "./ConditionalsExerciseStudentsPage";

function ConditionalsExercise() {
  const { role } = useUser();

  if (role === "instructor") return <ConditionalsExerciseInstructorsPage />;
  else return <ConditionalsExerciseStudentsPage />;
}

export default ConditionalsExercise;
