import { useState } from "react";
import { Link } from "react-router-dom";
import useSignup from "../features/authentication/useSignup";
import logo from "../assets/logo.svg";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [secret, setSecret] = useState("");
  const { signup, isLoading } = useSignup();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup({
      firstName,
      lastName,
      email,
      password,
      passwordConfirm: confirmPassword,
      role,
      secret,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-offwite via-light_blue to-offwite flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src={logo} alt="ThinkFlow Logo" className="w-12 h-12" />
              <h1 className="text-4xl font-bold text-dark_blue">Join Us</h1>
            </div>
            <p className="text-gray-600">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-semibold text-dark_blue mb-2"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="w-full px-4 py-3 rounded-lg border-2 border-light_blue bg-offwite focus:border-medium_blue focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-semibold text-dark_blue mb-2"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full px-4 py-3 rounded-lg border-2 border-light_blue bg-offwite focus:border-medium_blue focus:outline-none transition-colors"
              />
            </div>

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
                htmlFor="role"
                className="block text-sm font-semibold text-dark_blue mb-2"
              >
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-lg border-2 border-light_blue bg-offwite focus:border-medium_blue focus:outline-none transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2305668d%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3e%3cpolyline points=%226 9 12 15 18 9%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-right-3 bg-center"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>

            {role === "instructor" && (
              <div>
                <label
                  htmlFor="secret"
                  className="block text-sm font-semibold text-dark_blue mb-2"
                >
                  Instructor Secret
                </label>
                <input
                  id="secret"
                  type="password"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Enter the instructor secret"
                  className="w-full px-4 py-3 rounded-lg border-2 border-light_blue bg-offwite focus:border-medium_blue focus:outline-none transition-colors"
                />
              </div>
            )}

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

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-dark_blue mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-4 py-3 rounded-lg border-2 border-light_blue bg-offwite focus:border-medium_blue focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-semibold py-3 rounded-lg transition-all mt-6 ${
                isLoading
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-medium_blue to-dark_blue text-white hover:shadow-lg"
              }`}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-light_blue"></div>
            <span className="text-gray-500 text-sm">
              Already have an account?
            </span>
            <div className="flex-1 h-px bg-light_blue"></div>
          </div>

          <Link
            to="/login"
            className="block w-full text-center py-3 rounded-lg border-2 border-medium_blue text-medium_blue font-semibold hover:bg-light_blue transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
