import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Lock, User, Eye, EyeOff, Mail, Phone, ShieldCheck } from 'lucide-react';

type AuthMode = 'login' | 'register';

const Login = () => {
    const { loginWithData } = useApp();
    const navigate = useNavigate();
    const [mode, setMode] = useState<AuthMode>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [showFPSim, setShowFPSim] = useState(false); // Simulated Facebook Prompt

    // Initialize Facebook SDK
    useEffect(() => {
        // @ts-ignore
        window.fbAsyncInit = function () {
            // @ts-ignore
            FB.init({
                appId: 'YOUR_FACEBOOK_APP_ID', // Replace with real App ID
                cookie: true,
                xfbml: true,
                version: 'v18.0'
            });
        };

        // Load SDK script
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            // @ts-ignore
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            // @ts-ignore
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }, []);
    const [formData, setFormData] = useState({
        userFname: '',
        userLname: '',
        userEmail: '',
        userPhone: '',
        userUserN: '',
        userPass: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleFacebookLogin = async () => {
        // @ts-ignore
        if (typeof FB === 'undefined') {
            setShowFPSim(true);
            return;
        }

        setLoading(true);
        setError('');

        // @ts-ignore
        FB.login((response) => {
            if (response.authResponse) {
                // @ts-ignore
                FB.api('/me', { fields: 'id,first_name,last_name,email' }, async (profile) => {
                    await authWithBackend({
                        facebookID: profile.id,
                        userFname: profile.first_name,
                        userLname: profile.last_name,
                        userEmail: profile.email
                    });
                });
            } else {
                setLoading(false);
                setError('User cancelled login or did not fully authorize.');
            }
        }, {
            scope: 'public_profile,email',
            auth_type: 'reauthenticate' // This makes FB ask "Is this you?" or re-verify
        });
    };

    const authWithBackend = async (profileData: any) => {
        try {
            const response = await fetch('http://localhost:5000/api/users/facebook-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
            });

            const data = await response.json();

            if (data.success) {
                const user = data.user;
                const userData = {
                    userID: user.userID,
                    name: `${user.userFname} ${user.userLname}`,
                    role: user.userRole || 'customer',
                    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${user.userFname}${user.userLname}`,
                    userFname: user.userFname,
                    userLname: user.userLname,
                    userEmail: user.userEmail,
                };

                loginWithData(userData as any);
                navigate(userData.role === 'owner' ? '/owner' : '/shop');
            } else {
                setError(data.error || 'Facebook authentication failed');
            }
        } catch (err) {
            console.error('FB Login Error:', err);
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = mode === 'login' ? '/login' : '/register';
            const response = await fetch(`http://localhost:5000/api/users${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                if (mode === 'register') {
                    // After successful registration, show success message and switch to login
                    alert('Registration successful! Please login.');
                    setMode('login');
                    setFormData({
                        userFname: '',
                        userLname: '',
                        userEmail: '',
                        userPhone: '',
                        userUserN: '',
                        userPass: ''
                    });
                } else {
                    // Login successful
                    const user = data.user;

                    // Create user object for context and localStorage
                    const userData = {
                        userID: user.userID,
                        name: `${user.userFname} ${user.userLname}`,
                        role: user.userRole || 'customer',
                        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${user.userFname}${user.userLname}`,
                        userFname: user.userFname,
                        userLname: user.userLname,
                        userEmail: user.userEmail,
                        userPhone: user.userPhone,
                        userUserN: user.userUserN
                    };

                    // Update app context (this stores to localStorage automatically)
                    loginWithData(userData as any);

                    // Route based on user role
                    if (userData.role === 'owner') {
                        navigate('/owner');
                    } else {
                        navigate('/shop'); // CustomerShop page
                    }
                }
            } else {
                setError(data.error || `${mode === 'login' ? 'Login' : 'Registration'} failed`);
            }
        } catch (err) {
            setError('Server error. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-background">
            {/* Left decorative panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-800">
                {/* Background Image with Blur */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 filter blur-[1.5px] opacity-75"
                    style={{ backgroundImage: "url('/theme2.jpg')" }}
                />

                {/* Balanced Overlays for mid-level brightness */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/40" />
                <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/20">
                            <ShoppingBag className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-display font-bold text-xl text-primary-foreground">Auravive</span>
                    </div>

                    <div className="space-y-6 max-w-md">
                        <h2 className="text-4xl font-display font-bold text-primary-foreground leading-tight">
                            Start selling today with Auravive
                        </h2>
                        <p className="text-primary-foreground/70 text-lg leading-relaxed">
                            Join thousands of shop owners managing their products, inventory, and orders in one beautiful platform.
                        </p>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            {[
                                { value: '500+', label: 'Products Managed' },
                                { value: '2K+', label: 'Happy Customers' },
                                { value: '99%', label: 'Uptime' },
                                { value: '4.9★', label: 'Rating' },
                            ].map((stat) => (
                                <div key={stat.label} className="p-4 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 backdrop-blur-sm">
                                    <div className="text-2xl font-bold text-primary-foreground">{stat.value}</div>
                                    <div className="text-xs text-primary-foreground/50 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-primary-foreground/40 text-sm">© 2026 Auravive. All rights reserved.</p>
                </div>
            </div>

            {/* Right auth panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md animate-fade-in">
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Home
                        </button>
                        <div className="flex items-center gap-2 lg:hidden">
                            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                                <ShoppingBag className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <span className="font-display font-bold text-foreground">Auravive</span>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="w-7 h-7 text-primary-foreground" />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
                            {mode === 'login' ? 'Welcome back' : 'Create account'}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {mode === 'login' ? 'Sign in to your account' : 'Get started with Auravive'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Facebook button */}
                    <button
                        onClick={handleFacebookLogin}
                        className="w-full py-3 rounded-xl text-sm font-semibold bg-[#1877F2] text-white hover:bg-[#166FE5] transition-colors cursor-pointer flex items-center justify-center gap-3 shadow-lg shadow-[#1877F2]/20"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Continue with Facebook
                    </button>

                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-border" />
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        {mode === 'register' && (
                            <>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-foreground">First Name</label>
                                        <input
                                            type="text"
                                            placeholder="John"
                                            name="userFname"
                                            value={formData.userFname}
                                            onChange={handleChange}
                                            className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-foreground">Last Name</label>
                                        <input
                                            type="text"
                                            placeholder="Doe"
                                            name="userLname"
                                            value={formData.userLname}
                                            onChange={handleChange}
                                            className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-foreground">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            name="userEmail"
                                            value={formData.userEmail}
                                            onChange={handleChange}
                                            className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-foreground">Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            name="userPhone"
                                            value={formData.userPhone}
                                            onChange={handleChange}
                                            className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    name="userUserN"
                                    value={formData.userUserN}
                                    onChange={handleChange}
                                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-foreground">Password</label>
                                {mode === 'login' && (
                                    <button type="button" className="text-xs text-primary hover:underline cursor-pointer">
                                        Forgot password?
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    name="userPass"
                                    value={formData.userPass}
                                    onChange={handleChange}
                                    className="w-full h-11 pl-10 pr-11 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                    required
                                    disabled={loading}
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl text-sm font-semibold gradient-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer mt-2"
                            disabled={loading}
                        >
                            {loading
                                ? (mode === 'login' ? 'Logging in...' : 'Creating account...')
                                : (mode === 'login' ? 'Login' : 'Create Account')
                            }
                        </button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <button
                            onClick={() => {
                                setMode(mode === 'login' ? 'register' : 'login');
                                setError('');
                            }}
                            className="text-primary font-medium hover:underline cursor-pointer"
                        >
                            {mode === 'login' ? 'Register' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>

            {/* Simulated Facebook Confirmation Prompt */}
            {showFPSim && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
                        <div className="bg-[#1877F2] p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                <span className="text-white font-bold text-sm">Facebook Login</span>
                            </div>
                            <button onClick={() => setShowFPSim(false)} className="text-white/80 hover:text-white transition-colors">
                                <Lock className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-8 text-center bg-gray-50">
                            <div className="relative inline-block mb-6">
                                <img
                                    src="https://api.dicebear.com/7.x/initials/svg?seed=AuthUser"
                                    alt="User"
                                    className="w-20 h-20 rounded-full border-4 border-white shadow-md mx-auto bg-white"
                                />
                                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <ShieldCheck className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Continue as Auth User?</h3>
                            <p className="text-sm text-gray-500 mb-8 leading-relaxed px-4">
                                Auravive will receive your name, profile picture, and email address.
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        setShowFPSim(false);
                                        authWithBackend({
                                            facebookID: 'fb_1001',
                                            userFname: 'Auth',
                                            userLname: 'User',
                                            userEmail: 'auth.user@facebook.com'
                                        });
                                    }}
                                    className="w-full py-2.5 rounded-lg bg-[#1877F2] text-white font-bold text-sm hover:bg-[#166FE5] transition-colors shadow-md shadow-[#1877F2]/30 cursor-pointer"
                                >
                                    Continue as Auth
                                </button>
                                <button
                                    onClick={() => setShowFPSim(false)}
                                    className="w-full py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-[10px] text-gray-400 font-medium">
                                    By continuing, you agree to Facebook's Terms of Service and Privacy Policy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;