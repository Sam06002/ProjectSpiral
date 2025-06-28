import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Avatar,
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  AlertTitle,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

const validationSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
});

const ForgotPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError('');
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubmitted(true);
      } catch (err) {
        setError('Failed to process your request. Please try again.');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (isSubmitted) {
    return (
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'success.main' }}>
          <EmailIcon />
        </Avatar>
        <Typography component="h1" variant="h5" gutterBottom>
          Check Your Email
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          We've sent a password reset link to {formik.values.email}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Didn't receive the email?{' '}
          <Link
            component="button"
            variant="body2"
            onClick={() => {
              formik.resetForm();
              setIsSubmitted(false);
            }}
          >
            Try again
          </Link>
        </Typography>
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          onClick={() => navigate('/login')}
        >
          Back to Login
        </Button>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
        <EmailIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Forgot Password
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1, mb: 2 }}>
        Enter your email address and we'll send you a link to reset your password.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ width: '100%', mt: 1, mb: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, width: '100%' }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Send Reset Link'}
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link component={RouterLink} to="/login" variant="body2">
              Remember your password? Sign in
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ForgotPasswordPage;
