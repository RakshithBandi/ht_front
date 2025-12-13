import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Grid,
    Card,
    CardMedia,
    CardContent,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    useTheme,
    InputAdornment
} from '@mui/material';
import {
    Image as ImageIcon,
    Videocam as VideoIcon,
    CloudUpload as UploadIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import memoriesAPI from '../services/memoriesService';
import { useAuth } from '../services/authComponents';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div 
            role="tabpanel"
            hidden={value !== index}
            id={`memory-tabpanel-${index}`}
            aria-labelledby={`memory-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
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
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [uploadType, setUploadType] = useState('image'); // 'image' or 'video'
    const [formData, setFormData] = useState({
        title: '',
        file: '',
        type: '', // 'image' or 'video'
    });
    const { isAuthorized } = useAuth();
    const [loading, setLoading] = useState(true);
    const [compressing, setCompressing] = useState(false);
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
        setCompressing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Helper to convert data URL to File
    const dataURLtoFile = (dataurl, filename) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validation: 50MB limit
            if (file.size > 50 * 1024 * 1024) {
                alert("File is too large! Please upload files smaller than 50MB.");
                return;
            }

            try {
                if (uploadType === 'image') {
                    setCompressing(true);
                    const { compressImage } = await import('../utils/imageCompression');
                    // Increased quality/size as per user request: 1280px width, 0.8 quality
                    const compressedBase64 = await compressImage(file, 1280, 0.8);
                    const compressedFile = dataURLtoFile(compressedBase64, file.name);

                    setFormData(prev => ({
                        ...prev,
                        file: compressedFile
                    }));
                } else {
                    // For videos, use the file directly
                    setFormData(prev => ({
                        ...prev,
                        file: file
                    }));
                }
            } catch (err) {
                console.error("Error processing file:", err);
                alert("Error processing file. Please try again.");
            } finally {
                setCompressing(false);
            }
        }
    };

    const handleSave = async () => {
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('type', uploadType);
            data.append('file', formData.file);

            const newMemory = await memoriesAPI.create(data);

            setMemories(prev => {
                const updated = { ...prev };
                if (uploadType === 'image') {
                    updated.images = [newMemory, ...updated.images];
                } else {
                    updated.videos = [newMemory, ...updated.videos];
                }
                return updated;
            });

            // Force refresh to ensure data consistency
            await loadMemories();

            handleCloseDialog();
        } catch (err) {
            console.error(err);
            let errorMessage = "Failed to upload memory.";
            if (err.response && err.response.data) {
                if (typeof err.response.data === 'object') {
                    // Convert object errors (like validation errors) to string
                    errorMessage = Object.entries(err.response.data)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join('\n');
                } else {
                    errorMessage = err.response.data;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }
            alert(`Upload Failed:\n${errorMessage}`);
        }
    };

    const handleDelete = async (id, type) => {
        try {
            await memoriesAPI.delete(id);

            setMemories(prev => {
                const updated = { ...prev };
                if (type === 'image') {
                    updated.images = updated.images.filter(m => m.id !== id);
                } else {
                    updated.videos = updated.videos.filter(m => m.id !== id);
                }
                return updated;
            });
        } catch (err) {
            console.error(err);
            alert("Failed to delete memory. Please try again.");
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1600, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    Memories
                </Typography>
                <TextField
                    variant="outlined"
                    placeholder="Search memories..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ bgcolor: 'background.paper', borderRadius: 2, minWidth: { xs: '100%', sm: 300 }, display: { xs: 'none', sm: 'flex' } }}
                />
            </Box>

            {/* Mobile Search Bar */}
            <Box sx={{ mb: 3, display: { xs: 'block', sm: 'none' } }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search memories..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
                />
            </Box>

            {!isAuthorized && (
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                    You don't have permission to delete memories. Only authorized users can perform this action.
                </Alert>
            )}

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="memories tabs"
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '1rem',
                            minHeight: 48,
                            mr: 2,
                        },
                        '& .Mui-selected': {
                            color: '#667eea !important',
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#667eea',
                            height: 3,
                            borderRadius: '3px 3px 0 0',
                        }
                    }}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab icon={<ImageIcon />} label="Gallery" iconPosition="start" />
                    <Tab icon={<VideoIcon />} label="Videos" iconPosition="start" />
                </Tabs>
            </Box>

            {/* Images Tab */}
            <TabPanel value={tabValue} index={0}>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        startIcon={<UploadIcon />}
                        onClick={() => handleOpenDialog('image')}
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
                        Upload Image
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {memories.images
                        .filter(memory => memory.title.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((memory) => (
                            <Grid size={{ xs: 12, sm: 12, md: 6 }} key={memory.id}>
                                <Card
                                    key={memory.id}
                                    elevation={0}
                                    sx={{
                                        position: 'relative',
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        background: 'transparent',
                                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            '& .memory-overlay': {
                                                opacity: 1
                                            },
                                            '& .memory-img': {
                                                transform: 'scale(1.05)'
                                            }
                                        }
                                    }}
                                >
                                    <Box sx={{ position: 'relative', pt: '75%', overflow: 'hidden', borderRadius: 4 }}>
                                        <CardMedia
                                            component="img"
                                            image={memory.file}
                                            alt={memory.title}
                                            className="memory-img"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.5s ease',
                                            }}
                                        />
                                        <Box
                                            className="memory-overlay"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)',
                                                opacity: 0.8,
                                                transition: 'opacity 0.3s ease',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'flex-end',
                                                p: 2
                                            }}
                                        >
                                            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }} noWrap>
                                                {memory.title}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                                {new Date(memory.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </Typography>
                                        </Box>

                                        {isAuthorized && (
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(memory.id, 'image')}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    bgcolor: 'rgba(255,255,255,0.2)',
                                                    color: 'white',
                                                    backdropFilter: 'blur(4px)',
                                                    '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.8)' }
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    {memories.images.length === 0 && (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 8 }}>
                            <Typography variant="body1" color="text.secondary">
                                No memories captured yet.
                            </Typography>
                        </Box>
                    )}
                </Grid>
            </TabPanel>

            {/* Videos Tab */}
            <TabPanel value={tabValue} index={1}>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        startIcon={<UploadIcon />}
                        onClick={() => handleOpenDialog('video')}
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
                        Upload Video
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {memories.videos
                        .filter(memory => memory.title.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((memory) => (
                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }} key={memory.id}>
                                <Card
                                    key={memory.id}
                                    elevation={0}
                                    sx={{
                                        position: 'relative',
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        border: '1px solid',
                                        borderColor: theme.palette.divider
                                    }}
                                >
                                    {isAuthorized && (
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(memory.id, 'video')}
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                zIndex: 2,
                                                bgcolor: 'rgba(0,0,0,0.5)',
                                                color: 'white',
                                                '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.8)' }
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    <CardMedia
                                        component="video"
                                        height="220"
                                        src={memory.file}
                                        controls
                                        sx={{ objectFit: 'cover', bgcolor: '#000' }}
                                    />
                                    <CardContent sx={{ p: 2 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }} noWrap>
                                            {memory.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <VideoIcon sx={{ fontSize: 14 }} />
                                            {new Date(memory.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    {memories.videos.length === 0 && (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 8 }}>
                            <Typography variant="body1" color="text.secondary">
                                No videos uploaded yet.
                            </Typography>
                        </Box>
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
                            disabled={compressing}
                            sx={{ height: 100, borderStyle: 'dashed' }}
                        >
                            <Box sx={{ textAlign: 'center' }}>
                                {compressing ? (
                                    <Typography>Compressing image, please wait...</Typography>
                                ) : (
                                    <>
                                        <UploadIcon sx={{ fontSize: 40, mb: 1 }} />
                                        <Typography>
                                            Click to select {uploadType}
                                        </Typography>
                                    </>
                                )}
                            </Box>
                            <input
                                type="file"
                                hidden
                                accept={uploadType === 'image' ? "image/*" : "video/*"}
                                onChange={handleFileUpload}
                            />
                        </Button>

                        {formData.file && !compressing && (
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <Typography variant="body2" color="success.main">
                                    File selected successfully!
                                </Typography>
                                {uploadType === 'image' && formData.file instanceof File && (
                                    <Box
                                        component="img"
                                        src={URL.createObjectURL(formData.file)}
                                        alt="Preview"
                                        sx={{ mt: 1, maxHeight: 200, maxWidth: '100%', borderRadius: 1 }}
                                        onLoad={(e) => URL.revokeObjectURL(e.target.src)}
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
                        disabled={!formData.file || !formData.title || compressing}
                        startIcon={<UploadIcon />}
                    >
                        {compressing ? 'Compressing...' : 'Upload'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Memories;
