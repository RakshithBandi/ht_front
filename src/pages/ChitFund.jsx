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
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    AccountBalanceWallet as WalletIcon,
} from '@mui/icons-material';
import { useAuth } from '../services/authComponents';
import chitfundAPI from '../services/chitfundService';

function ChitFund() {
    const theme = useTheme();
    const [chitFunds, setChitFunds] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        year: '',
        permanentAmount: '',
        temporaryAmount: '',
        juniorAmount: '',
        villageContribution: '',
        otherContributions: '',
        grandTotal: '',
        amountSpent: '',
    });
    const { isAuthorized } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadChitFunds();
    }, []);

    const loadChitFunds = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await chitfundAPI.getAll();
            setChitFunds(data);
        } catch (err) {
            setError('Failed to load chit fund data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = () => {
        setFormData({
            year: new Date().getFullYear().toString(),
            permanentAmount: '',
            temporaryAmount: '',
            juniorAmount: '',
            villageContribution: '',
            otherContributions: '',
            grandTotal: '',
            amountSpent: '',
        });
        setEditingItem(null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingItem(null);
        setFormData({
            year: '',
            permanentAmount: '',
            temporaryAmount: '',
            juniorAmount: '',
            villageContribution: '',
            otherContributions: '',
            grandTotal: '',
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

    const calculateTotalReceived = (data) => {
        return (parseFloat(data.permanentAmount) || 0) +
            (parseFloat(data.temporaryAmount) || 0) +
            (parseFloat(data.juniorAmount) || 0) +
            (parseFloat(data.villageContribution) || 0) +
            (parseFloat(data.otherContributions) || 0);
    };

    const calculateBalance = (data) => {
        const received = calculateTotalReceived(data);
        const spent = parseFloat(data.amountSpent) || 0;
        return received - spent;
    };

    const handleSave = async () => {
        try {
            const currentBalance = (
                (parseFloat(formData.permanentAmount) || 0) +
                (parseFloat(formData.temporaryAmount) || 0) +
                (parseFloat(formData.juniorAmount) || 0) +
                (parseFloat(formData.villageContribution) || 0) +
                (parseFloat(formData.otherContributions) || 0)
            ) - (parseFloat(formData.amountSpent) || 0);

            const inputGrandTotal = parseFloat(formData.grandTotal) || 0;
            const finalGrandTotal = inputGrandTotal + currentBalance;

            const chitfundData = {
                year: formData.year,
                permanentAmount: parseFloat(formData.permanentAmount) || 0,
                temporaryAmount: parseFloat(formData.temporaryAmount) || 0,
                juniorAmount: parseFloat(formData.juniorAmount) || 0,
                villageContribution: parseFloat(formData.villageContribution) || 0,
                otherContributions: parseFloat(formData.otherContributions) || 0,
                inputGrandTotal: inputGrandTotal,
                grandTotal: finalGrandTotal,
                amountSpent: parseFloat(formData.amountSpent) || 0,
            };

            if (editingItem) {
                const updatedItem = await chitfundAPI.update(editingItem.id, chitfundData);
                setChitFunds(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
            } else {
                const newItem = await chitfundAPI.create(chitfundData);
                setChitFunds(prev => [newItem, ...prev]);
            }

            handleCloseDialog();
        } catch (err) {
            console.error(err);
            alert("Failed to save chit fund details. Please try again.");
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            year: item.year,
            permanentAmount: item.permanentAmount.toString(),
            temporaryAmount: item.temporaryAmount.toString(),
            juniorAmount: item.juniorAmount.toString(),
            villageContribution: item.villageContribution.toString(),
            otherContributions: item.otherContributions ? item.otherContributions.toString() : '0',
            grandTotal: item.inputGrandTotal ? item.inputGrandTotal.toString() : '',
            amountSpent: item.amountSpent.toString(),
        });
        setOpenDialog(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this chit fund record?")) return;
        try {
            await chitfundAPI.delete(id);
            setChitFunds(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete chit fund record. Please try again.");
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1600, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    HT VINAYAKA CHIT FUND
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
                        Add Details
                    </Button>
                )}
            </Box>

            {!isAuthorized && (
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                    You don't have permission to add, edit, or delete chit fund details. Only authorized users can perform these actions.
                </Alert>
            )}

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: 3,
                animation: 'fadeIn 0.5s ease-in-out',
                '@keyframes fadeIn': {
                    '0%': { opacity: 0, transform: 'translateY(20px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                }
            }}>
                {chitFunds
                    .sort((a, b) => b.year - a.year) // Sort by year descending
                    .map((item) => {
                        const totalReceived = calculateTotalReceived(item);
                        const balance = calculateBalance(item);

                        return (
                            <Card
                                key={item.id}
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
                                    },
                                    overflow: 'visible',
                                }}
                            >
                                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    {isAuthorized && (
                                        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEdit(item)}
                                                sx={{
                                                    color: theme.palette.primary.main,
                                                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                                                    mr: 1,
                                                    '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.2)' }
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(item.id)}
                                                sx={{
                                                    color: theme.palette.error.main,
                                                    bgcolor: 'rgba(244, 67, 54, 0.1)',
                                                    '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' }
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    )}

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                                        <Box sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            boxShadow: '0 4px 14px 0 rgba(118, 75, 162, 0.3)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 2
                                        }}>
                                            <WalletIcon sx={{ fontSize: 32, color: '#fff' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 1 }}>
                                                FINANCIAL YEAR
                                            </Typography>
                                            <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                                {item.year}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: 2,
                                        mb: 4
                                    }}>
                                        {[
                                            { label: 'Permanent', value: item.permanentAmount },
                                            { label: 'Temporary', value: item.temporaryAmount },
                                            { label: 'Junior', value: item.juniorAmount },
                                            { label: 'Village', value: item.villageContribution },
                                            { label: 'Other', value: item.otherContributions },
                                        ].map((stat, index) => (
                                            <Box key={index} sx={{
                                                p: 1.5,
                                                borderRadius: 2,
                                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                                border: '1px solid',
                                                borderColor: theme.palette.divider
                                            }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                    {stat.label}
                                                </Typography>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                    ₹{(stat.value || 0).toLocaleString()}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>

                                    <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">Total Received</Typography>
                                            <Typography variant="subtitle1" sx={{ color: '#00c853', fontWeight: 700 }}>
                                                ₹{totalReceived.toLocaleString()}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">Total Spent</Typography>
                                            <Typography variant="subtitle1" sx={{ color: '#ff3d00', fontWeight: 700 }}>
                                                ₹{item.amountSpent.toLocaleString()}
                                            </Typography>
                                        </Box>

                                        <Divider />

                                        <Box sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#667eea' }}>
                                                Grand Total
                                            </Typography>
                                            <Typography variant="h5" sx={{
                                                fontWeight: 800,
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent'
                                            }}>
                                                ₹{(item.grandTotal || 0).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        );
                    })}

                {chitFunds.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 8, gridColumn: '1/-1' }}>
                        <Typography variant="h6" color="text.secondary">
                            No chit fund details added yet
                        </Typography>
                    </Box>
                )}
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingItem ? 'Edit Details' : 'Add Details'}
                </DialogTitle>
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
                            label="Permanent Membership Amount"
                            name="permanentAmount"
                            type="number"
                            value={formData.permanentAmount}
                            onChange={handleInputChange}
                            required
                            InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography> }}
                        />
                        <TextField
                            fullWidth
                            label="Temporary Membership Amount"
                            name="temporaryAmount"
                            type="number"
                            value={formData.temporaryAmount}
                            onChange={handleInputChange}
                            required
                            InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography> }}
                        />
                        <TextField
                            fullWidth
                            label="Junior Membership Amount"
                            name="juniorAmount"
                            type="number"
                            value={formData.juniorAmount}
                            onChange={handleInputChange}
                            required
                            InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography> }}
                        />
                        <TextField
                            fullWidth
                            label="Village Contribution Amount"
                            name="villageContribution"
                            type="number"
                            value={formData.villageContribution}
                            onChange={handleInputChange}
                            required
                            InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography> }}
                        />
                        <TextField
                            fullWidth
                            label="Other Contributions"
                            name="otherContributions"
                            type="number"
                            value={formData.otherContributions}
                            onChange={handleInputChange}
                            InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography> }}
                        />
                        <TextField
                            fullWidth
                            label="Grand Total (Starting Balance)"
                            name="grandTotal"
                            type="number"
                            value={formData.grandTotal}
                            onChange={handleInputChange}
                            InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography> }}
                            helperText="This amount will be added to the current year's chit fund balance"
                        />
                        <TextField
                            fullWidth
                            label="Total Amount Spent This Year"
                            name="amountSpent"
                            type="number"
                            value={formData.amountSpent}
                            onChange={handleInputChange}
                            required
                            InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography> }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={!formData.year}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ChitFund;
