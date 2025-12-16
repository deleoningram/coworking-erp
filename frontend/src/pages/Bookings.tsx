import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Snackbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import { fetchBookings, deleteBooking, createBooking, updateBooking, Booking } from '../services/bookingsService';

const Bookings: React.FC = () => {
  const { t } = useTranslation();
  
  // State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Partial<Booking>>({
    resource: '',
    time: '',
    status: 'pending',
    payment: 'unpaid',
    client: '',
  });
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Load bookings on mount
  useEffect(() => {
    loadBookings();
  }, []);

  // Load bookings from Supabase
  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBookings();
      setBookings(data);
      setFilteredBookings(data);
    } catch (err) {
      setError('Ошибка загрузки бронирований');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.client.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter((booking) => booking.payment === paymentFilter);
    }

    setFilteredBookings(filtered);
  }, [searchTerm, statusFilter, paymentFilter, bookings]);

  // Handle create new booking
  const handleCreateNew = () => {
    setEditMode(false);
    setCurrentBooking({
      resource: '',
      time: '',
      status: 'pending',
      payment: 'unpaid',
      client: '',
    });
    setDialogOpen(true);
  };

  // Handle edit booking
  const handleEdit = (booking: Booking) => {
    setEditMode(true);
    setCurrentBooking(booking);
    setDialogOpen(true);
  };

  // Handle save (create or update)
  const handleSave = async () => {
    try {
      // Validation
      if (!currentBooking.resource || !currentBooking.time || !currentBooking.client) {
        setSnackbar({ open: true, message: 'Заполните все обязательные поля', severity: 'error' });
        return;
      }

      if (editMode && currentBooking.id) {
        // Update existing
        await updateBooking(currentBooking.id, currentBooking as Booking);
        setSnackbar({ open: true, message: 'Бронирование обновлено', severity: 'success' });
      } else {
        // Create new
        await createBooking(currentBooking as Omit<Booking, 'id' | 'created_at'>);
        setSnackbar({ open: true, message: 'Бронирование создано', severity: 'success' });
      }

      // Reload data and close dialog
      await loadBookings();
      setDialogOpen(false);
    } catch (err) {
      setSnackbar({ open: true, message: 'Ошибка сохранения', severity: 'error' });
      console.error(err);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить бронирование?')) return;

    try {
      await deleteBooking(id);
      setSnackbar({ open: true, message: 'Бронирование удалено', severity: 'success' });
      await loadBookings();
    } catch (err) {
      setSnackbar({ open: true, message: 'Ошибка удаления', severity: 'error' });
      console.error(err);
    }
  };

  // Export to CSV
  const handleExport = () => {
    const csv = [
      ['ID', 'Ресурс', 'Время', 'Статус', 'Оплата', 'Клиент'],
      ...filteredBookings.map((b) => [
        b.id,
        b.resource,
        b.time,
        t(`bookings.${b.status}`),
        t(`bookings.${b.payment}`),
        b.client,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Status color
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
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>{t('common.loading')}</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={loadBookings}>
            Повторить
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">{t('bookings.title')}</Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            {t('common.export')}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
          >
            {t('bookings.newBooking')}
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label={t('common.search')}
            placeholder="ID, ресурс или клиент"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 250 }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{t('bookings.status')}</InputLabel>
            <Select
              value={statusFilter}
              label={t('bookings.status')}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Все</MenuItem>
              <MenuItem value="active">{t('bookings.active')}</MenuItem>
              <MenuItem value="pending">{t('bookings.pending')}</MenuItem>
              <MenuItem value="approved">{t('bookings.approved')}</MenuItem>
              <MenuItem value="cancelled">{t('bookings.cancelled')}</MenuItem>
              <MenuItem value="completed">{t('bookings.completed')}</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{t('bookings.payment')}</InputLabel>
            <Select
              value={paymentFilter}
              label={t('bookings.payment')}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <MenuItem value="all">Все</MenuItem>
              <MenuItem value="paid">{t('bookings.paid')}</MenuItem>
              <MenuItem value="unpaid">{t('bookings.unpaid')}</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="body2" sx={{ alignSelf: 'center', ml: 'auto', color: 'text.secondary' }}>
            Показано: <strong>{filteredBookings.length}</strong> из <strong>{bookings.length}</strong>
          </Typography>
        </Box>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>{t('bookings.bookingId')}</strong></TableCell>
              <TableCell><strong>{t('bookings.resource')}</strong></TableCell>
              <TableCell><strong>{t('bookings.time')}</strong></TableCell>
              <TableCell><strong>{t('bookings.status')}</strong></TableCell>
              <TableCell><strong>{t('bookings.payment')}</strong></TableCell>
              <TableCell><strong>{t('bookings.client')}</strong></TableCell>
              <TableCell align="right"><strong>{t('bookings.actions')}</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all'
                      ? 'Нет результатов по фильтрам'
                      : t('common.noData')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id} hover>
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
                      color={booking.payment === 'paid' ? 'success' : 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{booking.client}</TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('common.edit')}>
                      <IconButton size="small" color="primary" onClick={() => handleEdit(booking)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(booking.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? `${t('common.edit')} ${t('bookings.title').toLowerCase()}` : t('bookings.newBooking')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('bookings.resource')}
                value={currentBooking.resource || ''}
                onChange={(e) => setCurrentBooking({ ...currentBooking, resource: e.target.value })}
                placeholder="Место A-12, Переговорная, и т.д."
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('bookings.time')}
                value={currentBooking.time || ''}
                onChange={(e) => setCurrentBooking({ ...currentBooking, time: e.target.value })}
                placeholder="10:00-12:00"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('bookings.client')}
                value={currentBooking.client || ''}
                onChange={(e) => setCurrentBooking({ ...currentBooking, client: e.target.value })}
                placeholder="Имя клиента"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>{t('bookings.status')}</InputLabel>
                <Select
                  value={currentBooking.status || 'pending'}
                  label={t('bookings.status')}
                  onChange={(e) => setCurrentBooking({ ...currentBooking, status: e.target.value as Booking['status'] })}
                >
                  <MenuItem value="pending">{t('bookings.pending')}</MenuItem>
                  <MenuItem value="active">{t('bookings.active')}</MenuItem>
                  <MenuItem value="approved">{t('bookings.approved')}</MenuItem>
                  <MenuItem value="cancelled">{t('bookings.cancelled')}</MenuItem>
                  <MenuItem value="completed">{t('bookings.completed')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>{t('bookings.payment')}</InputLabel>
                <Select
                  value={currentBooking.payment || 'unpaid'}
                  label={t('bookings.payment')}
                  onChange={(e) => setCurrentBooking({ ...currentBooking, payment: e.target.value as Booking['payment'] })}
                >
                  <MenuItem value="unpaid">{t('bookings.unpaid')}</MenuItem>
                  <MenuItem value="paid">{t('bookings.paid')}</MenuItem>
                  <MenuItem value="refund">Возврат</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} variant="contained">
            {editMode ? t('common.save') : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Bookings;
