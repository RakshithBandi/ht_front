import { useState, useEffect } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Button,
    useTheme,
    Avatar,
    Menu,
    MenuItem,
    Badge,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard,
    People,
    Settings,
    Assessment,
    Notifications,
    Brightness4,
    Brightness7,
    Logout,
    AccountCircle,
    SportsEsports,
    Store as StoreIcon,
    PhotoLibrary,
    Dashboard as DashboardIcon,
    AccountBalanceWallet,
    EmojiEvents,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Members from '../sidebar/Members';
import SettingsMenu from '../sidebar/SettingsMenu';
import notificationsAPI from '../services/notificationsService';

const drawerWidth = 260;

import { useLanguage } from '../context/LanguageContext';

function HomePage({ toggleTheme, isDarkMode, children }) {
    const theme = useTheme();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [lastNotificationCount, setLastNotificationCount] = useState(0);
    const { t } = useLanguage();

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            const data = await notificationsAPI.getAll();
            setNotifications(data);

            // Check for new notifications and show browser notification
            const unreadCount = data.filter(n => !n.is_read).length;
            if (unreadCount > lastNotificationCount && lastNotificationCount > 0) {
                const newNotifications = data.filter(n => !n.is_read).slice(0, unreadCount - lastNotificationCount);

                // Show browser notification if enabled
                const notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'true';
                if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
                    newNotifications.forEach(notification => {
                        new Notification(notification.title, {
                            body: notification.body,
                            icon: '/favicon.ico',
                            tag: `notification-${notification.id}`,
                        });
                    });
                }
            }
            setLastNotificationCount(unreadCount);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    // Poll for notifications every 30 seconds
    useEffect(() => {
        fetchNotifications(); // Initial fetch

        const interval = setInterval(() => {
            fetchNotifications();
        }, 30000); // 30 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [lastNotificationCount]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    const drawer = (
        <Box>
            <Box
                sx={{
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
            >
                <Avatar
                    sx={{
                        width: 48,
                        height: 48,
                        bgcolor: 'white',
                        color: '#667eea',
                        fontWeight: 700,
                    }}
                >
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                <Box>
                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                        {user.fullName || 'User'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {user.email || 'user@example.com'}
                    </Typography>
                </Box>
            </Box>

            <Divider />


            <List sx={{ px: 2, py: 2 }}>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                        onClick={() => navigate('/')}
                        sx={{
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? 'rgba(102, 126, 234, 0.15)'
                                    : 'rgba(102, 126, 234, 0.1)',
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: theme.palette.primary.main, minWidth: 40 }}>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={t('dashboard')}
                            primaryTypographyProps={{
                                fontWeight: 500,
                            }}
                        />
                    </ListItemButton>
                </ListItem>

                {/* Members Component with Submenu */}
                <Members />

                <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                        onClick={() => navigate('/games')}
                        sx={{
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? 'rgba(102, 126, 234, 0.15)'
                                    : 'rgba(102, 126, 234, 0.1)',
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: theme.palette.primary.main, minWidth: 40 }}>
                            <SportsEsports />
                        </ListItemIcon>
                        <ListItemText
                            primary="Games"
                            primaryTypographyProps={{
                                fontWeight: 500,
                            }}
                        />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                        onClick={() => navigate('/sponsors')}
                        sx={{
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? 'rgba(102, 126, 234, 0.15)'
                                    : 'rgba(102, 126, 234, 0.1)',
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: theme.palette.primary.main, minWidth: 40 }}>
                            <StoreIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={t('sponsors')}
                            primaryTypographyProps={{
                                fontWeight: 500,
                            }}
                        />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                        onClick={() => navigate('/memories')}
                        sx={{
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? 'rgba(102, 126, 234, 0.15)'
                                    : 'rgba(102, 126, 234, 0.1)',
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: theme.palette.primary.main, minWidth: 40 }}>
                            <PhotoLibrary />
                        </ListItemIcon>
                        <ListItemText
                            primary="Memories"
                            primaryTypographyProps={{
                                fontWeight: 500,
                            }}
                        />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                        onClick={() => navigate('/chitfund')}
                        sx={{
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? 'rgba(102, 126, 234, 0.15)'
                                    : 'rgba(102, 126, 234, 0.1)',
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: theme.palette.primary.main, minWidth: 40 }}>
                            <AccountBalanceWallet />
                        </ListItemIcon>
                        <ListItemText
                            primary="Chit Fund"
                            primaryTypographyProps={{
                                fontWeight: 500,
                            }}
                        />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                        onClick={() => navigate('/expenditures')}
                        sx={{
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? 'rgba(102, 126, 234, 0.15)'
                                    : 'rgba(102, 126, 234, 0.1)',
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: theme.palette.primary.main, minWidth: 40 }}>
                            <Assessment />
                        </ListItemIcon>
                        <ListItemText
                            primary="Expenditures"
                            primaryTypographyProps={{
                                fontWeight: 500,
                            }}
                        />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                        onClick={() => navigate('/quiz')}
                        sx={{
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? 'rgba(102, 126, 234, 0.15)'
                                    : 'rgba(102, 126, 234, 0.1)',
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: theme.palette.primary.main, minWidth: 40 }}>
                            <EmojiEvents />
                        </ListItemIcon>
                        <ListItemText
                            primary="Quiz"
                            primaryTypographyProps={{
                                fontWeight: 500,
                            }}
                        />
                    </ListItemButton>
                </ListItem>

                {/* Settings Component with Submenu */}
                <SettingsMenu />
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            {/* AppBar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    background: theme.palette.mode === 'dark'
                        ? theme.palette.background.paper
                        : 'white',
                    color: theme.palette.text.primary,
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 1px 3px rgba(0,0,0,0.3)'
                        : '0 1px 3px rgba(0,0,0,0.1)',
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Welcome to HT Portal
                    </Typography>

                    <IconButton onClick={toggleTheme} color="inherit" sx={{ mr: 1 }}>
                        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>

                    <IconButton
                        onClick={() => navigate('/settings/notifications')}
                        color="inherit"
                        sx={{ mr: 1 }}
                    >
                        <Badge
                            badgeContent={notifications.filter(n => !n.is_read).length}
                            color="error"
                            max={99}
                        >
                            <Notifications />
                        </Badge>
                    </IconButton>

                    <IconButton
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleProfileMenuClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={handleProfileMenuClose}>
                            <AccountCircle sx={{ mr: 1 }} /> {t('profile')}
                        </MenuItem>
                        <MenuItem onClick={handleProfileMenuClose}>
                            <Settings sx={{ mr: 1 }} /> {t('settings')}
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <Logout sx={{ mr: 1 }} /> {t('logout')}
                        </MenuItem>
                    </Menu>
                </Toolbar>

            </AppBar>

            {/* Sidebar Drawer */}
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                {/* Mobile drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Desktop drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    backgroundColor: theme.palette.background.default,
                }}
            >
                <Toolbar />

                {children ? (
                    children
                ) : (
                    <Box sx={{ mt: 4 }}>
                        {/* Empty Dashboard */}
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default HomePage;
