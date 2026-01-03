import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Checkbox,
  TablePagination,
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { Field } from '../../types/field';
import { Record } from '../../types/record';

interface DynamicListProps {
  entityName: string;
  fields: Field[];
  records: Record[];
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onEdit: (record: Record) => void;
  onDelete: (record: Record) => void;
  onBulkDelete?: (records: Record[]) => void;
  onCreate: () => void;
  onSearch?: (search: string) => void;
  isLoading?: boolean;
}

export const DynamicList = ({
  entityName,
  fields,
  records,
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
  onBulkDelete,
  onCreate,
  onSearch,
  isLoading = false,
}: DynamicListProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(records.map((r) => r.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (onBulkDelete) {
      const selectedRecords = records.filter((r) => selected.includes(r.id));
      onBulkDelete(selectedRecords);
      setSelected([]);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const displayFields = fields.slice(0, 5);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0' }}>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          {entityName}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {onSearch && (
            <TextField
              size="small"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#F4F7F6',
                  '& fieldset': { border: 'none' },
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#6c757d' }} />
                  </InputAdornment>
                ),
              }}
            />
          )}
          {selected.length > 0 && onBulkDelete && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleBulkDelete}
              sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
            >
              Delete ({selected.length})
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreate}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700,
              px: 3,
              boxShadow: '0 8px 16px rgba(255, 193, 7, 0.2)',
            }}
          >
            Add New
          </Button>
        </Box>
      </Box>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ backgroundColor: '#fcfcfc' }}>
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < records.length}
                  checked={records.length > 0 && selected.length === records.length}
                  onChange={handleSelectAll}
                  sx={{ color: '#A2A3B7', '&.Mui-checked': { color: '#FFC107' } }}
                />
              </TableCell>
              {displayFields.map((field) => (
                <TableCell key={field.id} sx={{ fontWeight: 700, backgroundColor: '#fcfcfc', color: '#1E1E2D' }}>
                  {field.displayName}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 700, backgroundColor: '#fcfcfc', color: '#1E1E2D' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={displayFields.length + 2} align="center" sx={{ py: 8 }}>
                  <Typography sx={{ color: '#6c757d' }}>Loading records...</Typography>
                </TableCell>
              </TableRow>
            ) : records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={displayFields.length + 2} align="center" sx={{ py: 8 }}>
                  <Typography sx={{ color: '#6c757d' }}>No records found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow
                  key={record.id}
                  hover
                  selected={selected.includes(record.id)}
                  sx={{ '&:hover': { backgroundColor: '#f8f9fa !important' } }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(record.id)}
                      onChange={() => handleSelect(record.id)}
                      sx={{ color: '#A2A3B7', '&.Mui-checked': { color: '#FFC107' } }}
                    />
                  </TableCell>
                  {displayFields.map((field) => (
                    <TableCell key={field.id} sx={{ fontWeight: 500 }}>
                      {String(record.data[field.name] ?? '-')}
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => onEdit(record)}
                        sx={{ color: '#6c757d', '&:hover': { color: '#1E1E2D', backgroundColor: alpha('#1E1E2D', 0.05) } }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onDelete(record)}
                        sx={{ color: '#ff4d4f', '&:hover': { color: '#cf1322', backgroundColor: alpha('#ff4d4f', 0.1) } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
        sx={{ borderTop: '1px solid #f0f0f0' }}
      />
    </Paper>
  );
};
