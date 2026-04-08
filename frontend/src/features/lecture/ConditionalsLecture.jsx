import useUser from "../authentication/useUser";
import ConditionalsLectureInstructor from "./ConditionalsLectureInstructor";
import ConditionalsLectureStudent from "./ConditionalsLectureStudent";

function ConditionalsLecture() {
  const { role } = useUser();

  if (role === "student") return <ConditionalsLectureStudent />;
  else return <ConditionalsLectureInstructor />;
}

export default ConditionalsLecture;
