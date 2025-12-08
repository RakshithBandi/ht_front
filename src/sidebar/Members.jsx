import { useState } from 'react';
import {
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    List,
} from '@mui/material';
import {
    People,
    ExpandLess,
    ExpandMore,
    PersonOutline,
    Badge,
    ChildCare,
} from '@mui/icons-material';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

function Members() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const { t } = useLanguage();

    const handleClick = () => {
        setOpen(!open);
    };

    const submenuItems = [
        { text: t('permanentMembers'), icon: <Badge />, path: '/members/permanent' },
        { text: t('temporaryMembers'), icon: <PersonOutline />, path: '/members/temporary' },
        { text: t('juniorMembers'), icon: <ChildCare />, path: '/members/junior' },
    ];

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                    onClick={handleClick}
                    sx={{
                        borderRadius: 2,
                        '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark'
                                ? 'rgba(102, 126, 234, 0.15)'
                                : 'rgba(102, 126, 234, 0.1)',
                        },
                    }}
                >
                    <ListItemIcon sx={{ color: theme.palette.primary.main, minWidth: 40 }}>
                        <People />
                    </ListItemIcon>
                    <ListItemText
                        primary={t('members')}
                        primaryTypographyProps={{
                            fontWeight: 500,
                        }}
                    />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
            </ListItem>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {submenuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => handleNavigate(item.path)}
                                sx={{
                                    pl: 4,
                                    borderRadius: 2,
                                    '&:hover': {
                                        backgroundColor: theme.palette.mode === 'dark'
                                            ? 'rgba(102, 126, 234, 0.15)'
                                            : 'rgba(102, 126, 234, 0.1)',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: theme.palette.primary.main, minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: 400,
                                        fontSize: '0.9rem',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Collapse>
        </>
    );
}

export default Members;
