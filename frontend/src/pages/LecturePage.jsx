import useUser from "../features/authentication/useUser";
import LectureInstructor from "../features/lecture/LectureInstructor";
import LectureStudent from "../features/lecture/LectureStudent";

function LecturePage() {
  const { role } = useUser();

  if (role === "student") return <LectureStudent />;
  else return <LectureInstructor />;
}

export default LecturePage;
