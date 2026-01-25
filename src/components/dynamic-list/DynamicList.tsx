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
  CircularProgress,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { Field } from '../../types/field';
import { Record as EntityRecord } from '../../types/record';

import { FilterBar } from './FilterBar';

interface FilterOption {
  label: string;
  value: string;
}

interface DynamicListProps {
  entityName: string;
  fields: Field[];
  records: EntityRecord[];
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onEdit: (record: EntityRecord) => void;
  onDelete: (record: EntityRecord) => void;
  onBulkDelete?: (records: EntityRecord[]) => void;
  onCreate: () => void;
  onSearch?: (search: string) => void;
  isLoading?: boolean;
  // Filter props
  filters?: {
    label: string;
    key: string;
    options: FilterOption[];
  }[];
  activeFilters?: { [key: string]: string };
  onFilterChange?: (key: string, value: string) => void;
  onClearFilters?: () => void;
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
  filters,
  activeFilters = {},
  onFilterChange,
  onClearFilters
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

  const displayFields = fields.slice(0, 6);

  return (
    <Box>
      {filters && onFilterChange && onClearFilters && (
        <FilterBar
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
          onClear={onClearFilters}
        />
      )}

      <Paper
        elevation={0}
        sx={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: '16px',
          backgroundColor: '#fff',
          boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
          border: '1px solid #EFF2F5',
        }}
      >
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E1E2D' }}>
              {entityName}
            </Typography>
            <Typography variant="body2" sx={{ color: '#A2A3B7', fontWeight: 500 }}>
              Management and overview of {entityName.toLowerCase()} records
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {onSearch && (
              <TextField
                size="small"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                sx={{
                  width: 300,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#F8FAFB',
                    border: '1px solid #EFF2F5',
                    '& fieldset': { border: 'none' },
                    '&:hover': { backgroundColor: '#F1F4F6' },
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#A2A3B7' }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            {selected.length > 0 && onBulkDelete && (
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleBulkDelete}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 700,
                  boxShadow: '0 8px 16px rgba(244, 67, 54, 0.2)',
                }}
              >
                Delete Selected ({selected.length})
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={onCreate}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 700,
                px: 4,
                boxShadow: '0 8px 16px rgba(255, 193, 7, 0.3)',
              }}
            >
              Create {entityName.slice(0, -1)}
            </Button>
          </Box>
        </Box>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ backgroundColor: '#F8FAFB', borderBottom: '1px solid #EFF2F5' }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < records.length}
                    checked={records.length > 0 && selected.length === records.length}
                    onChange={handleSelectAll}
                    sx={{ color: '#D1D5DB', '&.Mui-checked': { color: '#FFC107' } }}
                  />
                </TableCell>
                {displayFields.map((field) => (
                  <TableCell
                    key={field.id}
                    sx={{
                      fontWeight: 700,
                      backgroundColor: '#F8FAFB',
                      color: '#6c757d',
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid #EFF2F5',
                      py: 2
                    }}
                  >
                    {field.displayName}
                  </TableCell>
                ))}
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    backgroundColor: '#F8FAFB',
                    color: '#6c757d',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid #EFF2F5',
                    py: 2
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={displayFields.length + 2} align="center" sx={{ py: 12 }}>
                    <CircularProgress size={30} sx={{ mb: 2 }} />
                    <Typography sx={{ color: '#A2A3B7', fontWeight: 500 }}>Fetching your data...</Typography>
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={displayFields.length + 2} align="center" sx={{ py: 12 }}>
                    <Box sx={{ opacity: 0.5 }}>
                      <SearchIcon sx={{ fontSize: 48, color: '#D1D5DB', mb: 2 }} />
                    </Box>
                    <Typography sx={{ color: '#A2A3B7', fontWeight: 500 }}>No {entityName.toLowerCase()} found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow
                    key={record.id}
                    hover
                    selected={selected.includes(record.id)}
                    sx={{
                      transition: 'all 0.2s',
                      '&.Mui-selected': { backgroundColor: alpha('#FFC107', 0.04) + ' !important' },
                      '&:hover': { backgroundColor: '#F8FAFB !important' },
                      cursor: 'pointer'
                    }}
                  >
                    <TableCell padding="checkbox" sx={{ borderBottom: '1px solid #F1F4F6' }}>
                      <Checkbox
                        checked={selected.includes(record.id)}
                        onChange={() => handleSelect(record.id)}
                        onClick={(e) => e.stopPropagation()}
                        sx={{ color: '#D1D5DB', '&.Mui-checked': { color: '#FFC107' } }}
                      />
                    </TableCell>
                    {displayFields.map((field, idx) => (
                      <TableCell
                        key={field.id}
                        sx={{
                          fontWeight: 600,
                          color: '#1E1E2D',
                          borderBottom: '1px solid #F1F4F6',
                          py: 2.5
                        }}
                      >
                        {idx === 0 ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{
                              width: 44,
                              height: 44,
                              borderRadius: '8px',
                              bgcolor: alpha('#FFC107', 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden'
                            }}>
                              {record.data['image'] || record.data['avatar'] ? (
                                <img src={String(record.data['image'] || record.data['avatar'])} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <Typography sx={{ color: 'primary.main', fontWeight: 800 }}>{String(record.data[field.name]).charAt(0)}</Typography>
                              )}
                            </Box>
                            <Box>
                              <Typography sx={{ fontWeight: 700, color: '#1E1E2D', fontSize: '0.9rem' }}>
                                {String(record.data[field.name] ?? '-')}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#A2A3B7', fontWeight: 600 }}>
                                ID: {record.id.slice(0, 8)}
                              </Typography>
                            </Box>
                          </Box>
                        ) : field.fieldType === 'boolean' ? (
                          <Box sx={{
                            display: 'inline-flex',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: record.data[field.name] ? alpha('#4caf50', 0.1) : alpha('#f44336', 0.1),
                            color: record.data[field.name] ? '#4caf50' : '#f44336'
                          }}>
                            {record.data[field.name] ? 'ACTIVE' : 'INACTIVE'}
                          </Box>
                        ) : field.fieldType === 'select' ? (
                          <Box sx={{
                            display: 'inline-flex',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: '#F4F7F6',
                            color: '#1E1E2D'
                          }}>
                            {String(record.data[field.name] ?? '-')}
                          </Box>
                        ) : (
                          String(record.data[field.name] ?? '-')
                        )}
                      </TableCell>
                    ))}
                    <TableCell align="right" sx={{ borderBottom: '1px solid #F1F4F6', py: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); onEdit(record); }}
                          sx={{
                            color: '#A2A3B7',
                            backgroundColor: '#F8FAFB',
                            '&:hover': { color: '#FFC107', backgroundColor: alpha('#FFC107', 0.1) }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); onDelete(record); }}
                          sx={{
                            color: '#A2A3B7',
                            backgroundColor: '#F8FAFB',
                            '&:hover': { color: '#f44336', backgroundColor: alpha('#f44336', 0.1) }
                          }}
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
          sx={{
            borderTop: '1px solid #EFF2F5',
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              fontWeight: 600,
              color: '#6c757d'
            }
          }}
        />
      </Paper>
    </Box>
  );
};
