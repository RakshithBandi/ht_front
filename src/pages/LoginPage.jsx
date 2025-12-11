import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Checkbox,
    FormControlLabel,
    Link,
    Divider,
    IconButton,
    InputAdornment,
    Paper,
    Container,
    Alert
} from '@mui/material';
import {
    Email,
    Lock,
    Google,
    GitHub,
    ArrowForward,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authComponents';

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'rememberMe' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            const response = await fetch(`${API_BASE_URL}/api/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.email, // Assuming email is used as username or backend handles it
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Login successful
                const sessionUser = {
                    fullName: data.username, // Backend returns username
                    email: data.email || formData.email,
                    groups: data.groups || [], // Store user groups from backend
                    role: (data.groups && (data.groups.includes('Admin') || data.groups.includes('Manager'))) ? 'admin' : 'user'
                };

                // Update auth context
                login(sessionUser);

                console.log('Login successful for:', sessionUser.email);

                // Navigate to home page
                navigate('/');
            } else {
                setError(data.error || 'Invalid credentials. Please try again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Network error. Please ensure the backend server is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    filter: 'blur(100px)',
                    opacity: 0.5,
                    zIndex: 0
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -100,
                    left: -100,
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    filter: 'blur(100px)',
                    opacity: 0.4,
                    zIndex: 0
                }
            }}
        >
            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <Paper
                    elevation={24}
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1,
                            }}
                        >
                            Welcome Back
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Sign in to continue to your account
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            sx={{ mb: 3 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            required
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        sx={{
                                            color: '#667eea',
                                            '&.Mui-checked': {
                                                color: '#667eea',
                                            },
                                        }}
                                    />
                                }
                                label="Remember me"
                            />
                            <Typography
                                onClick={() => navigate('/forgot-password')}
                                sx={{
                                    color: '#667eea',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    },
                                }}
                            >
                                Forgot password?
                            </Typography>
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForward />}
                            disabled={loading}
                            sx={{
                                py: 1.5,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                                    transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Box>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Don't have an account?{' '}
                            <Link
                                onClick={() => navigate('/signup')}
                                sx={{ color: '#667eea', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Sign up
                            </Link>
                        </Typography>
                    </Box>

                </Paper>
            </Container>
        </Box>
    );
}

export default LoginPage;
