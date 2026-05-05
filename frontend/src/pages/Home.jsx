import useUser from "../features/authentication/useUser";
import InstructorHomePage from "../features/user/InstructorHomePage";
import StudentHome from "../features/user/StudentHome";

function Home() {
  const { role } = useUser();

  return role === "student" ? <StudentHome /> : <InstructorHomePage />;
}

export default Home;
