import React, { useState } from "react"; // Import useState
import { Link } from "react-router-dom";
import { Github, CheckCircle } from "lucide-react"; // Import a check icon
import Modal from "../components/common/Modal"; // Import the Modal component

function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-900 dark:from-gray-900 dark:to-gray-950 dark:text-white">
      {/* Header */}
      <header className="fixed top-0 z-10 w-full bg-white/80 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8 dark:bg-gray-800/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-blue-700 dark:text-blue-400"
          >
            <img src="/favicon.svg" alt="OpsGrid Logo" className="h-8 w-8" />
            OpsGrid
          </Link>
          <nav className="flex items-center space-x-4">
            <Link
              to="/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative flex flex-grow flex-col items-center justify-center pt-24 pb-16">
        <div
          className="absolute inset-0 bg-grid-small-black/[0.2] dark:bg-grid-small-white/[0.05]"
          style={{
            maskImage:
              "radial-gradient(ellipse at center, transparent 20%, black)",
          }}
        ></div>

        <div className="relative z-5 mx-auto max-w-4xl px-4 py-16 text-center sm:py-24 lg:py-32">
          <span className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            Streamline Your Logistics
          </span>
          <h2 className="mb-6 text-5xl font-extrabold leading-tight tracking-tighter text-gray-900 sm:text-6xl md:text-7xl dark:text-white">
            Your{" "}
            <span className="text-blue-600 dark:text-blue-400">Operations</span>
            , Unlocked.
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-700 sm:text-xl dark:text-gray-300">
            OpsGrid provides an intuitive, multi-tenant platform to manage your
            fleet, drivers, shipments, and issues—all in one place. Focus on
            growth, we handle the grid.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Get Started Now
            </Link>
            {/* --- START OF CHANGE --- */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-8 py-3 text-lg font-medium text-gray-700 shadow-sm transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Learn More
            </button>
            {/* --- END OF CHANGE --- */}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 bg-white py-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} OpsGrid. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-4 sm:mt-0">
            <a
              href="https://github.com/karannn3011/opsgrid"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              <Github className="h-5 w-5" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Learn More Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="About OpsGrid"
      >
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            OpsGrid is designed not as a simple tracking tool, but as a
            strategic command center for small to medium-sized logistics
            enterprises.
          </p>
          <p>
            It addresses critical business needs by providing a single source of
            truth for all operational data.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500" />
              <span>
                <strong>Centralized Management:</strong> A single dashboard for
                all your fleets, drivers, and shipments.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500" />
              <span>
                <strong>Streamlined Workflows:</strong> An intuitive system for
                tracking operational issues from report to resolution.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500" />
              <span>
                <strong>AI-Powered Insights:</strong> Use artificial
                intelligence to get expert-level diagnostics, analyze financial
                trends, and automate communication.
              </span>
            </li>
          </ul>
        </div>
      </Modal>
    </div>
  );
}

export default LandingPage;
