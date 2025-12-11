import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Avatar,
    Chip,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    useTheme,
} from '@mui/material';
import {
    Visibility,
    Edit,
    Delete,
    Add,
    Logout,
    People,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Users() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [viewMode, setViewMode] = useState(false);

    // Load users from localStorage on component mount
    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        setUsers(storedUsers);
    }, []);

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setViewMode(true);
        setOpenDialog(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setViewMode(false);
        setOpenDialog(true);
    };

    const handleDeleteUser = (email) => {
        const updatedUsers = users.filter(user => user.email !== email);
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
        setViewMode(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    User Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Logout />}
                    onClick={handleLogout}
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        '&:hover': {
                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b3fa0 100%)',
                        },
                    }}
                >
                    Logout
                </Button>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}
            >
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{
                                background: 'linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%)',
                                ...(theme.palette.mode === 'dark' && {
                                    background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                                })
                            }}>
                                <TableCell sx={{ fontWeight: 700, py: 2, color: 'text.secondary', borderBottom: `2px solid ${theme.palette.divider}` }}>User</TableCell>
                                <TableCell sx={{ fontWeight: 700, py: 2, color: 'text.secondary', borderBottom: `2px solid ${theme.palette.divider}` }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 700, py: 2, color: 'text.secondary', borderBottom: `2px solid ${theme.palette.divider}` }}>Phone</TableCell>
                                <TableCell sx={{ fontWeight: 700, py: 2, color: 'text.secondary', borderBottom: `2px solid ${theme.palette.divider}` }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 700, py: 2, color: 'text.secondary', borderBottom: `2px solid ${theme.palette.divider}` }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Box sx={{ p: 2, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.02)', mb: 2 }}>
                                                <People sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.5 }} />
                                            </Box>
                                            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                No users found
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                New updates will appear here
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user, index) => (
                                    <TableRow
                                        key={index}
                                        hover
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                backgroundColor: theme.palette.mode === 'dark'
                                                    ? 'rgba(255,255,255,0.03)'
                                                    : 'rgba(0,0,0,0.01)',
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                                            },
                                        }}
                                    >
                                        <TableCell sx={{ py: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        fontWeight: 700,
                                                        width: 40,
                                                        height: 40,
                                                        boxShadow: '0 2px 8px rgba(118, 75, 162, 0.3)'
                                                    }}
                                                >
                                                    {getInitials(user.fullName)}
                                                </Avatar>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {user.fullName}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>{user.email}</TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>{user.phone || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label="Active"
                                                size="small"
                                                variant="outlined"
                                                color="success"
                                                sx={{
                                                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                                    borderColor: 'rgba(76, 175, 80, 0.2)',
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleViewUser(user)}
                                                    sx={{
                                                        color: theme.palette.primary.main,
                                                        bgcolor: 'rgba(25, 118, 210, 0.05)',
                                                        '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.15)' }
                                                    }}
                                                >
                                                    <Visibility fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEditUser(user)}
                                                    sx={{
                                                        color: theme.palette.info.main,
                                                        bgcolor: 'rgba(2, 136, 209, 0.05)',
                                                        '&:hover': { bgcolor: 'rgba(2, 136, 209, 0.15)' }
                                                    }}
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteUser(user.email)}
                                                    sx={{
                                                        color: theme.palette.error.main,
                                                        bgcolor: 'rgba(211, 47, 47, 0.05)',
                                                        '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.15)' }
                                                    }}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* User Details Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
                    {viewMode ? 'User Details' : 'Edit User'}
                </DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <Box sx={{ pt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                    <Avatar
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            fontSize: '2rem',
                                            fontWeight: 700,
                                        }}
                                    >
                                        {getInitials(selectedUser.fullName)}
                                    </Avatar>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        value={selectedUser.fullName}
                                        InputProps={{
                                            readOnly: viewMode,
                                        }}
                                        variant={viewMode ? 'filled' : 'outlined'}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        value={selectedUser.email}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        variant="filled"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        value={selectedUser.phone || 'N/A'}
                                        InputProps={{
                                            readOnly: viewMode,
                                        }}
                                        variant={viewMode ? 'filled' : 'outlined'}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Status"
                                        value="Active"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        variant="filled"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={handleCloseDialog} sx={{ textTransform: 'none' }}>
                        Close
                    </Button>
                    {!viewMode && (
                        <Button
                            variant="contained"
                            onClick={handleCloseDialog}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                textTransform: 'none',
                            }}
                        >
                            Save Changes
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Users;
