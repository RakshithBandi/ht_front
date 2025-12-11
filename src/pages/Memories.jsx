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
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1600, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    Memories
                </Typography>
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

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 3,
                    animation: 'fadeIn 0.5s ease-in-out',
                    '@keyframes fadeIn': {
                        '0%': { opacity: 0, transform: 'translateY(20px)' },
                        '100%': { opacity: 1, transform: 'translateY(0)' },
                    }
                }}>
                    {memories.images.map((memory) => (
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
                    ))}
                    {memories.images.length === 0 && (
                        <Box sx={{ gridColumn: '1/-1', textAlign: 'center', py: 8 }}>
                            <Typography variant="body1" color="text.secondary">
                                No memories captured yet.
                            </Typography>
                        </Box>
                    )}
                </Box>
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

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: 3
                }}>
                    {memories.videos.map((memory) => (
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
                    ))}
                    {memories.videos.length === 0 && (
                        <Box sx={{ gridColumn: '1/-1', textAlign: 'center', py: 8 }}>
                            <Typography variant="body1" color="text.secondary">
                                No videos uploaded yet.
                            </Typography>
                        </Box>
                    )}
                </Box>
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
