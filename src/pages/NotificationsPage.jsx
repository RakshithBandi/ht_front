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
                    mb: 3,
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {notificationsEnabled ? (
                            <NotificationsActive sx={{ mr: 1, color: theme.palette.primary.main }} />
                        ) : (
                            <NotificationsOff sx={{ mr: 1, color: 'text.secondary' }} />
                        )}
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Notification Settings
                        </Typography>
                    </Box>
                    {notifications.length > 0 && (
                        <Button
                            size="small"
                            onClick={handleClearAll}
                            sx={{ textTransform: 'none' }}
                        >
                            Clear All
                        </Button>
                    )}
                </Box>

                <FormControlLabel
                    control={
                        <Switch
                            checked={notificationsEnabled}
                            onChange={handleToggleNotifications}
                            color="primary"
                        />
                    }
                    label={
                        <Box>
                            <Typography variant="body1">
                                Enable Browser Notifications
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Get notified when new announcements are posted
                            </Typography>
                        </Box>
                    }
                />

                {permission === 'denied' && (
                    <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                        Notifications are blocked. Please enable them in your browser settings.
                    </Typography>
                )}
            </Paper>

            {/* Notifications List */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    overflow: 'hidden',
                }}
            >
                <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Recent Notifications
                    </Typography>
                </Box>

                {notifications.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <NotificationsIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            No notifications yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            You'll see notifications here when announcements are posted
                        </Typography>
                    </Box>
                ) : (
                    <List sx={{ p: 0 }}>
                        {notifications.map((notification, index) => (
                            <Box key={notification.id}>
                                <ListItem
                                    sx={{
                                        py: 2,
                                        px: 3,
                                        '&:hover': {
                                            backgroundColor: theme.palette.mode === 'dark'
                                                ? 'rgba(102, 126, 234, 0.05)'
                                                : 'rgba(102, 126, 234, 0.02)',
                                        },
                                    }}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleDeleteNotification(notification.id)}
                                            size="small"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            sx={{
                                                bgcolor: 'rgba(102, 126, 234, 0.1)',
                                                color: theme.palette.primary.main,
                                            }}
                                        >
                                            <CampaignIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                    {notification.title}
                                                </Typography>
                                                {notification.isNew && (
                                                    <Chip
                                                        label="New"
                                                        size="small"
                                                        sx={{
                                                            height: 20,
                                                            fontSize: '0.7rem',
                                                            bgcolor: theme.palette.primary.main,
                                                            color: 'white',
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                    {notification.body}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatDate(notification.timestamp)}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {index < notifications.length - 1 && <Divider />}
                            </Box>
                        ))}
                    </List>
                )}
            </Paper>
        </Box>
    );
}

export default NotificationsPage;
