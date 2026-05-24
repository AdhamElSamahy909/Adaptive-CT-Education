import useUser from "../features/authentication/useUser";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useUser();

  useEffect(
    function () {
      if (isLoading) return;

      if (!isAuthenticated) {
        navigate("/login");
      }
    },
    [isAuthenticated, isLoading, navigate],
  );

  if (isLoading) return <Loader />;

  if (isAuthenticated) return children;

  return null;
}

export default ProtectedRoute;
