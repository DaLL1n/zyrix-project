import z from 'zod';
import { COIN_GECKO_API_URL } from '@/shared/config';
import { validateWithZod } from '@/shared/lib';
import { coinsTrendResponseSchema, type Coin } from '../model/schemas';

export const getTrendCoin = async (): Promise<Coin[]> => {
  // Готовим заголовки для запроса к CoinGecko.
  const headers: HeadersInit = {
    accept: 'application/json',
  };

  // Если есть API-ключ, добавляем его в запрос.
  if (process.env.COINGECKO_API_KEY) {
    headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
  }

  try {
    // Запрашиваем монеты для блока трендов на главной странице.
    // Ответ кешируем на 1 минуту, чтобы не делать лишний запрос при каждом открытии страницы.
    const response = await fetch(
      `${COIN_GECKO_API_URL}/coins/markets?vs_currency=usd&price_change_percentage=24h&per_page=5&sparkline=true&include_tokens=top&precision=3`,
      {
        headers,
        next: { revalidate: 60 },
      },
    );

    // Если CoinGecko вернул ошибку, прерываем выполнение.
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    // Преобразуем ответ в JSON.
    const data = await response.json();

    // Проверяем, что данные пришли в правильном формате.
    return validateWithZod(coinsTrendResponseSchema, data);
  } catch (error) {
    // Если ошибка связана с проверкой данных, выводим детали в консоль.
    if (error instanceof z.ZodError) {
      console.error(
        'Validation failed:',
        JSON.stringify(error.issues, null, 2),
      );
    } else {
      // Для остальных ошибок просто пишем причину в консоль.
      console.error('Fetch failed:', error);
    }

    // Если запрос не удался, возвращаем пустой список, чтобы страница не падала.
    return [];
  }
};
