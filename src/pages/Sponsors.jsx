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
                await sponsorsAPI.update(editingSponsor.id, sponsorData);
            } else {
                await sponsorsAPI.create(sponsorData);
            }

            await loadSponsors();
            handleCloseDialog();
        } catch (err) {
            console.error(err);
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
        try {
            await sponsorsAPI.delete(sponsorId);
            await loadSponsors();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Sponsors
                </Typography>
                {isAuthorized && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenDialog}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)',
                            },
                        }}
                    >
                        Add Sponsor
                    </Button>
                )}
            </Box>

            {!isAuthorized && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    You don't have permission to add, edit, or delete sponsors. Only authorized users can perform these actions.
                </Alert>
            )}

            {/* Sponsors Grid */}
            <Grid container spacing={3}>
                {sponsors.map((sponsor) => (
                    <Grid item xs={12} sm={6} md={4} key={sponsor.id}>
                        <Card
                            sx={{
                                height: 400,
                                borderRadius: 3,
                                position: 'relative',
                                boxShadow: theme.palette.mode === 'dark'
                                    ? '0 4px 12px rgba(0,0,0,0.3)'
                                    : '0 4px 12px rgba(0,0,0,0.1)',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                },
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <CardContent sx={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                p: 3,
                            }}>
                                {/* Edit/Delete Buttons */}
                                {isAuthorized && (
                                    <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEdit(sponsor)}
                                            sx={{ color: theme.palette.primary.main }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(sponsor.id)}
                                            sx={{ color: theme.palette.error.main }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                )}

                                {/* Sponsor Image */}
                                <Box sx={{ mb: 2 }}>
                                    <Avatar
                                        src={sponsor.image}
                                        alt={sponsor.name}
                                        variant="rounded"
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            fontSize: '3rem',
                                            background: sponsor.image
                                                ? 'transparent'
                                                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        }}
                                    >
                                        {!sponsor.image && sponsor.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                </Box>

                                {/* Sponsor Name */}
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                    {sponsor.name}
                                </Typography>

                                <Divider sx={{ mb: 2, width: '100%' }} />

                                {/* Description */}
                                <Typography variant="body2" color="text.secondary">
                                    {sponsor.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

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
