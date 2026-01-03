import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormHelperText,
} from '@mui/material';
import { Field, FieldType } from '../../types/field';

interface FieldRendererProps {
  field: Field;
  value: unknown;
  onChange: (fieldName: string, value: unknown) => void;
  error?: string;
  disabled?: boolean;
}

export const FieldRenderer = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
}: FieldRendererProps) => {
  const handleChange = (newValue: unknown) => {
    onChange(field.name, newValue);
  };

  const renderField = (fieldType: FieldType) => {
    switch (fieldType) {
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
        return (
          <TextField
            fullWidth
            label={field.displayName}
            type={fieldType === 'email' ? 'email' : fieldType === 'url' ? 'url' : 'text'}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            required={field.isRequired}
            error={!!error}
            helperText={error}
            disabled={disabled}
            size="small"
          />
        );

      case 'number':
        return (
          <TextField
            fullWidth
            label={field.displayName}
            type="number"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value ? Number(e.target.value) : '')}
            required={field.isRequired}
            error={!!error}
            helperText={error}
            disabled={disabled}
            size="small"
          />
        );

      case 'textarea':
        return (
          <TextField
            fullWidth
            label={field.displayName}
            multiline
            rows={4}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            required={field.isRequired}
            error={!!error}
            helperText={error}
            disabled={disabled}
            size="small"
          />
        );

      case 'date':
        return (
          <TextField
            fullWidth
            label={field.displayName}
            type="date"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            required={field.isRequired}
            error={!!error}
            helperText={error}
            disabled={disabled}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        );

      case 'datetime':
        return (
          <TextField
            fullWidth
            label={field.displayName}
            type="datetime-local"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            required={field.isRequired}
            error={!!error}
            helperText={error}
            disabled={disabled}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        );

      case 'boolean':
        return (
          <FormControl error={!!error} disabled={disabled}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!value}
                  onChange={(e) => handleChange(e.target.checked)}
                />
              }
              label={field.displayName}
            />
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case 'select':
        return (
          <FormControl fullWidth error={!!error} disabled={disabled} size="small">
            <InputLabel required={field.isRequired}>{field.displayName}</InputLabel>
            <Select
              value={value || ''}
              label={field.displayName}
              onChange={(e) => handleChange(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case 'multiselect':
        return (
          <FormControl fullWidth error={!!error} disabled={disabled} size="small">
            <InputLabel required={field.isRequired}>{field.displayName}</InputLabel>
            <Select
              multiple
              value={Array.isArray(value) ? value : []}
              label={field.displayName}
              onChange={(e) => handleChange(e.target.value)}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      default:
        return (
          <TextField
            fullWidth
            label={field.displayName}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            required={field.isRequired}
            error={!!error}
            helperText={error}
            disabled={disabled}
            size="small"
          />
        );
    }
  };

  return renderField(field.fieldType);
};
