import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { KeyRound } from "lucide-react"; // Import an icon

function SetPasswordPage() {
  useEffect(() => {
    document.title = "OpsGrid | Set Your Password"
  }, [])
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
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
    
    setLoading(true); // Start loading
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
        setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 dark:from-gray-900 dark:to-gray-950">
        <div className="w-full max-w-md">
            {/* Logo and Header */}
            <div className="mb-8 text-center">
                <Link to="/" className="inline-flex items-center gap-2">
                    <img src="/favicon.png" alt="OpsGrid Logo" className="h-10 w-10" />
                    <span className="text-3xl font-bold text-blue-700 dark:text-blue-400">OpsGrid</span>
                </Link>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Set Your New Password
                </h2>
            </div>
            
            {/* Form Card */}
            <div className="rounded-xl bg-white/80 p-8 shadow-2xl backdrop-blur-lg dark:bg-gray-800/80">
                {error && <p className="mb-4 rounded-md bg-red-100 p-3 text-center text-sm font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">{error}</p>}
                {success && <p className="mb-4 rounded-md bg-green-100 p-3 text-center text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">{success}</p>}

                {!success && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-lg border-gray-300 bg-white/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="confirmPassword">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full rounded-lg border-gray-300 bg-white/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-3 px-4 font-semibold text-white shadow-md transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                        >
                             {loading ? (
                                <>
                                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>
                                  <span>Activating...</span>
                                </>
                              ) : (
                                <>
                                  <KeyRound className="h-5 w-5" />
                                  <span>Set Password & Activate</span>
                                </>
                              )}
                        </button>
                    </form>
                )}
                {success && (
                    <div className="text-center">
                        <Link
                            to="/login"
                            className="font-semibold text-blue-600 hover:underline dark:text-blue-500"
                        >
                            Proceed to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}

export default SetPasswordPage;