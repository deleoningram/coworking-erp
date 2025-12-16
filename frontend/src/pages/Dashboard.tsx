import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { mockBookings, mockStats, mockResidents, mockOccupancyData } from '../services/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'approved':
        return 'info';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPaymentColor = (payment: string) => {
    return payment === 'paid' ? 'success' : 'error';
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        {t('dashboard.title')}
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {t('dashboard.todayBookings')}
              </Typography>
              <Typography variant="h3" color="primary">
                {mockStats.todayBookings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {t('dashboard.occupancy')}
              </Typography>
              <Typography variant="h3" color="warning.main">
                {mockStats.occupancy}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {t('dashboard.revenue')}
              </Typography>
              <Typography variant="h3" color="success.main">
                {mockStats.revenue}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Occupancy Chart */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {t('dashboard.occupancyByHour')}
        </Typography>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={mockOccupancyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#1976d2" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Bookings Table */}
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">{t('dashboard.bookingsList')}</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('bookings.bookingId')}</TableCell>
                <TableCell>{t('bookings.resource')}</TableCell>
                <TableCell>{t('bookings.time')}</TableCell>
                <TableCell>{t('bookings.status')}</TableCell>
                <TableCell>{t('bookings.payment')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>{booking.resource}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>
                    <Chip
                      label={t(`bookings.${booking.status}`)}
                      color={getStatusColor(booking.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(`bookings.${booking.payment}`)}
                      color={getPaymentColor(booking.payment)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Residents and Tariffs */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.residents')}
            </Typography>
            {mockResidents.map((resident, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography>
                  {resident.name} - <Chip label={t(`residents.${resident.status}`)} size="small" />
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.tariffs')}
            </Typography>
            <Typography>Hot desk: ₽500</Typography>
            <Typography>Фикс: ₽12,000/мес</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
