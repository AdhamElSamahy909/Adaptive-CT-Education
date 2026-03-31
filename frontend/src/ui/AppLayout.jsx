import { NavLink, Outlet } from "react-router-dom";
import useUser from "../features/authentication/useUser";
import ColdStartChallenge from "../features/bayesianNetworks/ColdStartChallenge";

function AppLayout() {
  const { coldStartChallengeFixed } = useUser();

  if (!coldStartChallengeFixed) return <ColdStartChallenge />;
  else
    return (
      <div className="min-h-screen bg-offwite">
        <nav className="bg-gradient-to-r from-dark_blue to-medium_blue shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <h1 className="text-2xl font-bold text-white">ThinkFlow</h1>

                <div className="hidden md:flex gap-2">
                  <NavLink
                    to="loops"
                    className={({ isActive }) =>
                      `px-5 py-2 rounded-lg font-semibold transition-all duration-300 border-2 ${
                        isActive
                          ? "bg-light_blue text-dark_blue border-light_blue shadow-lg scale-105"
                          : "text-white border-transparent hover:border-light_blue hover:text-light_blue"
                      }`
                    }
                  >
                    Loops
                  </NavLink>
                  <NavLink
                    to="conditionals"
                    className={({ isActive }) =>
                      `px-5 py-2 rounded-lg font-semibold transition-all duration-300 border-2 ${
                        isActive
                          ? "bg-light_blue text-dark_blue border-light_blue shadow-lg scale-105"
                          : "text-white border-transparent hover:border-light_blue hover:text-light_blue"
                      }`
                    }
                  >
                    Conditionals
                  </NavLink>
                  <NavLink
                    to="sequential"
                    className={({ isActive }) =>
                      `px-5 py-2 rounded-lg font-semibold transition-all duration-300 border-2 ${
                        isActive
                          ? "bg-light_blue text-dark_blue border-light_blue shadow-lg scale-105"
                          : "text-white border-transparent hover:border-light_blue hover:text-light_blue"
                      }`
                    }
                  >
                    Sequential
                  </NavLink>
                </div>
              </div>

              <button className="px-4 py-2 bg-light_blue text-dark_blue font-semibold rounded-lg hover:bg-offwite transition-colors">
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    );
}

export default AppLayout;
