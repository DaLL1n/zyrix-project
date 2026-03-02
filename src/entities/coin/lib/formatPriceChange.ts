export const formatPriceChange = (priceChange: number) => {
  const fixPrice = priceChange.toFixed(2);

  if (priceChange > 0) {
    return { priceChange: `+${fixPrice}%`, cellClass: 'positive' };
  } else if (priceChange === 0) {
    return { priceChange: `${fixPrice}%`, cellClass: 'neutral' };
  } else {
    return { priceChange: `${fixPrice}%`, cellClass: 'negative' };
  }
};
