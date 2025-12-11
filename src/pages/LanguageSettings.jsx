import {
    Box,
    Typography,
    Paper,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    useTheme,
    Grid,
    Card,
    CardContent,
} from '@mui/material';
import { useLanguage } from '../context/LanguageContext';
import { languages } from '../utils/translations';
import { Language as LanguageIcon } from '@mui/icons-material';

function LanguageSettings() {
    const theme = useTheme();
    const { language, changeLanguage } = useLanguage();

    const handleLanguageChange = (event) => {
        changeLanguage(event.target.value);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Language Settings
            </Typography>

            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Box sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                        color: theme.palette.primary.main,
                        mr: 2
                    }}>
                        <LanguageIcon fontSize="medium" />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Select Application Language
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Choose the language you want to see throughout the application
                        </Typography>
                    </Box>
                </Box>

                <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <RadioGroup
                        aria-label="language"
                        name="language-group"
                        value={language}
                        onChange={handleLanguageChange}
                    >
                        <Grid container spacing={3}>
                            {languages.map((lang) => (
                                <Grid item xs={12} sm={6} key={lang.code}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            position: 'relative',
                                            cursor: 'pointer',
                                            border: '2px solid',
                                            borderColor: language === lang.code ? '#667eea' : theme.palette.divider,
                                            borderRadius: 3,
                                            bgcolor: language === lang.code
                                                ? (theme.palette.mode === 'dark' ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.04)')
                                                : 'transparent',
                                            transition: 'all 0.2s ease-in-out',
                                            transform: language === lang.code ? 'scale(1.02)' : 'scale(1)',
                                            boxShadow: language === lang.code ? '0 8px 20px rgba(102, 126, 234, 0.15)' : 'none',
                                            '&:hover': {
                                                borderColor: '#667eea',
                                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(102, 126, 234, 0.05)' : 'rgba(102, 126, 234, 0.02)',
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                            }
                                        }}
                                        onClick={() => changeLanguage(lang.code)}
                                    >
                                        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                                            <FormControlLabel
                                                value={lang.code}
                                                control={<Radio sx={{
                                                    color: language === lang.code ? '#667eea' : 'text.disabled',
                                                    '&.Mui-checked': { color: '#667eea' }
                                                }} />}
                                                label={
                                                    <Box sx={{ ml: 1 }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                            {lang.nativeName}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                            {lang.name}
                                                        </Typography>
                                                    </Box>
                                                }
                                                sx={{ width: '100%', m: 0, pointerEvents: 'none' }}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </RadioGroup>
                </FormControl>
            </Paper>
        </Box>
    );
}

export default LanguageSettings;
