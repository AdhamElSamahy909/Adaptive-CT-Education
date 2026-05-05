import { useNavigate } from "react-router-dom";

function InstructorHomePage() {
  const navigate = useNavigate();

  const topics = [
    {
      name: "Sequential",
      path: "/sequential",
      emoji: "↘️",
      description: "Manage sequential execution exercises and lectures",
    },
    {
      name: "Loops",
      path: "/loops",
      emoji: "🔄",
      description: "Manage loop structures and iterative patterns",
    },
    {
      name: "Conditionals",
      path: "/conditionals",
      emoji: "🔀",
      description: "Manage conditional statements and logic",
    },
  ];

  return (
    <div className="min-h-screen bg-offwite">
      {/* Welcome Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-r from-medium_blue to-dark_blue relative overflow-hidden">
        <div className="absolute inset-0 bg-light_blue/20 blur-3xl"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-4">
            <span className="inline-block px-4 py-1 bg-light_blue/40 border border-light_blue rounded-full text-dark_blue text-sm font-semibold">
              🎓 Instructor Dashboard
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-offwite mb-4 leading-tight">
            Welcome to your <br />
            <span className="text-light_blue">teaching hub</span>
          </h1>
          <p className="text-light_blue text-lg max-w-2xl">
            Manage your courses and course topics effectively.
          </p>
        </div>
      </section>

      {/* Topics Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-dark_blue mb-2">
              Your Topics
            </h2>
            <p className="text-medium_blue">
              Navigate to a topic to manage its exercises and lectures
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {topics.map((topic, idx) => (
              <div
                key={idx}
                onClick={() => navigate(topic.path)}
                className="group bg-white border border-light_blue rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-medium_blue cursor-pointer overflow-hidden relative"
              >
                <div className="relative z-10">
                  <div className="text-5xl mb-4">{topic.emoji}</div>
                  <h3 className="text-2xl font-bold text-dark_blue mb-3">
                    {topic.name}
                  </h3>
                  <p className="text-medium_blue mb-6">{topic.description}</p>
                  <div className="flex items-center gap-2 text-medium_blue font-semibold group-hover:text-dark_blue transition-colors">
                    Manage Topic →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default InstructorHomePage;
