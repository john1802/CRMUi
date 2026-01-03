import React, { useReducer, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Drawer,
    TextField,
    Grid,
    InputAdornment,
    IconButton,
    Divider,
    Avatar,
    Snackbar,
    Alert,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { Sidebar } from '../../components/layout/Sidebar';
import { Navbar } from '../../components/layout/Navbar';
import { UserApi } from '../../api/userApi';
import { RoleApi } from '../../api/roleApi';
import { User } from '../../types/user';
import { Role } from '../../types/role';
import { UserCard } from '../../components/User/UserCard';
import { userListReducer, initialState } from '../../reducers/userListReducer';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

export const ListUsers = () => {
    const [state, dispatch] = useReducer(userListReducer, initialState);
    const { users, roles, isLoading, error, openDrawer, editingUser, formValues, searchQuery, snackbar } = state;

    useEffect(() => {
        const initData = async () => {
            try {
                dispatch({ type: 'FETCH_INIT' });
                const [usersResponse, rolesResponse] = await Promise.all([
                    UserApi.getAll(),
                    RoleApi.getAll()
                ]);
                dispatch({ type: 'FETCH_SUCCESS', payload: usersResponse.data });
                dispatch({ type: 'FETCH_ROLES_SUCCESS', payload: rolesResponse.data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to load initial data' });
            }
        };

        initData();
    }, []);

    // fetchUsers removed as it is no longer used. Data is managed via optimistic updates and initial load.

    const handleOpenCreateDrawer = () => {
        dispatch({ type: 'OPEN_CREATE_DRAWER' });
    };

    const handleOpenEditDrawer = (e: React.MouseEvent, user: User) => {
        e.stopPropagation();
        dispatch({ type: 'OPEN_EDIT_DRAWER', payload: { ...user } });
    };

    const handleSaveUser = async () => {
        if (!formValues.name.trim() || !formValues.roleId.trim()) {
            dispatch({ type: 'SHOW_SNACKBAR', payload: { message: 'Name and Role are required', severity: 'warning' } });
            return;
        }

        // Email/Password check for create
        if (!editingUser) {
            if (!formValues.email.trim() || !formValues.password.trim()) {
                dispatch({ type: 'SHOW_SNACKBAR', payload: { message: 'Email and Password required for new users', severity: 'warning' } });
                return;
            }
        }

        try {
            if (editingUser) {
                const response = await UserApi.update(editingUser.id, {
                    name: formValues.name,
                    roleId: formValues.roleId,
                });
                dispatch({ type: 'UPDATE_USER', payload: response.data });
            } else {
                const response = await UserApi.create({
                    email: formValues.email,
                    name: formValues.name,
                    password: formValues.password,
                    roleId: formValues.roleId,
                });
                dispatch({ type: 'ADD_USER', payload: response.data });
            }
            dispatch({ type: 'CLOSE_DRAWER' });
            dispatch({ type: 'SHOW_SNACKBAR', payload: { message: editingUser ? 'User updated successfully' : 'User created successfully', severity: 'success' } });
            // Manual state update ensures UI is correct immediately.
            // fetchUsers(); // Removed to prevent race condition/stale data overwrite
        } catch (err) {
            dispatch({ type: 'SHOW_SNACKBAR', payload: { message: editingUser ? 'Failed to update user' : 'Failed to create user', severity: 'error' } });
        }
    };

    const handleToggleStatus = async (_: React.ChangeEvent<HTMLInputElement>, checked: boolean, userId: string) => {
        dispatch({ type: 'UPDATE_USER_STATUS', payload: { id: userId, isActive: checked } });
        try {
            await UserApi.updateStatus(userId, { isActive: checked });
            dispatch({ type: 'SHOW_SNACKBAR', payload: { message: `User ${checked ? 'activated' : 'deactivated'} successfully`, severity: 'success' } });
        } catch (err) {
            dispatch({ type: 'UPDATE_USER_STATUS', payload: { id: userId, isActive: !checked } });
            dispatch({ type: 'SHOW_SNACKBAR', payload: { message: 'Failed to update user status', severity: 'error' } });
        }
    };

    const handleCloseDrawer = () => {
        dispatch({ type: 'CLOSE_DRAWER' });
    };

    const handleCloseSnackbar = () => {
        dispatch({ type: 'HIDE_SNACKBAR' });
    };

    const filteredUsers = users.filter(u =>
        (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#F4F7F6' }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Navbar title="Users" />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 4,
                        pt: 12,
                        overflow: 'auto',
                    }}
                >
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h4" sx={{ fontSize: '1.8rem' }}>
                                {users.length} Users
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<FilterIcon />}
                                    sx={{ color: '#6c757d', borderColor: '#dcdfe8', textTransform: 'none' }}
                                >
                                    Filter
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                    onClick={handleOpenCreateDrawer}
                                >
                                    Create User
                                </Button>
                            </Box>
                        </Box>

                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                            sx={{
                                maxWidth: 400,
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#fff',
                                    borderRadius: 2,
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Box sx={{ p: 4, textAlign: 'center', color: 'error.main' }}>
                            {error}
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {filteredUsers.length === 0 ? (
                                <Grid size={{ xs: 12 }}>
                                    <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                                        No users found. Create one to get started.
                                    </Box>
                                </Grid>
                            ) : (
                                filteredUsers.map((user) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={user.id}>
                                        <UserCard
                                            user={user}
                                            roles={roles}
                                            onEdit={(e) => handleOpenEditDrawer(e, user)}
                                            onToggleStatus={(e, checked) => handleToggleStatus(e, checked, user.id)}
                                        />
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    )}

                    {/* Create/Edit User Drawer - Right Side Panel */}
                    <Drawer
                        anchor="right"
                        open={openDrawer}
                        onClose={handleCloseDrawer}
                        sx={{
                            '& .MuiDrawer-paper': {
                                width: 480,
                                p: 0,
                                backgroundColor: '#fff',
                                border: 'none',
                                boxShadow: '-10px 0 30px rgba(0,0,0,0.05)',
                            },
                        }}
                    >
                        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    {editingUser ? 'User Details' : 'Create New User'}
                                </Typography>
                                <IconButton onClick={handleCloseDrawer}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Avatar
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        bgcolor: '#FFC107',
                                        color: '#1E1E2D',
                                        fontSize: '2rem',
                                        fontWeight: 800,
                                    }}
                                >
                                    {formValues.name.charAt(0) || '?'}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">{formValues.name || 'User Name'}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {editingUser ? editingUser.email : 'New User Profile'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 4 }} />

                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#1E1E2D' }}>
                                    GENERAL INFORMATION
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            autoFocus
                                            label="Fullname"
                                            fullWidth
                                            variant="outlined"
                                            value={formValues.name}
                                            onChange={(e) => dispatch({ type: 'UPDATE_FORM', field: 'name', value: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            label="Email"
                                            fullWidth
                                            variant="outlined"
                                            disabled={!!editingUser}
                                            value={formValues.email}
                                            onChange={(e) => dispatch({ type: 'UPDATE_FORM', field: 'email', value: e.target.value })}
                                        />
                                    </Grid>
                                    {!editingUser && (
                                        <Grid size={{ xs: 12 }}>
                                            <TextField
                                                label="Password"
                                                type="password"
                                                fullWidth
                                                variant="outlined"
                                                value={formValues.password}
                                                onChange={(e) => dispatch({ type: 'UPDATE_FORM', field: 'password', value: e.target.value })}
                                            />
                                        </Grid>
                                    )}
                                    <Grid size={{ xs: 12 }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="role-select-label">Role</InputLabel>
                                            <Select
                                                labelId="role-select-label"
                                                id="role-select"
                                                value={formValues.roleId}
                                                label="Role"
                                                onChange={(e) => dispatch({ type: 'UPDATE_FORM', field: 'roleId', value: e.target.value })}
                                            >
                                                {roles.map((role: Role) => (
                                                    <MenuItem key={role.id} value={role.id}>
                                                        {role.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box sx={{ pt: 3, borderTop: '1px solid #f0f0f0', display: 'flex', gap: 2 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleCloseDrawer}
                                    sx={{ color: '#1E1E2D', borderColor: '#dcdfe8' }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    fullWidth
                                    onClick={handleSaveUser}
                                    variant="contained"
                                    color="primary"
                                >
                                    {editingUser ? 'Save Changes' : 'Create User'}
                                </Button>
                            </Box>
                        </Box>
                    </Drawer>
                </Box>
            </Box>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ListUsers;
