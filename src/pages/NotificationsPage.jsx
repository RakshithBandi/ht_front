import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Button,
    Switch,
    FormControlLabel,
    useTheme,
    Chip,
    IconButton,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Campaign as CampaignIcon,
    Delete as DeleteIcon,
    NotificationsActive,
    NotificationsOff,
} from '@mui/icons-material';
import notificationsAPI from '../services/notificationsService';

function NotificationsPage() {
    const theme = useTheme();
    const [notifications, setNotifications] = useState([]);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [permission, setPermission] = useState('default');

    useEffect(() => {
        loadNotifications();

        // Check notification permission
        if ('Notification' in window) {
            setPermission(Notification.permission);
            const enabled = localStorage.getItem('notificationsEnabled') === 'true';
            setNotificationsEnabled(enabled && Notification.permission === 'granted');
        }
    }, []);

    const loadNotifications = async () => {
        try {
            const data = await notificationsAPI.getAll();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to load notifications:', error);
            // Fallback to localStorage
            const savedNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
            setNotifications(savedNotifications);
        }
    };

    const requestNotificationPermission = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            setPermission(permission);

            if (permission === 'granted') {
                setNotificationsEnabled(true);
                localStorage.setItem('notificationsEnabled', 'true');

                // Send a test notification
                new Notification('Notifications Enabled!', {
                    body: 'You will now receive updates when new announcements are posted.',
                    icon: '/favicon.ico',
                });
            }
        }
    };

    const handleToggleNotifications = async () => {
        if (!notificationsEnabled && permission !== 'granted') {
            await requestNotificationPermission();
        } else {
            const newState = !notificationsEnabled;
            setNotificationsEnabled(newState);
            localStorage.setItem('notificationsEnabled', newState.toString());
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationsAPI.markAsRead(id);
            await loadNotifications();
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleDeleteNotification = async (id) => {
        try {
            await notificationsAPI.delete(id);
            await loadNotifications();
        } catch (error) {
            console.error('Failed to delete notification:', error);
            // Fallback to localStorage
            const updatedNotifications = notifications.filter(n => n.id !== id);
            setNotifications(updatedNotifications);
            localStorage.setItem('userNotifications', JSON.stringify(updatedNotifications));
        }
    };

    const handleClearAll = async () => {
        try {
            await notificationsAPI.clearAll();
            setNotifications([]);
        } catch (error) {
            console.error('Failed to clear notifications:', error);
            // Fallback to localStorage
            setNotifications([]);
            localStorage.setItem('userNotifications', '[]');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInMins = Math.floor(diffInMs / 60000);
        const diffInHours = Math.floor(diffInMs / 3600000);
        const diffInDays = Math.floor(diffInMs / 86400000);

        if (diffInMins < 1) return 'Just now';
        if (diffInMins < 60) return `${diffInMins} min ago`;
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Notifications
            </Typography>

            {/* Notification Settings */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'space-between',
                    gap: 2,
                    boxShadow: '0 4px 20px rgba(118, 75, 162, 0.3)'
                }}
            >
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <NotificationsActive />
                        Push Notifications
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                        Get notified instantly when new announcements are posted
                    </Typography>
                </Box>

                <FormControlLabel
                    control={
                        <Switch
                            checked={notificationsEnabled}
                            onChange={handleToggleNotifications}
                            color="default"
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: 'white',
                                },
                                '& .MuiSwitch-track': {
                                    backgroundColor: 'rgba(255,255,255,0.5) !important',
                                }
                            }}
                        />
                    }
                    label={<Typography sx={{ fontWeight: 600 }}>{notificationsEnabled ? 'Enabled' : 'Disabled'}</Typography>}
                />
            </Paper>

            {/* Notifications List */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    overflow: 'hidden',
                    background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff',
                }}
            >
                <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Recent Notifications
                    </Typography>
                    {notifications.length > 0 && (
                        <Button
                            size="small"
                            onClick={handleClearAll}
                            sx={{ textTransform: 'none', color: 'text.secondary' }}
                        >
                            Clear All
                        </Button>
                    )}
                </Box>

                {notifications.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Box sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            bgcolor: 'rgba(0,0,0,0.03)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2
                        }}>
                            <NotificationsIcon sx={{ fontSize: 40, color: 'text.disabled', opacity: 0.5 }} />
                        </Box>
                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
                            No new notifications
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            We'll notify you when something important happens
                        </Typography>
                    </Box>
                ) : (
                    <List sx={{ p: 0 }}>
                        {notifications.map((notification, index) => (
                            <Box key={notification.id}>
                                <ListItem
                                    sx={{
                                        py: 2.5,
                                        px: 3,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        backgroundColor: !notification.is_read
                                            ? (theme.palette.mode === 'dark' ? 'rgba(102, 126, 234, 0.08)' : 'rgba(102, 126, 234, 0.04)')
                                            : 'transparent',
                                        '&:hover': {
                                            backgroundColor: theme.palette.mode === 'dark'
                                                ? 'rgba(102, 126, 234, 0.15)'
                                                : 'rgba(102, 126, 234, 0.08)',
                                        },
                                    }}
                                    onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteNotification(notification.id);
                                            }}
                                            size="small"
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            sx={{
                                                bgcolor: 'rgba(102, 126, 234, 0.1)',
                                                color: '#667eea',
                                                border: '1px solid rgba(102, 126, 234, 0.2)'
                                            }}
                                        >
                                            <CampaignIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primaryTypographyProps={{ component: 'div' }}
                                        secondaryTypographyProps={{ component: 'div' }}
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                                                    {notification.title}
                                                </Typography>
                                                {!notification.is_read && (
                                                    <Chip
                                                        label="New"
                                                        size="small"
                                                        sx={{
                                                            height: 20,
                                                            fontSize: '0.7rem',
                                                            bgcolor: '#667eea',
                                                            color: 'white',
                                                            fontWeight: 700
                                                        }}
                                                    />
                                                )}
                                                <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto', mr: 2 }}>
                                                    {formatDate(notification.timestamp)}
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                                                {notification.body}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                {index < notifications.length - 1 && <Divider component="li" />}
                            </Box>
                        ))}
                    </List>
                )}
            </Paper>
        </Box>
    );
}

export default NotificationsPage;
