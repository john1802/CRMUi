import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Alert, CircularProgress } from '@mui/material';
import { Sidebar } from '../../components/layout/Sidebar';
import { Navbar } from '../../components/layout/Navbar';
import { DynamicForm } from '../../components/dynamic-form/DynamicForm';
import { useFetchDefinition } from '../../hooks/useFetchDefinition';
import { RecordApi } from '../../api/recordApi';

export const EditRecord = () => {
  const { entityId, recordId } = useParams<{ entityId: string; recordId: string }>();
  const navigate = useNavigate();
  const { entity, fields, isLoading: definitionLoading, error: definitionError } = useFetchDefinition(entityId);

  const [values, setValues] = useState<{ [key: string]: unknown }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (entityId && recordId && !definitionLoading) {
      fetchRecord();
    }
  }, [entityId, recordId, definitionLoading]);

  const fetchRecord = async () => {
    if (!entityId || !recordId) return;
    try {
      setIsLoading(true);
      const response = await RecordApi.getById(entityId, recordId);
      setValues(response.data.data);
    } catch (err) {
      setSubmitError('Failed to load record');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (fieldName: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    fields.forEach((field) => {
      if (field.isRequired && !values[field.name]) {
        newErrors[field.name] = `${field.displayName} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!entityId || !recordId || !validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await RecordApi.update(entityId, recordId, { data: values });
      navigate(`/entities/${entityId}/records`);
    } catch (err) {
      setSubmitError('Failed to update record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/entities/${entityId}/records`);
  };

  if (definitionLoading || isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (definitionError) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{definitionError}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Navbar title={`Edit ${entity?.name || 'Record'}`} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            backgroundColor: '#f5f5f5',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Paper sx={{ p: 4, borderRadius: 2, maxWidth: 1440, mx: 'auto' }}>
            <Typography variant="h5" fontWeight={800} gutterBottom sx={{ color: '#1E1E2D', mb: 4 }}>
              Edit {entity?.name || 'Record'}
            </Typography>

            {submitError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {submitError}
              </Alert>
            )}

            <DynamicForm
              fields={fields}
              values={values}
              errors={errors}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isSubmitting}
              submitLabel="Update"
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default EditRecord;
