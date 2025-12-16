import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Payments: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h4">{t('payments.title')}</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Модуль оплаты в разработке
      </Typography>
    </Box>
  );
};

export default Payments;
