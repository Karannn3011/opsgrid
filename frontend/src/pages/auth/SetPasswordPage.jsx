import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

function SetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError(
        "No invitation token found. Please use the link from your invitation.",
      );
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

    try {
      const response = await api.post("/auth/set-password", {
        token,
        password,
      });
      setSuccess(response.data + " Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data ||
          "Failed to set password. The token may be invalid or expired.",
      );
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Set Your Password
        </h2>
        {error && (
          <p className="mb-4 rounded-md bg-red-100 p-3 text-center text-sm text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-4 rounded-md bg-green-100 p-3 text-center text-sm text-green-700">
            {success}
          </p>
        )}

        {!success && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                htmlFor="password"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                htmlFor="confirmPassword"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Set Password & Activate Account
            </button>
          </form>
        )}
        {success && (
          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default SetPasswordPage;
