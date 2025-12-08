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
            const response = await fetch('http://localhost:8000/api/password-reset/request/', {
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
                background: '#f5f5f5',
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={24}
                    sx={{
                        p: 5,
                        borderRadius: 4,
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
