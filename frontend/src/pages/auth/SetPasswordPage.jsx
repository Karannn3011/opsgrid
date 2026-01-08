import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { KeyRound, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react"; 

function SetPasswordPage() {
  useEffect(() => {
    document.title = "OpsGrid | Set Your Password"
  }, [])

  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("No invitation token found. Please use the link from your invitation.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    
    setLoading(true); 
    try {
      const response = await api.post("/auth/set-password", { token, password });
      setSuccess(response.data + " Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data || "Failed to set password. The token may be invalid or expired.");
      console.error(err);
    } finally {
        setLoading(false); 
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans selection:bg-blue-500/30">
        <div className="w-full max-w-md space-y-8">
            
            {/* Header */}
            <div className="flex flex-col items-center text-center">
                <Link to="/" className="group flex items-center gap-3">
                     <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-blue-600 text-white shadow-sm transition-transform group-hover:scale-105">
                        <img src="/favicon.svg" alt="OpsGrid" className="h-6 w-6" />
                     </div>
                     <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                       OpsGrid
                     </span>
                </Link>
                <div className="mt-4 flex flex-col items-center gap-2">
                    <div className="rounded-full bg-slate-100 p-2 dark:bg-slate-900">
                        <ShieldCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-sm font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        Security Credential Setup
                    </h2>
                </div>
            </div>
            
            {/* Form Card */}
            <div className="rounded-sm border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                
                {error && (
                    <div className="mb-6 flex items-center gap-3 rounded-sm border border-red-200 bg-red-50 p-3 text-red-700 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <p className="text-xs font-mono font-medium uppercase">{error}</p>
                    </div>
                )}
                
                {success && (
                    <div className="mb-6 flex items-center gap-3 rounded-sm border border-emerald-200 bg-emerald-50 p-3 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/10 dark:text-emerald-400">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                        <p className="text-xs font-mono font-medium uppercase">{success}</p>
                    </div>
                )}

                {!success && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1" htmlFor="password">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-sm border border-slate-300 bg-slate-50 px-3 py-2 text-sm placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1" htmlFor="confirmPassword">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="block w-full rounded-sm border border-slate-300 bg-slate-50 px-3 py-2 text-sm placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-sm bg-blue-600 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400 dark:focus:ring-offset-slate-900"
                        >
                            {loading ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    <span>Activating...</span>
                                </>
                            ) : (
                                <>
                                    <KeyRound className="h-4 w-4" />
                                    <span>Activate Access</span>
                                </>
                            )}
                        </button>
                    </form>
                )}
                
                {success && (
                    <div className="text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 font-semibold text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-400 hover:underline"
                        >
                            Proceed to Login Interface <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}

export default SetPasswordPage;