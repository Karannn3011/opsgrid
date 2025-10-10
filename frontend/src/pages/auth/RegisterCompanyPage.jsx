import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Building, UserPlus } from 'lucide-react'; 

function RegisterCompanyPage() {
    useEffect(() => {
        document.title = "OpsGrid | Register Your Company"
      }, [])
    const [formData, setFormData] = useState({
        companyName: '',
        adminUsername: '',
        adminEmail: '',
        adminPassword: '',
        adminEmployeeId: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false); 
    const { registerCompany } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true); 
        try {
            await registerCompany(formData);
            setSuccess('Registration successful! You will be redirected to login shortly.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data || 'Failed to register. Please try again.');
            console.error(err);
            setLoading(false); 
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 dark:from-gray-900 dark:to-gray-950">
            <div className="w-full max-w-lg">
                {/* Logo and Header */}
                <div className="mb-8 text-center">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <img src="/favicon.svg" alt="OpsGrid Logo" className="h-10 w-10" />
                        <span className="text-3xl font-bold text-blue-700 dark:text-blue-400">OpsGrid</span>
                    </Link>
                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Create your Company Account
                    </h2>
                </div>

                {/* Registration Form Card */}
                <div className="rounded-xl bg-white/80 p-8 shadow-2xl backdrop-blur-lg dark:bg-gray-800/80">
                    {error && <p className="mb-4 rounded-md bg-red-100 p-3 text-center text-sm font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">{error}</p>}
                    {success && <p className="mb-4 rounded-md bg-green-100 p-3 text-center text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">{success}</p>}
                    
                    {!success && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Company Details */}
                            <div className="flex items-center gap-2 border-b pb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                                <Building className="h-5 w-5" />
                                <span>Company Details</span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                                <input name="companyName" type="text" required onChange={handleChange} className="mt-1 block w-full rounded-lg border-gray-300 bg-white/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white" />
                            </div>

                            {/* Admin Details */}
                            <div className="flex items-center gap-2 border-b pt-2 pb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                                <UserPlus className="h-5 w-5" />
                                <span>Administrator Account</span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin Username</label>
                                <input name="adminUsername" type="text" required onChange={handleChange} className="mt-1 block w-full rounded-lg border-gray-300 bg-white/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin Email</label>
                                <input name="adminEmail" type="email" required onChange={handleChange} className="mt-1 block w-full rounded-lg border-gray-300 bg-white/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin Employee ID</label>
                                <input name="adminEmployeeId" type="text" required onChange={handleChange} className="mt-1 block w-full rounded-lg border-gray-300 bg-white/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin Password</label>
                                <input name="adminPassword" type="password" required onChange={handleChange} className="mt-1 block w-full rounded-lg border-gray-300 bg-white/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white" />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-3 px-4 font-semibold text-white shadow-md transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                            >
                                {loading ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer Link */}
                <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-blue-600 hover:underline dark:text-blue-500">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterCompanyPage;