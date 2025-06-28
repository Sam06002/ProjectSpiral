import React from 'react';
import { Button, Container, Typography, Box, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const Page404: React.FC = () => {
  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 600,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <ErrorOutlineIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
          <Typography component="h1" variant="h3" gutterBottom>
            404 - Page Not Found
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Oops! The page you're looking for doesn't exist or has been moved.
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The requested URL was not found on this server. You may have mistyped the address or the page may have been moved.
          </Typography>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3 }}
          >
            Go to Homepage
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Page404;
