import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardMedia,
    CardContent,
    Grid,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    useTheme,
    Tabs,
    Tab,
    TextField,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
    Image as ImageIcon,
    Videocam as VideoIcon,
    CloudUpload as UploadIcon,
} from '@mui/icons-material';
import { useAuth } from '../services/authComponents';
import memoriesAPI from '../services/memoriesService';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`memories-tabpanel-${index}`}
            aria-labelledby={`memories-tab-${index}`}
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

function Memories() {
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);
    const [memories, setMemories] = useState({ images: [], videos: [] });
    const [openDialog, setOpenDialog] = useState(false);
    const [uploadType, setUploadType] = useState('image'); // 'image' or 'video'
    const [formData, setFormData] = useState({
        title: '',
        file: '',
        type: '', // 'image' or 'video'
    });
    const { isAuthorized } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadMemories();
    }, []);

    const loadMemories = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await memoriesAPI.getAll();
            // Separate into images and videos
            const images = data.filter(m => m.type === 'image');
            const videos = data.filter(m => m.type === 'video');
            setMemories({ images, videos });
        } catch (err) {
            setError('Failed to load memories');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleOpenDialog = (type) => {
        setUploadType(type);
        setFormData({
            title: '',
            file: '',
            type: type,
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({
            title: '',
            file: '',
            type: '',
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
            // Basic validation for file size (limit to 5MB for localStorage sake)
            if (file.size > 5 * 1024 * 1024) {
                console.error("File is too large! Please upload files smaller than 5MB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    file: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const memoryData = {
                title: formData.title,
                file: formData.file,
                type: uploadType,
            };

            await memoriesAPI.create(memoryData);
            await loadMemories();
            handleCloseDialog();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id, type) => {
        try {
            await memoriesAPI.delete(id);
            await loadMemories();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Memories
                </Typography>
            </Box>

            {!isAuthorized && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    You don't have permission to delete memories. Only authorized users can perform this action.
                </Alert>
            )}

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="memories tabs">
                    <Tab icon={<ImageIcon />} label="Images" iconPosition="start" />
                    <Tab icon={<VideoIcon />} label="Videos" iconPosition="start" />
                </Tabs>
            </Box>

            {/* Images Tab */}
            <TabPanel value={tabValue} index={0}>
                <Box sx={{ mb: 3 }}>
                    <Button
                        variant="contained"
                        startIcon={<UploadIcon />}
                        onClick={() => handleOpenDialog('image')}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                    >
                        Upload Image
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {memories.images.map((memory) => (
                        <Grid item xs={12} sm={6} md={4} key={memory.id}>
                            <Card sx={{ position: 'relative', borderRadius: 2, minHeight: 300 }}>
                                {isAuthorized && (
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDelete(memory.id, 'image')}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            bgcolor: 'rgba(0,0,0,0.5)',
                                            color: 'white',
                                            '&:hover': { bgcolor: 'rgba(255,0,0,0.7)' }
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                )}
                                <CardMedia
                                    component="img"
                                    height="250"
                                    image={memory.file}
                                    alt={memory.title}
                                    sx={{ objectFit: 'cover' }}
                                />
                                <CardContent>
                                    <Typography variant="subtitle1" noWrap>
                                        {memory.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(memory.createdAt).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    {memories.images.length === 0 && (
                        <Grid item xs={12}>
                            <Typography variant="body1" color="text.secondary" align="center">
                                No images uploaded yet.
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </TabPanel>

            {/* Videos Tab */}
            <TabPanel value={tabValue} index={1}>
                <Box sx={{ mb: 3 }}>
                    <Button
                        variant="contained"
                        startIcon={<UploadIcon />}
                        onClick={() => handleOpenDialog('video')}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                    >
                        Upload Video
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {memories.videos.map((memory) => (
                        <Grid item xs={12} sm={6} md={4} key={memory.id}>
                            <Card sx={{ position: 'relative', borderRadius: 2, minHeight: 300 }}>
                                {isAuthorized && (
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDelete(memory.id, 'video')}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            zIndex: 1,
                                            bgcolor: 'rgba(0,0,0,0.5)',
                                            color: 'white',
                                            '&:hover': { bgcolor: 'rgba(255,0,0,0.7)' }
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                )}
                                <CardMedia
                                    component="video"
                                    height="250"
                                    src={memory.file}
                                    controls
                                    sx={{ objectFit: 'cover', bgcolor: 'black' }}
                                />
                                <CardContent>
                                    <Typography variant="subtitle1" noWrap>
                                        {memory.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(memory.createdAt).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    {memories.videos.length === 0 && (
                        <Grid item xs={12}>
                            <Typography variant="body1" color="text.secondary" align="center">
                                No videos uploaded yet.
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </TabPanel>

            {/* Upload Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Upload {uploadType === 'image' ? 'Image' : 'Video'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />

                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            sx={{ height: 100, borderStyle: 'dashed' }}
                        >
                            <Box sx={{ textAlign: 'center' }}>
                                <UploadIcon sx={{ fontSize: 40, mb: 1 }} />
                                <Typography>
                                    Click to select {uploadType}
                                </Typography>
                            </Box>
                            <input
                                type="file"
                                hidden
                                accept={uploadType === 'image' ? "image/*" : "video/*"}
                                onChange={handleFileUpload}
                            />
                        </Button>

                        {formData.file && (
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <Typography variant="body2" color="success.main">
                                    File selected successfully!
                                </Typography>
                                {uploadType === 'image' && (
                                    <Box
                                        component="img"
                                        src={formData.file}
                                        alt="Preview"
                                        sx={{ mt: 1, maxHeight: 200, maxWidth: '100%', borderRadius: 1 }}
                                    />
                                )}
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseDialog} startIcon={<CloseIcon />}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={!formData.file || !formData.title}
                        startIcon={<UploadIcon />}
                    >
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Memories;
