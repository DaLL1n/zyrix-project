export type SearchCoin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  price: number;
  priceChange24h: number | null;
};