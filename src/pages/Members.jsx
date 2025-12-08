import { Box, Typography } from '@mui/material';

function Members() {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4">Members</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                Select a member category from the sidebar.
            </Typography>
        </Box>
    );
}

export default Members;
