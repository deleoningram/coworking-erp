import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileDownload as ExportIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { mockBookings } from '../services/mockData';

// Define Booking type locally to avoid import issues
type BookingType = {
  id: string;
  resource: string;
  time: string;
  status: 'active' | 'pending' | 'approved' | 'cancelled' | 'completed';
  payment: 'paid' | 'unpaid';
  client: string;
};

const Bookings: React.FC = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<BookingType[]>(mockBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  // Filter bookings based on search and filters
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch = 
        booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.client.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || booking.payment === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [bookings, searchQuery, statusFilter, paymentFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'approved': return 'info';
      case 'cancelled': return 'error';
      case 'completed': return 'default';
      default: return 'default';
    }
  };

  const getPaymentColor = (payment: string) => {
    return payment === 'paid' ? 'success' : 'error';
  };

  const handleDelete = (id: string) => {
    setBookings(bookings.filter(b => b.id !== id));
  };

  const handleExport = () => {
    const csv = [
      ['ID', 'Ресурс', 'Время', 'Статус', 'Оплата', 'Клиент'],
      ...filteredBookings.map(b => [b.id, b.resource, b.time, b.status, b.payment, b.client])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookings.csv';
    a.click();
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">{t('bookings.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          {t('bookings.newBooking')}
        </Button>
      </Stack>

      {/* Filters Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>{t('bookings.status')}</InputLabel>
            <Select
              value={statusFilter}
              label={t('bookings.status')}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Все</MenuItem>
              <MenuItem value="active">Активно</MenuItem>
              <MenuItem value="pending">Ожидание</MenuItem>
              <MenuItem value="approved">Согласовано</MenuItem>
              <MenuItem value="cancelled">Отменено</MenuItem>
              <MenuItem value="completed">Завершено</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>{t('bookings.payment')}</InputLabel>
            <Select
              value={paymentFilter}
              label={t('bookings.payment')}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <MenuItem value="all">Все</MenuItem>
              <MenuItem value="paid">Оплачено</MenuItem>
              <MenuItem value="unpaid">Не оплачено</MenuItem>
            </Select>
          </FormControl>

          <Button variant="outlined" startIcon={<ExportIcon />} onClick={handleExport}>
            {t('common.export')}
          </Button>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Найдено: {filteredBookings.length} из {bookings.length}
        </Typography>
      </Paper>

      {/* Bookings Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('bookings.bookingId')}</TableCell>
              <TableCell>{t('bookings.resource')}</TableCell>
              <TableCell>{t('bookings.time')}</TableCell>
              <TableCell>{t('bookings.client')}</TableCell>
              <TableCell>{t('bookings.status')}</TableCell>
              <TableCell>{t('bookings.payment')}</TableCell>
              <TableCell align="right">{t('bookings.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary">{t('common.noData')}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id} hover>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>{booking.resource}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>{booking.client}</TableCell>
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
                  <TableCell align="right">
                    <Tooltip title="Редактировать">
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDelete(booking.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Bookings;
