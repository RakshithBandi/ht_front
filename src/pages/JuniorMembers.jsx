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
} from '@mui/icons-material';
import { useAuth } from '../services/authComponents';
import membersAPI from '../services/membersService';

function JuniorMembers() {
    const theme = useTheme();
    const [members, setMembers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        amountInvested: '',
        amountPaidThisYear: '',
        profilePic: '',
    });
    const { isAuthorized } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await membersAPI.junior.getAll();
            setMembers(data);
        } catch (err) {
            setError('Failed to load members');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = () => {
        setFormData({
            name: '',
            age: '',
            amountInvested: '',
            amountPaidThisYear: '',
            profilePic: '',
        });
        setEditingMember(null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingMember(null);
        setFormData({
            name: '',
            age: '',
            amountInvested: '',
            amountPaidThisYear: '',
            profilePic: '',
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
                    profilePic: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const memberData = {
                name: formData.name,
                age: parseInt(formData.age) || 0,
                amountInvested: parseFloat(formData.amountInvested) || 0,
                amountPaidThisYear: parseFloat(formData.amountPaidThisYear) || 0,
                profilePic: formData.profilePic || '',
            };

            if (editingMember) {
                await membersAPI.junior.update(editingMember.id, memberData);
            } else {
                await membersAPI.junior.create(memberData);
            }

            await loadMembers();
            handleCloseDialog();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (member) => {
        setEditingMember(member);
        setFormData({
            name: member.name,
            age: member.age.toString(),
            amountInvested: member.amountInvested.toString(),
            profilePic: member.profilePic || '',
            amountPaidThisYear: member.amountPaidThisYear.toString(),
        });
        setOpenDialog(true);
    };

    const handleDelete = async (memberId) => {
        try {
            await membersAPI.junior.delete(memberId);
            await loadMembers();
        } catch (err) {
            console.error(err);
        }
    };

    const calculateTotal = (member) => {
        const invested = parseFloat(member.amountInvested) || 0;
        const paidThisYear = parseFloat(member.amountPaidThisYear) || 0;
        return invested + paidThisYear;
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Junior Members
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
                        Add Junior Member
                    </Button>
                )}
            </Box>

            {!isAuthorized && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    You don't have permission to add, edit, or delete members. Only authorized users can perform these actions.
                </Alert>
            )}

            {/* Members Grid */}
            <Grid container spacing={3}>
                {members.map((member) => (
                    <Grid item xs={12} sm={6} md={4} key={member.id}>
                        <Card
                            sx={{
                                minHeight: 400,
                                borderRadius: 3,
                                position: 'relative',
                                boxShadow: theme.palette.mode === 'dark'
                                    ? '0 4px 12px rgba(0,0,0,0.3)'
                                    : '0 4px 12px rgba(0,0,0,0.1)',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                },
                            }}
                        >
                            <CardContent>
                                {/* Profile Picture */}
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                    <Avatar
                                        src={member.profilePic}
                                        alt={member.name}
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            fontSize: '2rem',
                                            fontWeight: 700,
                                            background: member.profilePic
                                                ? 'transparent'
                                                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        }}
                                    >
                                        {!member.profilePic && member.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center', width: '100%' }}>
                                        {member.name}
                                    </Typography>
                                    {isAuthorized && (
                                        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEdit(member)}
                                                sx={{ color: theme.palette.primary.main }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(member.id)}
                                                sx={{ color: theme.palette.error.main }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>

                                <Divider sx={{ mb: 2 }} />

                                <Box sx={{ mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Age: <strong>{member.age}</strong>
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Amount Invested: <strong>₹{member.amountInvested.toLocaleString()}</strong>
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Amount Paid This Year: <strong>₹{member.amountPaidThisYear.toLocaleString()}</strong>
                                    </Typography>
                                </Box>

                                <Divider sx={{ mb: 2 }} />

                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        background: theme.palette.mode === 'dark'
                                            ? 'rgba(102, 126, 234, 0.15)'
                                            : 'rgba(102, 126, 234, 0.1)',
                                    }}
                                >
                                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700 }}>
                                        Total Amount: ₹{calculateTotal(member).toLocaleString()}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {members.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No junior members added yet
                    </Typography>
                </Box>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingMember ? 'Edit Junior Member' : 'Add Junior Member'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* Profile Picture Upload */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Avatar
                                src={formData.profilePic}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    fontSize: '2.5rem',
                                    background: formData.profilePic
                                        ? 'transparent'
                                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                }}
                            >
                                {!formData.profilePic && (formData.name ? formData.name.charAt(0).toUpperCase() : 'U')}
                            </Avatar>
                            <Button
                                variant="outlined"
                                component="label"
                                sx={{ textTransform: 'none' }}
                            >
                                Upload Profile Picture
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
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Age"
                            name="age"
                            type="number"
                            value={formData.age}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Amount Invested"
                            name="amountInvested"
                            type="number"
                            value={formData.amountInvested}
                            onChange={handleInputChange}
                            required
                            InputProps={{
                                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Amount Paid This Year"
                            name="amountPaidThisYear"
                            type="number"
                            value={formData.amountPaidThisYear}
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

export default JuniorMembers;
