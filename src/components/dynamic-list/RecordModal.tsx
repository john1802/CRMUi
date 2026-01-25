import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
    useTheme,
    useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DynamicForm } from '../dynamic-form/DynamicForm';
import { Field } from '../../types/field';

interface RecordModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    fields: Field[];
    values: { [key: string]: unknown };
    errors: { [key: string]: string };
    onChange: (fieldName: string, value: unknown) => void;
    onSubmit: () => void;
    isLoading?: boolean;
    submitLabel?: string;
    width?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const RecordModal: React.FC<RecordModalProps> = ({
    open,
    onClose,
    title,
    subtitle,
    fields,
    values,
    errors,
    onChange,
    onSubmit,
    isLoading,
    submitLabel,
    width
}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={fullScreen}
            maxWidth={width || "md"}
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: fullScreen ? 0 : '20px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }
            }}
        >
            <DialogTitle sx={{
                m: 0,
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #EFF2F5'
            }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E1E2D' }}>
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ color: '#A2A3B7' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4, mt: 1 }}>
                <Box sx={{ mb: 2 }}>
                    <DynamicForm
                        fields={fields}
                        values={values}
                        errors={errors}
                        onChange={onChange}
                        onSubmit={onSubmit}
                        onCancel={onClose}
                        isLoading={isLoading}
                        submitLabel={submitLabel}
                    />
                </Box>
            </DialogContent>
        </Dialog>
    );
};
