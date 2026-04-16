import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Loops from "./pages/Loops";
import Conditionals from "./pages/Conditionals";
import Sequential from "./pages/Sequential";
import ProtectedRoute from "./ui/protectedRoute";
import AppLayout from "./ui/AppLayout";
import LecturePage from "./pages/LecturePage";
import ExercisePage from "./pages/ExercisePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#333",
            },
            success: {
              duration: 3000,
            },
            error: {
              duration: 4000,
            },
          }}
        />
        <Routes>
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate replace to="home" />} />
            <Route path="home" element={<Home />} />
            <Route path="loops" element={<Loops />} />
            <Route path="loops/exercise" element={<ExercisePage />} />
            <Route path="loops/lecture" element={<LecturePage />} />
            <Route path="conditionals" element={<Conditionals />} />
            <Route path="conditionals/exercise" element={<ExercisePage />} />
            <Route path="conditionals/lecture" element={<LecturePage />} />
            <Route path="sequential" element={<Sequential />} />
            <Route path="sequential/exercise" element={<ExercisePage />} />
            <Route path="sequential/lecture" element={<LecturePage />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
