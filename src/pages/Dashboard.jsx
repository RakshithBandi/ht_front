import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    useTheme,
    Avatar,
    TextField,
    Button,
    IconButton,
    Paper,
    Divider,
    Alert,
} from '@mui/material';
import {
    People as PeopleIcon,
    PersonOutline as PersonOutlineIcon,
    Store as StoreIcon,
    EmojiEvents as TrophyIcon,
    ChildCare as ChildCareIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Campaign as CampaignIcon,
} from '@mui/icons-material';
import { useAuth } from '../services/authComponents';
import { useLanguage } from '../context/LanguageContext';
import dashboardService from '../services/dashboardService';

function Dashboard() {
    const theme = useTheme();
    const { isAuthorized } = useAuth();
    const { t } = useLanguage();
    const [stats, setStats] = useState({
        permanentMembers: 0,
        temporaryMembers: 0,
        juniorMembers: 0,
        sponsors: 0,
        winners: 0,
    });

    const [announcements, setAnnouncements] = useState([]);
    const [formData, setFormData] = useState({
        heading: '',
        year: new Date().getFullYear().toString(),
        description: '',
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [statsData, announcementsData] = await Promise.all([
                dashboardService.getStats(),
                dashboardService.getAnnouncements()
            ]);
            setStats(statsData);
            setAnnouncements(announcementsData);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddAnnouncement = async () => {
        if (!formData.heading || !formData.year || !formData.description) {
            return;
        }

        try {
            const announcementData = {
                heading: formData.heading,
                year: formData.year,
                description: formData.description,
            };

            if (editingId) {
                await dashboardService.updateAnnouncement(editingId, announcementData);
            } else {
                const newAnnouncement = await dashboardService.createAnnouncement(announcementData);
                // Send notification for new announcement
                sendNotification(newAnnouncement);
            }

            // Reload data to get fresh list
            await loadDashboardData();

            // Reset form
            setFormData({
                heading: '',
                year: new Date().getFullYear().toString(),
                description: '',
            });
            setEditingId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const sendNotification = (announcement) => {
        // Check if notifications are enabled
        const notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'true';

        // Send browser notification if enabled and permission granted
        if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
            new Notification('New Announcement!', {
                body: `${announcement.heading} - ${announcement.description.substring(0, 100)}${announcement.description.length > 100 ? '...' : ''}`,
                icon: '/favicon.ico',
                tag: `announcement-${announcement.id}`,
            });
        }

        // Store notification in localStorage for notifications page
        const userNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
        const newNotification = {
            id: Date.now(),
            title: `New Announcement: ${announcement.heading}`,
            body: announcement.description,
            timestamp: new Date().toISOString(),
            isNew: true,
            announcementId: announcement.id,
        };

        const updatedNotifications = [newNotification, ...userNotifications];
        localStorage.setItem('userNotifications', JSON.stringify(updatedNotifications));
    };

    const handleEdit = (announcement) => {
        setFormData({
            heading: announcement.heading,
            year: announcement.year,
            description: announcement.description,
        });
        setEditingId(announcement.id);
    };

    const handleDelete = async (id) => {
        try {
            await dashboardService.deleteAnnouncement(id);
            await loadDashboardData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancelEdit = () => {
        setFormData({
            heading: '',
            year: new Date().getFullYear().toString(),
            description: '',
        });
        setEditingId(null);
    };

    const StatCard = ({ title, count, icon, color }) => (
        <Card
            elevation={0}
            sx={{
                height: '100%',
                borderRadius: 4,
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                    : '#ffffff',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 32px rgba(0,0,0,0.2)'
                    : '0 8px 32px rgba(0,0,0,0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 12px 40px rgba(0,0,0,0.3)'
                        : '0 12px 40px rgba(0,0,0,0.1)',
                    borderColor: `${color}80`,
                },
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Box sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
                borderRadius: '50%',
            }} />

            <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                    variant="rounded"
                    sx={{
                        bgcolor: `${color}15`,
                        color: color,
                        width: 60,
                        height: 60,
                        borderRadius: 3,
                    }}
                >
                    {icon}
                </Avatar>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 0 }}>
                        {count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>
                        {title.toUpperCase()}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1600, mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    {t('dashboard')}
                </Typography>
            </Box>

            {/* Stats Grid - Fixed Grid Syntax */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 3,
                mb: 6
            }}>
                <StatCard
                    title={t('permanentMembers')}
                    count={stats.permanentMembers}
                    icon={<PeopleIcon fontSize="medium" />}
                    color="#6366f1"
                />
                <StatCard
                    title={t('temporaryMembers')}
                    count={stats.temporaryMembers}
                    icon={<PersonOutlineIcon fontSize="medium" />}
                    color="#8b5cf6"
                />
                <StatCard
                    title={t('juniorMembers')}
                    count={stats.juniorMembers}
                    icon={<ChildCareIcon fontSize="medium" />}
                    color="#ec4899"
                />
                <StatCard
                    title={t('sponsors')}
                    count={stats.sponsors}
                    icon={<StoreIcon fontSize="medium" />}
                    color="#10b981"
                />
                <StatCard
                    title={t('winners')}
                    count={stats.winners}
                    icon={<TrophyIcon fontSize="medium" />}
                    color="#f59e0b"
                />
            </Box>

            {/* Announcements Section */}
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {t('announcements')}
                    </Typography>
                </Box>

                {/* Add Announcement Form */}
                {isAuthorized && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 4,
                            borderRadius: 4,
                            border: '1px solid',
                            borderColor: theme.palette.divider,
                            background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#fff',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                                <CampaignIcon />
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {editingId ? t('editAnnouncement') : t('addNewAnnouncement')}
                            </Typography>
                        </Box>

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                            gap: 3
                        }}>
                            <TextField
                                fullWidth
                                label={t('heading')}
                                name="heading"
                                value={formData.heading}
                                onChange={handleInputChange}
                                placeholder="Enter heading"
                                variant="outlined"
                            />
                            <TextField
                                fullWidth
                                label={t('year')}
                                name="year"
                                type="number"
                                value={formData.year}
                                onChange={handleInputChange}
                                placeholder="Year"
                                variant="outlined"
                            />
                            <Box sx={{ gridColumn: '1 / -1' }}>
                                <TextField
                                    fullWidth
                                    label={t('description')}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter description"
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                />
                            </Box>
                            <Box sx={{ gridColumn: '1 / -1', display: 'flex', gap: 1 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleAddAnnouncement}
                                    disabled={!formData.heading || !formData.year || !formData.description}
                                    sx={{
                                        px: 4,
                                        py: 1.2,
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)',
                                        background: theme.palette.primary.main,
                                    }}
                                >
                                    {editingId ? t('update') : t('add')}
                                </Button>
                                {editingId && (
                                    <Button
                                        variant="text"
                                        onClick={handleCancelEdit}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        {t('cancel')}
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Paper>
                )}

                {/* Announcements Grid */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 3
                }}>
                    {announcements.map((announcement) => (
                        <Card
                            key={announcement.id}
                            elevation={0}
                            sx={{
                                height: '100%',
                                minHeight: 250,
                                borderRadius: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                background: theme.palette.mode === 'dark'
                                    ? 'rgba(255,255,255,0.03)'
                                    : '#ffffff',
                                border: '1px solid',
                                borderColor: theme.palette.divider,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                                    borderColor: theme.palette.primary.main,
                                },
                            }}
                        >
                            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Box sx={{
                                            width: 4,
                                            height: 40,
                                            borderRadius: 2,
                                            bgcolor: theme.palette.primary.main
                                        }} />
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                                {announcement.heading}
                                            </Typography>
                                            <Typography variant="caption" sx={{
                                                display: 'inline-block',
                                                mt: 0.5,
                                                px: 1,
                                                py: 0.25,
                                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                                borderRadius: 1,
                                                fontWeight: 600
                                            }}>
                                                {announcement.year}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {isAuthorized && (
                                        <Box>
                                            <IconButton size="small" onClick={() => handleEdit(announcement)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => handleDelete(announcement.id)} color="error">
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>

                                <Typography variant="body2" color="text.secondary" sx={{ flex: 1, lineHeight: 1.7 }}>
                                    {announcement.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {announcements.length === 0 && (
                    <Box sx={{
                        textAlign: 'center',
                        py: 8,
                        bgcolor: theme.palette.action.hover,
                        borderRadius: 4,
                        border: '1px dashed',
                        borderColor: theme.palette.divider
                    }}>
                        <CampaignIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            {t('noAnnouncements')}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default Dashboard;
