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
                const updatedGame = await gamesAPI.update(editingGame.id, gameData);
                setGames(prev => prev.map(g => g.id === editingGame.id ? updatedGame : g));
            } else {
                const newGame = await gamesAPI.create(gameData);
                setGames(prev => [newGame, ...prev]);
            }

            handleCloseDialog();
        } catch (err) {
            console.error(err);
            alert("Failed to save game. Please try again.");
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
        if (!window.confirm("Are you sure you want to delete this game?")) return;
        try {
            await gamesAPI.delete(gameId);
            setGames(prev => prev.filter(g => g.id !== gameId));
        } catch (err) {
            console.error(err);
            alert("Failed to delete game. Please try again.");
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1600, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    Games
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
                        Add Game
                    </Button>
                )}
            </Box>

            {!isAuthorized && (
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                    You don't have permission to add, edit, or delete games. Only authorized users can perform these actions.
                </Alert>
            )}

            {/* Games Grid - Fixed Grid Syntax */}
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
                {games.map((game) => (
                    <Card
                        key={game.id}
                        elevation={0}
                        sx={{
                            height: '100%',
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
                                '& .game-actions': {
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
                                height: 80,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '16px 16px 0 0',
                                position: 'relative',
                                mb: 4,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <TrophyIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.3)' }} />

                                {/* Edit/Delete Buttons */}
                                {isAuthorized && (
                                    <Box
                                        className="game-actions"
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
                                            onClick={() => handleEdit(game)}
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
                                            onClick={() => handleDelete(game.id)}
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

                            <Box sx={{ px: 3, pb: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, textAlign: 'center' }}>
                                    {game.gameName}
                                </Typography>

                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                    <Chip
                                        icon={<PeopleIcon sx={{ fontSize: '1rem !important' }} />}
                                        label={`${game.participantsCount} Participants`}
                                        sx={{
                                            bgcolor: 'rgba(118, 75, 162, 0.1)',
                                            color: '#764ba2',
                                            fontWeight: 600,
                                            height: 28
                                        }}
                                    />
                                </Box>

                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3, flex: 1 }}>
                                    {game.description}
                                </Typography>

                                {/* Winner Section */}
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 3,
                                        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.05) 100%)',
                                        border: '1px solid',
                                        borderColor: 'rgba(255, 215, 0, 0.3)',
                                        mt: 'auto'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        {/* Winner Image */}
                                        <Avatar
                                            src={game.winnerImage}
                                            alt={game.winnerName}
                                            sx={{
                                                width: 50,
                                                height: 50,
                                                border: '2px solid #FFD700',
                                                background: game.winnerImage
                                                    ? 'transparent'
                                                    : 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                                boxShadow: '0 4px 10px rgba(255, 215, 0, 0.2)'
                                            }}
                                        >
                                            {!game.winnerImage && game.winnerName.charAt(0).toUpperCase()}
                                        </Avatar>

                                        {/* Winner Info */}
                                        <Box>
                                            <Typography variant="caption" sx={{ color: '#DAA520', fontWeight: 700, display: 'block', mb: 0.5, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                                                🏆 Winner
                                            </Typography>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: theme.palette.text.primary, lineHeight: 1.2 }}>
                                                {game.winnerName}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

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
