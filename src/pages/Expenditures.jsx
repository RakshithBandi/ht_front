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
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useAuth } from '../services/authComponents';
import expenditureAPI from '../services/expenditureService';

function Expenditures() {
    const theme = useTheme();
    const [expenditures, setExpenditures] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [formData, setFormData] = useState({
        year: new Date().getFullYear().toString(),
        purpose: '',
        amountSpent: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthorized } = useAuth();

    // Load expenditures from API
    useEffect(() => {
        loadExpenditures();
    }, []);

    const loadExpenditures = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await expenditureAPI.getAll();
            setExpenditures(data);
        } catch (err) {
            setError('Failed to load expenditures');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = () => {
        setFormData({
            year: new Date().getFullYear().toString(),
            purpose: '',
            amountSpent: '',
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({
            year: new Date().getFullYear().toString(),
            purpose: '',
            amountSpent: '',
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddExpenditure = async () => {
        if (!formData.purpose || !formData.amountSpent || !formData.year) {
            return;
        }

        try {
            const expenditureData = {
                year: formData.year,
                purpose: formData.purpose,
                amountSpent: parseFloat(formData.amountSpent) || 0,
            };

            const newExpenditure = await expenditureAPI.create(expenditureData);
            setExpenditures(prev => [newExpenditure, ...prev]);
            handleCloseDialog();
        } catch (err) {
            console.error(err);
            alert("Failed to add expenditure. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this expenditure?")) return;
        try {
            await expenditureAPI.delete(id);
            setExpenditures(prev => prev.filter(exp => exp.id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete expenditure. Please try again.");
        }
    };

    // Calculate total for selected year
    const calculateYearTotal = (year) => {
        return expenditures
            .filter(exp => exp.year === year.toString())
            .reduce((sum, exp) => sum + (parseFloat(exp.amountSpent) || 0), 0);
    };

    // Get unique years
    const getUniqueYears = () => {
        const years = expenditures.map(exp => exp.year);
        return [...new Set(years)].sort((a, b) => b - a);
    };

    // Filter expenditures by current year
    const currentYearExpenditures = expenditures.filter(
        exp => exp.year === currentYear.toString()
    );

    const uniqueYears = getUniqueYears();

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1600, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    Expenditures
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
                        Add Expenditure
                    </Button>
                )}
            </Box>

            {!isAuthorized && (
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                    You don't have permission to add or delete expenditures. Only authorized users can perform these actions.
                </Alert>
            )}

            {/* Year Selector */}
            {uniqueYears.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600, ml: 0.5 }}>
                        FILTER BY YEAR
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        {uniqueYears.map(year => (
                            <Button
                                key={year}
                                variant={currentYear.toString() === year ? 'contained' : 'outlined'}
                                onClick={() => setCurrentYear(parseInt(year))}
                                sx={{
                                    borderRadius: 50,
                                    px: 3,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    ...(currentYear.toString() === year ? {
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        boxShadow: '0 4px 10px rgba(118, 75, 162, 0.3)'
                                    } : {
                                        borderColor: theme.palette.divider,
                                        color: theme.palette.text.secondary,
                                        '&:hover': {
                                            borderColor: '#667eea',
                                            color: '#667eea',
                                            bgcolor: 'rgba(102, 126, 234, 0.05)'
                                        }
                                    }),
                                }}
                            >
                                {year}
                            </Button>
                        ))}
                    </Box>
                </Box>
            )}

            {/* Total Amount Card using Grid */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 3,
                mb: 4
            }}>
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        boxShadow: '0 8px 32px rgba(118, 75, 162, 0.25)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: 150,
                        height: 150,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)'
                    }} />
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Box sx={{
                                p: 1,
                                borderRadius: 2,
                                bgcolor: 'rgba(255,255,255,0.2)',
                                mr: 2,
                                display: 'flex'
                            }}>
                                <ReceiptIcon sx={{ fontSize: 24, color: '#fff' }} />
                            </Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, opacity: 0.9 }}>
                                Total Spent in {currentYear}
                            </Typography>
                        </Box>
                        <Typography variant="h3" sx={{ fontWeight: 800, mt: 2 }}>
                            ₹{calculateYearTotal(currentYear).toLocaleString()}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            {/* Expenditures Table */}
            {currentYearExpenditures.length > 0 ? (
                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: '1px solid',
                        borderColor: theme.palette.divider,
                        overflow: 'hidden',
                        background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#fff',
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                                <TableCell sx={{ fontWeight: 700, py: 2.5 }}>S.No</TableCell>
                                <TableCell sx={{ fontWeight: 700, py: 2.5 }}>Purpose</TableCell>
                                <TableCell sx={{ fontWeight: 700, py: 2.5 }}>Amount Spent</TableCell>
                                <TableCell sx={{ fontWeight: 700, py: 2.5 }}>Date</TableCell>
                                {isAuthorized && <TableCell sx={{ fontWeight: 700, py: 2.5 }}>Actions</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentYearExpenditures.map((expenditure, index) => (
                                <TableRow
                                    key={expenditure.id}
                                    sx={{
                                        transition: 'background-color 0.2s',
                                        '&:hover': {
                                            bgcolor: theme.palette.mode === 'dark'
                                                ? 'rgba(255,255,255,0.03)'
                                                : 'rgba(102, 126, 234, 0.04)',
                                        },
                                    }}
                                >
                                    <TableCell sx={{ py: 2 }}>{index + 1}</TableCell>
                                    <TableCell sx={{ py: 2, fontWeight: 500 }}>{expenditure.purpose}</TableCell>
                                    <TableCell sx={{ py: 2 }}>
                                        <Box sx={{
                                            display: 'inline-block',
                                            px: 1.5,
                                            py: 0.5,
                                            bgcolor: 'rgba(244, 67, 54, 0.1)',
                                            color: '#d32f2f',
                                            borderRadius: 1,
                                            fontWeight: 600
                                        }}>
                                            ₹{expenditure.amountSpent.toLocaleString()}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ py: 2, color: 'text.secondary' }}>
                                        {new Date(expenditure.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    {isAuthorized && (
                                        <TableCell sx={{ py: 2 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(expenditure.id)}
                                                sx={{
                                                    color: theme.palette.error.main,
                                                    '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.1)' }
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                            <TableRow sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(102, 126, 234, 0.15)' : 'rgba(102, 126, 234, 0.08)' }}>
                                <TableCell colSpan={2} sx={{ fontWeight: 700, fontSize: '1.1rem', py: 3 }}>
                                    Total
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '1.2rem', color: theme.palette.primary.main, py: 3 }}>
                                    ₹{calculateYearTotal(currentYear).toLocaleString()}
                                </TableCell>
                                <TableCell colSpan={isAuthorized ? 2 : 1} sx={{ py: 3 }}></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Box sx={{ textAlign: 'center', py: 12, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', borderRadius: 4 }}>
                    <ReceiptIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No expenditures recorded for {currentYear}
                    </Typography>
                    {isAuthorized && (
                        <Typography variant="body2" color="text.secondary">
                            Click "Add Expenditure" to add your first entry
                        </Typography>
                    )}
                </Box>
            )}

            {/* Add Expenditure Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Add Expenditure</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Year"
                            name="year"
                            type="number"
                            value={formData.year}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Purpose"
                            name="purpose"
                            value={formData.purpose}
                            onChange={handleInputChange}
                            placeholder="e.g., Event expenses, Equipment purchase"
                            required
                            multiline
                            rows={2}
                        />
                        <TextField
                            fullWidth
                            label="Amount Spent"
                            name="amountSpent"
                            type="number"
                            value={formData.amountSpent}
                            onChange={handleInputChange}
                            required
                            InputProps={{
                                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                            }}
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
                        onClick={handleAddExpenditure}
                        startIcon={<SaveIcon />}
                        variant="contained"
                        disabled={!formData.purpose || !formData.amountSpent || !formData.year}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)',
                            },
                        }}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Expenditures;
