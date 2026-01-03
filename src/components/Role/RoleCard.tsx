import { Paper, Box, Typography, IconButton, Chip, alpha } from '@mui/material';
import { Edit as EditIcon, Security as SecurityIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Role } from '../../types/role';

interface RoleCardProps {
    role: Role;
    onEdit: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
}

export const RoleCard = ({ role, onEdit, onDelete }: RoleCardProps) => {
    const metadata = typeof role.metadata === 'string'
        ? JSON.parse(role.metadata as unknown as string)
        : role.metadata || {};

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                height: '100%',
                borderRadius: '24px',
                border: '1px solid #EFF2F5',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.05)',
                    borderColor: 'primary.main',
                },
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: '16px',
                        backgroundColor: alpha('#FFC107', 0.1),
                        color: '#FFA000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <SecurityIcon />
                </Box>
                <Chip
                    label={`Level ${metadata.level || 0}`}
                    size="small"
                    sx={{
                        borderRadius: '8px',
                        fontWeight: 700,
                        backgroundColor: '#F3F6F9',
                        color: '#7E8299',
                    }}
                />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                {role.name}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, flexGrow: 1 }}>
                {metadata.description || 'No description provided.'}
            </Typography>

            <Box sx={{ pt: 2, borderTop: '1px solid #EFF2F5', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <IconButton
                    size="small"
                    onClick={onDelete}
                    sx={{
                        color: 'text.secondary',
                        '&:hover': { color: 'error.main', backgroundColor: alpha('#F1416C', 0.1) }
                    }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
                <IconButton
                    size="small"
                    onClick={onEdit}
                    sx={{
                        color: 'text.secondary',
                        '&:hover': { color: 'primary.main', backgroundColor: alpha('#1E1E2D', 0.05) }
                    }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
            </Box>
        </Paper>
    );
};
