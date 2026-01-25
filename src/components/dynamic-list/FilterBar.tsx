import React from 'react';
import { Box, MenuItem, Select, FormControl, InputLabel, Button } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

interface FilterOption {
    label: string;
    value: string;
}

interface FilterBarProps {
    filters: {
        label: string;
        key: string;
        options: FilterOption[];
    }[];
    activeFilters: { [key: string]: string };
    onFilterChange: (key: string, value: string) => void;
    onClear: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, activeFilters, onFilterChange, onClear }) => {
    return (
        <Box sx={{
            display: 'flex',
            gap: 2,
            mb: 3,
            flexWrap: 'wrap',
            alignItems: 'center',
            p: 2,
            bgcolor: '#fff',
            borderRadius: '16px',
            border: '1px solid #EFF2F5'
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6c757d', mr: 1 }}>
                <FilterAltIcon fontSize="small" />
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>FILTER BY:</span>
            </Box>

            {filters.map((filter) => (
                <FormControl key={filter.key} size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>{filter.label}</InputLabel>
                    <Select
                        value={activeFilters[filter.key] || ''}
                        label={filter.label}
                        onChange={(e) => onFilterChange(filter.key, e.target.value as string)}
                        sx={{
                            borderRadius: '10px',
                            backgroundColor: '#F8FAFB',
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            fontWeight: 600,
                            fontSize: '0.875rem'
                        }}
                    >
                        <MenuItem value=""><em>All {filter.label}</em></MenuItem>
                        {filter.options.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ))}

            <Button
                onClick={onClear}
                size="small"
                sx={{
                    ml: 'auto',
                    color: '#6c757d',
                    textTransform: 'none',
                    fontWeight: 700,
                    '&:hover': { bgcolor: 'transparent', color: 'primary.main' }
                }}
            >
                Clear All
            </Button>
        </Box>
    );
};
