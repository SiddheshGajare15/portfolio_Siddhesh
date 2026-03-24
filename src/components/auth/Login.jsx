import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Loader2, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const from = location.state?.from?.pathname || "/dashboard";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await login(formData.email, formData.password);
        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl space-y-8"
            >
                <div className="text-center">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">Sign In</h2>
                    <p className="text-slate-500 font-medium">Continue your CDAC preparation</p>
                </div>

                {error && (
                   <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 flex items-center gap-2">
                      {error}
                   </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            required
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            required
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/25 flex items-center justify-center gap-2 hover:bg-primary/95"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <LogIn size={20} />}
                        Log In
                    </button>
                </form>

                <div className="text-center pt-4">
                    <p className="text-slate-500 font-medium mb-2">Don't have an account?</p>
                    <Link to="/signup" className="text-primary font-black flex items-center justify-center gap-2">
                        Create Account <ArrowRight size={16} />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
