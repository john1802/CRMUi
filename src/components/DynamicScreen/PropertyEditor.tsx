import {
    TextField,
    Checkbox,
    FormControlLabel,
    Box,
    Typography,
    Button,
    Tabs,
    Tab,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Divider,
    Slider
} from '@mui/material';
import { Field } from '../../types/field';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

export interface FormSettings {
    backgroundColor: string;
    padding: number;
    borderRadius: number;
    maxWidth: string;
    // Modal Specific
    modalTitle?: string;
    modalSubtitle?: string;
    modalWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

interface PropertyEditorProps {
    field: Field | null;
    onUpdate: (field: Field) => void;
    onDelete: (fieldId: string) => void;
    formSettings?: FormSettings;
    onUpdateSettings?: (settings: FormSettings) => void;
    designerMode?: 'form' | 'list';
}

export const PropertyEditor = ({ field, onUpdate, onDelete, formSettings, onUpdateSettings, designerMode }: PropertyEditorProps) => {
    const [tab, setTab] = useState(0);

    if (!field) {
        if (formSettings && onUpdateSettings) {
            return (
                <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Typography variant="overline" color="text.secondary" sx={{ fontSize: '10px', mb: -0.5 }}>{designerMode === 'form' ? 'Modal Appearance' : 'Page Appearance'}</Typography>

                    {designerMode === 'form' && (
                        <>
                            <TextField label="Modal Title" value={formSettings.modalTitle || ''} onChange={(e) => onUpdateSettings({ ...formSettings, modalTitle: e.target.value })} fullWidth size="small" />
                            <TextField label="Modal Subtitle" value={formSettings.modalSubtitle || ''} onChange={(e) => onUpdateSettings({ ...formSettings, modalSubtitle: e.target.value })} fullWidth size="small" />
                            <FormControl fullWidth size="small">
                                <InputLabel>Modal Size</InputLabel>
                                <Select value={formSettings.modalWidth || 'md'} label="Modal Size" onChange={(e) => onUpdateSettings({ ...formSettings, modalWidth: e.target.value as any })}>
                                    <MenuItem value="xs">Extra Small</MenuItem>
                                    <MenuItem value="sm">Small</MenuItem>
                                    <MenuItem value="md">Medium</MenuItem>
                                    <MenuItem value="lg">Large</MenuItem>
                                    <MenuItem value="xl">Extra Large</MenuItem>
                                </Select>
                            </FormControl>
                            <Divider />
                        </>
                    )}

                    <TextField label="Canvas BG Color" type="color" value={formSettings.backgroundColor} onChange={(e) => onUpdateSettings({ ...formSettings, backgroundColor: e.target.value })} fullWidth size="small" />
                    <TextField label="Canvas Max Width" value={formSettings.maxWidth} onChange={(e) => onUpdateSettings({ ...formSettings, maxWidth: e.target.value })} fullWidth size="small" />
                    <TextField label="Internal Padding" type="number" value={formSettings.padding} onChange={(e) => onUpdateSettings({ ...formSettings, padding: parseInt(e.target.value) || 0 })} fullWidth size="small" />
                    <TextField label="Corner Radius" type="number" value={formSettings.borderRadius} onChange={(e) => onUpdateSettings({ ...formSettings, borderRadius: parseInt(e.target.value) || 0 })} fullWidth size="small" />
                </Box>
            );
        }
        return <Box sx={{ p: 2 }}><Typography color="text.secondary">Select an element to edit</Typography></Box>;
    }

    const handleChange = (prop: keyof Field, value: any) => {
        onUpdate({ ...field, [prop]: value });
    };

    const handleStyleChange = (prop: string, value: any) => {
        onUpdate({
            ...field,
            style: {
                ...field.style,
                [prop]: value
            }
        });
    };

    const isContainer = ['container', 'card', 'section'].includes(field.fieldType);
    const isDecorative = ['header', 'label', 'icon', 'badge', 'image', 'button', 'divider'].includes(field.fieldType);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: '1px solid #EFF2F5' }}
            >
                <Tab label="Content" />
                <Tab label="Layout" />
                <Tab label="Style" />
            </Tabs>

            <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5, overflowY: 'auto', flexGrow: 1 }}>
                {tab === 0 && (
                    <>
                        <Typography variant="overline" color="text.secondary" sx={{ fontSize: '10px', mb: -0.5 }}>Basic Info</Typography>
                        <TextField label="Display Label" value={field.displayName} onChange={(e) => handleChange('displayName', e.target.value)} fullWidth size="small" />

                        {field.fieldType === 'icon' && (
                            <TextField label="Icon Name (MUI)" value={field.defaultValue || ''} onChange={(e) => handleChange('defaultValue', e.target.value)} fullWidth size="small" helperText="e.g. Person, Settings, Favorite" />
                        )}

                        {field.fieldType === 'image' && (
                            <TextField label="Image URL" value={field.defaultValue || ''} onChange={(e) => handleChange('defaultValue', e.target.value)} fullWidth size="small" />
                        )}

                        {!isContainer && !isDecorative && (
                            <TextField label="Field Key (API)" value={field.name} onChange={(e) => handleChange('name', e.target.value)} fullWidth size="small" />
                        )}

                        {(field.fieldType === 'select' || field.fieldType === 'multiselect') && (
                            <Box sx={{ border: '1px solid #eee', p: 1, borderRadius: 1 }}>
                                <Typography variant="subtitle2">Options</Typography>
                                {field.options?.map((opt, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', gap: 0.5, my: 0.5 }}>
                                        <TextField size="small" value={opt.label} onChange={(e) => {
                                            const newOpts = [...(field.options || [])];
                                            newOpts[idx].label = e.target.value;
                                            handleChange('options', newOpts);
                                        }} />
                                        <TextField size="small" value={opt.value} onChange={(e) => {
                                            const newOpts = [...(field.options || [])];
                                            newOpts[idx].value = e.target.value;
                                            handleChange('options', newOpts);
                                        }} />
                                    </Box>
                                ))}
                                <Button size="small" onClick={() => handleChange('options', [...(field.options || []), { label: 'New', value: 'val' }])}>+ Add</Button>
                            </Box>
                        )}
                    </>
                )}

                {tab === 1 && (
                    <>
                        <Typography variant="overline" color="text.secondary" sx={{ fontSize: '10px', mb: -0.5 }}>Dimensions</Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField label="Width (e.g. 100%)" value={field.style?.width || ''} onChange={(e) => handleStyleChange('width', e.target.value)} fullWidth size="small" />
                            <TextField label="Height" value={field.style?.height || ''} onChange={(e) => handleStyleChange('height', e.target.value)} fullWidth size="small" />
                        </Box>

                        <Typography variant="subtitle2">Grid Columns (1-12)</Typography>
                        <Slider value={field.colSpan || 12} min={1} max={12} step={1} onChange={(_, v) => handleChange('colSpan', v)} valueLabelDisplay="auto" />

                        <Divider />
                        <Typography variant="overline" color="text.secondary">Spacing (Margins/Padding)</Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                            <TextField label="Margin" value={field.style?.margin || ''} onChange={(e) => handleStyleChange('margin', e.target.value)} size="small" />
                            <TextField label="Padding" value={field.style?.padding || ''} onChange={(e) => handleStyleChange('padding', e.target.value)} size="small" />
                        </Box>

                        {isContainer && (
                            <>
                                <Divider />
                                <Typography variant="overline" color="text.secondary">Flexbox Layout</Typography>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Direction</InputLabel>
                                    <Select value={field.style?.flexDirection || 'row'} label="Direction" onChange={(e) => handleStyleChange('flexDirection', e.target.value)}>
                                        <MenuItem value="row">Horizontal Row</MenuItem>
                                        <MenuItem value="column">Vertical Stack</MenuItem>
                                    </Select>
                                </FormControl>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <TextField label="Gap" value={field.style?.gap || ''} onChange={(e) => handleStyleChange('gap', e.target.value)} fullWidth size="small" />
                                    <TextField label="Align" value={field.style?.alignItems || ''} onChange={(e) => handleStyleChange('alignItems', e.target.value)} fullWidth size="small" placeholder="center/start" />
                                </Box>
                            </>
                        )}

                        <Divider />
                        <Typography variant="overline" color="text.secondary">Visibility & Grid</Typography>
                        <Box sx={{ px: 1 }}>
                            <FormControlLabel
                                control={<Checkbox checked={field.showInList || false} onChange={(e) => handleChange('showInList', e.target.checked)} size="small" />}
                                label={<Typography variant="body2" fontWeight={600}>Show in List View (Table Column)</Typography>}
                            />
                            <FormControlLabel
                                control={<Checkbox checked={field.showAsFilter || false} onChange={(e) => handleChange('showAsFilter', e.target.checked)} size="small" />}
                                label={<Typography variant="body2" fontWeight={600}>Enable as Filter</Typography>}
                            />
                        </Box>
                    </>
                )}

                {tab === 2 && (
                    <>
                        <Typography variant="overline" color="text.secondary" sx={{ fontSize: '10px', mb: -0.5 }}>Colors & Borders</Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField label="Text Color" type="color" value={field.style?.color || '#000000'} onChange={(e) => handleStyleChange('color', e.target.value)} size="small" sx={{ width: 80 }} />
                            <TextField label="BG Color" type="color" value={field.style?.backgroundColor || '#ffffff'} onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} size="small" sx={{ width: 80 }} />
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="caption">Transparent?</Typography>
                                <Button size="small" onClick={() => handleStyleChange('backgroundColor', 'transparent')}>Set Transp</Button>
                            </Box>
                        </Box>

                        <TextField label="Border" value={field.style?.border || ''} onChange={(e) => handleStyleChange('border', e.target.value)} fullWidth size="small" placeholder="1px solid #ddd" />
                        <TextField label="Corner Radius" value={field.style?.borderRadius || ''} onChange={(e) => handleStyleChange('borderRadius', e.target.value)} fullWidth size="small" />

                        <Divider />
                        <Typography variant="overline" color="text.secondary">Advanced Visuals</Typography>
                        <TextField label="Box Shadow" value={field.style?.boxShadow || ''} onChange={(e) => handleStyleChange('boxShadow', e.target.value)} fullWidth size="small" placeholder="0 4px 12px rgba(0,0,0,0.1)" />
                        <TextField label="Font Weight" value={field.style?.fontWeight || ''} onChange={(e) => handleStyleChange('fontWeight', e.target.value)} fullWidth size="small" placeholder="800, bold, normal" />

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Align Text</InputLabel>
                                <Select value={field.style?.textAlign || 'left'} label="Align Text" onChange={(e) => handleStyleChange('textAlign', e.target.value)}>
                                    <MenuItem value="left">Left</MenuItem>
                                    <MenuItem value="center">Center</MenuItem>
                                    <MenuItem value="right">Right</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField label="Opacity" type="number" inputProps={{ step: 0.1, min: 0, max: 1 }} value={field.style?.opacity || 1} onChange={(e) => handleStyleChange('opacity', parseFloat(e.target.value))} fullWidth size="small" />
                        </Box>
                    </>
                )}

                <Box sx={{ mt: 'auto', pt: 2 }}>
                    <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => onDelete(field.id)} fullWidth>Remove Element</Button>
                </Box>
            </Box>
        </Box>
    );
};
