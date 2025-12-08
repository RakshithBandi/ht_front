/**
 * Authorization React Components and Hooks
 * 
 * React-specific authorization utilities including hooks and components
 * for controlling access to UI elements and routes.
 */

import { useState, useEffect, createContext, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Alert, Box, Button, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { getCurrentUser, canEdit, isAuthenticated, isCurrentUserAuthorized } from './authService';

// ============================================================================
// CONTEXT
// ============================================================================

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const initAuth = () => {
            const currentUser = getCurrentUser();
            const authenticated = isAuthenticated();

            if (authenticated && currentUser) {
                setUser(currentUser);
                setIsAuthorized(canEdit(currentUser));
            } else {
                setUser(null);
                setIsAuthorized(false);
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        setUser(userData);
        setIsAuthorized(canEdit(userData));
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        setUser(null);
        setIsAuthorized(false);
    };

    const value = {
        user,
        loading,
        isAuthorized,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// ============================================================================
// REACT HOOKS
// ============================================================================

/**
 * Custom React hook to access auth context
 * Usage: const { user, isAuthorized, login, logout } = useAuth();
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

/**
 * Custom React hook to get current user and authorization status
 * Usage: const { user, isAuthorized, role } = useCurrentUser();
 */
export const useCurrentUser = () => {
    const { user, isAuthorized } = useAuth();
    return { user, isAuthorized, role: isAuthorized ? 'admin' : 'user' };
};

// ============================================================================
// REACT COMPONENTS
// ============================================================================

/**
 * Protected Route Component
 * Wraps routes that require authorization
 */
export const ProtectedRoute = ({ children, requireAuth = false }) => {
    const { user, isAuthorized, loading } = useAuth();

    if (loading) {
        return null; // Or loading spinner
    }

    // Check if user is logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if authorization is required and user is authorized
    if (requireAuth && !isAuthorized) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    You don't have permission to access this page.
                    Only authorized administrators can view this content.
                </Alert>
            </Box>
        );
    }

    return children;
};

/**
 * Conditional Render Component
 * Shows children only if user is authorized
 */
export const AuthorizedOnly = ({ children, fallback = null }) => {
    const { isAuthorized } = useAuth();
    return isAuthorized ? children : fallback;
};

/**
 * Action Buttons Component
 * Shows Edit/Add/Delete buttons only for authorized users
 */
export const ActionButtons = ({
    onEdit,
    onDelete,
    onAdd,
    showEdit = true,
    showDelete = true,
    showAdd = true,
    variant = 'icon' // 'icon' or 'button'
}) => {
    const { isAuthorized } = useAuth();

    if (!isAuthorized) {
        return null;
    }

    if (variant === 'icon') {
        return (
            <Box sx={{ display: 'flex', gap: 1 }}>
                {showEdit && onEdit && (
                    <IconButton onClick={onEdit} color="primary" size="small">
                        <EditIcon fontSize="small" />
                    </IconButton>
                )}
                {showDelete && onDelete && (
                    <IconButton onClick={onDelete} color="error" size="small">
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                )}
                {showAdd && onAdd && (
                    <IconButton onClick={onAdd} color="success" size="small">
                        <AddIcon fontSize="small" />
                    </IconButton>
                )}
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', gap: 1 }}>
            {showEdit && onEdit && (
                <Button onClick={onEdit} variant="outlined" startIcon={<EditIcon />}>
                    Edit
                </Button>
            )}
            {showDelete && onDelete && (
                <Button onClick={onDelete} variant="outlined" color="error" startIcon={<DeleteIcon />}>
                    Delete
                </Button>
            )}
            {showAdd && onAdd && (
                <Button onClick={onAdd} variant="contained" startIcon={<AddIcon />}>
                    Add
                </Button>
            )}
        </Box>
    );
};

export default {
    AuthProvider,
    useAuth,
    useCurrentUser,
    ProtectedRoute,
    AuthorizedOnly,
    ActionButtons
};
