import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Container,
    Alert,
    InputAdornment,
} from '@mui/material';
import {
    Email,
    ArrowBack,
    Send,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            const response = await fetch(`${API_BASE_URL}/api/password-reset/request/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                // Redirect to login after 5 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            } else {
                setError(data.error || 'Failed to send reset email. Please try again.');
            }
        } catch (err) {
            console.error('Password reset request error:', err);
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
                            Forgot Password?
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Enter your email address and we'll send you a link to reset your password
                        </Typography>
                    </Box>

                    {success ? (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
                                Reset link sent!
                            </Typography>
                            <Typography variant="body2">
                                If an account exists with this email, you will receive a password reset link shortly.
                                Check your email (or console if using development mode).
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                                Redirecting to login page in 5 seconds...
                            </Typography>
                        </Alert>
                    ) : (
                        <>
                            {error && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {error}
                                </Alert>
                            )}

                            <Box component="form" onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    endIcon={<Send />}
                                    disabled={loading}
                                    sx={{
                                        py: 1.5,
                                        mb: 2,
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
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </Button>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<ArrowBack />}
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        borderColor: '#667eea',
                                        color: '#667eea',
                                        '&:hover': {
                                            borderColor: '#764ba2',
                                            backgroundColor: 'rgba(102, 126, 234, 0.05)',
                                        },
                                    }}
                                >
                                    Back to Login
                                </Button>
                            </Box>
                        </>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}

export default ForgotPasswordPage;
