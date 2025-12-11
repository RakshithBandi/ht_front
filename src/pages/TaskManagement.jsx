import { Box, Typography, Paper, useTheme, Button } from '@mui/material';
import { Assessment, Construction } from '@mui/icons-material';

function TaskManagement() {
    const theme = useTheme();

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                        Task Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Organize, assign and track team tasks
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    disabled
                    startIcon={<Assessment />}
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        opacity: 0.7
                    }}
                >
                    Dashboard Coming Soon
                </Button>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: 8,
                    borderRadius: 4,
                    border: '1px dashed',
                    borderColor: theme.palette.divider,
                    background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    minHeight: 400
                }}
            >
                <Box sx={{
                    p: 3,
                    borderRadius: '50%',
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                    mb: 3
                }}>
                    <Construction sx={{ fontSize: 48 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    Under Construction
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mb: 3 }}>
                    We are building a powerful task management system to help your team stay organized. Stay tuned!
                </Typography>
            </Paper>
        </Box>
    );
}

export default TaskManagement;
