function StudentHome() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back!</h1>
          <p className="text-blue-100 text-lg">
            Continue your learning journey and master computational thinking
          </p>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Stat 1 */}
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
              <p className="text-gray-600">Topics Available</p>
            </div>

            {/* Stat 2 */}
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-3xl font-bold text-green-600 mb-2">0%</div>
              <p className="text-gray-600">Overall Progress</p>
            </div>

            {/* Stat 3 */}
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
              <p className="text-gray-600">Exercises Completed</p>
            </div>

            {/* Stat 4 */}
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-3xl font-bold text-orange-600 mb-2">0</div>
              <p className="text-gray-600">Achievements Earned</p>
            </div>
          </div>
        </div>
      </section>

      {/* Your Learning Path Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Your Learning Path
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sequential */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2"></div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Sequential
                </h3>
                <p className="text-gray-700 mb-4">
                  Start with the fundamentals of sequential execution and basic
                  data operations.
                </p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "0%" }}
                    ></div>
                  </div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
                  Continue Learning
                </button>
              </div>
            </div>

            {/* Loops */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              <div className="bg-gradient-to-r from-green-500 to-green-600 h-2"></div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Loops</h3>
                <p className="text-gray-700 mb-4">
                  Automate repetitive tasks and control program flow with loops
                  and iterative patterns.
                </p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: "0%" }}
                    ></div>
                  </div>
                </div>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
                  Start Learning
                </button>
              </div>
            </div>

            {/* Conditionals */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2"></div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Conditionals
                </h3>
                <p className="text-gray-700 mb-4">
                  Master decision-making with conditional statements and logical
                  reasoning techniques.
                </p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: "0%" }}
                    ></div>
                  </div>
                </div>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
                  Start Learning
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Learning Tips
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                💡 Tip: Take Your Time
              </h3>
              <p className="text-gray-700">
                There's no rush! Our adaptive system adjusts to your pace. Take
                time to understand each concept before moving forward.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                📝 Tip: Practice Regularly
              </h3>
              <p className="text-gray-700">
                Consistent practice is key. Try to complete exercises daily to
                reinforce what you've learned.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                🎯 Tip: Choose Your Style
              </h3>
              <p className="text-gray-700">
                We offer visual, verbal, and hands-on exercises. Pick whichever
                format helps you learn best.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                🔄 Tip: Review Concepts
              </h3>
              <p className="text-gray-700">
                Don't hesitate to revisit earlier topics. Reviewing helps
                solidify your understanding.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StudentHome;
