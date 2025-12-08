# 🚀 Quick Copy-Paste Examples

## 📦 Import Guide

```javascript
// For helper functions (pure JavaScript)
import { canEdit, getCurrentUser, isCurrentUserAuthorized } from './services/authService';

// For React hooks and components (JSX)
import { useAuth, useCurrentUser, ProtectedRoute, ActionButtons } from './services/authComponents';
```

## 1️⃣ Basic Authorization Check

```javascript
import { useAuth } from './services/authComponents';

function MyComponent() {
    const isAuthorized = useAuth();

    return (
        <div>
            {isAuthorized && <button>Edit</button>}
        </div>
    );
}
```

## 2️⃣ Show/Hide Buttons

```javascript
import { useAuth } from './services/authComponents';

function ProductCard({ product }) {
    const isAuthorized = useAuth();

    return (
        <div>
            <h2>{product.name}</h2>
            {isAuthorized && (
                <>
                    <button onClick={() => handleEdit(product.id)}>Edit</button>
                    <button onClick={() => handleDelete(product.id)}>Delete</button>
                </>
            )}
        </div>
    );
}
```

## 3️⃣ Protected Route

```javascript
// In App.jsx
import { ProtectedRoute } from './services/authComponents';

<Route
    path="/admin"
    element={
        <ProtectedRoute requireAuth={true}>
            <AdminPage />
        </ProtectedRoute>
    }
/>
```

## 4️⃣ Using ActionButtons Component

```javascript
import { ActionButtons } from './services/authComponents';

function ItemCard({ item }) {
    return (
        <div>
            <h3>{item.name}</h3>
            <ActionButtons
                onEdit={() => handleEdit(item.id)}
                onDelete={() => handleDelete(item.id)}
                variant="icon"
            />
        </div>
    );
}
```

## 5️⃣ Get User Info

```javascript
import { useCurrentUser } from './services/authComponents';

function Header() {
    const { user, isAuthorized, role } = useCurrentUser();

    return (
        <div>
            <p>Welcome, {user?.email}</p>
            <p>Role: {role}</p>
            {isAuthorized && <button>Admin Panel</button>}
        </div>
    );
}
```

## 6️⃣ Conditional Section

```javascript
import { AuthorizedOnly } from './services/authComponents';

function Dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>
            
            <AuthorizedOnly>
                <div className="admin-section">
                    <button>Add Item</button>
                    <button>Settings</button>
                </div>
            </AuthorizedOnly>
        </div>
    );
}
```

## 7️⃣ Complete CRUD Example

```javascript
import { useAuth, ActionButtons } from './services/authComponents';
import { useState } from 'react';

function ItemList() {
    const isAuthorized = useAuth();
    const [items, setItems] = useState([]);

    const handleAdd = () => {
        // Add logic
    };

    const handleEdit = (id) => {
        // Edit logic
    };

    const handleDelete = (id) => {
        // Delete logic
    };

    return (
        <div>
            <h1>Items</h1>
            
            {/* Add button - only for authorized users */}
            {isAuthorized && (
                <button onClick={handleAdd}>Add New Item</button>
            )}

            {/* Item list */}
            {items.map(item => (
                <div key={item.id}>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    
                    {/* Edit/Delete - only for authorized users */}
                    <ActionButtons
                        onEdit={() => handleEdit(item.id)}
                        onDelete={() => handleDelete(item.id)}
                        showAdd={false}
                    />
                </div>
            ))}
        </div>
    );
}
```

## 8️⃣ Helper Function (Outside React)

```javascript
import { getCurrentUser, canEdit } from './services/authService';

// In a utility function or service
export function deleteItem(itemId) {
    const user = getCurrentUser();
    
    if (!canEdit(user)) {
        alert('You do not have permission to delete items');
        return;
    }
    
    // Proceed with deletion
    // ...
}
```

## 9️⃣ Multiple Authorization Levels

```javascript
import { useCurrentUser } from './services/authComponents';

function AdminPanel() {
    const { user, isAuthorized } = useCurrentUser();

    // Super admin check
    const isSuperAdmin = user?.email === 'admin@example.com';

    return (
        <div>
            {isAuthorized && <button>Edit Users</button>}
            {isSuperAdmin && <button>Delete All Data</button>}
        </div>
    );
}
```

## 🔟 Form with Authorization

```javascript
import { useAuth } from './services/authService';

function ProductForm({ product }) {
    const isAuthorized = useAuth();

    if (!isAuthorized) {
        return <p>You don't have permission to edit products.</p>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <input name="name" defaultValue={product.name} />
            <input name="price" defaultValue={product.price} />
            <button type="submit">Save</button>
        </form>
    );
}
```

---

## 📝 Change Authorized Emails

Edit `src/services/authService.js`:

```javascript
const AUTHORIZED_EMAILS = [
    'your-admin@email.com',
    'another-admin@email.com'
];
```

## ✅ Testing

**As Admin:**
- Login with: `admin@example.com` or `manager@example.com`
- You should see all Edit/Add/Delete buttons

**As Regular User:**
- Login with any other email
- Edit/Add/Delete buttons should be hidden
