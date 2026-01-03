import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Login } from './pages/Login/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { ListEntities } from './pages/Entity/ListEntities';
import { ListUsers } from './pages/User/ListUsers';
import { ListRoles } from './pages/Role/ListRoles';
import { ListRecords } from './pages/Records/ListRecords';
import { CreateRecord } from './pages/Records/CreateRecord';
import { EditRecord } from './pages/Records/EditRecord';
import { storage } from './utils/storage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFC107', // Amber/Gold highlight
      contrastText: '#1e1e2d',
    },
    secondary: {
      main: '#1e1e2d', // Deep Navy/Dark Gray
    },
    background: {
      default: '#f4f7f6', // Light gray/blue-ish background
      paper: '#ffffff',
    },
    text: {
      primary: '#1e1e2d',
      secondary: '#6c757d',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, color: '#1e1e2d' },
    h5: { fontWeight: 600, color: '#1e1e2d' },
    h6: { fontWeight: 600, color: '#1e1e2d' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 24px',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#e6ae00',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = storage.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/entities"
            element={
              <ProtectedRoute>
                <ListEntities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <ListUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <ProtectedRoute>
                <ListRoles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/entities/:entityId/records"
            element={
              <ProtectedRoute>
                <ListRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path="/entities/:entityId/records/create"
            element={
              <ProtectedRoute>
                <CreateRecord />
              </ProtectedRoute>
            }
          />
          <Route
            path="/entities/:entityId/records/:recordId/edit"
            element={
              <ProtectedRoute>
                <EditRecord />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
