import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">OpsGrid</h1>
          <nav>
            <Link to="/login" className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800">
              Login
            </Link>
            <Link to="/register" className="ml-4 inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-grow flex-col items-center justify-center text-center">
        <div className="container mx-auto px-4 py-12 sm:py-20">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            The Command Center for Your Logistics
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            OpsGrid provides a powerful, multi-tenant platform to manage your fleet, drivers, shipments, and issues all in one place.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-base font-medium text-white hover:bg-blue-800"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
