import { Paper, Box, Typography, IconButton, Chip, alpha, Switch } from '@mui/material';
import { Edit as EditIcon, Person as PersonIcon, Circle as CircleIcon } from '@mui/icons-material';
import { User } from '../../types/user';
import { Role } from '../../types/role';

interface UserCardProps {
    user: User;
    roles: Role[];
    onEdit: (e: React.MouseEvent) => void;
    onToggleStatus: (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

export const UserCard = ({ user, roles, onEdit, onToggleStatus }: UserCardProps) => {
    const roleName = (roles || []).find(r => r.id === user.roleId)?.name || 'Unknown Role';

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
                    <PersonIcon />
                </Box>
                <Chip
                    label={user.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    icon={<CircleIcon sx={{ fontSize: '8px !important' }} />}
                    sx={{
                        borderRadius: '8px',
                        fontWeight: 700,
                        backgroundColor: user.isActive ? alpha('#4caf50', 0.1) : alpha('#9e9e9e', 0.1),
                        color: user.isActive ? '#2e7d32' : '#616161',
                        '& .MuiChip-icon': {
                            color: user.isActive ? '#4caf50' : '#9e9e9e',
                        }
                    }}
                />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                {user.name}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, flexGrow: 1 }}>
                {user.email}
            </Typography>

            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mb: 2 }}>
                {roleName}
            </Typography>

            <Box sx={{ pt: 2, borderTop: '1px solid #EFF2F5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Switch
                    checked={user.isActive}
                    onChange={(e, checked) => onToggleStatus(e, checked)}
                    size="small"
                    color="primary"
                />
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
