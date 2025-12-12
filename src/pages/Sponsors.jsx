import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Card,
    CardContent,
    Grid,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    useTheme,
    Avatar,
    Divider,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Store as StoreIcon,
} from '@mui/icons-material';
import { useAuth } from '../services/authComponents';
import sponsorsAPI from '../services/sponsorsService';

function Sponsors() {
    const theme = useTheme();
    const [sponsors, setSponsors] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingSponsor, setEditingSponsor] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
    });
    const { isAuthorized } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSponsors();
    }, []);

    const loadSponsors = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await sponsorsAPI.getAll();
            setSponsors(data);
        } catch (err) {
            setError('Failed to load sponsors');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = () => {
        setFormData({
            name: '',
            description: '',
            image: '',
        });
        setEditingSponsor(null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingSponsor(null);
        setFormData({
            name: '',
            description: '',
            image: '',
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    image: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const sponsorData = {
                name: formData.name,
                description: formData.description,
                image: formData.image || '',
            };

            if (editingSponsor) {
                const updatedSponsor = await sponsorsAPI.update(editingSponsor.id, sponsorData);
                setSponsors(prev => prev.map(s => s.id === editingSponsor.id ? updatedSponsor : s));
            } else {
                const newSponsor = await sponsorsAPI.create(sponsorData);
                setSponsors(prev => [newSponsor, ...prev]);
            }

            handleCloseDialog();
        } catch (err) {
            console.error(err);
            alert("Failed to save sponsor. Please try again.");
        }
    };

    const handleEdit = (sponsor) => {
        setEditingSponsor(sponsor);
        setFormData({
            name: sponsor.name,
            description: sponsor.description,
            image: sponsor.image || '',
        });
        setOpenDialog(true);
    };

    const handleDelete = async (sponsorId) => {
        if (!window.confirm("Are you sure you want to delete this sponsor?")) return;
        try {
            await sponsorsAPI.delete(sponsorId);
            setSponsors(prev => prev.filter(s => s.id !== sponsorId));
        } catch (err) {
            console.error(err);
            alert("Failed to delete sponsor. Please try again.");
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1600, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    Sponsors
                </Typography>
                {isAuthorized && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenDialog}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            boxShadow: '0 4px 14px 0 rgba(118, 75, 162, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 6px 20px 0 rgba(118, 75, 162, 0.4)',
                            },
                        }}
                    >
                        Add Sponsor
                    </Button>
                )}
            </Box>

            {!isAuthorized && (
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                    You don't have permission to add, edit, or delete sponsors. Only authorized users can perform these actions.
                </Alert>
            )}

            {/* Sponsors Grid - Fixed Grid Syntax */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 3,
                animation: 'fadeIn 0.5s ease-in-out',
                '@keyframes fadeIn': {
                    '0%': { opacity: 0, transform: 'translateY(20px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                }
            }}>
                {sponsors.map((sponsor) => (
                    <Card
                        key={sponsor.id}
                        elevation={0}
                        sx={{
                            height: '100%',
                            minHeight: 400,
                            borderRadius: 4,
                            position: 'relative',
                            background: theme.palette.mode === 'dark'
                                ? 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                                : '#ffffff',
                            border: '1px solid',
                            borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: theme.palette.mode === 'dark'
                                    ? '0 20px 40px rgba(0,0,0,0.4)'
                                    : '0 20px 40px rgba(0,0,0,0.1)',
                                '& .sponsor-actions': {
                                    opacity: 1,
                                    transform: 'translateY(0)',
                                }
                            },
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'visible',
                        }}
                    >
                        <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {/* Header Background */}
                            <Box sx={{
                                height: 120,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '16px 16px 0 0',
                                position: 'relative',
                                mb: 6
                            }}>
                                {/* Sponsor Image */}
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: -50,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    p: 0.5,
                                    bgcolor: theme.palette.background.paper,
                                    borderRadius: 3,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                }}>
                                    <Avatar
                                        src={sponsor.image}
                                        alt={sponsor.name}
                                        variant="rounded"
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            fontSize: '3rem',
                                            background: sponsor.image
                                                ? 'transparent'
                                                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            borderRadius: 2.5
                                        }}
                                    >
                                        {!sponsor.image && sponsor.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                </Box>

                                {/* Edit/Delete Buttons */}
                                {isAuthorized && (
                                    <Box
                                        className="sponsor-actions"
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            opacity: 0,
                                            transition: 'all 0.3s ease',
                                            transform: 'translateY(-10px)',
                                            display: 'flex',
                                            gap: 1
                                        }}
                                    >
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEdit(sponsor)}
                                            sx={{
                                                bgcolor: 'rgba(255,255,255,0.2)',
                                                color: '#fff',
                                                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                                            }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(sponsor.id)}
                                            sx={{
                                                bgcolor: 'rgba(255,0,0,0.2)',
                                                color: '#fff',
                                                '&:hover': { bgcolor: 'rgba(255,0,0,0.4)' }
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                )}
                            </Box>

                            <Box sx={{
                                px: 3,
                                pb: 4,
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, textAlign: 'center' }}>
                                    {sponsor.name}
                                </Typography>

                                <Divider sx={{ width: 40, borderBottomWidth: 3, borderRadius: 1, borderColor: '#667eea', mb: 3 }} />

                                {/* Description */}
                                <Box sx={{
                                    width: '100%',
                                    p: 2.5,
                                    borderRadius: 3,
                                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                    border: '1px solid',
                                    borderColor: theme.palette.divider,
                                    flex: 1
                                }}>
                                    <Typography variant="body2" color="text.secondary" sx={{
                                        textAlign: 'center',
                                        lineHeight: 1.6
                                    }}>
                                        {sponsor.description}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {sponsors.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No sponsors added yet
                    </Typography>
                </Box>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingSponsor ? 'Edit Sponsor' : 'Add Sponsor'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* Image Upload */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Avatar
                                src={formData.image}
                                variant="rounded"
                                sx={{
                                    width: 120,
                                    height: 120,
                                    fontSize: '3rem',
                                    background: formData.image
                                        ? 'transparent'
                                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                }}
                            >
                                {!formData.image && (formData.name ? formData.name.charAt(0).toUpperCase() : 'S')}
                            </Avatar>
                            <Button
                                variant="outlined"
                                component="label"
                                sx={{ textTransform: 'none' }}
                            >
                                Upload Sponsor Image
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                />
                            </Button>
                        </Box>

                        <TextField
                            fullWidth
                            label="Sponsor Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={handleCloseDialog}
                        startIcon={<CancelIcon />}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        startIcon={<SaveIcon />}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)',
                            },
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Sponsors;
