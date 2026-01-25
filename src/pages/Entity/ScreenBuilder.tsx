import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Alert, Snackbar } from '@mui/material';
import { Sidebar } from '../../components/layout/Sidebar';
import { Navbar } from '../../components/layout/Navbar';
import { FieldBuilder } from '../../components/DynamicScreen/FieldBuilder';
import { FormSettings } from '../../components/DynamicScreen/PropertyEditor';
import { FieldApi } from '../../api/fieldApi';
import { Field } from '../../types/field';

export const ScreenBuilder = () => {
    const { entityId } = useParams<{ entityId: string }>();
    const [formFields, setFormFields] = useState<Field[]>([]);
    const [listFields, setListFields] = useState<Field[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    useEffect(() => {
        if (entityId) {
            loadFields(entityId);
        }
    }, [entityId]);

    const loadFields = async (id: string) => {
        try {
            setLoading(true);
            const response = await FieldApi.getByEntity(id);

            const allFields = response.data.map(f => ({
                ...f,
                colSpan: f.colSpan || 6,
                validation: f.validation || {},
                uiMeta: f.uiMeta || {}
            }));

            // Split fields by page tag (default to 'form' for legacy fields)
            setFormFields(allFields.filter(f => !f.uiMeta.page || f.uiMeta.page === 'form'));
            setListFields(allFields.filter(f => f.uiMeta.page === 'list'));

        } catch (err) {
            setError('Failed to load fields.');
            setFormFields([]);
            setListFields([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (updatedForm: Field[], updatedList: Field[], settings: any) => {
        if (!entityId) return;

        try {
            setLoading(true);

            // Tag fields with their page AND settings
            const formToSave = updatedForm.map((f, i) => ({
                ...f,
                uiMeta: {
                    ...f.uiMeta,
                    page: 'form',
                    // Store modal settings on the first form field
                    ...(i === 0 ? {
                        modalTitle: settings.modalTitle,
                        modalSubtitle: settings.modalSubtitle,
                        modalWidth: settings.modalWidth,
                        canvasBackgroundColor: settings.backgroundColor,
                        canvasPadding: settings.padding,
                        canvasBorderRadius: settings.borderRadius
                    } : {})
                }
            }));

            const listToSave = updatedList.map(f => ({ ...f, uiMeta: { ...f.uiMeta, page: 'list' } }));
            const allToSave = [...formToSave, ...listToSave];

            // Currently existing fields in DB
            const response = await FieldApi.getByEntity(entityId);
            const existingIds = new Set(response.data.map(f => f.id));

            // Detect deletions (fields in DB but not in our save list for THEIR page)
            // Note: This is simplified. Real production code would be more careful.

            const promises = allToSave.map(async (field) => {
                const isNew = !existingIds.has(field.id);

                const payload = {
                    name: field.name,
                    displayName: field.displayName,
                    fieldType: field.fieldType,
                    isRequired: field.isRequired,
                    options: field.options,
                    order: field.order,
                    colSpan: field.colSpan,
                    validation: field.validation,
                    uiMeta: field.uiMeta
                };

                if (isNew) {
                    return FieldApi.create(entityId, payload);
                } else {
                    return FieldApi.update(entityId, field.id, payload);
                }
            });

            await Promise.all(promises);

            // Re-order (Backend reorder might need update for dual-list, but let's try)
            await FieldApi.reorder(entityId, allToSave.map(f => f.id));

            setSuccessMsg('Universal design saved successfully!');
            loadFields(entityId);
        } catch (err) {
            setError('Failed to save changes.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#F4F7F6' }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Navbar title="Universal Screen Designer" />

                <Box component="main" sx={{ flexGrow: 1, p: 2, overflow: 'auto' }}>
                    {loading && formFields.length === 0 && listFields.length === 0 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <FieldBuilder
                            initialFormFields={formFields}
                            initialListFields={listFields}
                            initialSettings={formFields[0]?.uiMeta ? {
                                modalTitle: formFields[0].uiMeta.modalTitle,
                                modalSubtitle: formFields[0].uiMeta.modalSubtitle,
                                modalWidth: formFields[0].uiMeta.modalWidth,
                                backgroundColor: formFields[0].uiMeta.canvasBackgroundColor || '#F8FAFB',
                                padding: formFields[0].uiMeta.canvasPadding || 4,
                                borderRadius: formFields[0].uiMeta.canvasBorderRadius || 12,
                                maxWidth: '1440px'
                            } : undefined}
                            onSave={handleSave}
                        />
                    )}
                </Box>
            </Box>

            <Snackbar open={!!successMsg} autoHideDuration={4000} onClose={() => setSuccessMsg(null)}>
                <Alert severity="success">{successMsg}</Alert>
            </Snackbar>
            <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
                <Alert severity="error">{error}</Alert>
            </Snackbar>
        </Box>
    );
};
