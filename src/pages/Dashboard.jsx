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
            sx={{
                minHeight: 200,
                borderRadius: 3,
                boxShadow: theme.palette.mode === 'dark'
                    ? '0 4px 12px rgba(0,0,0,0.3)'
                    : '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                },
            }}
        >
            <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                height: '100%',
            }}>
                <Avatar
                    variant="rounded"
                    sx={{
                        bgcolor: `${color}15`,
                        color: color,
                        width: 56,
                        height: 56,
                        mb: 2,
                    }}
                >
                    {icon}
                </Avatar>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {title}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
                {t('dashboard')}
            </Typography>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title={t('permanentMembers')}
                        count={stats.permanentMembers}
                        icon={<PeopleIcon fontSize="large" />}
                        color="#667eea"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title={t('temporaryMembers')}
                        count={stats.temporaryMembers}
                        icon={<PersonOutlineIcon fontSize="large" />}
                        color="#764ba2"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title={t('juniorMembers')}
                        count={stats.juniorMembers}
                        icon={<ChildCareIcon fontSize="large" />}
                        color="#EC4899"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title={t('sponsors')}
                        count={stats.sponsors}
                        icon={<StoreIcon fontSize="large" />}
                        color="#10B981"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title={t('winners')}
                        count={stats.winners}
                        icon={<TrophyIcon fontSize="large" />}
                        color="#F59E0B"
                    />
                </Grid>
            </Grid>

            {/* Announcements Section */}
            <Box sx={{ mt: 5 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                    {t('announcements')}
                </Typography>

                {/* Add Announcement Form - Only for Authorized Users */}
                {isAuthorized && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 4,
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <CampaignIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {editingId ? t('editAnnouncement') : t('addNewAnnouncement')}
                            </Typography>
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label={t('heading')}
                                    name="heading"
                                    value={formData.heading}
                                    onChange={handleInputChange}
                                    placeholder="Enter announcement heading"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label={t('year')}
                                    name="year"
                                    type="number"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    placeholder="Enter year"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label={t('description')}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter announcement description"
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        startIcon={editingId ? <EditIcon /> : <AddIcon />}
                                        onClick={handleAddAnnouncement}
                                        disabled={!formData.heading || !formData.year || !formData.description}
                                        sx={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)',
                                            },
                                        }}
                                    >
                                        {editingId ? t('update') : t('add')}
                                    </Button>
                                    {editingId && (
                                        <Button
                                            variant="outlined"
                                            onClick={handleCancelEdit}
                                        >
                                            {t('cancel')}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                )}

                {!isAuthorized && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        Only authorized users (Admin/Manager) can add or manage announcements.
                    </Alert>
                )}

                {/* Display Announcements */}
                <Grid container spacing={3}>
                    {announcements.map((announcement) => (
                        <Grid item xs={12} md={4} key={announcement.id}>
                            <Card
                                sx={{
                                    height: 280,
                                    borderRadius: 3,
                                    boxShadow: theme.palette.mode === 'dark'
                                        ? '0 4px 12px rgba(0,0,0,0.3)'
                                        : '0 4px 12px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                    },
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <CardContent sx={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    p: 3,
                                }}>
                                    {isAuthorized && (
                                        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEdit(announcement)}
                                                sx={{ color: theme.palette.primary.main }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(announcement.id)}
                                                sx={{ color: theme.palette.error.main }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    )}

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: 'rgba(102, 126, 234, 0.1)',
                                                color: theme.palette.primary.main,
                                                mr: 2,
                                            }}
                                        >
                                            <CampaignIcon />
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                {announcement.heading}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {t('year')}: {announcement.year}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ mb: 2 }} />

                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                        {announcement.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {announcements.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <CampaignIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            {t('noAnnouncements')}
                        </Typography>
                        {isAuthorized && (
                            <Typography variant="body2" color="text.secondary">
                                Add your first announcement using the form above
                            </Typography>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default Dashboard;
