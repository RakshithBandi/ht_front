import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    TextField,
    Grid,
    Card,
    CardContent,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    IconButton,
    Input,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Pagination,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Image as ImageIcon,
    EmojiEvents,
    CheckCircle,
    Cancel,
    AccessTime,
    Search as SearchIcon
} from '@mui/icons-material';
import { Switch, FormControlLabel as MuiFormControlLabel } from '@mui/material';
import quizService from '../services/quizService';
import { useLanguage } from '../context/LanguageContext';

const Quiz = () => {
    const theme = useTheme();
    const { t } = useLanguage();
    // User role check - simplified for now, assuming role fits strictly 'admin' or 'manager' check from user object
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdminOrManager = user.role === 'admin' || user.role === 'manager';

    const [questions, setQuestions] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [userScore, setUserScore] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false);

    // Create Question State
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        question_text: '',
        question_image: null,
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: '',
        year: new Date().getFullYear()
    });
    const [imagePreview, setImagePreview] = useState(null);

    // Answer State
    const [selectedAnswers, setSelectedAnswers] = useState({}); // Map questionId -> answer
    const [results, setResults] = useState({}); // Map questionId -> {isCorrect, correct_answer}

    useEffect(() => {
        loadData();
    }, [selectedYear]);

    const loadData = async () => {
        try {
            const questionsData = await quizService.getQuestions(selectedYear);
            setQuestions(questionsData);

            const scoreData = await quizService.getUserScore();
            setUserScore(scoreData.total_points || 0);

            // Fetch settings
            try {
                const settings = await quizService.getSettings();
                setIsLeaderboardVisible(settings.is_leaderboard_visible);
            } catch (err) {
                console.warn("Could not fetch settings", err);
            }

            // Fetch leaderboard
            try {
                const lbData = await quizService.getLeaderboard();
                setLeaderboard(lbData);
            } catch (err) {
                console.warn("Leaderboard hidden or error", err);
                setLeaderboard([]); // Clear if hidden/error
            }
        } catch (error) {
            console.error("Failed to load quiz data", error);
        }
    };

    const handleToggleLeaderboard = async () => {
        try {
            const updatedSettings = await quizService.toggleLeaderboard();
            setIsLeaderboardVisible(updatedSettings.is_leaderboard_visible);
            loadData(); // Reload to get/hide leaderboard data
        } catch (error) {
            console.error("Failed to toggle leaderboard", error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewQuestion({ ...newQuestion, question_image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCreateQuestion = async () => {
        try {
            const formData = new FormData();
            formData.append('question_text', newQuestion.question_text);
            if (newQuestion.question_image) {
                formData.append('question_image', newQuestion.question_image);
            }
            formData.append('option_a', newQuestion.option_a);
            formData.append('option_b', newQuestion.option_b);
            formData.append('option_c', newQuestion.option_c);
            formData.append('option_d', newQuestion.option_d);
            formData.append('correct_answer', newQuestion.correct_answer);
            formData.append('year', newQuestion.year);

            const createdQuestion = await quizService.createQuestion(formData);

            // Only update local state if the new question belongs to the currently selected year
            if (parseInt(createdQuestion.year) === parseInt(selectedYear)) {
                setQuestions(prev => [...prev, createdQuestion]);
            }

            setIsCreateDialogOpen(false);
            setNewQuestion({
                question_text: '',
                question_image: null,
                option_a: '',
                option_b: '',
                option_c: '',
                option_d: '',
                correct_answer: '',
                year: new Date().getFullYear()
            });
            setImagePreview(null);
        } catch (error) {
            console.error("Failed to create question", error);
            alert("Failed to create question. Please try again.");
        }
    };

    const handleDeleteQuestion = async (id) => {
        if (!window.confirm("Are you sure you want to delete this question?")) return;
        try {
            await quizService.deleteQuestion(id);
            setQuestions(prev => prev.filter(q => q.id !== id));
        } catch (error) {
            console.error("Failed to delete question", error);
            alert("Failed to delete question. Please try again.");
        }
    };

    const handleAnswerSubmit = async (questionId) => {
        const answer = selectedAnswers[questionId];
        if (!answer) return;

        try {
            const result = await quizService.submitAnswer(questionId, answer);
            setResults(prev => ({
                ...prev,
                [questionId]: {
                    isCorrect: result.is_correct,
                    correct_answer: result.correct_answer
                }
            }));

            if (result.is_correct) {
                setUserScore(prev => prev + 1);
            }
            // Refresh leaderboard maybe?
        } catch (error) {
            console.error("Failed to submit answer", error);
        }
    };

    // Timer State
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getTimeRemaining = (expiresAt) => {
        const expireTime = new Date(expiresAt).getTime();
        const currentTime = now.getTime();
        const diff = expireTime - currentTime;

        if (diff <= 0) return null;

        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1600, mx: 'auto' }}>
            {/* Header / Stats */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    Quiz Challenge
                </Typography>
                <Card
                    elevation={0}
                    sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(118, 75, 162, 0.4)'
                    }}
                >
                    <EmojiEvents fontSize="large" sx={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                    <Box>
                        <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: 700 }}>{userScore}</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>Total Points</Typography>
                    </Box>
                </Card>
            </Box>

            <Grid container spacing={4}>
                {/* Main Quiz Area */}
                <Grid item xs={12} lg={8.5}>
                    <Card elevation={0} sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 4,
                        border: '1px solid',
                        borderColor: theme.palette.divider,
                        background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff'
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                                <FormControl sx={{ minWidth: 150 }} size="small">
                                    <InputLabel>Year</InputLabel>
                                    <Select
                                        value={selectedYear}
                                        label="Year"
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        {[2023, 2024, 2025].map(year => (
                                            <MenuItem key={year} value={year}>{year}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    variant="outlined"
                                    placeholder="Search questions..."
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
                                    sx={{ bgcolor: 'background.paper', borderRadius: 2, minWidth: 200 }}
                                />
                            </Box>

                            {isAdminOrManager && (
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => setIsCreateDialogOpen(true)}
                                    sx={{
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        boxShadow: '0 4px 14px 0 rgba(118, 75, 162, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)',
                                            boxShadow: '0 6px 20px 0 rgba(118, 75, 162, 0.4)',
                                        },
                                    }}
                                >
                                    Add Question
                                </Button>
                            )}
                        </Box>

                        {questions.length === 0 ? (
                            <Box sx={{ py: 8, textAlign: 'center' }}>
                                <Typography color="text.secondary" variant="h6">
                                    No questions available for {selectedYear}
                                </Typography>
                            </Box>
                        ) : (
                            questions
                                .filter(q =>
                                    q.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    q.option_a.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    q.option_b.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    q.option_c.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    q.option_d.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((q, index) => {
                                    const timeLeft = getTimeRemaining(q.expires_at);
                                    const isExpired = !timeLeft;

                                    return (
                                        <Card
                                            key={q.id}
                                            elevation={0}
                                            sx={{
                                                mb: 3,
                                                borderRadius: 3,
                                                border: '1px solid',
                                                borderColor: theme.palette.divider,
                                                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                                                opacity: isExpired && !results[q.id] ? 0.7 : 1,
                                                overflow: 'visible'
                                            }}
                                        >
                                            <CardContent sx={{ p: 3 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                    <Box>
                                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                                                            <Box component="span" sx={{
                                                                bgcolor: 'primary.main',
                                                                color: 'white',
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: '50%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '0.9rem',
                                                                mr: 1
                                                            }}>
                                                                {index + 1}
                                                            </Box>
                                                            {q.question_text}
                                                        </Typography>

                                                        <Box sx={{ display: 'flex', gap: 1, mt: 1, ml: 5 }}>
                                                            {isExpired && !results[q.id] && !q.already_answered && (
                                                                <Chip label="Expired" color="error" size="small" variant="filled" />
                                                            )}
                                                            {timeLeft && !results[q.id] && !q.already_answered && (
                                                                <Chip
                                                                    label={`Time left: ${timeLeft}`}
                                                                    color="warning"
                                                                    size="small"
                                                                    variant="filled"
                                                                    icon={<AccessTime fontSize="small" />}
                                                                />
                                                            )}
                                                        </Box>
                                                    </Box>
                                                    {isAdminOrManager && (
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDeleteQuestion(q.id)}
                                                            sx={{
                                                                color: theme.palette.error.main,
                                                                bgcolor: 'rgba(255,0,0,0.05)',
                                                                '&:hover': { bgcolor: 'rgba(255,0,0,0.1)' }
                                                            }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                </Box>

                                                {q.question_image && (
                                                    <Box
                                                        component="img"
                                                        src={q.question_image}
                                                        alt="Question"
                                                        sx={{
                                                            maxWidth: '100%',
                                                            maxHeight: 400,
                                                            borderRadius: 2,
                                                            mb: 3,
                                                            ml: { xs: 0, md: 5 },
                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                        }}
                                                    />
                                                )}

                                                <FormControl component="fieldset" fullWidth sx={{ ml: { xs: 0, md: 5 }, width: 'auto' }}>
                                                    <RadioGroup
                                                        value={selectedAnswers[q.id] || ''}
                                                        onChange={(e) => setSelectedAnswers({ ...selectedAnswers, [q.id]: e.target.value })}
                                                    >
                                                        {['A', 'B', 'C', 'D'].map((opt) => (
                                                            <FormControlLabel
                                                                key={opt}
                                                                value={opt}
                                                                control={<Radio disabled={!!results[q.id] || q.already_answered || isExpired} />}
                                                                label={
                                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                        <Typography>{q[`option_${opt.toLowerCase()}`]}</Typography>
                                                                        {/* Show indicators if answered */}
                                                                        {results[q.id] && results[q.id].correct_answer === opt && (
                                                                            <CheckCircle fontSize="small" color="success" sx={{ ml: 1 }} />
                                                                        )}
                                                                        {results[q.id] && results[q.id].isCorrect === false && selectedAnswers[q.id] === opt && (
                                                                            <Cancel fontSize="small" color="error" sx={{ ml: 1 }} />
                                                                        )}
                                                                    </Box>
                                                                }
                                                                sx={{
                                                                    mb: 1,
                                                                    p: 1.5,
                                                                    borderRadius: 2,
                                                                    border: '1px solid',
                                                                    borderColor: selectedAnswers[q.id] === opt ? 'primary.main' : 'divider',
                                                                    bgcolor: selectedAnswers[q.id] === opt ? 'rgba(102, 126, 234, 0.05)' : 'transparent',
                                                                    transition: 'all 0.2s',
                                                                    '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.05)' },
                                                                    mr: 0
                                                                }}
                                                            />
                                                        ))}
                                                    </RadioGroup>

                                                    {!results[q.id] && !q.already_answered && !isExpired && (
                                                        <Button
                                                            variant="contained"
                                                            onClick={() => handleAnswerSubmit(q.id)}
                                                            disabled={!selectedAnswers[q.id]}
                                                            sx={{ mt: 2, alignSelf: 'flex-start', borderRadius: 2 }}
                                                        >
                                                            Submit Answer
                                                        </Button>
                                                    )}

                                                    {(results[q.id] || q.already_answered) && (
                                                        <Box sx={{ mt: 2 }}>
                                                            <Chip
                                                                label={results[q.id]?.isCorrect ? "Correct! +1 Point" : q.already_answered ? "Already Answered" : "Incorrect Answer"}
                                                                color={results[q.id]?.isCorrect ? "success" : "default"}
                                                                variant={results[q.id]?.isCorrect ? "filled" : "outlined"}
                                                            />
                                                        </Box>
                                                    )}
                                                </FormControl>
                                            </CardContent>
                                        </Card>
                                    )
                                })
                        )}
                    </Card>
                </Grid>

                {/* Sidebar / Leaderboard */}
                <Grid item xs={12} lg={3.5}>
                    <Card elevation={0} sx={{
                        p: 0,
                        borderRadius: 4,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: theme.palette.divider,
                        position: 'sticky',
                        top: 24
                    }}>
                        <Box sx={{
                            p: 3,
                            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Typography variant="h6" display="flex" alignItems="center" sx={{ fontWeight: 700, color: 'white' }}>
                                <EmojiEvents sx={{ mr: 1 }} />
                                Leaderboard
                            </Typography>
                            {isAdminOrManager && (
                                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 1, px: 1 }}>
                                    <MuiFormControlLabel
                                        control={
                                            <Switch
                                                checked={isLeaderboardVisible}
                                                onChange={handleToggleLeaderboard}
                                                size="small"
                                                color="default"
                                            />
                                        }
                                        label={isLeaderboardVisible ? "Visible" : "Hidden"}
                                        slotProps={{ typography: { variant: 'caption', fontWeight: 600 } }}
                                        sx={{ mr: 0 }}
                                    />
                                </Box>
                            )}
                        </Box>

                        <Box sx={{ p: 2 }}>
                            {!isLeaderboardVisible && !isAdminOrManager ? (
                                <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                                    <EmojiEvents sx={{ fontSize: 48, mb: 1, opacity: 0.2 }} />
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        Leaderboard is currently hidden
                                    </Typography>
                                    <Typography variant="caption">
                                        Check back later!
                                    </Typography>
                                </Box>
                            ) : (
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Rank</TableCell>
                                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>User</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>Pts</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {leaderboard.length > 0 ? leaderboard.map((entry, idx) => (
                                                <TableRow key={idx} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell sx={{ fontSize: '1.1rem' }}>
                                                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                                                    </TableCell>
                                                    <TableCell sx={{ fontWeight: 500 }}>{entry.username}</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 800, color: 'primary.main' }}>{entry.total_points}</TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow>
                                                    <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.secondary' }}>No scores yet</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}

                            {!isLeaderboardVisible && isAdminOrManager && (
                                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 2, textAlign: 'center', fontWeight: 500, bgcolor: 'rgba(255,0,0,0.05)', py: 0.5, borderRadius: 1 }}>
                                    Hidden from users
                                </Typography>
                            )}
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* Create Question Dialog */}
            <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Question</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        fullWidth
                        label="Question Text"
                        multiline
                        rows={2}
                        value={newQuestion.question_text}
                        onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
                        sx={{ mb: 2, mt: 1 }}
                    />

                    <Box sx={{ mb: 3 }}>
                        <InputLabel sx={{ mb: 1 }}>Question Image (Optional)</InputLabel>
                        <input
                            accept="image/*"
                            type="file"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="raised-button-file"
                        />
                        <label htmlFor="raised-button-file">
                            <Button variant="outlined" component="span" startIcon={<ImageIcon />}>
                                Upload Image
                            </Button>
                        </label>
                        {imagePreview && (
                            <Box
                                component="img"
                                src={imagePreview}
                                sx={{
                                    mt: 2,
                                    maxHeight: 200,
                                    maxWidth: '100%',
                                    borderRadius: 1,
                                    border: '1px solid #ddd'
                                }}
                            />
                        )}
                    </Box>

                    <Grid container spacing={2}>
                        {['A', 'B', 'C', 'D'].map((opt) => (
                            <Grid item xs={6} key={opt}>
                                <TextField
                                    fullWidth
                                    label={`Option ${opt}`}
                                    value={newQuestion[`option_${opt.toLowerCase()}`]}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, [`option_${opt.toLowerCase()}`]: e.target.value })}
                                    size="small"
                                />
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Correct Answer</InputLabel>
                            <Select
                                value={newQuestion.correct_answer}
                                label="Correct Answer"
                                onChange={(e) => setNewQuestion({ ...newQuestion, correct_answer: e.target.value })}
                            >
                                <MenuItem value="A">Option A</MenuItem>
                                <MenuItem value="B">Option B</MenuItem>
                                <MenuItem value="C">Option C</MenuItem>
                                <MenuItem value="D">Option D</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Year</InputLabel>
                            <Select
                                value={newQuestion.year}
                                label="Year"
                                onChange={(e) => setNewQuestion({ ...newQuestion, year: e.target.value })}
                            >
                                <MenuItem value={2023}>2023</MenuItem>
                                <MenuItem value={2024}>2024</MenuItem>
                                <MenuItem value={2025}>2025</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateQuestion}>Create Question</Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

export default Quiz;
