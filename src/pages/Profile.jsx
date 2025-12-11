import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Avatar,
    Grid,
    TextField,
    Divider,
    Chip,
    useTheme,
    Button,
    IconButton,
} from '@mui/material';
import {
    Email,
    Phone,
    Edit,
    CameraAlt,
    AccountCircle,
} from '@mui/icons-material';
import profileAPI from '../services/profileService';

function Profile() {
    const theme = useTheme();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        // First, try to get user from localStorage (set during login)
        const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');

        if (loggedInUser && loggedInUser.email) {
            // User is logged in, use their data
            setUser(loggedInUser);
            setProfilePicture(loggedInUser.profilePicture || null);
        } else {
            // No user in localStorage, try API as fallback
            try {
                const profileData = await profileAPI.getProfile();
                setUser(profileData);
                setProfilePicture(profileData.profilePicture || null);
            } catch (error) {
                console.error('Failed to load profile:', error);
                // Set empty user object if both fail
                setUser({
                    fullName: 'User',
                    email: 'user@example.com',
                    phone: '',
                });
            }
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleProfilePictureChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setProfilePicture(base64String);
                setUser({ ...user, profilePicture: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const updatedProfile = await profileAPI.updateProfile(user);
            setUser(updatedProfile);
            // Also update localStorage for compatibility
            localStorage.setItem('user', JSON.stringify(updatedProfile));
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (field, value) => {
        setUser({ ...user, [field]: value });
    };

    if (!user || !user.fullName) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Typography variant="h6" color="text.secondary">
                    No user data found. Please log in again.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff',
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                }}
            >
                {/* Profile Header */}
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        p: { xs: 3, md: 5 },
                        pb: { xs: 18, md: 10 },
                        position: 'relative',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { xs: 'center', md: 'flex-start' },
                        gap: 3
                    }}
                >
                    <Avatar
                        src={profilePicture}
                        sx={{
                            width: 140,
                            height: 140,
                            bgcolor: 'white',
                            color: '#667eea',
                            fontSize: '3.5rem',
                            fontWeight: 700,
                            border: '5px solid white',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                            position: 'absolute',
                            bottom: -50,
                            left: { xs: '50%', md: 40 },
                            transform: { xs: 'translateX(-50%)', md: 'none' }
                        }}
                    >
                        {!profilePicture && getInitials(user.fullName)}
                    </Avatar>

                    <Box sx={{
                        ml: { xs: 0, md: 22 },
                        mt: { xs: 0, md: 2 },
                        textAlign: { xs: 'center', md: 'left' }
                    }}>
                        <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mb: 1, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                            {user.fullName}
                        </Typography>
                        <Chip
                            label="Active Member"
                            sx={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                fontWeight: 700,
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.3)'
                            }}
                        />
                    </Box>

                    {isEditing && (
                        <Box sx={{ position: 'absolute', bottom: -40, left: { xs: '50%', md: 130 }, transform: { xs: 'translateX(20px)', md: 'none' }, zIndex: 10 }}>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="profile-picture-upload"
                                type="file"
                                onChange={handleProfilePictureChange}
                            />
                            <label htmlFor="profile-picture-upload">
                                <IconButton
                                    component="span"
                                    sx={{
                                        bgcolor: 'white',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.9)',
                                            transform: 'scale(1.1)'
                                        },
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <CameraAlt sx={{ color: '#667eea' }} />
                                </IconButton>
                            </label>
                        </Box>
                    )}
                </Box>

                {/* Profile Details */}
                <Box sx={{ p: { xs: 3, md: 5 }, pt: { xs: 12, md: 10 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                            Personal Information
                        </Typography>

                        {!isEditing ? (
                            <Button
                                variant="contained"
                                startIcon={<Edit />}
                                onClick={handleEditToggle}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    boxShadow: '0 4px 14px 0 rgba(118, 75, 162, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)',
                                        boxShadow: '0 6px 20px 0 rgba(118, 75, 162, 0.4)',
                                    },
                                }}
                            >
                                Edit Profile
                            </Button>
                        ) : (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleEditToggle}
                                    sx={{ textTransform: 'none', borderRadius: 2 }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSave}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        boxShadow: '0 4px 14px 0 rgba(118, 75, 162, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)',
                                            boxShadow: '0 6px 20px 0 rgba(118, 75, 162, 0.4)',
                                        },
                                    }}
                                >
                                    Save Changes
                                </Button>
                            </Box>
                        )}
                    </Box>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 3, borderRadius: 3, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', height: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                    <AccountCircle sx={{ color: '#667eea', fontSize: 28 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Contact Details
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                                            Full Name
                                        </Typography>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                size="small"
                                                value={user.fullName}
                                                onChange={(e) => handleChange('fullName', e.target.value)}
                                                variant="outlined"
                                                sx={{ bgcolor: theme.palette.background.paper }}
                                            />
                                        ) : (
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {user.fullName}
                                            </Typography>
                                        )}
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                                            Email Address
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {user.email}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                                            Phone Number
                                        </Typography>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                size="small"
                                                value={user.phone || ''}
                                                onChange={(e) => handleChange('phone', e.target.value)}
                                                variant="outlined"
                                                placeholder="Enter phone number"
                                                sx={{ bgcolor: theme.palette.background.paper }}
                                            />
                                        ) : (
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {user.phone || 'Not provided'}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 3, borderRadius: 3, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', height: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', bgcolor: 'rgba(102, 126, 234, 0.2)', color: '#667eea' }}>
                                        <Typography variant="caption" sx={{ fontWeight: 800 }}>ID</Typography>
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Account Credentials
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                                            Username
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {user.username || user.email.split('@')[0]}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                                            Password
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Typography variant="body1" sx={{ fontWeight: 500, letterSpacing: 2 }}>
                                                ••••••••
                                            </Typography>
                                            <Button size="small" sx={{ textTransform: 'none', minWidth: 'auto', p: 0.5 }}>
                                                Change
                                            </Button>
                                        </Box>
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                                            Role
                                        </Typography>
                                        <Chip
                                            label={user.role || 'Member'}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
}

export default Profile;
