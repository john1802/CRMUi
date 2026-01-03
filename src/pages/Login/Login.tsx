import { useState, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { styles } from './Login.styles';
import { formReducer, createFormInitialState } from '../../reducers/formReducer';
import { AuthApi } from '../../api/authApi';
import { storage } from '../../utils/storage';

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

const initialValues: LoginFormValues = {
  email: '',
  password: '',
};

export const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'error' | 'success' | 'warning' }>({
    open: false,
    message: '',
    severity: 'error',
  });
  
  const [formState, dispatch] = useReducer(
    formReducer<LoginFormValues>,
    createFormInitialState(initialValues)
  );

  const showToast = (message: string, severity: 'error' | 'success' | 'warning' = 'error') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast(prev => ({ ...prev, open: false }));
  };

  const validateForm = (): LoginFormErrors => {
    const errors: LoginFormErrors = {};
    
    if (!formState.values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formState.values.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formState.values.password) {
      errors.password = 'Password is required';
    }
    
    return errors;
  };

  const handleChange = (field: keyof LoginFormValues, value: string) => {
    dispatch({ type: 'SET_FIELD', field, value });
    if (formState.errors[field]) {
      dispatch({ type: 'CLEAR_ERROR', field });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      showToast(firstError || 'Please fill in all required fields', 'error');
      Object.entries(errors).forEach(([field, errorMsg]) => {
        dispatch({ 
          type: 'SET_ERROR', 
          field: field as keyof LoginFormValues, 
          error: errorMsg 
        });
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthApi.login(formState.values);
      const { token, tenantId } = response.data;
      
      storage.setToken(token);
      if (tenantId) {
        storage.setTenantId(tenantId);
      }
      
      showToast('Login successful!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast('Invalid email or password. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <IconButton size="small">
          <LanguageIcon />
        </IconButton>
        <Button sx={styles.headerButton}>Sign up</Button>
        <Button variant="contained" sx={styles.requestDemoButton}>
          Request Demo
        </Button>
      </Box>

      <Box sx={styles.leftSection}>
        <Box sx={styles.decorativeElements}>
          {/* Curvy line at top */}
          <svg
            style={{ position: 'absolute', top: '5%', left: '55%', width: 180 }}
            viewBox="0 0 180 30"
          >
            <path d="M0,15 Q30,5 60,15 T120,15 T180,15" fill="none" stroke="#333" strokeWidth="1.5" />
          </svg>

          {/* Document/Form icon - top area */}
          <svg
            style={{ position: 'absolute', top: '12%', left: '8%', width: 90, height: 70 }}
            viewBox="0 0 90 70"
          >
            <rect x="5" y="5" width="80" height="60" rx="4" fill="none" stroke="#333" strokeWidth="1.5" />
            <line x1="15" y1="20" x2="65" y2="20" stroke="#333" strokeWidth="1.5" />
            <line x1="15" y1="32" x2="55" y2="32" stroke="#333" strokeWidth="1.5" />
          </svg>

          {/* Small rectangle with lines - middle left */}
          <svg
            style={{ position: 'absolute', top: '35%', left: '3%', width: 70, height: 55 }}
            viewBox="0 0 70 55"
          >
            <rect x="3" y="3" width="64" height="49" rx="3" fill="none" stroke="#333" strokeWidth="1.5" />
            <line x1="12" y1="15" x2="45" y2="15" stroke="#333" strokeWidth="1.5" />
            <line x1="12" y1="28" x2="58" y2="28" stroke="#333" strokeWidth="1.5" />
          </svg>

          {/* Squiggle line - middle area */}
          <svg
            style={{ position: 'absolute', top: '28%', left: '35%', width: 140 }}
            viewBox="0 0 140 25"
          >
            <path d="M0,12 Q20,2 40,12 T80,12 T120,12 T140,12" fill="none" stroke="#333" strokeWidth="1.5" />
          </svg>

          {/* Yellow/Orange dotted rectangle - bottom left */}
          <svg
            style={{ position: 'absolute', bottom: '12%', left: '2%', width: 75, height: 95 }}
            viewBox="0 0 75 95"
          >
            <rect x="3" y="3" width="69" height="89" rx="4" fill="#f5a623" />
            {[...Array(12)].map((_, i) => (
              <circle
                key={i}
                cx={14 + (i % 3) * 22}
                cy={18 + Math.floor(i / 3) * 22}
                r="5"
                fill="#333"
              />
            ))}
          </svg>

          {/* White card with arrow - bottom center-left */}
          <svg
            style={{ position: 'absolute', bottom: '8%', left: '22%', width: 75, height: 75 }}
            viewBox="0 0 75 75"
          >
            <rect x="3" y="3" width="69" height="69" rx="4" fill="#fff" stroke="#ddd" strokeWidth="1.5" />
            <path d="M20,55 L37,22 L54,55" fill="none" stroke="#333" strokeWidth="2" />
          </svg>

          {/* Small decorative line - top right of left section */}
          <svg
            style={{ position: 'absolute', top: '18%', left: '60%', width: 60 }}
            viewBox="0 0 60 15"
          >
            <path d="M0,7 Q15,0 30,7 T60,7" fill="none" stroke="#333" strokeWidth="1.5" />
          </svg>

          {/* Additional small rectangle - middle right */}
          <svg
            style={{ position: 'absolute', top: '50%', left: '55%', width: 50, height: 40 }}
            viewBox="0 0 50 40"
          >
            <rect x="2" y="2" width="46" height="36" rx="3" fill="none" stroke="#333" strokeWidth="1.5" />
            <line x1="8" y1="12" x2="35" y2="12" stroke="#333" strokeWidth="1.5" />
            <line x1="8" y1="22" x2="42" y2="22" stroke="#333" strokeWidth="1.5" />
          </svg>
        </Box>
      </Box>

      <Box sx={styles.centerSection}>
        <Card sx={styles.loginCard}>
          <Typography sx={styles.title}>Agent Login</Typography>
          <Typography sx={styles.subtitle}>
            Hey, Enter your details to get sign in<br />to your account
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="Enter Email / Phone No"
              value={formState.values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              sx={styles.textField}
              disabled={isLoading}
            />

            <TextField
              fullWidth
              placeholder="Passcode"
              type={showPassword ? 'text' : 'password'}
              value={formState.values.password}
              onChange={(e) => handleChange('password', e.target.value)}
              sx={styles.textField}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    <Typography
                      sx={{ ml: 1, cursor: 'pointer', color: '#666', fontSize: '0.875rem' }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Hide' : 'Hide'}
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={styles.forgotPassword}>
              <Typography component="span" sx={styles.forgotPasswordLink}>
                Having trouble in sign in?
              </Typography>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={styles.signInButton}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign in'}
            </Button>
          </form>

          <Divider sx={styles.divider}>Or Sign in with</Divider>

          <Box sx={styles.socialButtons}>
            <Button variant="outlined" sx={styles.socialButton}>
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                style={{ width: 18, height: 18, marginRight: 8 }}
              />
              Google
            </Button>
            <Button variant="outlined" sx={styles.socialButton}>
              <img
                src="https://www.apple.com/favicon.ico"
                alt="Apple"
                style={{ width: 18, height: 18, marginRight: 8 }}
              />
              Apple ID
            </Button>
            <Button variant="outlined" sx={styles.socialButton}>
              <img
                src="https://www.facebook.com/favicon.ico"
                alt="Facebook"
                style={{ width: 18, height: 18, marginRight: 8 }}
              />
              Facebook
            </Button>
          </Box>

          <Typography sx={styles.signupText}>
            Don't have an account?{' '}
            <Typography component="span" sx={styles.signupLink}>
              Request Now
            </Typography>
          </Typography>
        </Card>
      </Box>

      <Box sx={styles.rightSection}>
        <Box
          component="img"
          src="/attached_assets/ChatGPT_Image_Dec_13,_2025,_10_13_31_PM_1765644695827.png"
          alt="Woman sitting with laptop"
          sx={styles.womanIllustration}
        />
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
