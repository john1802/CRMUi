import { Box, Paper, Typography, Avatar, Chip, IconButton, alpha } from '@mui/material';
import { Edit as EditIcon, Circle as CircleIcon, DashboardCustomize as DashboardCustomizeIcon } from '@mui/icons-material';
import { Entity } from '../../types/entity';

interface EntityCardProps {
    entity: Entity;
    onClick: () => void;
    onEdit: (e: React.MouseEvent) => void;
    onDesign?: (e: React.MouseEvent) => void;
}

export const EntityCard = ({ entity, onClick, onEdit, onDesign }: EntityCardProps) => {
    return (
        <Paper
            elevation={0}
            onClick={onClick}
            sx={{
                p: 3,
                height: '100%',
                borderRadius: '24px',
                border: '1px solid #EFF2F5',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.05)',
                    borderColor: 'primary.main',
                },
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Avatar
                    sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '16px',
                        bgcolor: alpha('#FFC107', 0.1),
                        color: '#FFA000',
                        fontWeight: 800,
                        fontSize: '1.25rem',
                    }}
                >
                    {entity.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                        label="Active"
                        size="small"
                        icon={<CircleIcon sx={{ fontSize: '8px !important' }} />}
                        sx={{
                            borderRadius: '8px',
                            fontWeight: 700,
                            backgroundColor: alpha('#4caf50', 0.1),
                            color: '#2e7d32',
                            '& .MuiChip-icon': {
                                color: '#4caf50',
                            }
                        }}
                    />
                </Box>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                {entity.name}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, flexGrow: 1 }}>
                /{entity.slug}
            </Typography>

            <Box sx={{ pt: 2, borderTop: '1px solid #EFF2F5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        Created
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {new Date(entity.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Typography>
                </Box>

                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDesign?.(e);
                    }}
                    sx={{
                        color: 'text.secondary',
                        '&:hover': { color: 'primary.main', backgroundColor: alpha('#1E1E2D', 0.05) }
                    }}
                    title="Design Screen"
                >
                    <DashboardCustomizeIcon fontSize="small" />
                </IconButton>
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(e);
                    }}
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
