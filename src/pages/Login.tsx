import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Lock, User, Eye, EyeOff, Mail, Phone } from 'lucide-react';

type AuthMode = 'login' | 'register';

const Login = () => {
    const { loginWithData } = useApp();
    const navigate = useNavigate();
    const [mode, setMode] = useState<AuthMode>('login');
    const [showPassword, setShowPassword] = useState(false);
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

    const handleFacebookLogin = () => {
        const fbUser = {
            userID: 0,
            name: 'Shop Owner',
            role: 'owner' as const,
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SO',
            userFname: 'Shop',
            userLname: 'Owner',
        };
        loginWithData(fbUser);
        navigate('/owner');
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
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden gradient-primary">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.08),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]" />
                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/20">
                            <ShoppingBag className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-display font-bold text-xl text-primary-foreground">ShopHub</span>
                    </div>

                    <div className="space-y-6 max-w-md">
                        <h2 className="text-4xl font-display font-bold text-primary-foreground leading-tight">
                            Start selling today with ShopHub
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

                    <p className="text-primary-foreground/40 text-sm">© 2026 ShopHub. All rights reserved.</p>
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
                            <span className="font-display font-bold text-foreground">ShopHub</span>
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
                            {mode === 'login' ? 'Sign in to your account' : 'Get started with ShopHub'}
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
        </div>
    );
};

export default Login;