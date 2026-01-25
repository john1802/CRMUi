import React from 'react';
import {
    TextField,
    Switch,
    FormControlLabel,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Box,
    Typography,
    Divider,
    Button,
    Paper,
    Chip
} from '@mui/material';
import * as MuiIcons from '@mui/icons-material';
import { Field } from '../../types/field';

interface DynamicFieldProps {
    field: Field;
    value: any;
    onChange: (value: any) => void;
    error?: string;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({ field, value, onChange, error }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    const handleSelectChange = (e: any) => {
        onChange(e.target.value);
    };

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked);
    };

    const style = field.style || {};

    // Recursive render helper for containers
    const renderChildren = () => {
        if (!field.children || field.children.length === 0) return null;
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: style.flexDirection || 'row',
                flexWrap: 'wrap',
                gap: style.gap || 0,
                width: '100%',
                alignItems: style.alignItems || 'stretch',
                justifyContent: style.justifyContent || 'flex-start'
            }}>
                {field.children.map(child => (
                    <Box
                        key={child.id}
                        sx={{
                            width: child.colSpan ? `${(child.colSpan / 12) * 100}%` : '100%',
                            p: 0.5,
                            boxSizing: 'border-box'
                        }}
                    >
                        <DynamicField
                            field={child}
                            value={value?.[child.name]}
                            onChange={(val) => {
                                const newValue = typeof value === 'object' ? { ...value, [child.name]: val } : { [child.name]: val };
                                onChange(newValue);
                            }}
                        />
                    </Box>
                ))}
            </Box>
        );
    };

    switch (field.fieldType) {
        case 'container':
        case 'section':
            return (
                <Box sx={{ ...style }}>
                    {renderChildren()}
                </Box>
            );

        case 'card':
            return (
                <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid #EFF2F5', ...style }}>
                    {renderChildren()}
                </Paper>
            );

        case 'header':
            return (
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 'bold',
                        mb: 1,
                        color: style.color || 'inherit',
                        textAlign: style.textAlign || 'left',
                        ...style
                    }}
                >
                    {field.displayName}
                </Typography>
            );

        case 'label':
            return (
                <Typography
                    variant="body1"
                    sx={{
                        color: style.color || 'text.secondary',
                        textAlign: style.textAlign || 'left',
                        ...style
                    }}
                >
                    {field.displayName}
                    {field.defaultValue && <Box component="span" sx={{ display: 'block', mt: 0.5 }}>{field.defaultValue}</Box>}
                </Typography>
            );

        case 'badge':
            return (
                <Box sx={{ display: 'flex', justifyContent: style.textAlign === 'center' ? 'center' : style.textAlign === 'right' ? 'flex-end' : 'flex-start' }}>
                    <Chip
                        label={field.displayName}
                        size="small"
                        sx={{
                            fontWeight: 700,
                            borderRadius: 1,
                            ...style
                        }}
                    />
                </Box>
            );

        case 'icon':
            const IconComp = (MuiIcons as any)[field.defaultValue || 'Help'] || MuiIcons.Help;
            return (
                <Box sx={{ display: 'flex', justifyContent: style.textAlign === 'center' ? 'center' : style.textAlign === 'right' ? 'flex-end' : 'flex-start', color: style.color || 'inherit' }}>
                    <IconComp sx={{ fontSize: style.fontSize || 'default', ...style }} />
                </Box>
            );

        case 'divider':
            return <Divider sx={{ my: 2, ...style }} />;

        case 'image':
            return (
                <Box sx={{
                    display: 'flex',
                    justifyContent: style.textAlign === 'center' ? 'center' : style.textAlign === 'right' ? 'flex-end' : 'flex-start',
                    width: '100%'
                }}>
                    <Box
                        component="img"
                        src={field.defaultValue || 'https://placehold.co/600x400?text=Image+Placeholder'}
                        alt={field.displayName}
                        sx={{
                            maxWidth: '100%',
                            borderRadius: style.borderRadius || 1,
                            height: style.height || 'auto',
                            width: style.width || 'auto',
                            maxHeight: 500,
                            objectFit: 'cover',
                            ...style
                        }}
                    />
                </Box>
            );

        case 'button':
            return (
                <Box sx={{
                    display: 'flex',
                    justifyContent: style.textAlign === 'center' ? 'center' : style.textAlign === 'right' ? 'flex-end' : 'flex-start',
                    width: '100%'
                }}>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: style.backgroundColor || 'primary.main',
                            color: style.color || 'white',
                            ...style
                        }}
                    >
                        {field.displayName || 'Button'}
                    </Button>
                </Box>
            );

        case 'text':
        case 'number':
        case 'email':
            return (
                <TextField
                    fullWidth
                    label={field.displayName}
                    type={field.fieldType}
                    value={value || ''}
                    onChange={handleChange}
                    required={field.isRequired}
                    error={!!error}
                    variant="outlined"
                    size="small"
                    sx={{ ...style }}
                />
            );

        case 'textarea':
            return (
                <TextField
                    fullWidth
                    label={field.displayName}
                    value={value || ''}
                    onChange={handleChange}
                    multiline
                    minRows={3}
                    sx={{ ...style }}
                />
            );

        case 'boolean':
            return (
                <FormControlLabel
                    control={<Switch checked={!!value} onChange={handleToggle} />}
                    label={field.displayName}
                    sx={{ ...style }}
                />
            );

        case 'select':
            return (
                <FormControl fullWidth size="small" sx={{ ...style }}>
                    <InputLabel>{field.displayName}</InputLabel>
                    <Select value={value || ''} label={field.displayName} onChange={handleSelectChange}>
                        {field.options?.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );

        default:
            return <Box sx={{ ...style }}>Unknown: {field.fieldType}</Box>;
    }
};
