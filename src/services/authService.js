/**
 * Authorization Service - Core Utilities
 * 
 * This service provides authorization utilities for controlling access to
 * edit, add, and delete operations based on user email addresses.
 * 
 * Only users with specific email addresses are authorized to perform
 * administrative actions.
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * List of authorized roles
 * Only users with these roles can perform edit, add, and delete operations
 */
export const AUTHORIZED_ROLES = ['Admin', 'Manager'];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the currently logged-in user from localStorage
 * @returns {Object|null} User object or null if not logged in
 */
export const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};

/**
 * Check if a user is authorized to edit/add/delete
 * @param {Object} user - User object with groups or role property
 * @returns {boolean} True if user is authorized, false otherwise
 */
export const canEdit = (user) => {
    if (!user) {
        return false;
    }

    // Check if user has Admin or Manager role
    if (user.role && AUTHORIZED_ROLES.includes(user.role)) {
        return true;
    }

    // Check if user belongs to Admin or Manager group
    if (user.groups && Array.isArray(user.groups)) {
        return user.groups.some(group => AUTHORIZED_ROLES.includes(group));
    }

    return false;
};

/**
 * Check if the currently logged-in user is authorized
 * @returns {boolean} True if current user is authorized, false otherwise
 */
export const isCurrentUserAuthorized = () => {
    const user = getCurrentUser();
    return canEdit(user);
};

/**
 * Check if a user can perform a specific action
 * @param {Object} user - User object
 * @param {string} action - Action type ('edit', 'add', 'delete', 'view')
 * @returns {boolean} True if user can perform the action
 */
export const canPerformAction = (user, action) => {
    // Anyone can view
    if (action === 'view') {
        return true;
    }

    // Only authorized users can edit, add, or delete
    if (['edit', 'add', 'delete'].includes(action)) {
        return canEdit(user);
    }

    return false;
};

/**
 * Get user role based on authorization
 * @param {Object} user - User object
 * @returns {string} 'admin' if authorized, 'user' otherwise
 */
export const getUserRole = (user) => {
    return canEdit(user) ? 'admin' : 'user';
};

/**
 * Check if user is authenticated (logged in)
 * @returns {boolean} True if user is logged in
 */
export const isAuthenticated = () => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    const user = getCurrentUser();
    return isAuth && user !== null;
};

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * EXAMPLE 1: Using canEdit() helper function
 * 
 * import { getCurrentUser, canEdit } from './services/authService';
 * 
 * function MyComponent() {
 *     const user = getCurrentUser();
 *     const userCanEdit = canEdit(user);
 * 
 *     return (
 *         <div>
 *             {userCanEdit && <button>Edit</button>}
 *             {userCanEdit && <button>Delete</button>}
 *         </div>
 *     );
 * }
 */

/**
 * EXAMPLE 2: Using isCurrentUserAuthorized()
 * 
 * import { isCurrentUserAuthorized } from './services/authService';
 * 
 * function MyComponent() {
 *     const isAuthorized = isCurrentUserAuthorized();
 * 
 *     return (
 *         <div>
 *             {isAuthorized ? (
 *                 <button>Edit Item</button>
 *             ) : (
 *                 <p>You don't have permission to edit</p>
 *             )}
 *         </div>
 *     );
 * }
 */

/**
 * EXAMPLE 3: Check permissions before API call
 * 
 * import { getCurrentUser, canEdit } from './services/authService';
 * 
 * async function deleteItem(itemId) {
 *     const user = getCurrentUser();
 *     
 *     if (!canEdit(user)) {
 *         alert('You do not have permission to delete items');
 *         return;
 *     }
 *     
 *     // Proceed with deletion
 *     await api.delete(`/items/${itemId}`);
 * }
 */

export default {
    // Helper Functions
    getCurrentUser,
    canEdit,
    isCurrentUserAuthorized,
    canPerformAction,
    getUserRole,
    isAuthenticated,

    // Constants
    AUTHORIZED_ROLES
};
