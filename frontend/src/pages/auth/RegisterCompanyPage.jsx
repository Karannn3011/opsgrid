import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function RegisterCompanyPage() {
    const [formData, setFormData] = useState({
        companyName: '',
        adminUsername: '',
        adminEmail: '',
        adminPassword: '',
        adminEmployeeId: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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
        try {
            await registerCompany(formData);
            setSuccess('Registration successful! You will be redirected to login.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data || 'Failed to register. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
            <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
                    Register Your Company
                </h2>
                {error && <p className="mb-4 rounded-md bg-red-100 p-3 text-center text-sm text-red-700">{error}</p>}
                {success && <p className="mb-4 rounded-md bg-green-100 p-3 text-center text-sm text-green-700">{success}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                        <input name="companyName" type="text" required onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin Username</label>
                        <input name="adminUsername" type="text" required onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin Email</label>
                        <input name="adminEmail" type="email" required onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin Employee ID</label>
                        <input name="adminEmployeeId" type="text" required onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin Password</label>
                        <input name="adminPassword" type="password" required onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                    </div>
                    <button type="submit" className="w-full rounded-md bg-blue-600 py-2 px-4 font-semibold text-white hover:bg-blue-700">
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterCompanyPage;
