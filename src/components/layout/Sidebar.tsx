import { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 70;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  {
    title: 'RECRUITMENT',
    items: [
      { text: 'Jobs', icon: <BusinessIcon />, path: '/jobs' },
      { text: 'Candidates', icon: <PeopleIcon />, path: '/candidates' },
    ]
  },
  {
    title: 'ORGANIZATION',
    items: [
      { text: 'Entities', icon: <BusinessIcon />, path: '/entities' },
      { text: 'Users', icon: <PeopleIcon />, path: '/users' },
      { text: 'Roles', icon: <SecurityIcon />, path: '/roles' },
      { text: 'Structure', icon: <SettingsIcon />, path: '/structure' },
    ]
  },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const drawerWidth = collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowX: 'hidden',
          backgroundColor: '#1E1E2D', // Deep Navy
          color: '#A2A3B7', // Muted text
          border: 'none',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 3,
          py: 3,
          mb: 2,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            backgroundColor: '#FFC107',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: collapsed ? 0 : 1.5,
          }}
        >
          <Typography sx={{ color: '#1E1E2D', fontWeight: 900, fontSize: 20 }}>ti</Typography>
        </Box>
        {!collapsed && (
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.5px' }}>
            tiimi
          </Typography>
        )}
      </Box>

      <List sx={{ px: collapsed ? 1 : 2 }}>
        {menuItems.map((section, idx) => (
          <Box key={idx} sx={{ mb: 2 }}>
            {!collapsed && 'title' in section && (
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  py: 1,
                  display: 'block',
                  color: '#494B74',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                }}
              >
                {section.title}
              </Typography>
            )}
            {('items' in section ? section.items : [section]).map((item: any) => {
              const active = location.pathname.startsWith(item.path);
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    selected={active}
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: '10px',
                      minHeight: 44,
                      justifyContent: collapsed ? 'center' : 'initial',
                      px: 2,
                      backgroundColor: active ? '#FFC107' : 'transparent',
                      color: active ? '#1E1E2D' : '#A2A3B7',
                      '&:hover': {
                        backgroundColor: active ? '#FFC107' : 'rgba(255,255,255,0.05)',
                        color: active ? '#1E1E2D' : '#FFFFFF',
                        '& .MuiListItemIcon-root': {
                          color: active ? '#1E1E2D' : '#FFFFFF',
                        }
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#FFC107',
                        color: '#1E1E2D',
                        '&:hover': {
                          backgroundColor: '#FFC107',
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: collapsed ? 0 : 2,
                        justifyContent: 'center',
                        color: 'inherit',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!collapsed && (
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: '14px',
                          fontWeight: active ? 700 : 500
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{
            width: '100%',
            borderRadius: '10px',
            color: '#A2A3B7',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)', color: '#FFFFFF' },
          }}
        >
          {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
    </Drawer>
  );
};
