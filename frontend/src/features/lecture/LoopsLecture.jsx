import useUser from "../authentication/useUser";
import LoopsLectureInstructor from "./LoopsLectureInstructor";
import LoopsLectureStudent from "./LoopsLectureStudent";

function LoopsLecture() {
  const { role } = useUser();

  if (role === "student") return <LoopsLectureStudent />;
  else return <LoopsLectureInstructor />;
}

export default LoopsLecture;
