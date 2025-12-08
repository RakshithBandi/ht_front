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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    My Profile
                </Typography>
                {!isEditing ? (
                    <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={handleEditToggle}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                            '&:hover': {
                                borderColor: theme.palette.primary.dark,
                                backgroundColor: 'rgba(102, 126, 234, 0.05)',
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
                            sx={{ textTransform: 'none' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            sx={{
                                textTransform: 'none',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            }}
                        >
                            Save Changes
                        </Button>
                    </Box>
                )}
            </Box>

            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: `1px solid ${theme.palette.divider}`,
                }}
            >
                {/* Profile Header */}
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        p: 4,
                        position: 'relative',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                src={profilePicture}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    bgcolor: 'white',
                                    color: '#667eea',
                                    fontSize: '3rem',
                                    fontWeight: 700,
                                    border: '4px solid white',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                }}
                            >
                                {!profilePicture && getInitials(user.fullName)}
                            </Avatar>
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
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        bgcolor: 'white',
                                        boxShadow: 2,
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.9)',
                                        },
                                    }}
                                    size="small"
                                >
                                    <CameraAlt sx={{ color: '#667eea' }} />
                                </IconButton>
                            </label>
                        </Box>
                        <Box>
                            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                                {user.fullName}
                            </Typography>
                            <Chip
                                label="Active"
                                sx={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    fontWeight: 600,
                                    backdropFilter: 'blur(10px)',
                                }}
                            />
                        </Box>
                    </Box>
                </Box>

                {/* Profile Details */}
                <Box sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                        Personal Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <AccountCircle sx={{ color: theme.palette.primary.main }} />
                                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                    Full Name
                                </Typography>
                            </Box>
                            {isEditing ? (
                                <TextField
                                    fullWidth
                                    value={user.fullName}
                                    onChange={(e) => handleChange('fullName', e.target.value)}
                                    variant="outlined"
                                />
                            ) : (
                                <Typography variant="body1" sx={{ fontWeight: 500, pl: 4 }}>
                                    {user.fullName}
                                </Typography>
                            )}
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Email sx={{ color: theme.palette.primary.main }} />
                                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                    Email Address
                                </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 500, pl: 4 }}>
                                {user.email}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Phone sx={{ color: theme.palette.primary.main }} />
                                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                    Phone Number
                                </Typography>
                            </Box>
                            {isEditing ? (
                                <TextField
                                    fullWidth
                                    value={user.phone || ''}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    variant="outlined"
                                    placeholder="Enter phone number"
                                />
                            ) : (
                                <Typography variant="body1" sx={{ fontWeight: 500, pl: 4 }}>
                                    {user.phone || 'Not provided'}
                                </Typography>
                            )}
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                        Account Credentials
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                    Username
                                </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 500, pl: 0 }}>
                                {user.username || user.email.split('@')[0]}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                    Password
                                </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 500, pl: 0 }}>
                                ••••••••
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
}

export default Profile;
