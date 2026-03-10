import { baseApi } from '@/shared/api';
import { validateWithZod } from '@/shared/lib';
import { coinsSearchSchema, coinTopSearchSchema } from '../model/schemas';
import { normalizeNestedResponse } from '../lib/normalizeNestedResponse';
import type { SearchCoin } from '../model/search.types';

const coinApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTopSearch: build.query<SearchCoin[], void>({
      query: () => '/coins/search/trending',
      transformResponse: (response: unknown) => {
        return normalizeNestedResponse(
          validateWithZod(coinTopSearchSchema, response),
        );
      },
    }),
    getSearchCoins: build.query<SearchCoin[], string>({
      query: (query) => ({ url: 'coins/search', params: { query } }),
      transformResponse: (response: unknown) => {
        return normalizeNestedResponse(
          validateWithZod(coinsSearchSchema, response),
        );
      },
    }),
  }),
});

export const { useGetTopSearchQuery, useGetSearchCoinsQuery } = coinApi;
