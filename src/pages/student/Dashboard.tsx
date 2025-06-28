import React from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, CardHeader, Divider, Avatar } from '@mui/material';
import { Bar } from '@nivo/bar';
import { useTheme } from '@mui/material/styles';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// Mock data - in a real app, this would come from an API
const attendanceData = {
  totalClasses: 30,
  present: 25,
  absent: 3,
  late: 2,
  percentage: 83.33,
  monthlyData: [
    { month: 'Jan', present: 20, absent: 2, late: 1 },
    { month: 'Feb', present: 22, absent: 1, late: 0 },
    { month: 'Mar', present: 18, absent: 3, late: 2 },
    { month: 'Apr', present: 23, absent: 1, late: 1 },
    { month: 'May', present: 21, absent: 2, late: 0 },
  ],
};

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

const StudentDashboard: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Student Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Welcome back! Here's your attendance summary.
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Classes"
            value={attendanceData.totalClasses}
            icon={<CalendarMonthIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Present"
            value={attendanceData.present}
            icon={<CheckCircleOutlineIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Absent"
            value={attendanceData.absent}
            icon={<PendingActionsIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Attendance %"
            value={`${attendanceData.percentage}%`}
            icon={<WarningAmberIcon />}
            color={attendanceData.percentage < 75 ? 'error' : 'primary'}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Monthly Attendance Overview
            </Typography>
            <Box sx={{ height: 'calc(100% - 40px)' }}>
              <Bar
                data={attendanceData.monthlyData}
                keys={['present', 'absent', 'late']}
                indexBy="month"
                margin={{ top: 20, right: 80, bottom: 60, left: 50 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={[theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main]}
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
                  legend: 'Number of Classes',
                  legendPosition: 'middle',
                  legendOffset: -40,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="inherit:darker(1.6)"
                animate={true}
                legends={[
                  {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 15,
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemOpacity: 1,
                        },
                      },
                    ],
                  },
                ]}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '400px', overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Recent Attendance
            </Typography>
            <Box>
              {[1, 2, 3, 4, 5].map((item) => (
                <Box key={item} sx={{ mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2">
                      {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: item % 3 === 0 ? 'error.light' : 'success.light',
                        color: item % 3 === 0 ? 'error.contrastText' : 'success.contrastText',
                        px: 1,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                      }}
                    >
                      {item % 3 === 0 ? 'Absent' : 'Present'}
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {item % 3 === 0 ? 'Missed class' : 'Attended class on time'}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
