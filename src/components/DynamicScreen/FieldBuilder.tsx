import React, { useState } from 'react';
import { Box, Paper, Typography, Button, List, ListItemButton, ListItemText, IconButton, Tooltip, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Field, FieldType } from '../../types/field';
import { DynamicField } from './DynamicField';
import { PropertyEditor, FormSettings } from './PropertyEditor';
import { DynamicList } from '../dynamic-list/DynamicList';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';

const FIELD_TYPES: { type: FieldType, label: string, category: string }[] = [
    // Layout
    { type: 'card', label: 'Styled Card', category: 'Layout' },
    { type: 'container', label: 'Flex Container', category: 'Layout' },
    { type: 'divider', label: 'Divider Line', category: 'Layout' },
    { type: 'recordGrid', label: 'Record Grid (Table Component)', category: 'Layout' },

    // Decorative
    { type: 'header', label: 'Header Text', category: 'Visual' },
    { type: 'label', label: 'Paragraph / Label', category: 'Visual' },
    { type: 'image', label: 'Image', category: 'Visual' },
    { type: 'icon', label: 'Icon (MUI)', category: 'Visual' },
    { type: 'badge', label: 'Badge / Chip', category: 'Visual' },
    { type: 'button', label: 'Action Button', category: 'Visual' },

    // Form Inputs
    { type: 'text', label: 'Text Input', category: 'Form' },
    { type: 'number', label: 'Number Input', category: 'Form' },
    { type: 'email', label: 'Email Input', category: 'Form' },
    { type: 'boolean', label: 'Toggle Switch', category: 'Form' },
    { type: 'select', label: 'Dropdown Select', category: 'Form' },
    { type: 'textarea', label: 'Long Text Area', category: 'Form' },
];

interface FieldBuilderProps {
    initialFormFields?: Field[];
    initialListFields?: Field[];
    initialSettings?: FormSettings;
    onSave: (formFields: Field[], listFields: Field[], settings: FormSettings) => void;
}

export const FieldBuilder: React.FC<FieldBuilderProps> = ({ initialFormFields = [], initialListFields = [], initialSettings, onSave }) => {
    const [formFields, setFormFields] = useState<Field[]>(initialFormFields);
    const [listFields, setListFields] = useState<Field[]>(initialListFields);
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    const [toolboxOpen, setToolboxOpen] = useState(true);
    const [propertiesOpen, setPropertiesOpen] = useState(true);
    const [designerMode, setDesignerMode] = useState<'form' | 'list'>('form');

    const fields = designerMode === 'form' ? formFields : listFields;
    const setFields = designerMode === 'form' ? setFormFields : setListFields;

    const [formSettings, setFormSettings] = useState<FormSettings>(initialSettings || {
        backgroundColor: '#F8FAFB',
        padding: 4,
        borderRadius: 12,
        maxWidth: '1440px'
    });

    const handleAddField = (type: FieldType) => {
        const newField: Field = {
            id: crypto.randomUUID(),
            entityId: 'temp',
            name: `element_${Date.now()}`,
            displayName: `New ${type}`,
            fieldType: type,
            isRequired: false,
            order: fields.length,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            colSpan: type === 'card' || type === 'container' ? 12 : 6,
            uiMeta: {},
            validation: {},
            style: {
                padding: type === 'card' ? '16px' : '0px',
                borderRadius: type === 'card' ? '12px' : '0px',
                boxShadow: type === 'card' ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
                backgroundColor: type === 'card' ? '#ffffff' : 'transparent'
            },
            showInList: true
        };
        setFields([...fields, newField]);
        setSelectedFieldId(newField.id);
        setPropertiesOpen(true);
    };

    const handleUpdateField = (updatedField: Field) => {
        setFields(fields.map(f => f.id === updatedField.id ? updatedField : f));
    };

    const handleDeleteField = (fieldId: string) => {
        setFields(fields.filter(f => f.id !== fieldId));
        if (selectedFieldId === fieldId) setSelectedFieldId(null);
    };

    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedItemIndex === null || draggedItemIndex === index) return;

        const newFields = [...fields];
        const draggedItem = newFields[draggedItemIndex];
        newFields.splice(draggedItemIndex, 1);
        newFields.splice(index, 0, draggedItem);

        newFields.forEach((f, idx) => f.order = idx);

        setFields(newFields);
        setDraggedItemIndex(index);
    };

    const selectedField = fields.find(f => f.id === selectedFieldId) || null;

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', mt: 8 }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                px: 3,
                py: 2,
                bgcolor: '#fff',
                borderBottom: '1px solid #EFF2F5',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Tooltip title={toolboxOpen ? "Collapse Toolbox" : "Expand Toolbox"}>
                        <IconButton
                            onClick={() => setToolboxOpen(!toolboxOpen)}
                            sx={{ bgcolor: toolboxOpen ? '#F4F7F6' : 'transparent', color: toolboxOpen ? 'primary.main' : '#A2A3B7' }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Tooltip>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E1E2D' }}>Ultimate UI Designer</Typography>
                        <Typography variant="caption" color="text.secondary">Design trendsetter screens with absolute flexibility</Typography>
                    </Box>
                    <Box sx={{ ml: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                            size="small"
                            onClick={() => setDesignerMode('list')}
                            sx={{
                                color: designerMode === 'list' ? 'primary.main' : '#A2A3B7',
                                fontWeight: designerMode === 'list' ? 800 : 500,
                                textTransform: 'none',
                                fontSize: '0.9rem'
                            }}
                        >
                            Design Page
                        </Button>
                        <Typography color="text.disabled">/</Typography>
                        <Button
                            size="small"
                            onClick={() => setDesignerMode('form')}
                            sx={{
                                color: designerMode === 'form' ? 'primary.main' : '#A2A3B7',
                                fontWeight: designerMode === 'form' ? 800 : 500,
                                textTransform: 'none',
                                fontSize: '0.9rem'
                            }}
                        >
                            Configure Modal Popup
                        </Button>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => onSave(formFields, listFields, formSettings)}
                        sx={{ px: 5, borderRadius: 2, fontWeight: 700, textTransform: 'none', boxShadow: '0 4px 12px alpha(primary.main, 0.2)' }}
                    >
                        Save Design
                    </Button>
                    <Tooltip title={propertiesOpen ? "Collapse Properties" : "Expand Properties"}>
                        <IconButton
                            onClick={() => setPropertiesOpen(!propertiesOpen)}
                            sx={{ bgcolor: propertiesOpen ? '#F4F7F6' : 'transparent', color: propertiesOpen ? 'primary.main' : '#A2A3B7' }}
                        >
                            <SettingsIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden', gap: 0, bgcolor: '#F8FAFB' }}>

                {/* Toolbox */}
                <Box sx={{
                    width: toolboxOpen ? { xs: 240, md: 300 } : 0,
                    flexShrink: 0,
                    overflowX: 'hidden',
                    borderRight: '1px solid #EFF2F5',
                    bgcolor: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                    <Box sx={{ width: { xs: 240, md: 300 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle2" sx={{ p: 2, fontWeight: 800, color: '#1E1E2D', textTransform: 'uppercase', letterSpacing: 1 }}>Designer Toolbox</Typography>
                        <Box sx={{ overflowY: 'auto', flexGrow: 1, px: 1 }}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="caption" sx={{ px: 2, fontWeight: 700, color: 'primary.main' }}>Design Areas</Typography>
                                <List dense>
                                    <ListItemButton
                                        onClick={() => setDesignerMode('list')}
                                        sx={{
                                            borderRadius: 2,
                                            mb: 0.5,
                                            bgcolor: designerMode === 'list' ? alpha('#1976d2', 0.08) : 'transparent',
                                            '&:hover': { bgcolor: '#F4F7F6' }
                                        }}
                                    >
                                        <ListItemText primary="Main Records Page" primaryTypographyProps={{ variant: 'body2', fontWeight: designerMode === 'list' ? 800 : 500, color: designerMode === 'list' ? 'primary.main' : 'inherit' }} />
                                    </ListItemButton>
                                    <ListItemButton
                                        onClick={() => setDesignerMode('form')}
                                        sx={{
                                            borderRadius: 2,
                                            mb: 0.5,
                                            bgcolor: designerMode === 'form' ? alpha('#1976d2', 0.08) : 'transparent',
                                            '&:hover': { bgcolor: '#F4F7F6' }
                                        }}
                                    >
                                        <ListItemText primary="Record Modal Popup" primaryTypographyProps={{ variant: 'body2', fontWeight: designerMode === 'form' ? 800 : 500, color: designerMode === 'form' ? 'primary.main' : 'inherit' }} />
                                    </ListItemButton>
                                </List>
                            </Box>

                            {['Layout', 'Visual', 'Form'].map((cat: string) => (
                                <Box key={cat} sx={{ mb: 2 }}>
                                    <Typography variant="caption" sx={{ px: 2, fontWeight: 700, color: 'text.disabled' }}>{cat}</Typography>
                                    <List dense>
                                        {FIELD_TYPES
                                            .filter((t) => t.category === cat)
                                            .filter((t) => designerMode === 'list' || t.type !== 'recordGrid')
                                            .map((item) => (
                                                <ListItemButton key={item.type} onClick={() => handleAddField(item.type)} sx={{ borderRadius: 2, mb: 0.5, '&:hover': { bgcolor: '#F4F7F6' } }}>
                                                    <ListItemText primary={item.label} primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
                                                </ListItemButton>
                                            ))}
                                    </List>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>

                {/* Canvas */}
                <Box sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                    p: { xs: 1, md: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start', // Align to start for horizontal scroll
                    backgroundColor: '#E2E8F0',
                    position: 'relative'
                }}>
                    <Paper
                        elevation={0}
                        sx={{
                            width: formSettings.maxWidth,
                            minWidth: formSettings.maxWidth, // Ensure it doesn't shrink
                            minHeight: '100vh',
                            p: formSettings.padding,
                            bgcolor: formSettings.backgroundColor,
                            borderRadius: `${formSettings.borderRadius}px`,
                            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                            border: '1px solid #EFF2F5',
                            transition: 'all 0.3s ease',
                            flexShrink: 0,
                            mx: 'auto' // Center within the scrollable container
                        }}
                        onClick={() => setSelectedFieldId(null)}
                    >
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0, mx: -1 }}>
                            {fields.map((field, index) => {
                                const widthPercent = (field.colSpan || 6) / 12 * 100;
                                return (
                                    <Box
                                        key={field.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onClick={(e) => { e.stopPropagation(); setSelectedFieldId(field.id); setPropertiesOpen(true); }}
                                        sx={{
                                            width: `${widthPercent}%`,
                                            p: 1.5,
                                            boxSizing: 'border-box',
                                            border: selectedFieldId === field.id ? '2px solid #1976d2' : '2px dashed transparent',
                                            borderRadius: 2,
                                            cursor: 'grab',
                                            '&:hover': { border: '2px dashed #D1D5DB' },
                                            position: 'relative',
                                            transition: 'border 0.2s',
                                            outline: 'none'
                                        }}
                                    >
                                        {field.fieldType === 'recordGrid' ? (
                                            <Box sx={{ pointerEvents: 'none', position: 'relative' }}>
                                                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, bgcolor: 'rgba(255,255,255,0.7)', display: designerMode === 'list' ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Typography variant="h6" fontWeight={800} color="error">GRID FOR LIST ONLY</Typography>
                                                </Box>
                                                <DynamicList
                                                    entityName="Interactive Grid"
                                                    fields={formFields.filter(f => f.showInList)}
                                                    records={[
                                                        { id: '1', entityId: 't', tenantId: '1', data: { [formFields[0]?.name || 'name']: 'Sample A' }, createdAt: '', updatedAt: '' }
                                                    ]}
                                                    total={1}
                                                    page={0}
                                                    rowsPerPage={5}
                                                    onPageChange={() => { }}
                                                    onRowsPerPageChange={() => { }}
                                                    onEdit={() => { }}
                                                    onDelete={() => { }}
                                                    onCreate={() => { }}
                                                />
                                            </Box>
                                        ) : (
                                            <Box sx={{ pointerEvents: 'none' }}>
                                                <DynamicField field={field} value={{}} onChange={() => { }} />
                                            </Box>
                                        )}
                                        {selectedFieldId === field.id && (
                                            <Box sx={{ position: 'absolute', top: -10, left: 10, px: 1, bgcolor: '#1976d2', color: '#fff', borderRadius: 1, fontSize: '10px', zIndex: 10 }}>
                                                {field.fieldType.toUpperCase()}
                                            </Box>
                                        )}
                                        <Box sx={{ position: 'absolute', top: 5, right: 5, p: 0.5, cursor: 'grab', opacity: selectedFieldId === field.id ? 1 : 0, transition: 'opacity 0.2s' }}>
                                            <DragIndicatorIcon color="primary" fontSize="small" />
                                        </Box>
                                    </Box>
                                );
                            })}
                            {fields.length === 0 && (
                                <Box sx={{ width: '100%', p: 12, textAlign: 'center', color: 'text.secondary', border: '2px dashed #E5E7EB', borderRadius: 4, bgcolor: '#fff' }}>
                                    <Typography variant="h6">Canvas is Empty</Typography>
                                    <Typography variant="body2">
                                        {designerMode === 'form' ? 'Design your record modal popup' : 'Design your custom records list page'}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Box>

                {/* Properties Panel */}
                <Box sx={{
                    width: propertiesOpen ? { xs: 280, md: 350 } : 0,
                    flexShrink: 0,
                    overflowX: 'hidden',
                    borderLeft: '1px solid #EFF2F5',
                    bgcolor: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                    <Box sx={{ width: { xs: 280, md: 350 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle2" sx={{ p: 2, fontWeight: 800, color: '#1E1E2D', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #EFF2F5', whiteSpace: 'nowrap' }}>
                            {selectedField ? `${selectedField.fieldType} Properties` : 'Canvas Settings'}
                        </Typography>
                        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                            <PropertyEditor
                                field={selectedField}
                                onUpdate={handleUpdateField}
                                onDelete={handleDeleteField}
                                formSettings={formSettings}
                                onUpdateSettings={setFormSettings}
                                designerMode={designerMode}
                            />
                        </Box>
                    </Box>
                </Box>

            </Box>
        </Box>
    );
};
