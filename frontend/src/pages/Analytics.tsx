import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Analytics: React.FC = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState('week');

  const occupancyByZone = [
    { name: 'Open Space', value: 75 },
    { name: 'Фокус-кабинки', value: 85 },
    { name: 'Переговорные', value: 65 },
    { name: 'Телефонные будки', value: 90 },
    { name: 'Ивент-зона', value: 45 }
  ];

  const revenueData = [
    { month: 'Июль', revenue: 320000, target: 300000 },
    { month: 'Август', revenue: 380000, target: 350000 },
    { month: 'Сентябрь', revenue: 420000, target: 400000 },
    { month: 'Октябрь', revenue: 450000, target: 420000 },
    { month: 'Ноябрь', revenue: 480000, target: 450000 },
    { month: 'Декабрь', revenue: 510000, target: 480000 }
  ];

  const tariffDistribution = [
    { name: 'Hot desk', value: 45, color: '#1976d2' },
    { name: 'Фикс место', value: 30, color: '#dc004e' },
    { name: 'Переговорные', value: 15, color: '#f57c00' },
    { name: 'Ивент-зона', value: 10, color: '#388e3c' }
  ];

  const COLORS = ['#1976d2', '#dc004e', '#f57c00', '#388e3c'];

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">{t('analytics.title')}</Typography>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Период</InputLabel>
          <Select
            value={period}
            label="Период"
            onChange={(e) => setPeriod(e.target.value)}
          >
            <MenuItem value="week">Неделя</MenuItem>
            <MenuItem value="month">Месяц</MenuItem>
            <MenuItem value="quarter">Квартал</MenuItem>
            <MenuItem value="year">Год</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Средняя загрузка
              </Typography>
              <Typography variant="h4" color="primary">
                72%
              </Typography>
              <Typography variant="body2" color="success.main">
                +5% за месяц
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Выручка/месяц
              </Typography>
              <Typography variant="h4" color="success.main">
                ₽510K
              </Typography>
              <Typography variant="body2" color="success.main">
                +6.7% за месяц
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Активных резидентов
              </Typography>
              <Typography variant="h4" color="info.main">
                127
              </Typography>
              <Typography variant="body2" color="success.main">
                +12 за месяц
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                ARPU
              </Typography>
              <Typography variant="h4" color="warning.main">
                ₽4,016
              </Typography>
              <Typography variant="body2" color="text.secondary">
                стабильно
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Выручка vs План
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₽${value.toLocaleString()}`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#1976d2" 
                  strokeWidth={2}
                  name="Факт"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#dc004e" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="План"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Распределение по тарифам
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tariffDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tariffDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Загрузка по зонам
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={occupancyByZone}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="value" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
