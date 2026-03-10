import type {
  CoinTopSearchResponse,
  CoinsSearchResponse,
} from '@/entities/coin/model/schemas';
import type { SearchCoin } from '@/entities/coin';

type TopSearchCoin = CoinTopSearchResponse['coins'][number];
type SearchCoinResponseItem = CoinsSearchResponse['coins'][number];

const isTopSearchCoin = (
  coin: TopSearchCoin | SearchCoinResponseItem,
): coin is TopSearchCoin => {
  return 'item' in coin;
};

export const normalizeNestedResponse = (
  data?: CoinTopSearchResponse | CoinsSearchResponse,
): SearchCoin[] => {
  if (!data?.coins?.length) {
    return [];
  }

  return data.coins.map((coin) => {
    if (isTopSearchCoin(coin)) {
      return {
        id: coin.item.id,
        name: coin.item.name,
        symbol: coin.item.symbol,
        image: coin.item.small,
        price: coin.item.data.price,
        priceChange24h: coin.item.data.price_change_percentage_24h.usd,
      };
    }

    return {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      price: coin.current_price,
      priceChange24h: coin.price_change_percentage_24h,
    };
  });
};
