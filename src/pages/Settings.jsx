import { useState, useEffect } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Paper,
    useTheme,
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
        <Box sx={{ p: 3 }}>
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 12px rgba(0,0,0,0.3)'
                        : '0 4px 12px rgba(0,0,0,0.1)',
                }}
            >   
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={currentTab}
                        onChange={handleTabChange}
                        aria-label="settings tabs"
                        sx={{
                            px: 2,
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                minHeight: 64,
                            },
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
            </Paper>
        </Box>
    );
}

export default Settings;
