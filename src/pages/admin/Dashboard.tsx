import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Avatar,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Bar, Pie } from '@nivo/rosetta';
import { useTheme } from '@mui/material/styles';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Class as ClassIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  PersonAdd as PersonAddIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Link as RouterLink } from 'react-router-dom';

// Mock data - in a real app, this would come from an API
const systemStats = {
  totalUsers: 156,
  activeUsers: 142,
  inactiveUsers: 14,
  totalStudents: 1245,
  totalTeachers: 45,
  totalClasses: 32,
  userGrowth: [
    { month: 'Jan', users: 120 },
    { month: 'Feb', users: 125 },
    { month: 'Mar', users: 130 },
    { month: 'Apr', users: 135 },
    { month: 'May', users: 142 },
    { month: 'Jun', users: 156 },
  ],
  userDistribution: [
    { id: 'Students', label: 'Students', value: 1245, color: '#4caf50' },
    { id: 'Teachers', label: 'Teachers', value: 45, color: '#2196f3' },
    { id: 'Admins', label: 'Admins', value: 5, color: '#ff9800' },
  ],
  recentActivities: [
    { id: 1, user: 'John Doe', action: 'Logged in', time: '2 minutes ago', type: 'info' },
    { id: 2, user: 'Jane Smith', action: 'Updated profile', time: '10 minutes ago', type: 'success' },
    { id: 3, user: 'Admin', action: 'Created new user', time: '25 minutes ago', type: 'info' },
    { id: 4, user: 'System', action: 'Scheduled maintenance', time: '1 hour ago', type: 'warning' },
    { id: 5, user: 'Robert Johnson', action: 'Failed login attempt', time: '2 hours ago', type: 'error' },
  ],
};

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', lastLogin: '2023-06-28T10:30:00' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Teacher', status: 'active', lastLogin: '2023-06-28T09:15:00' },
  { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'Teacher', status: 'inactive', lastLogin: '2023-06-27T14:22:00' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'Student', status: 'active', lastLogin: '2023-06-28T08:45:00' },
  { id: 5, name: 'Michael Wilson', email: 'michael@example.com', role: 'Student', status: 'suspended', lastLogin: '2023-06-25T16:10:00' },
];

const StatCard = ({ title, value, icon, color, trend }: { title: string; value: string | number; icon: React.ReactNode; color: string; trend?: string }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="overline" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ mt: 1 }}>
            {value}
          </Typography>
          {trend && (
            <Chip
              label={trend}
              size="small"
              color={trend.includes('+') ? 'success' : 'error'}
              sx={{ mt: 1 }}
            />
          )}
        </Box>
        <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.dark` }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, userId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleAction = (action: string) => {
    console.log(`${action} user ${selectedUserId}`);
    handleMenuClose();
  };

  const userColumns: GridColDef[] = [
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.main' }}>
            {params.row.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {params.row.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      )
    },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small"
          color={
            params.value === 'Admin' ? 'primary' : 
            params.value === 'Teacher' ? 'secondary' : 'default'
          }
        />
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small"
          color={
            params.value === 'active' ? 'success' : 
            params.value === 'inactive' ? 'default' : 'error'
          }
          variant={params.value === 'inactive' ? 'outlined' : 'filled'}
        />
      )
    },
    { 
      field: 'lastLogin', 
      headerName: 'Last Login', 
      width: 180,
      valueFormatter: (params) => 
        new Date(params.value).toLocaleString()
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleMenuOpen(e, params.row.id);
          }}
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome back! Here's what's happening with your system.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={systemStats.totalUsers}
            icon={<PeopleIcon />}
            color="primary"
            trend="+5.2% from last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Users"
            value={systemStats.activeUsers}
            icon={<PeopleIcon />}
            color="success"
            trend="+3.1% from last week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={systemStats.totalStudents}
            icon={<SchoolIcon />}
            color="info"
            trend="+8.7% from last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Classes"
            value={systemStats.totalClasses}
            icon={<ClassIcon />}
            color="warning"
            trend="+2 new this month"
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              User Growth
            </Typography>
            <Box sx={{ height: 320 }}>
              <Bar
                data={systemStats.userGrowth}
                indexBy="month"
                keys={['users']}
                margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={[theme.palette.primary.main]}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Month',
                  legendPosition: 'middle',
                  legendOffset: 40,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Number of Users',
                  legendPosition: 'middle',
                  legendOffset: -50,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="inherit:darker(1.6)"
                animate={true}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              User Distribution
            </Typography>
            <Box sx={{ height: 320, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Pie
                data={systemStats.userDistribution}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.6}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                enableArcLinkLabels={false}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor="white"
                colors={({ data }) => data.color}
                tooltip={({ datum: { label, value, color } }) => (
                  <Box
                    sx={{
                      padding: 1,
                      background: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      boxShadow: theme.shadows[1],
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: color,
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2">
                        {label}: <strong>{value} users</strong>
                      </Typography>
                    </Box>
                  </Box>
                )}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Users Table */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">User Management</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              size="small"
              placeholder="Search users..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              component={RouterLink}
              to="/admin/users/new"
            >
              Add User
            </Button>
          </Box>
        </Box>
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 2 }}
        >
          <Tab label="All Users" />
          <Tab label="Active" />
          <Tab label="Inactive" />
          <Tab label="Suspended" />
        </Tabs>

        <Box sx={{ height: 500 }}>
          <DataGrid
            rows={users}
            columns={userColumns}
            pageSize={7}
            rowsPerPageOptions={[7]}
            checkboxSelection
            disableSelectionOnClick
            onRowClick={(params) => {
              // Navigate to user detail page
              console.log('Navigate to user:', params.row.id);
            }}
            sx={{
              '& .MuiDataGrid-row': {
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              },
            }}
          />
        </Box>
      </Paper>

      {/* Recent Activities */}
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Recent Activities</Typography>
          <Button
            size="small"
            endIcon={<FileDownloadIcon />}
            onClick={() => console.log('Export activities')}
          >
            Export
          </Button>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {systemStats.recentActivities.map((activity) => (
                <TableRow key={activity.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {activity.user}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={activity.action}
                      size="small"
                      color={
                        activity.type === 'success' ? 'success' :
                        activity.type === 'warning' ? 'warning' :
                        activity.type === 'error' ? 'error' : 'default'
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* User Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleAction('edit')}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit User</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('suspend')}>
          <ListItemIcon>
            <BlockIcon fontSize="small" color="warning" />
          </ListItemIcon>
          <ListItemText>Suspend User</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete User</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AdminDashboard;
