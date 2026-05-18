import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../features/authentication/useLogin";
import logo from "../assets/logo.svg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-offwite via-light_blue to-offwite flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src={logo} alt="ThinkFlow Logo" className="w-12 h-12" />
              <h1 className="text-4xl font-bold text-dark_blue">Welcome</h1>
            </div>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-dark_blue mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border-2 border-light_blue bg-offwite focus:border-medium_blue focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-dark_blue mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg border-2 border-light_blue bg-offwite focus:border-medium_blue focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-semibold py-3 rounded-lg transition-all ${
                isLoading
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-medium_blue to-dark_blue text-white hover:shadow-lg"
              }`}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-light_blue"></div>
            <span className="text-gray-500 text-sm">New user?</span>
            <div className="flex-1 h-px bg-light_blue"></div>
          </div>

          <Link
            to="/signup"
            className="block w-full text-center py-3 rounded-lg border-2 border-medium_blue text-medium_blue font-semibold hover:bg-light_blue transition-colors"
          >
            Create Account
          </Link> */}
        </div>
      </div>
    </div>
  );
}

export default Login;
