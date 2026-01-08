import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Github, 
  ChevronRight, 
  Truck, 
  BarChart3, 
  ShieldCheck, 
  Globe,
  LayoutDashboard,
  Users
} from "lucide-react";
import Modal from "../components/common/Modal";

function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans selection:bg-blue-500/30">
      
      {/* --- NAVBAR --- */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-blue-600 text-white shadow-sm transition-transform group-hover:scale-105">
               {/* Simple geometric logo placeholder if img fails, or use img */}
               <img src="/favicon.svg" alt="OpsGrid" className="h-5 w-5" onError={(e) => e.target.style.display='none'} />
               <span className="font-mono font-bold text-sm hidden group-hover:block" style={{display: 'none'}}>OG</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              OpsGrid
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-sm bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <main className="flex-grow">
        <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
            
            {/* Left Content */}
            <div className="max-w-2xl">
              
              <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
                Logistics Command <br />
                <span className="text-slate-400 dark:text-slate-600">Centralized.</span>
              </h1>
              
              <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                A military-grade dashboard for modern logistics. Manage fleets, track shipments, and resolve incidents from a single source of truth. No clutter, just control.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-sm bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
                >
                  Start Now <ChevronRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center rounded-sm border border-slate-200 bg-white px-6 py-3 text-base font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  About
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex items-center gap-6 border-t border-slate-200 pt-8 dark:border-slate-800 text-slate-500">
                 <div className="flex flex-col">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">99.9%</span>
                    <span className="text-xs uppercase tracking-wider">Uptime</span>
                 </div>
                 <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
                 <div className="flex flex-col">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">Real-Time</span>
                    <span className="text-xs uppercase tracking-wider">Tracking</span>
                 </div>
              </div>
            </div>

            {/* Right Graphic - Abstract Dashboard Representation */}
            <div className="relative hidden lg:block">
               {/* Main Card */}
               <div className="relative z-10 rounded-lg border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                  <div className="rounded border border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950/50">
                     <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                           <LayoutDashboard className="h-5 w-5 text-blue-600" />
                           <span className="font-mono text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">OpsGrid // Main</span>
                        </div>
                        <div className="flex gap-1.5">
                           <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                           <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                        </div>
                     </div>
                     
                     <div className="space-y-3">
                        {/* Fake UI Elements */}
                        <div className="flex items-center justify-between rounded bg-white p-3 shadow-sm dark:bg-slate-900">
                           <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded bg-emerald-100 flex items-center justify-center text-emerald-600 dark:bg-emerald-900/30"><Truck className="h-4 w-4"/></div>
                              <div>
                                 <div className="h-2 w-24 rounded bg-slate-200 dark:bg-slate-800"></div>
                                 <div className="mt-1 h-2 w-12 rounded bg-slate-100 dark:bg-slate-800"></div>
                              </div>
                           </div>
                           <div className="h-2 w-8 rounded bg-emerald-500"></div>
                        </div>

                        <div className="flex items-center justify-between rounded bg-white p-3 shadow-sm dark:bg-slate-900">
                           <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/30"><Globe className="h-4 w-4"/></div>
                              <div>
                                 <div className="h-2 w-32 rounded bg-slate-200 dark:bg-slate-800"></div>
                                 <div className="mt-1 h-2 w-16 rounded bg-slate-100 dark:bg-slate-800"></div>
                              </div>
                           </div>
                           <div className="h-2 w-12 rounded bg-blue-500"></div>
                        </div>

                        <div className="flex items-center justify-between rounded bg-white p-3 shadow-sm dark:bg-slate-900">
                           <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded bg-amber-100 flex items-center justify-center text-amber-600 dark:bg-amber-900/30"><ShieldCheck className="h-4 w-4"/></div>
                              <div>
                                 <div className="h-2 w-20 rounded bg-slate-200 dark:bg-slate-800"></div>
                              </div>
                           </div>
                           <div className="h-2 w-6 rounded bg-amber-500"></div>
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* Decorative Backdrop Element */}
               <div className="absolute -right-4 -bottom-4 -z-10 h-full w-full rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50"></div>
            </div>
          </div>
        </section>

        {/* --- FEATURE GRID --- */}
        <section className="bg-white py-24 dark:bg-slate-900">
           <div className="mx-auto max-w-7xl px-6">
              <div className="mb-16 max-w-2xl">
                 <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">Operational Modules</h2>
                 <p className="mt-4 text-slate-600 dark:text-slate-400">
                    OpsGrid replaces disjointed spreadsheets with a unified, role-based command structure.
                 </p>
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                 {/* Card 1 */}
                 <div className="group relative rounded-lg border border-slate-200 bg-slate-50 p-8 transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded bg-blue-600 text-white">
                       <Truck className="h-5 w-5" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Fleet Command</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                       Real-time status tracking of all assets. Monitor maintenance cycles, assign drivers, and optimize readiness.
                    </p>
                 </div>

                 {/* Card 2 */}
                 <div className="group relative rounded-lg border border-slate-200 bg-slate-50 p-8 transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded bg-blue-600 text-white">
                       <BarChart3 className="h-5 w-5" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Financial Ledger</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                       Integrated income and expense tracking. Analyze profitability per shipment and reduce operational overhead.
                    </p>
                 </div>

                 {/* Card 3 */}
                 <div className="group relative rounded-lg border border-slate-200 bg-slate-50 p-8 transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded bg-blue-600 text-white">
                       <Users className="h-5 w-5" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Personnel Manifest</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                       Role-based access for Admins, Managers, and Drivers. Secure onboarding and activity monitoring.
                    </p>
                 </div>
              </div>
           </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} OpsGrid Logistics
          </p>
          <a
            href="https://github.com/karannn3011/opsgrid"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <Github className="h-4 w-4" />
            <span>Source Code</span>
          </a>
        </div>
      </footer>

      {/* --- SIMPLE INFO MODAL --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="SYSTEM OVERVIEW"
      >
        <div className="space-y-4 font-sans text-sm text-slate-600 dark:text-slate-300">
          <p>
            <strong>OpsGrid</strong> is a comprehensive logistics management platform built to bridge the gap between field operations and command decisions.
          </p>
          <div className="rounded border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <h4 className="mb-2 font-bold uppercase text-xs tracking-wider text-slate-900 dark:text-white">Core Capabilities</h4>
            <ul className="list-disc list-inside space-y-1">
               <li>End-to-end Shipment Tracking</li>
               <li>Automated Issue Reporting & Resolution</li>
               <li>Driver Performance Metrics</li>
               <li>AI-Assisted Diagnostics (Google Gemini Integration)</li>
            </ul>
          </div>
          <p>
             Designed for scalability, security, and speed.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default LandingPage;