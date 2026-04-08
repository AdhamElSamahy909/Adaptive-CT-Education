import useUser from "../authentication/useUser";
import SequentialLectureInstructor from "./SequentialLectureInstructor";
import SequentialLectureStudent from "./SequentialLectureStudent";

function SequentialLecture() {
  const { role } = useUser();

  if (role === "student") return <SequentialLectureStudent />;
  else return <SequentialLectureInstructor />;
}

export default SequentialLecture;
