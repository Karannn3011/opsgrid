import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Building2, UserCog, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'; 

function RegisterCompanyPage() {
    useEffect(() => {
        document.title = "OpsGrid | Initialize Organization"
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
            setSuccess('Organization initialized successfully. Redirecting to secure login...');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data || 'Initialization failed. Please check input parameters.');
            console.error(err);
            setLoading(false); 
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans selection:bg-blue-500/30">
            <div className="w-full max-w-xl space-y-8">
                
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
                    <h2 className="mt-4 text-sm font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        New Organization Setup
                    </h2>
                </div>

                {/* Main Form Card */}
                <div className="rounded-sm border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    
                    {/* Feedback Messages */}
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
                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            {/* SECTION 1: COMPANY */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
                                    <Building2 className="h-4 w-4 text-blue-600" />
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                        Organization Details
                                    </h3>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                        Company Name
                                    </label>
                                    <input 
                                        name="companyName" 
                                        type="text" 
                                        required 
                                        onChange={handleChange}
                                        placeholder="GLOBAL LOGISTICS INC." 
                                        className="block w-full rounded-sm border border-slate-300 bg-slate-50 px-3 py-2 text-sm placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" 
                                    />
                                </div>
                            </div>

                            {/* SECTION 2: ADMIN */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
                                    <UserCog className="h-4 w-4 text-blue-600" />
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                        Root Administrator
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                            Username
                                        </label>
                                        <input 
                                            name="adminUsername" 
                                            type="text" 
                                            required 
                                            onChange={handleChange}
                                            placeholder="ADMIN_01" 
                                            className="block w-full rounded-sm border border-slate-300 bg-slate-50 px-3 py-2 text-sm placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                            Employee ID
                                        </label>
                                        <input 
                                            name="adminEmployeeId" 
                                            type="text" 
                                            required 
                                            onChange={handleChange}
                                            placeholder="EMP-001" 
                                            className="block w-full rounded-sm border border-slate-300 bg-slate-50 px-3 py-2 text-sm placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                        Email Address
                                    </label>
                                    <input 
                                        name="adminEmail" 
                                        type="email" 
                                        required 
                                        onChange={handleChange} 
                                        placeholder="admin@company.com"
                                        className="block w-full rounded-sm border border-slate-300 bg-slate-50 px-3 py-2 text-sm placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" 
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                        Master Password
                                    </label>
                                    <input 
                                        name="adminPassword" 
                                        type="password" 
                                        required 
                                        onChange={handleChange}
                                        placeholder="••••••••" 
                                        className="block w-full rounded-sm border border-slate-300 bg-slate-50 px-3 py-2 text-sm placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" 
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-sm bg-blue-600 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400 dark:focus:ring-offset-slate-900"
                            >
                                {loading ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        <span>Provisioning System...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Initialize Organization</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer Link */}
                <div className="text-center text-sm">
                   <span className="text-slate-500 dark:text-slate-400">Already registered? </span>
                   <Link
                     to="/login"
                     className="font-semibold text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-400 hover:underline"
                   >
                     Sign in.
                   </Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterCompanyPage;