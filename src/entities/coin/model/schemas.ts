import z from 'zod';

export const coinSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  image: z.string(),
  current_price: z.number(),
  price_change_percentage_24h: z.number(),
  sparkline_in_7d: z.object({ price: z.array(z.number()) }),
});

export type Coin = z.infer<typeof coinSchema>;

export const coinsTrendResponseSchema = z.array(coinSchema);
