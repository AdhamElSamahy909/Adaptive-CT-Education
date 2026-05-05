function StudentHome() {
  return (
    <div className="min-h-screen bg-offwite">
      {/* Welcome Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-r from-medium_blue to-dark_blue">
        <div className="absolute inset-0 bg-gradient-to-r from-light_blue/20 to-medium_blue/20 blur-3xl"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-2">
            <span className="inline-block px-4 py-1 bg-light_blue/40 border border-light_blue/60 rounded-full text-dark_blue text-sm font-semibold">
              👋 Welcome
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Ready to level up your
            <br />
            <span className="text-light_blue">computational thinking?</span>
          </h1>
          <p className="text-light_blue text-lg max-w-2xl">
            Start your personalized learning journey with our adaptive system
            that adjusts to your pace and learning style.
          </p>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {/* Stat 1 */}
            <div className="group bg-white border border-light_blue rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-medium_blue">
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl font-bold text-medium_blue">3</div>
                <span className="text-2xl">📚</span>
              </div>
              <p className="text-dark_blue font-medium">Topics Available</p>
            </div>

            {/* Stat 2 */}
            <div className="group bg-white border border-light_blue rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-medium_blue">
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl font-bold text-medium_blue">0%</div>
                <span className="text-2xl">📈</span>
              </div>
              <p className="text-dark_blue font-medium">Overall Progress</p>
            </div>

            {/* Stat 3 */}
            <div className="group bg-white border border-light_blue rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-medium_blue">
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl font-bold text-medium_blue">0</div>
                <span className="text-2xl">✅</span>
              </div>
              <p className="text-dark_blue font-medium">Exercises Completed</p>
            </div>

            {/* Stat 4 */}
            <div className="group bg-white border border-light_blue rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-medium_blue">
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl font-bold text-medium_blue">0</div>
                <span className="text-2xl">🏆</span>
              </div>
              <p className="text-dark_blue font-medium">Achievements Earned</p>
            </div>
          </div>
        </div>
      </section>

      {/* Your Learning Path Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-dark_blue mb-2">
              Your Learning Path
            </h2>
            <p className="text-medium_blue">
              Start with any topic that interests you. Our system adapts to your
              pace.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sequential */}
            <div className="group bg-white border border-light_blue rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-medium_blue overflow-hidden relative">
              <div className="relative z-10">
                <div className="text-4xl mb-3">↘️</div>
                <h3 className="text-2xl font-bold text-dark_blue mb-3">
                  Sequential
                </h3>
                <p className="text-medium_blue mb-6">
                  Start with the fundamentals of sequential execution and basic
                  data operations.
                </p>
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-dark_blue mb-3">
                    <span className="font-semibold">Progress</span>
                    <span className="font-semibold">0%</span>
                  </div>
                  <div className="w-full bg-light_blue rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-medium_blue h-3 rounded-full transition-all duration-500"
                      style={{ width: "0%" }}
                    ></div>
                  </div>
                </div>
                <button className="w-full bg-medium_blue hover:bg-dark_blue text-offwite font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md">
                  Continue Learning →
                </button>
              </div>
            </div>

            {/* Loops */}
            <div className="group bg-white border border-light_blue rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-medium_blue overflow-hidden relative">
              <div className="relative z-10">
                <div className="text-4xl mb-3">🔄</div>
                <h3 className="text-2xl font-bold text-dark_blue mb-3">
                  Loops
                </h3>
                <p className="text-medium_blue mb-6">
                  Automate repetitive tasks and control program flow with loops
                  and iterative patterns.
                </p>
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-dark_blue mb-3">
                    <span className="font-semibold">Progress</span>
                    <span className="font-semibold">0%</span>
                  </div>
                  <div className="w-full bg-light_blue rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-medium_blue h-3 rounded-full transition-all duration-500"
                      style={{ width: "0%" }}
                    ></div>
                  </div>
                </div>
                <button className="w-full bg-medium_blue hover:bg-dark_blue text-offwite font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md">
                  Start Learning →
                </button>
              </div>
            </div>

            {/* Conditionals */}
            <div className="group bg-white border border-light_blue rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-medium_blue overflow-hidden relative">
              <div className="relative z-10">
                <div className="text-4xl mb-3">🔀</div>
                <h3 className="text-2xl font-bold text-dark_blue mb-3">
                  Conditionals
                </h3>
                <p className="text-medium_blue mb-6">
                  Master decision-making with conditional statements and logical
                  reasoning techniques.
                </p>
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-dark_blue mb-3">
                    <span className="font-semibold">Progress</span>
                    <span className="font-semibold">0%</span>
                  </div>
                  <div className="w-full bg-light_blue rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-medium_blue h-3 rounded-full transition-all duration-500"
                      style={{ width: "0%" }}
                    ></div>
                  </div>
                </div>
                <button className="w-full bg-medium_blue hover:bg-dark_blue text-offwite font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md">
                  Start Learning →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-light_blue/30 blur-3xl"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-dark_blue mb-2">
              Learning Tips & Tricks
            </h2>
            <p className="text-medium_blue">
              Master computational thinking with these proven strategies
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="group bg-white border border-light_blue rounded-xl p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:border-medium_blue">
              <div className="flex items-start gap-4">
                <span className="text-4xl mt-1">💡</span>
                <div>
                  <h3 className="text-lg font-bold text-dark_blue mb-2">
                    Take Your Time
                  </h3>
                  <p className="text-medium_blue">
                    There's no rush! Our adaptive system adjusts to your pace.
                    Take time to understand each concept before moving forward.
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white border border-light_blue rounded-xl p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:border-medium_blue">
              <div className="flex items-start gap-4">
                <span className="text-4xl mt-1">📝</span>
                <div>
                  <h3 className="text-lg font-bold text-dark_blue mb-2">
                    Practice Regularly
                  </h3>
                  <p className="text-medium_blue">
                    Consistent practice is key. Try to complete exercises daily
                    to reinforce what you've learned.
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white border border-light_blue rounded-xl p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:border-medium_blue">
              <div className="flex items-start gap-4">
                <span className="text-4xl mt-1">🎯</span>
                <div>
                  <h3 className="text-lg font-bold text-dark_blue mb-2">
                    Choose Your Style
                  </h3>
                  <p className="text-medium_blue">
                    We offer visual, verbal, and hands-on exercises. Pick
                    whichever format helps you learn best.
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white border border-light_blue rounded-xl p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:border-medium_blue">
              <div className="flex items-start gap-4">
                <span className="text-4xl mt-1">🔄</span>
                <div>
                  <h3 className="text-lg font-bold text-dark_blue mb-2">
                    Review Concepts
                  </h3>
                  <p className="text-medium_blue">
                    Don't hesitate to revisit earlier topics. Reviewing helps
                    solidify your understanding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StudentHome;
