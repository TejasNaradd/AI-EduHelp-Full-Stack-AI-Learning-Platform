import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">

      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 animate-gradient" />

      {/* Glowing Blobs */}
      <div className="absolute top-[-120px] left-[-120px] w-[450px] h-[450px] bg-blue-600/20 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[450px] h-[450px] bg-indigo-600/20 rounded-full blur-[140px] animate-pulse" />

      {/* NAVBAR */}
      <nav className="fixed w-full bg-slate-950/70 backdrop-blur-lg border-b border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
         <Link to="/">
         <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            AI-EduHelp
          </h1>
         </Link> 
          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="text-slate-300 hover:text-white transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 rounded-lg hover:opacity-90 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-40 pb-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            Study Smarter,
            <span className="block bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Not Harder ✨
            </span>
          </h2>

          <p className="mt-6 text-slate-400 text-lg md:text-xl">
            Turn your notes and documents into AI-powered summaries,
            flashcards, quizzes, and performance insights —
            all in one friendly learning space.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 rounded-xl text-lg font-semibold hover:opacity-90 transition"
            >
              Get Started Free
            </Link>

            <Link
              to="/login"
              className="border border-slate-700 px-8 py-3 rounded-xl hover:bg-slate-800 transition"
            >
              I Already Have Account
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

          {[
            {
              title: "📄 AI Summaries",
              desc: "Upload long documents and get clear, structured summaries instantly."
            },
            {
              title: "🧠 Smart Flashcards",
              desc: "Revise key concepts efficiently using intelligent repetition."
            },
            {
              title: "📊 Progress Insights",
              desc: "Track your learning growth and identify weak areas automatically."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -6 }}
              className="bg-slate-900/60 backdrop-blur-md p-8 rounded-2xl border border-slate-800 hover:border-blue-500 transition duration-300"
            >
              <h3 className="text-xl font-semibold mb-4">
                {feature.title}
              </h3>
              <p className="text-slate-400">
                {feature.desc}
              </p>
            </motion.div>
          ))}

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="px-6 pb-28 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-3xl mx-auto bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-12"
        >
          <h3 className="text-3xl md:text-4xl font-bold">
            Ready to Boost Your Learning? 🚀
          </h3>
          <p className="mt-4 text-slate-400 text-lg">
            Join AI-EduHelp and experience the future of intelligent studying.
          </p>

          <Link
            to="/register"
            className="inline-block mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 rounded-xl text-lg font-semibold hover:opacity-90 transition"
          >
            Create Free Account
          </Link>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500">
        © {new Date().getFullYear()} AI-EduHelp. Built for smart learners.
      </footer>
    </div>
  );
}