import { COIN_GECKO_API_URL } from '@/shared/config';
import { NextResponse } from 'next/server';

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.trim();

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 },
    );
  }

  const headers = {
    'x-cg-demo-api-key': process.env.COINGECKO_API_KEY!,
    accept: 'application/json',
  };

  try {
    // 1. Ищем монеты (текстовый поиск)
    const searchRes = await fetch(
      `${COIN_GECKO_API_URL}/search?query=${query}`,
      { headers },
    );
    if (!searchRes.ok) throw new Error('Search failed');
    const searchData = await searchRes.json();

    // Если ничего не найдено
    if (!searchData.coins || searchData.coins.length === 0) {
      return NextResponse.json({ coins: [] });
    }

    // 2. Берем топ-5 ID
    const topCoinIds = searchData.coins
      .slice(0, 5)
      .map((coin: { id: string }) => coin.id)
      .join(',');

    // 3. Запрашиваем полные рыночные данные по этим ID (включая sparkline и цены)
    const marketsRes = await fetch(
      `${COIN_GECKO_API_URL}/coins/markets?vs_currency=usd&ids=${topCoinIds}&price_change_percentage=24h`,
      { headers },
    );
    if (!marketsRes.ok) throw new Error('Markets fetch failed');
    const marketsData = await marketsRes.json();

    // Возвращаем данные.
    // Оборачиваем в объект { coins: [...] } чтобы структура совпадала с ожиданиями UI
    return NextResponse.json({ coins: marketsData });
  } catch (error) {
    console.error('BFF Search Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
};
