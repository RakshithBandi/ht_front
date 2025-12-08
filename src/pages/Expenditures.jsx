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

            await expenditureAPI.create(expenditureData);
            await loadExpenditures();
            handleCloseDialog();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await expenditureAPI.delete(id);
            await loadExpenditures();
        } catch (err) {
            console.error(err);
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
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                    Expenditures
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
                        Add Expenditure
                    </Button>
                )}
            </Box>

            {!isAuthorized && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    You don't have permission to add or delete expenditures. Only authorized users can perform these actions.
                </Alert>
            )}

            {/* Year Selector */}
            {uniqueYears.length > 0 && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                        Select Year:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {uniqueYears.map(year => (
                            <Button
                                key={year}
                                variant={currentYear.toString() === year ? 'contained' : 'outlined'}
                                onClick={() => setCurrentYear(parseInt(year))}
                                sx={{
                                    ...(currentYear.toString() === year && {
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    }),
                                }}
                            >
                                {year}
                            </Button>
                        ))}
                    </Box>
                </Box>
            )}

            {/* Total Amount Card */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Card
                        sx={{
                            borderRadius: 3,
                            background: theme.palette.mode === 'dark'
                                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                                : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                            boxShadow: theme.palette.mode === 'dark'
                                ? '0 4px 12px rgba(0,0,0,0.3)'
                                : '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <ReceiptIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Total Amount Spent in {currentYear}
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                                        ₹{calculateYearTotal(currentYear).toLocaleString()}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Expenditures Table */}
            {currentYearExpenditures.length > 0 ? (
                <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)' }}>
                                <TableCell sx={{ fontWeight: 700 }}>S.No</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Purpose</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Amount Spent</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                                {isAuthorized && <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentYearExpenditures.map((expenditure, index) => (
                                <TableRow
                                    key={expenditure.id}
                                    sx={{
                                        '&:hover': {
                                            bgcolor: theme.palette.mode === 'dark'
                                                ? 'rgba(255,255,255,0.05)'
                                                : 'rgba(0,0,0,0.02)',
                                        },
                                    }}
                                >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{expenditure.purpose}</TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 600, color: theme.palette.error.main }}>
                                            ₹{expenditure.amountSpent.toLocaleString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(expenditure.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    {isAuthorized && (
                                        <TableCell>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(expenditure.id)}
                                                sx={{ color: theme.palette.error.main }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                            <TableRow sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(102, 126, 234, 0.15)' : 'rgba(102, 126, 234, 0.1)' }}>
                                <TableCell colSpan={2} sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                                    Total
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem', color: theme.palette.primary.main }}>
                                    ₹{calculateYearTotal(currentYear).toLocaleString()}
                                </TableCell>
                                <TableCell colSpan={isAuthorized ? 2 : 1}></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <ReceiptIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
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
