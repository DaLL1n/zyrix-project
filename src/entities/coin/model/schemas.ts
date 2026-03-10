import z from 'zod';

export const coinSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  image: z.string(),
  current_price: z.number(),
  price_change_percentage_24h: z.number().nullable(),
  sparkline_in_7d: z.object({ price: z.array(z.number()) }),
});

export type Coin = z.infer<typeof coinSchema>;

export const coinsTrendResponseSchema = z.array(coinSchema);

export const coinTopSearchSchema = z.object({
  coins: z.array(
    z.object({
      item: coinSchema
        .pick({
          id: true,
          name: true,
          symbol: true,
        })
        .extend({
          small: z.string(),
          data: z.object({
            price: z.number(),
            price_change_percentage_24h: z.object({
              usd: z.number(),
            }),
          }),
        }),
    }),
  ),
});

export type CoinTopSearchResponse = z.infer<typeof coinTopSearchSchema>;

export const coinsSearchSchema = z.object({
  coins: z.array(
    coinSchema.pick({
      id: true,
      name: true,
      symbol: true,
      image: true,
      current_price: true,
      price_change_percentage_24h: true,
    }),
  ),
});

export type CoinsSearchResponse = z.infer<typeof coinsSearchSchema>;
