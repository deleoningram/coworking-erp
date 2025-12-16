import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Stack,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as AddIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { mockResidents } from '../services/mockData';

const Residents: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const extendedResidents = [
    { 
      name: 'Иван Петров', 
      status: 'active', 
      tariff: 'Hot desk',
      email: 'ivan.petrov@email.com',
      phone: '+7 (999) 123-45-67',
      since: '2024-01-15'
    },
    { 
      name: 'Мария Смирнова', 
      status: 'active', 
      tariff: 'Фикс место',
      email: 'maria.smirnova@email.com',
      phone: '+7 (999) 234-56-78',
      since: '2024-03-20'
    },
    { 
      name: 'Алексей Козлов', 
      status: 'active', 
      tariff: 'Переговорная',
      email: 'alexey.kozlov@email.com',
      phone: '+7 (999) 345-67-89',
      since: '2024-06-10'
    },
    { 
      name: 'Ольга Новикова', 
      status: 'inactive', 
      tariff: 'Hot desk',
      email: 'olga.novikova@email.com',
      phone: '+7 (999) 456-78-90',
      since: '2023-11-05'
    },
  ];

  const filteredResidents = extendedResidents.filter(resident =>
    resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resident.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">{t('residents.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Добавить резидента
        </Button>
      </Stack>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Поиск по имени или email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Найдено: {filteredResidents.length} резидентов
        </Typography>
      </Paper>

      {/* Residents Grid */}
      <Grid container spacing={3}>
        {filteredResidents.map((resident, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                    {getInitials(resident.name)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{resident.name}</Typography>
                    <Chip
                      label={t(`residents.${resident.status}`)}
                      color={resident.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                </Stack>

                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {resident.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {resident.phone}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Тариф: <strong>{resident.tariff}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    С нами с: {new Date(resident.since).toLocaleDateString('ru-RU')}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button size="small" variant="outlined" fullWidth>
                    Подробнее
                  </Button>
                  <Button size="small" variant="outlined" color="error" fullWidth>
                    Удалить
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredResidents.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Резиденты не найдены
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Residents;
