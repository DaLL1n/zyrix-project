export const formatCurrency = (
  value: number,
  currency: string = 'USD',
  minimumFractionDigits: number = 1,
  maximumFractionDigits: number = 3,
): string => {
  let minimun = minimumFractionDigits;
  const maximum = maximumFractionDigits;
  if (value < 100) minimun = 0;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: minimun,
    maximumFractionDigits: maximum,
  }).format(value);
};
