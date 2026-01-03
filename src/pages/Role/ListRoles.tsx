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
    Snackbar,
    Alert,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Close as CloseIcon,
    Security as SecurityIcon,
} from '@mui/icons-material';
import { Sidebar } from '../../components/layout/Sidebar';
import { Navbar } from '../../components/layout/Navbar';
import { RoleApi } from '../../api/roleApi';
import { Role } from '../../types/role';
import { RoleCard } from '../../components/Role/RoleCard';
import { roleListReducer, initialState } from '../../reducers/roleListReducer';

export const ListRoles = () => {
    const [state, dispatch] = useReducer(roleListReducer, initialState);
    const { roles, isLoading, error, openDrawer, editingRole, formValues, searchQuery, snackbar } = state;

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            dispatch({ type: 'FETCH_INIT' });
            const response = await RoleApi.getAll();
            dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
        } catch (err) {
            dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to load roles' });
        }
    };

    const handleOpenCreateDrawer = () => {
        dispatch({ type: 'OPEN_CREATE_DRAWER' });
    };

    const handleOpenEditDrawer = (e: React.MouseEvent, role: Role) => {
        e.stopPropagation();
        dispatch({ type: 'OPEN_EDIT_DRAWER', payload: role });
    };

    const handleDeleteRole = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this role?')) {
            try {
                await RoleApi.delete(id);
                dispatch({ type: 'SHOW_SNACKBAR', payload: { message: 'Role deleted successfully', severity: 'success' } });
                fetchRoles();
            } catch (err) {
                dispatch({ type: 'SHOW_SNACKBAR', payload: { message: 'Failed to delete role', severity: 'error' } });
            }
        }
    }

    const handleSaveRole = async () => {
        if (!formValues.name.trim()) {
            dispatch({ type: 'SHOW_SNACKBAR', payload: { message: 'Role Name is required', severity: 'warning' } });
            return;
        }

        try {
            const payload = {
                name: formValues.name,
                metadata: {
                    description: formValues.description,
                    level: parseInt(formValues.level) || 0
                }
            };

            if (editingRole) {
                await RoleApi.update(editingRole.id, payload);
            } else {
                await RoleApi.create(payload);
            }
            dispatch({ type: 'CLOSE_DRAWER' });
            dispatch({ type: 'SHOW_SNACKBAR', payload: { message: editingRole ? 'Role updated successfully' : 'Role created successfully', severity: 'success' } });
            fetchRoles();
        } catch (err) {
            dispatch({ type: 'SHOW_SNACKBAR', payload: { message: editingRole ? 'Failed to update role' : 'Failed to create role', severity: 'error' } });
        }
    };

    const handleCloseDrawer = () => {
        dispatch({ type: 'CLOSE_DRAWER' });
    };

    const handleCloseSnackbar = () => {
        dispatch({ type: 'HIDE_SNACKBAR' });
    };

    const filteredRoles = roles.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#F4F7F6' }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Navbar title="Roles" />
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
                                {roles.length} Roles
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
                                    Create Role
                                </Button>
                            </Box>
                        </Box>

                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search roles..."
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
                            {filteredRoles.length === 0 ? (
                                <Grid size={{ xs: 12 }}>
                                    <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                                        No roles found. Create one to get started.
                                    </Box>
                                </Grid>
                            ) : (
                                filteredRoles.map((role) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={role.id}>
                                        <RoleCard
                                            role={role}
                                            onEdit={(e) => handleOpenEditDrawer(e, role)}
                                            onDelete={(e) => handleDeleteRole(e, role.id)}
                                        />
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    )}

                    {/* Create/Edit Role Drawer - Right Side Panel */}
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
                                    {editingRole ? 'Role Details' : 'Create New Role'}
                                </Typography>
                                <IconButton onClick={handleCloseDrawer}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        bgcolor: '#FFC107',
                                        color: '#1E1E2D',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <SecurityIcon sx={{ fontSize: '2.5rem' }} />
                                </Box>
                                <Box>
                                    <Typography variant="h6">{formValues.name || 'Role Name'}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {editingRole ? `Level ${editingRole.metadata.level}` : 'New System Role'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 4 }} />

                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#1E1E2D' }}>
                                    ROLE INFORMATION
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            autoFocus
                                            label="Role Name"
                                            fullWidth
                                            variant="outlined"
                                            value={formValues.name}
                                            onChange={(e) => dispatch({ type: 'UPDATE_FORM', field: 'name', value: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            label="Description"
                                            fullWidth
                                            variant="outlined"
                                            multiline
                                            rows={3}
                                            value={formValues.description}
                                            onChange={(e) => dispatch({ type: 'UPDATE_FORM', field: 'description', value: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            label="Level"
                                            type="number"
                                            fullWidth
                                            variant="outlined"
                                            value={formValues.level}
                                            onChange={(e) => dispatch({ type: 'UPDATE_FORM', field: 'level', value: e.target.value })}
                                            helperText="Numeric level (e.g., 1 for Admin, 2 for Manager)"
                                        />
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
                                    onClick={handleSaveRole}
                                    variant="contained"
                                    color="primary"
                                >
                                    {editingRole ? 'Save Changes' : 'Create Role'}
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

export default ListRoles;
