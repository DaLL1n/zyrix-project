import { COIN_GECKO_API_URL } from '@/shared/config';
import { NextResponse } from 'next/server';

export const GET = async (request: Request) => {
  // 1. Достаём поисковую строку из URL и убираем лишние пробелы.
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.trim();

  // 2. Если запрос пустой, сразу возвращаем 400.
  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 },
    );
  }

  const apiKey = process.env.COINGECKO_API_KEY;

  // 3. Проверяем, что ключ CoinGecko доступен в окружении.
  if (!apiKey) {
    console.error('BFF Search Error: COINGECKO_API_KEY is missing');
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }

  const headers = {
    'x-cg-demo-api-key': apiKey,
    accept: 'application/json',
  };

  try {
    // 4. Собираем URL через searchParams, чтобы спецсимволы в query
    // корректно кодировались и не ломали запрос.
    const searchUrl = new URL(`${COIN_GECKO_API_URL}/search`);
    searchUrl.searchParams.set('query', query);

    // 5. Ищем монеты по текстовому запросу.
    const searchRes = await fetch(searchUrl.toString(), { headers });

    if (!searchRes.ok) {
      throw new Error('Search failed');
    }

    const searchData = await searchRes.json();

    // 6. Если совпадений нет, возвращаем пустой список в формате UI.
    if (!searchData.coins || searchData.coins.length === 0) {
      return NextResponse.json({ coins: [] });
    }

    // 7. Берём только первые 7 id для второго запроса.
    const topCoinIds = searchData.coins
      .slice(0, 7)
      .map((coin: { id: string }) => coin.id)
      .join(',');

    // 8. Запрашиваем полные рыночные данные по найденным монетам.
    const marketsUrl = new URL(`${COIN_GECKO_API_URL}/coins/markets`);
    marketsUrl.searchParams.set('vs_currency', 'usd');
    marketsUrl.searchParams.set('ids', topCoinIds);
    marketsUrl.searchParams.set('price_change_percentage', '24h');

    const marketsRes = await fetch(marketsUrl.toString(), { headers });

    if (!marketsRes.ok) {
      throw new Error('Markets fetch failed');
    }

    const marketsData = await marketsRes.json();

    // 9. Возвращаем ответ в формате { coins: [...] }, который уже ждёт UI.
    return NextResponse.json({ coins: marketsData });
  } catch (error) {
    console.error('BFF Search Error:', error);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
};
