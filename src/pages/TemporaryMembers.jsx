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

function TemporaryMembers() {
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
            const data = await membersAPI.temporary.getAll();
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
                await membersAPI.temporary.update(editingMember.id, memberData);
            } else {
                await membersAPI.temporary.create(memberData);
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
            amountPaidThisYear: member.amountPaidThisYear.toString(),
            profilePic: member.profilePic || '',
        });
        setOpenDialog(true);
    };

    const handleDelete = async (memberId) => {
        try {
            await membersAPI.temporary.delete(memberId);
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
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1600, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    Temporary Members
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
                        Add Temporary Member
                    </Button>
                )}
            </Box>

            {!isAuthorized && (
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                    You don't have permission to add, edit, or delete members. Only authorized users can perform these actions.
                </Alert>
            )}

            {/* Members Grid - Fixed Grid Syntax */}
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
                {members.map((member) => (
                    <Card
                        key={member.id}
                        elevation={0}
                        sx={{
                            height: '100%',
                            minHeight: 400,
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
                                '& .member-actions': {
                                    opacity: 1,
                                    transform: 'translateY(0)',
                                }
                            },
                            overflow: 'visible',
                        }}
                    >
                        <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {/* Header Background */}
                            <Box sx={{
                                height: 100,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '16px 16px 0 0',
                                position: 'relative',
                                mb: 6
                            }}>
                                {/* Profile Picture */}
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: -40,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    p: 0.5,
                                    bgcolor: theme.palette.background.paper,
                                    borderRadius: '50%',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                }}>
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

                                {isAuthorized && (
                                    <Box
                                        className="member-actions"
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
                                            onClick={() => handleEdit(member)}
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
                                            onClick={() => handleDelete(member.id)}
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
                                <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center', mb: 0.5 }}>
                                    {member.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
                                    Age: {member.age}
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                                    <Box sx={{
                                        p: 2,
                                        borderRadius: 3,
                                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                        border: '1px solid',
                                        borderColor: theme.palette.divider
                                    }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                            Invested Amount
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#667eea' }}>
                                            ₹{member.amountInvested.toLocaleString()}
                                        </Typography>
                                    </Box>

                                    <Box sx={{
                                        p: 2,
                                        borderRadius: 3,
                                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                        border: '1px solid',
                                        borderColor: theme.palette.divider
                                    }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                            Paid This Year
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#764ba2' }}>
                                            ₹{member.amountPaidThisYear.toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                <Box sx={{
                                    p: 2.5,
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                    textAlign: 'center'
                                }}>
                                    <Typography variant="caption" sx={{ color: '#764ba2', fontWeight: 600, display: 'block', mb: 0.5 }}>
                                        TOTAL CONTRIBUTION
                                    </Typography>
                                    <Typography variant="h5" sx={{
                                        fontWeight: 800,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}>
                                        ₹{calculateTotal(member).toLocaleString()}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {members.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No temporary members added yet
                    </Typography>
                </Box>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingMember ? 'Edit Temporary Member' : 'Add Temporary Member'}
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

export default TemporaryMembers;
