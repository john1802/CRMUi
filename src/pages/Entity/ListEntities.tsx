import { useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { EntityApi } from '../../api/entityApi';
import { Entity } from '../../types/entity';
import { EntityCard } from '../../components/Entity/EntityCard';
import { entityListReducer, initialState } from '../../reducers/entityListReducer';

export const ListEntities = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(entityListReducer, initialState);
  const { entities, isLoading, error, openDrawer, editingEntity, formValues, searchQuery, snackbar } = state;

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    try {
      dispatch({ type: 'FETCH_INIT' });
      const response = await EntityApi.getAll();
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to load entities' });
    }
  };

  const handleOpenCreateDrawer = () => {
    dispatch({ type: 'OPEN_CREATE_DRAWER' });
  };

  const handleOpenEditDrawer = (e: React.MouseEvent, entity: Entity) => {
    e.stopPropagation();
    dispatch({ type: 'OPEN_EDIT_DRAWER', payload: entity });
  };

  const handleSaveEntity = async () => {
    if (!formValues.name.trim() || !formValues.slug.trim()) {
      // For simplicity in this refactor, handling error locally or via another dispatch
      // In a real app we might want a SET_FORM_ERROR action
      alert('Name and Slug are required');
      return;
    }
    try {
      if (editingEntity) {
        await EntityApi.update(editingEntity.id, {
          name: formValues.name,
          slug: formValues.slug,
          configJson: formValues.configJson || undefined,
        });
      } else {
        await EntityApi.create({
          name: formValues.name,
          slug: formValues.slug,
          configJson: formValues.configJson || undefined,
        });
      }
      dispatch({ type: 'CLOSE_DRAWER' });
      dispatch({ type: 'SHOW_SNACKBAR', payload: { message: editingEntity ? 'Entity updated successfully' : 'Entity created successfully', severity: 'success' } });
      fetchEntities();
    } catch (err) {
      dispatch({ type: 'SHOW_SNACKBAR', payload: { message: editingEntity ? 'Failed to update entity' : 'Failed to create entity', severity: 'error' } });
    }
  };

  const handleCloseDrawer = () => {
    dispatch({ type: 'CLOSE_DRAWER' });
  };

  const handleCloseSnackbar = () => {
    dispatch({ type: 'HIDE_SNACKBAR' });
  };

  const filteredEntities = entities.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#F4F7F6' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar title="Entities" />
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
                {entities.length} Entities
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ ml: 2, color: '#6c757d', borderColor: '#dcdfe8', textTransform: 'none' }}
                >
                  +New Hint
                </Button>
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
                  Create Entity
                </Button>
              </Box>
            </Box>

            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search entities..."
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
              {filteredEntities.length === 0 ? (
                <Grid xs={12}>
                  <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                    No entities found. Create one to get started.
                  </Box>
                </Grid>
              ) : (
                filteredEntities.map((entity) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={entity.id}>
                    <EntityCard
                      entity={entity}
                      onClick={() => navigate(`/entities/${entity.id}/records`)}
                      onEdit={(e) => handleOpenEditDrawer(e, entity)}
                    />
                  </Grid>
                ))
              )}
            </Grid>
          )}

          {/* Create/Edit Entity Drawer - Right Side Panel */}
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
                  {editingEntity ? 'Entity Details' : 'Create New Entity'}
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
                  <Typography variant="h6">{formValues.name || 'Entity Name'}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {editingEntity ? 'Active - UI Designer' : 'New Entity Profile'}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#1E1E2D' }}>
                  GENERAL INFORMATION
                </Typography>
                <Grid container spacing={2}>
                  <Grid xs={12}>
                    <TextField
                      autoFocus
                      label="Fullname"
                      fullWidth
                      variant="outlined"
                      value={formValues.name}
                      onChange={(e) => dispatch({ type: 'UPDATE_FORM', field: 'name', value: e.target.value })}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <TextField
                      label="Slug (URL Friendly)"
                      placeholder="e.g., customers, projects"
                      fullWidth
                      variant="outlined"
                      value={formValues.slug}
                      onChange={(e) => dispatch({ type: 'UPDATE_FORM', field: 'slug', value: e.target.value })}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <TextField
                      label="Configuration JSON"
                      placeholder='{"theme": "dark"}'
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={4}
                      value={formValues.configJson}
                      onChange={(e) => dispatch({ type: 'UPDATE_FORM', field: 'configJson', value: e.target.value })}
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
                  onClick={handleSaveEntity}
                  variant="contained"
                  color="primary"
                >
                  {editingEntity ? 'Save Changes' : 'Create Entity'}
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

export default ListEntities;
