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
    Chip,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    EmojiEvents as TrophyIcon,
    People as PeopleIcon,
} from '@mui/icons-material';
import { useAuth } from '../services/authComponents';
import gamesAPI from '../services/gamesService';

function Games() {
    const theme = useTheme();
    const [games, setGames] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingGame, setEditingGame] = useState(null);
    const [formData, setFormData] = useState({
        gameName: '',
        participantsCount: '',
        description: '',
        winnerName: '',
        winnerImage: '',
    });
    const { isAuthorized } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load games from API
    useEffect(() => {
        loadGames();
    }, []);

    const loadGames = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await gamesAPI.getAll();
            setGames(data);
        } catch (err) {
            setError('Failed to load games');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = () => {
        setFormData({
            gameName: '',
            participantsCount: '',
            description: '',
            winnerName: '',
            winnerImage: '',
        });
        setEditingGame(null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingGame(null);
        setFormData({
            gameName: '',
            participantsCount: '',
            description: '',
            winnerName: '',
            winnerImage: '',
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
                    winnerImage: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const gameData = {
                gameName: formData.gameName,
                participantsCount: parseInt(formData.participantsCount) || 0,
                description: formData.description,
                winnerName: formData.winnerName,
                winnerImage: formData.winnerImage || '',
            };

            if (editingGame) {
                await gamesAPI.update(editingGame.id, gameData);
            } else {
                await gamesAPI.create(gameData);
            }

            await loadGames();
            handleCloseDialog();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (game) => {
        setEditingGame(game);
        setFormData({
            gameName: game.gameName,
            participantsCount: game.participantsCount.toString(),
            description: game.description,
            winnerName: game.winnerName,
            winnerImage: game.winnerImage || '',
        });
        setOpenDialog(true);
    };

    const handleDelete = async (gameId) => {
        try {
            await gamesAPI.delete(gameId);
            await loadGames();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Games
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
                        Add Game
                    </Button>
                )}
            </Box>

            {!isAuthorized && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    You don't have permission to add, edit, or delete games. Only authorized users can perform these actions.
                </Alert>
            )}

            {/* Games Grid */}
            <Grid container spacing={3}>
                {games.map((game) => (
                    <Grid item xs={12} sm={6} md={4} key={game.id}>
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
                                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEdit(game)}
                                            sx={{ color: theme.palette.primary.main }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(game.id)}
                                            sx={{ color: theme.palette.error.main }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                )}

                                {/* Game Name */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <TrophyIcon sx={{ color: theme.palette.primary.main }} />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {game.gameName}
                                    </Typography>
                                </Box>

                                {/* Participants Count */}
                                <Box sx={{ mb: 2 }}>
                                    <Chip
                                        icon={<PeopleIcon />}
                                        label={`${game.participantsCount} Participants`}
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                    />
                                </Box>

                                {/* Description */}
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {game.description}
                                </Typography>

                                <Divider sx={{ mb: 2, width: '100%' }} />

                                {/* Winner Section */}
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        background: theme.palette.mode === 'dark'
                                            ? 'rgba(255, 215, 0, 0.1)'
                                            : 'rgba(255, 215, 0, 0.15)',
                                        border: '2px solid',
                                        borderColor: theme.palette.mode === 'dark'
                                            ? 'rgba(255, 215, 0, 0.3)'
                                            : 'rgba(255, 215, 0, 0.5)',
                                        width: '100%',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                                        {/* Winner Image */}
                                        <Avatar
                                            src={game.winnerImage}
                                            alt={game.winnerName}
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                border: '3px solid gold',
                                                background: game.winnerImage
                                                    ? 'transparent'
                                                    : 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                            }}
                                        >
                                            {!game.winnerImage && game.winnerName.charAt(0).toUpperCase()}
                                        </Avatar>

                                        {/* Winner Info */}
                                        <Box>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                                🏆 Winner
                                            </Typography>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#FFD700' }}>
                                                {game.winnerName}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {games.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No games added yet
                    </Typography>
                </Box>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingGame ? 'Edit Game' : 'Add Game'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Game Name"
                            name="gameName"
                            value={formData.gameName}
                            onChange={handleInputChange}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Number of Participants"
                            name="participantsCount"
                            type="number"
                            value={formData.participantsCount}
                            onChange={handleInputChange}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        />

                        <Divider>Winner Details</Divider>

                        {/* Winner Image Upload */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Avatar
                                src={formData.winnerImage}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    fontSize: '2.5rem',
                                    border: '3px solid gold',
                                    background: formData.winnerImage
                                        ? 'transparent'
                                        : 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                }}
                            >
                                {!formData.winnerImage && (formData.winnerName ? formData.winnerName.charAt(0).toUpperCase() : '🏆')}
                            </Avatar>
                            <Button
                                variant="outlined"
                                component="label"
                                sx={{ textTransform: 'none' }}
                            >
                                Upload Winner Image
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
                            label="Winner Name"
                            name="winnerName"
                            value={formData.winnerName}
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

export default Games;
