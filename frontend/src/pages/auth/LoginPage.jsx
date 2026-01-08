import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LogIn, AlertCircle } from "lucide-react"; 

function LoginPage() {
  useEffect(() => {
    document.title = "OpsGrid | Login";
  }, []);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Authentication failed. Please verify credentials.");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans selection:bg-blue-500/30">
      
      <div className="w-full max-w-md space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center">
          <Link to="/" className="group flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-blue-600 text-white shadow-sm transition-transform group-hover:scale-105">
                <img src="/favicon.svg" alt="OpsGrid" className="h-6 w-6" />
             </div>
             <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
               OpsGrid
             </span>
          </Link>
          <h2 className="mt-4 text-sm font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Your Organization's Hub
          </h2>
        </div>

        {/* Login Card */}
        <div className="rounded-sm border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-sm border border-red-200 bg-red-50 p-3 text-red-700 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-xs font-mono font-medium uppercase">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Username / ID
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 block w-full rounded-sm border border-slate-300 bg-slate-50 px-3 py-2 text-sm placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder-slate-600"
                placeholder="ENTER ID"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full rounded-sm border border-slate-300 bg-slate-50 px-3 py-2 text-sm placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder-slate-600"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-blue-600 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400 dark:focus:ring-offset-slate-900"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Authenticate</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center text-sm">
           <span className="text-slate-500 dark:text-slate-400">New Organization? </span>
           <Link
             to="/register"
             className="font-semibold text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-400 hover:underline"
           >
             Register Your Company
           </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;