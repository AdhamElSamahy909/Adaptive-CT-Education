import useUser from "../features/authentication/useUser";
import ExercisesInstructor from "../features/exercise/ExercisesInstructor";
import ExerciseStudents from "../features/exercise/ExerciseStudents";

function ExercisePage() {
  const { role } = useUser();

  if (role === "instructor") return <ExercisesInstructor />;
  else return <ExerciseStudents />;
}

export default ExercisePage;
