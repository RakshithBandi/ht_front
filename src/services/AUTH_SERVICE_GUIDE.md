# Authorization Service - Usage Guide

This guide shows you how to use the authorization service to control access to edit, add, and delete operations in your React application.

## 📦 Files Structure

The authorization system is split into two files:

1. **`authService.js`** - Pure JavaScript helper functions (no React/JSX)
2. **`authComponents.jsx`** - React hooks and components (with JSX)

## 📋 Quick Start

### 1. Import what you need

```javascript
// For helper functions (use anywhere, including non-React code)
import { canEdit, getCurrentUser, isCurrentUserAuthorized } from './services/authService';

// For React hooks and components (use in React components)
import { useAuth, ProtectedRoute, ActionButtons } from './services/authComponents';
```

### 2. Configure authorized users

Edit `authService.js` and update the `AUTHORIZED_EMAILS` array:

```javascript
const AUTHORIZED_EMAILS = [
    'admin@example.com',
    'manager@example.com'
];
```

## 🔧 Available Functions

### Helper Functions

#### `getCurrentUser()`
Get the currently logged-in user from localStorage.

```javascript
const user = getCurrentUser();
console.log(user.email); // 'admin@example.com'
```

#### `canEdit(user)`
Check if a user is authorized to edit/add/delete.

```javascript
const user = getCurrentUser();
if (canEdit(user)) {
    // Show edit buttons
}
```

#### `isCurrentUserAuthorized()`
Check if the currently logged-in user is authorized.

```javascript
if (isCurrentUserAuthorized()) {
    // User is authorized
}
```

## 🎣 React Hooks

### `useAuth()`
Simple hook that returns true if current user is authorized.

```javascript
function MyComponent() {
    const isAuthorized = useAuth();

    return (
        <div>
            {isAuthorized && <button>Edit</button>}
        </div>
    );
}
```

### `useCurrentUser()`
Get user info and authorization status.

```javascript
function MyComponent() {
    const { user, isAuthorized, role } = useCurrentUser();

    return (
        <div>
            <p>Email: {user?.email}</p>
            <p>Role: {role}</p>
            {isAuthorized && <button>Admin Actions</button>}
        </div>
    );
}
```

## 🛡️ React Components

### `<ProtectedRoute>`
Protect entire pages/routes.

```javascript
// In App.jsx
import { ProtectedRoute } from './services/authService';

<Route
    path="/admin"
    element={
        <ProtectedRoute requireAuth={true}>
            <AdminPage />
        </ProtectedRoute>
    }
/>
```

### `<AuthorizedOnly>`
Conditionally render content for authorized users only.

```javascript
import { AuthorizedOnly } from './services/authService';

function MyComponent() {
    return (
        <div>
            <h1>My Page</h1>
            <AuthorizedOnly>
                <button>Edit</button>
                <button>Delete</button>
            </AuthorizedOnly>
        </div>
    );
}
```

### `<ActionButtons>`
Pre-built Edit/Delete/Add buttons that only show for authorized users.

```javascript
import { ActionButtons } from './services/authService';

function ItemCard({ item }) {
    const handleEdit = () => console.log('Edit', item.id);
    const handleDelete = () => console.log('Delete', item.id);

    return (
        <div>
            <h3>{item.name}</h3>
            <ActionButtons
                onEdit={handleEdit}
                onDelete={handleDelete}
                variant="button" // or "icon"
            />
        </div>
    );
}
```

## 💡 Complete Examples

### Example 1: Simple Component with Edit Button

```javascript
import { useAuth } from './services/authService';

function ProductCard({ product }) {
    const isAuthorized = useAuth();

    return (
        <div>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            
            {isAuthorized && (
                <button onClick={() => editProduct(product.id)}>
                    Edit Product
                </button>
            )}
        </div>
    );
}
```

### Example 2: List with Add/Edit/Delete

```javascript
import { useCurrentUser, ActionButtons } from './services/authService';

function ProductList() {
    const { isAuthorized } = useCurrentUser();
    const [products, setProducts] = useState([]);

    const handleAdd = () => {
        // Add new product
    };

    const handleEdit = (id) => {
        // Edit product
    };

    const handleDelete = (id) => {
        // Delete product
    };

    return (
        <div>
            <h1>Products</h1>
            
            {/* Add button - only for authorized users */}
            {isAuthorized && (
                <button onClick={handleAdd}>Add New Product</button>
            )}

            {/* Product list */}
            {products.map(product => (
                <div key={product.id}>
                    <h3>{product.name}</h3>
                    
                    {/* Edit/Delete buttons - only for authorized users */}
                    <ActionButtons
                        onEdit={() => handleEdit(product.id)}
                        onDelete={() => handleDelete(product.id)}
                        showAdd={false}
                        variant="icon"
                    />
                </div>
            ))}
        </div>
    );
}
```

### Example 3: Protected Admin Page

```javascript
// In App.jsx
import { ProtectedRoute } from './services/authService';
import AdminDashboard from './pages/AdminDashboard';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            
            {/* Only authorized users can access */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute requireAuth={true}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}
```

### Example 4: Conditional Rendering with Fallback

```javascript
import { AuthorizedOnly } from './services/authService';

function Dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>
            
            <AuthorizedOnly
                fallback={
                    <p>You don't have permission to manage items.</p>
                }
            >
                <div>
                    <button>Add Item</button>
                    <button>Manage Users</button>
                    <button>Settings</button>
                </div>
            </AuthorizedOnly>
        </div>
    );
}
```

### Example 5: Using in Existing Components

```javascript
// Update your existing PermanentMembers.jsx
import { useAuth } from './services/authService';

function PermanentMembers() {
    const isAuthorized = useAuth(); // Replace your existing auth check

    return (
        <Box>
            {isAuthorized && (
                <Button onClick={handleOpenDialog}>
                    Add Permanent Member
                </Button>
            )}
            
            {/* Rest of your component */}
        </Box>
    );
}
```

## 🔐 How It Works

1. **User Login**: When a user logs in, their email is stored in localStorage
2. **Authorization Check**: The service checks if the user's email is in the `AUTHORIZED_EMAILS` list
3. **Conditional Rendering**: Components/buttons only show for authorized users
4. **Route Protection**: Entire pages can be protected from unauthorized access

## ✅ Best Practices

1. **Use hooks in components**: `useAuth()` or `useCurrentUser()`
2. **Use helper functions in utilities**: `canEdit(user)` or `isCurrentUserAuthorized()`
3. **Protect sensitive routes**: Wrap admin pages with `<ProtectedRoute>`
4. **Use ActionButtons**: For consistent UI across your app

## 🎯 Testing

To test as an authorized user:
1. Sign up or login with `admin@example.com` or `manager@example.com`
2. You should see Edit/Add/Delete buttons
3. You can access protected routes

To test as a regular user:
1. Sign up or login with any other email
2. Edit/Add/Delete buttons should be hidden
3. Protected routes should show "unauthorized" message

## 📝 Customization

### Change authorized emails
Edit `AUTHORIZED_EMAILS` in `authService.js`:

```javascript
const AUTHORIZED_EMAILS = [
    'your-admin@email.com',
    'another-admin@email.com'
];
```

### Add more authorization levels
Extend the service with roles:

```javascript
export const getUserPermissions = (user) => {
    if (user.email === 'superadmin@example.com') {
        return ['read', 'write', 'delete', 'admin'];
    }
    if (AUTHORIZED_EMAILS.includes(user.email)) {
        return ['read', 'write', 'delete'];
    }
    return ['read'];
};
```

## 🚀 Integration Steps

1. ✅ Copy `authService.js` to `src/services/`
2. ✅ Update `AUTHORIZED_EMAILS` with your admin emails
3. ✅ Import and use in your components
4. ✅ Wrap protected routes with `<ProtectedRoute>`
5. ✅ Test with authorized and unauthorized users

That's it! Your authorization system is ready to use! 🎉
