function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Master Computational Thinking
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Learn programming fundamentals at your own pace with personalized
            lessons adapted to your learning style.
          </p>
          {/* <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300">
            Get Started
          </button> */}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Our Platform Offers
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Adaptive Learning
              </h3>
              <p className="text-gray-700">
                Our intelligent system learns your pace and style, adjusting
                content to optimize your learning journey.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">👁️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Multiple Learning Styles
              </h3>
              <p className="text-gray-700">
                Learn through visual explanations, verbal instructions, and
                hands-on exercises.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-purple-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Comprehensive Curriculum
              </h3>
              <p className="text-gray-700">
                From sequential programming to loops and conditionals, build a
                strong foundation in computational thinking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Topics You'll Work On
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sequential */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-blue-600 hover:shadow-lg transition duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Sequential
              </h3>
              <p className="text-gray-700 mb-4">
                Start your programming journey with the fundamentals of
                sequential execution and basic data operations.
              </p>
              <button className="text-blue-600 font-semibold hover:text-blue-700">
                Explore →
              </button>
            </div>

            {/* Loops */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-green-600 hover:shadow-lg transition duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Loops</h3>
              <p className="text-gray-700 mb-4">
                Learn to automate repetitive tasks and control program flow with
                loops and iterative patterns.
              </p>
              <button className="text-green-600 font-semibold hover:text-green-700">
                Explore →
              </button>
            </div>

            {/* Conditionals */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-purple-600 hover:shadow-lg transition duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Conditionals
              </h3>
              <p className="text-gray-700 mb-4">
                Master decision-making in code with conditional statements and
                logical reasoning techniques.
              </p>
              <button className="text-purple-600 font-semibold hover:text-purple-700">
                Explore →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      {/* <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            How It Works
          </h2>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white font-bold text-lg">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Create Your Account
                </h3>
                <p className="text-gray-700">
                  Sign up and tell us about your learning preferences to get
                  started.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white font-bold text-lg">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Take Diagnostic Assessment
                </h3>
                <p className="text-gray-700">
                  Our system analyzes your strengths and customizes your
                  learning path accordingly.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white font-bold text-lg">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Learn & Practice
                </h3>
                <p className="text-gray-700">
                  Engage with interactive lessons and exercises tailored to your
                  pace and style.
                </p>
              </div>
            </div>

             <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white font-bold text-lg">
                  4
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Track Your Progress
                </h3>
                <p className="text-gray-700">
                  Monitor your growth and earn achievements as you master new
                  concepts.
                </p>
              </div>
            </div> 
          </div>
        </div>
      </section> */}
    </div>
  );
}

export default Home;
