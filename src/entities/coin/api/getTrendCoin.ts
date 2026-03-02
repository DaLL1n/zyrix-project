import z from 'zod';
import { coinsTrendResponseSchema, type Coin } from '../model/schemas';

export const getTrendCoin = async (): Promise<Coin[]> => {
  try {
    const response = await fetch(
      `${process.env.COINGECKO_API_URL}/coins/markets?vs_currency=usd&price_change_percentage=24h&per_page=5&sparkline=true&include_tokens=top&precision=2&sparkline=true&precision=3`,
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();

    return coinsTrendResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        'Validation failed:',
        JSON.stringify(error.issues, null, 2),
      );
    } else {
      console.error('Fetch failed:', error);
    }
    throw error;
  }
};
