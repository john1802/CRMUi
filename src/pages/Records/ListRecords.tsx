import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Alert } from '@mui/material';
import { Sidebar } from '../../components/layout/Sidebar';
import { Navbar } from '../../components/layout/Navbar';
import { DynamicList } from '../../components/dynamic-list/DynamicList';
import { useFetchDefinition } from '../../hooks/useFetchDefinition';
import { RecordApi } from '../../api/recordApi';
import { Record } from '../../types/record';

export const ListRecords = () => {
  const { entityId } = useParams<{ entityId: string }>();
  const navigate = useNavigate();
  const { entity, fields, isLoading: definitionLoading, error: definitionError } = useFetchDefinition(entityId);

  const [records, setRecords] = useState<Record[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    if (!entityId) return;
    try {
      setIsLoading(true);
      const response = await RecordApi.getByEntity(entityId, {
        page: page + 1,
        limit: rowsPerPage,
        search: search || undefined,
      });
      setRecords(response.data.records);
      setTotal(response.data.total);
    } catch (err) {
      setError('Failed to load records');
    } finally {
      setIsLoading(false);
    }
  }, [entityId, page, rowsPerPage, search]);

  useEffect(() => {
    if (entityId && !definitionLoading) {
      fetchRecords();
    }
  }, [entityId, definitionLoading, fetchRecords]);

  const handleEdit = (record: Record) => {
    navigate(`/entities/${entityId}/records/${record.id}/edit`);
  };

  const handleDelete = async (record: Record) => {
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

  const handleBulkDelete = async (selectedRecords: Record[]) => {
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
    navigate(`/entities/${entityId}/records/create`);
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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F4F7F6' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Navbar title={entity?.displayName || 'Records'} />
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

          <DynamicList
            entityName={entity?.displayName || 'Records'}
            fields={fields}
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
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ListRecords;
