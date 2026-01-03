import { Box, Paper, Typography, Grid, Avatar, Button, Chip, IconButton } from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Sidebar } from '../../components/layout/Sidebar';
import { Navbar } from '../../components/layout/Navbar';

const statCards = [
  { title: 'Total Candidates', value: '1,234', icon: <PeopleIcon />, color: '#4caf50', trend: '+12%' },
  { title: 'Open Jobs', value: '56', icon: <BusinessIcon />, color: '#FFC107', trend: '+5%' },
  { title: 'Interviews', value: '23', icon: <TrendingUpIcon />, color: '#2196f3', trend: '+2%' },
  { title: 'Revenue', value: '$45,678', icon: <AttachMoneyIcon />, color: '#9c27b0', trend: '+8%' },
];

export const Dashboard = () => {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#F4F7F6', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Navbar title="Dashboard" />
        <Box
          component="main"
          sx={{
            p: { xs: 2, md: 4 },
            mt: 8,
          }}
        >
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E1E2D' }}>
                Good Morning, Fikri!
              </Typography>
              <Typography variant="body1" sx={{ color: '#6c757d', mt: 0.5 }}>
                Here's what's happening with your recruitment today.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: '12px',
                px: 3,
                py: 1.5,
                boxShadow: '0 8px 16px rgba(255, 193, 7, 0.2)',
                fontWeight: 700,
              }}
            >
              Add New Job
            </Button>
          </Box>

          <Grid container spacing={3}>
            {statCards.map((card) => (
              <Grid xs={12} sm={6} md={3} key={card.title}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: '24px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                    border: '1px solid #f0f0f0',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: `${card.color}15`,
                        color: card.color,
                        width: 48,
                        height: 48,
                        borderRadius: '14px'
                      }}
                    >
                      {card.icon}
                    </Avatar>
                    <Chip
                      label={card.trend}
                      size="small"
                      sx={{
                        bgcolor: '#e8f5e9',
                        color: '#2e7d32',
                        fontWeight: 700,
                        height: 24,
                        fontSize: '0.7rem'
                      }}
                    />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6c757d', fontWeight: 500 }}>
                    {card.title}
                  </Typography>
                </Paper>
              </Grid>
            ))}

            <Grid xs={12} md={8}>
              <Paper sx={{ p: 4, borderRadius: '24px', minHeight: 460, border: '1px solid #f0f0f0', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Recent Hires
                  </Typography>
                  <Button variant="text" sx={{ fontWeight: 700, color: '#FFC107' }}>View All</Button>
                </Box>

                {[1, 2, 3, 4].map((i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 2, borderBottom: i === 4 ? 'none' : '1px solid #f8f9fa' }}>
                    <Avatar sx={{ width: 44, height: 44, mr: 2, bgcolor: '#f0f0f0', color: '#1E1E2D', fontWeight: 700 }}>Candidate {i}</Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Alexander Graham</Typography>
                      <Typography variant="caption" sx={{ color: '#6c757d' }}>Senior Product Designer • applied 2h ago</Typography>
                    </Box>
                    <Chip label="Interview" size="small" sx={{ bgcolor: '#fff8e1', color: '#ffa000', fontWeight: 700 }} />
                    <IconButton size="small" sx={{ ml: 1 }}><MoreVertIcon fontSize="small" /></IconButton>
                  </Box>
                ))}
              </Paper>
            </Grid>

            <Grid xs={12} md={4}>
              <Paper sx={{ p: 4, borderRadius: '24px', minHeight: 460, border: '1px solid #f0f0f0', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { label: 'Schedule Interview', sub: 'Choose time & interviewer', icon: '🗓️' },
                    { label: 'Post New Job', sub: 'Create a job listing', icon: '🚀' },
                    { label: 'Generate Report', sub: 'Weekly hiring statistics', icon: '📊' },
                    { label: 'Integrate Slack', sub: 'Get instant notifications', icon: '💬' },
                  ].map((action) => (
                    <Paper
                      key={action.label}
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        '&:hover': {
                          backgroundColor: '#f8f9fa',
                          borderColor: '#FFC107',
                        },
                      }}
                    >
                      <Box sx={{ fontSize: '1.5rem' }}>{action.icon}</Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>{action.label}</Typography>
                        <Typography variant="caption" sx={{ color: '#6c757d' }}>{action.sub}</Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
