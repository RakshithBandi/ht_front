import { useState, useEffect } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Paper,
    useTheme,
    Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    People,
    AccountCircle,
    Notifications,
    Language,
} from '@mui/icons-material';
import Users from './Users';
import Profile from './Profile';
import NotificationsPage from './NotificationsPage';
import LanguageSettings from './LanguageSettings';

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`settings-tabpanel-${index}`}
            aria-labelledby={`settings-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function Settings() {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState(0);

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/settings/users')) {
            setCurrentTab(1);
        } else if (path.includes('/settings/notifications')) {
            setCurrentTab(2);
        } else if (path.includes('/settings/language')) {
            setCurrentTab(3);
        } else {
            setCurrentTab(0);
        }
    }, [location.pathname]);

    const handleTabChange = (event, newValue) => {
        switch (newValue) {
            case 0:
                navigate('/settings/profile');
                break;
            case 1:
                navigate('/settings/users');
                break;
            case 2:
                navigate('/settings/notifications');
                break;
            case 3:
                navigate('/settings/language');
                break;
            default:
                break;
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                    Settings
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your account settings and preferences
                </Typography>
            </Box>

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
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={currentTab}
                        onChange={handleTabChange}
                        aria-label="settings tabs"
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            px: 2,
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                minHeight: 64,
                                mr: 2,
                                color: 'text.secondary',
                                '&.Mui-selected': {
                                    color: '#667eea',
                                }
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#667eea',
                                height: 3,
                                borderRadius: '3px 3px 0 0',
                            }
                        }}
                    >
                        <Tab
                            icon={<AccountCircle />}
                            iconPosition="start"
                            label="Profile"
                            id="settings-tab-0"
                            aria-controls="settings-tabpanel-0"
                        />
                        <Tab
                            icon={<People />}
                            iconPosition="start"
                            label="Users"
                            id="settings-tab-1"
                            aria-controls="settings-tabpanel-1"
                        />
                        <Tab
                            icon={<Notifications />}
                            iconPosition="start"
                            label="Notifications"
                            id="settings-tab-2"
                            aria-controls="settings-tabpanel-2"
                        />
                        <Tab
                            icon={<Language />}
                            iconPosition="start"
                            label="Language"
                            id="settings-tab-3"
                            aria-controls="settings-tabpanel-3"
                        />
                    </Tabs>
                </Box>

                <Box sx={{ minHeight: 400 }}>
                    <TabPanel value={currentTab} index={0}>
                        <Profile />
                    </TabPanel>

                    <TabPanel value={currentTab} index={1}>
                        <Users />
                    </TabPanel>

                    <TabPanel value={currentTab} index={2}>
                        <NotificationsPage />
                    </TabPanel>

                    <TabPanel value={currentTab} index={3}>
                        <LanguageSettings />
                    </TabPanel>
                </Box>
            </Paper>
        </Box>
    );
}

export default Settings;
