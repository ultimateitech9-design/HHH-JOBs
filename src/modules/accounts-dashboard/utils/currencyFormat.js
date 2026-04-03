export const formatCurrency = (value, currency = 'INR', locale = 'en-IN') => {
  const amount = Number(value || 0);

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatCompactCurrency = (value, currency = 'INR', locale = 'en-IN') => {
  const amount = Number(value || 0);

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(amount);
};
