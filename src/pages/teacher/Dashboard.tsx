import React from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, Button, Divider, Avatar, Chip } from '@mui/material';
import { Pie } from '@nivo/pie';
import { useTheme } from '@mui/material/styles';
import GroupsIcon from '@mui/icons-material/Groups';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Link as RouterLink } from 'react-router-dom';

// Mock data - in a real app, this would come from an API
const classData = {
  totalStudents: 45,
  present: 42,
  absent: 3,
  late: 2,
  attendancePercentage: 93.33,
  recentAttendance: [
    { id: 1, date: '2023-06-28', present: 42, absent: 3, late: 2 },
    { id: 2, date: '2023-06-27', present: 41, absent: 4, late: 1 },
    { id: 3, date: '2023-06-26', present: 43, absent: 2, late: 0 },
    { id: 4, date: '2023-06-25', present: 40, absent: 5, late: 3 },
    { id: 5, date: '2023-06-24', present: 44, absent: 1, late: 1 },
  ],
};

const students = [
  { id: 1, name: 'John Doe', rollNumber: 'S001', attendance: '95%', status: 'present' },
  { id: 2, name: 'Jane Smith', rollNumber: 'S002', attendance: '88%', status: 'present' },
  { id: 3, name: 'Robert Johnson', rollNumber: 'S003', attendance: '76%', status: 'warning' },
  { id: 4, name: 'Emily Davis', rollNumber: 'S004', attendance: '92%', status: 'present' },
  { id: 5, name: 'Michael Wilson', rollNumber: 'S005', attendance: '68%', status: 'warning' },
];

const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.dark`, mr: 2 }}>
          {icon}
        </Avatar>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const TeacherDashboard: React.FC = () => {
  const theme = useTheme();

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Student Name', flex: 1 },
    { field: 'rollNumber', headerName: 'Roll No.', width: 120 },
    {
      field: 'attendance',
      headerName: 'Attendance %',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <Box
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'divider',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: `${params.value}`,
                  bgcolor: parseFloat(params.value) > 75 ? 'success.main' : 'warning.main',
                }}
              />
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value === 'present' ? 'Good' : 'Needs Attention'}
          color={params.value === 'present' ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: () => (
        <Button
          variant="outlined"
          size="small"
          component={RouterLink}
          to="/teacher/student/1"
        >
          View Details
        </Button>
      ),
    },
  ];

  const pieData = [
    {
      id: 'Present',
      label: 'Present',
      value: classData.present,
      color: theme.palette.success.main,
    },
    {
      id: 'Absent',
      label: 'Absent',
      value: classData.absent,
      color: theme.palette.error.main,
    },
    {
      id: 'Late',
      label: 'Late',
      value: classData.late,
      color: theme.palette.warning.main,
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Teacher Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome back! Here's your class overview.
          </Typography>
        </Box>
        <Button variant="contained" color="primary" component={RouterLink} to="/teacher/attendance/mark">
          Mark Attendance
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={classData.totalStudents}
            icon={<GroupsIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Present Today"
            value={classData.present}
            icon={<CheckCircleOutlineIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Absent Today"
            value={classData.absent}
            icon={<PendingActionsIcon />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Class Attendance"
            value={`${classData.attendancePercentage}%`}
            icon={<WarningAmberIcon />}
            color={classData.attendancePercentage < 80 ? 'warning' : 'primary'}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Today's Attendance
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Pie
                data={pieData}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
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
                        {label}: <strong>{value} students</strong>
                      </Typography>
                    </Box>
                  </Box>
                )}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Recent Attendance</Typography>
              <Button size="small" component={RouterLink} to="/teacher/attendance">
                View All
              </Button>
            </Box>
            <Box sx={{ height: 'calc(100% - 40px)' }}>
              <DataGrid
                rows={classData.recentAttendance.map((item) => ({
                  ...item,
                  date: new Date(item.date).toLocaleDateString(),
                  attendance: Math.round(((item.present + item.late * 0.5) / classData.totalStudents) * 100) + '%',
                }))}
                columns={[
                  { field: 'date', headerName: 'Date', flex: 1 },
                  { field: 'present', headerName: 'Present', width: 100 },
                  { field: 'absent', headerName: 'Absent', width: 100 },
                  { field: 'late', headerName: 'Late', width: 100 },
                  { field: 'attendance', headerName: 'Attendance', width: 120 },
                ]}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Class Students</Typography>
          <Button size="small" component={RouterLink} to="/teacher/students">
            View All Students
          </Button>
        </Box>
        <Box sx={{ height: 400 }}>
          <DataGrid
            rows={students}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default TeacherDashboard;
