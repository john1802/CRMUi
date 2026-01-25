import React, { useState, useEffect } from 'react';
import { Button, Box, Paper } from '@mui/material';
import { Field } from '../../types/field';
import { DynamicField } from './DynamicField';

interface DynamicFormProps {
    fields: Field[];
    initialValues?: Record<string, any>;
    onSubmit: (data: Record<string, any>) => void;
    readOnly?: boolean;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ fields, initialValues = {}, onSubmit, readOnly }) => {
    const [formData, setFormData] = useState<Record<string, any>>(initialValues);

    useEffect(() => {
        setFormData(initialValues);
    }, [initialValues]);

    // Sort fields by order
    const sortedFields = [...fields].sort((a, b) => (a.order || 0) - (b.order || 0));

    const handleChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #EFF2F5' }}>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
                    {sortedFields.map(field => {
                        const widthPercent = (field.colSpan || 6) / 12 * 100;
                        return (
                            <Box
                                key={field.id}
                                sx={{
                                    width: `${widthPercent}%`,
                                    p: 1.5,
                                    boxSizing: 'border-box'
                                }}
                            >
                                <DynamicField
                                    field={field}
                                    value={formData[field.name]}
                                    onChange={(val) => handleChange(field.name, val)}
                                />
                            </Box>
                        );
                    })}
                </Box>
                {!readOnly && (
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ px: 5, fontWeight: 700, borderRadius: 2 }}
                        >
                            Save Record
                        </Button>
                    </Box>
                )}
            </form>
        </Paper>
    );
};
