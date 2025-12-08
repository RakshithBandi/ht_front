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
                    p: 3,
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <LanguageIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Select Application Language
                    </Typography>
                </Box>

                <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <RadioGroup
                        aria-label="language"
                        name="language-group"
                        value={language}
                        onChange={handleLanguageChange}
                    >
                        <Grid container spacing={2}>
                            {languages.map((lang) => (
                                <Grid item xs={12} sm={6} key={lang.code}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            position: 'relative',
                                            borderColor: language === lang.code ? theme.palette.primary.main : theme.palette.divider,
                                            bgcolor: language === lang.code
                                                ? (theme.palette.mode === 'dark' ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)')
                                                : 'transparent',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                borderColor: theme.palette.primary.main,
                                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(102, 126, 234, 0.05)' : 'rgba(102, 126, 234, 0.02)',
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                            <FormControlLabel
                                                value={lang.code}
                                                control={<Radio />}
                                                label={
                                                    <Box>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                            {lang.nativeName}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {lang.name}
                                                        </Typography>
                                                    </Box>
                                                }
                                                sx={{ width: '100%', m: 0 }}
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
