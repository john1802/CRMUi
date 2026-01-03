import { Box, Button, Grid, CircularProgress } from '@mui/material';
import { Field } from '../../types/field';
import { FieldRenderer } from './FieldRenderer';

interface DynamicFormProps {
  fields: Field[];
  values: { [key: string]: unknown };
  errors: { [key: string]: string };
  onChange: (fieldName: string, value: unknown) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export const DynamicForm = ({
  fields,
  values,
  errors,
  onChange,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Save',
}: DynamicFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {fields.map((field) => (
          <Grid item xs={12} sm={6} key={field.id}>
            <FieldRenderer
              field={field}
              value={values[field.name]}
              onChange={onChange}
              error={errors[field.name]}
              disabled={isLoading}
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{
            backgroundColor: '#f5a623',
            '&:hover': { backgroundColor: '#e09612' },
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : submitLabel}
        </Button>
      </Box>
    </Box>
  );
};
