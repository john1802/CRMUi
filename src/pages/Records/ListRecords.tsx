import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Alert } from '@mui/material';
import { Sidebar } from '../../components/layout/Sidebar';
import { Navbar } from '../../components/layout/Navbar';
import { DynamicList } from '../../components/dynamic-list/DynamicList';
import { DynamicField } from '../../components/DynamicScreen/DynamicField';
import { useFetchDefinition } from '../../hooks/useFetchDefinition';
import { RecordApi } from '../../api/recordApi';
import { Record } from '../../types/record';
import { RecordModal } from '../../components/dynamic-list/RecordModal';
import { Record as EntityRecord } from '../../types/record';

export const ListRecords = () => {
  const { entityId } = useParams<{ entityId: string }>();
  const { entity, fields: allFields, isLoading: definitionLoading, error: definitionError } = useFetchDefinition(entityId);

  const listFields = allFields.filter(f => f.uiMeta?.page === 'list');
  const formFields = allFields.filter(f => !f.uiMeta?.page || f.uiMeta?.page === 'form');
  const fields = formFields; // for Modal

  const [records, setRecords] = useState<Record[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const [formValues, setFormValues] = useState<{ [key: string]: unknown }>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  // Filter State
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string }>({});

  const fetchRecords = useCallback(async () => {
    if (!entityId) return;
    try {
      setIsLoading(true);
      const response = await RecordApi.getByEntity(entityId, {
        page: page + 1,
        limit: rowsPerPage,
        search: search || undefined,
        ...activeFilters
      });
      setRecords(response.data.records);
      setTotal(response.data.total);
    } catch (err) {
      setError('Failed to load records');
    } finally {
      setIsLoading(false);
    }
  }, [entityId, page, rowsPerPage, search, activeFilters]);

  useEffect(() => {
    if (entityId && !definitionLoading) {
      fetchRecords();
    }
  }, [entityId, definitionLoading, fetchRecords]);

  const handleEdit = (record: EntityRecord) => {
    setEditingRecord(record);
    setFormValues(record.data);
    setFormErrors({});
    setModalOpen(true);
  };

  const handleDelete = async (record: EntityRecord) => {
    if (!entityId) return;
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await RecordApi.delete(entityId, record.id);
        fetchRecords();
      } catch (err) {
        setError('Failed to delete record');
      }
    }
  };

  const handleBulkDelete = async (selectedRecords: EntityRecord[]) => {
    if (!entityId) return;
    if (window.confirm(`Are you sure you want to delete ${selectedRecords.length} records?`)) {
      try {
        await RecordApi.bulkDelete(
          entityId,
          selectedRecords.map((r) => r.id)
        );
        fetchRecords();
      } catch (err) {
        setError('Failed to delete records');
      }
    }
  };

  const handleCreate = () => {
    setEditingRecord(null);
    setFormValues({});
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!entityId) return;

    // Simple validation
    const newErrors: { [key: string]: string } = {};
    fields.forEach(f => {
      if (f.isRequired && !formValues[f.name]) {
        newErrors[f.name] = `${f.displayName} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    try {
      setIsSaving(true);
      if (editingRecord) {
        await RecordApi.update(entityId, editingRecord.id, { data: formValues });
      } else {
        await RecordApi.create(entityId, { data: formValues });
      }
      setModalOpen(false);
      fetchRecords();
    } catch (err) {
      setError('Failed to save record');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
    setPage(0);
  };

  if (definitionLoading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F4F7F6' }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1 }}>
          <Navbar title="Loading..." />
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)', mt: 8 }}>
            <CircularProgress />
          </Box>
        </Box>
      </Box>
    );
  }

  if (definitionError) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F4F7F6' }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1 }}>
          <Navbar title="Error" />
          <Box sx={{ p: 4, mt: 8 }}>
            <Alert severity="error">{definitionError}</Alert>
          </Box>
        </Box>
      </Box>
    );
  }

  // Dynamic Filter Definitions from Form Fields
  const dynamicFilters = formFields
    .filter(f => f.showAsFilter)
    .map(f => ({
      label: f.displayName,
      key: f.name,
      options: f.options || []
    }));

  const gridFields = formFields.filter(f => f.showInList);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F4F7F6' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Navbar title={entity?.name || 'Records'} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 4 },
            mt: 8,
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          <Box sx={{ maxWidth: '1440px', mx: 'auto' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0, mx: -1 }}>
              {listFields.length === 0 ? (
                <Box sx={{ width: '100%', p: 1 }}>
                  <DynamicList
                    entityName={entity?.name || 'Records'}
                    fields={gridFields}
                    records={records}
                    total={total}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={setPage}
                    onRowsPerPageChange={(newRowsPerPage) => {
                      setRowsPerPage(newRowsPerPage);
                      setPage(0);
                    }}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onBulkDelete={handleBulkDelete}
                    onCreate={handleCreate}
                    onSearch={setSearch}
                    isLoading={isLoading}
                    filters={dynamicFilters}
                    activeFilters={activeFilters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={() => setActiveFilters({})}
                  />
                </Box>
              ) : (
                listFields.map((field) => {
                  const widthPercent = (field.colSpan || 12) / 12 * 100;
                  return (
                    <Box key={field.id} sx={{ width: `${widthPercent}%`, p: 1, boxSizing: 'border-box' }}>
                      {field.fieldType === 'recordGrid' ? (
                        <DynamicList
                          entityName={entity?.name || 'Records'}
                          fields={gridFields}
                          records={records}
                          total={total}
                          page={page}
                          rowsPerPage={rowsPerPage}
                          onPageChange={setPage}
                          onRowsPerPageChange={(nr) => { setRowsPerPage(nr); setPage(0); }}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onBulkDelete={handleBulkDelete}
                          onCreate={handleCreate}
                          onSearch={setSearch}
                          isLoading={isLoading}
                          filters={dynamicFilters}
                          activeFilters={activeFilters}
                          onFilterChange={handleFilterChange}
                          onClearFilters={() => setActiveFilters({})}
                        />
                      ) : (
                        <DynamicField field={field} value={{}} onChange={() => { }} />
                      )}
                    </Box>
                  );
                })
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <RecordModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingRecord ? (formFields[0]?.uiMeta?.modalTitle || `Edit ${entity?.name || 'Record'}`) : (formFields[0]?.uiMeta?.modalTitle || `Create New ${entity?.name || 'Record'}`)}
        subtitle={formFields[0]?.uiMeta?.modalSubtitle}
        width={formFields[0]?.uiMeta?.modalWidth as any}
        fields={fields}
        values={formValues}
        errors={formErrors}
        onChange={(name, val) => setFormValues(prev => ({ ...prev, [name]: val }))}
        onSubmit={handleSave}
        isLoading={isSaving}
        submitLabel={editingRecord ? 'Save Changes' : 'Create Record'}
      />
    </Box>
  );
};

export default ListRecords;
