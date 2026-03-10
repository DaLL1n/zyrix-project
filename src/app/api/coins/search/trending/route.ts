import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/search/trending',
      {
        headers: {
          'x-cg-demo-api-key': process.env.COINGECKO_API_KEY!,
          accept: 'application/json',
        },

        next: { revalidate: 60 },
      },
    );

    if (!res.ok) throw new Error('Failed to fetch trending searches');

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Search Trending API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
};
