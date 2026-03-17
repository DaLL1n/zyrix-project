import { useState } from 'react';
import { useDebounce } from '@/shared/lib/hooks';
import { useGetSearchCoinsQuery, useGetTopSearchQuery } from '@/entities/coin';

const MIN_SEARCH_LENGTH = 2;

export const useModalSearchCoins = () => {
  const [searchValue, setSearchValue] = useState('');
  const trimmedSearchValue = searchValue.trim();
  const debouncedSearchValue = useDebounce(trimmedSearchValue, 500);
  const shouldSearch = debouncedSearchValue.length >= MIN_SEARCH_LENGTH;

  const {
    data: topSearchData,
    status: topSearchStatus,
    refetch: refetchTopSearch,
  } = useGetTopSearchQuery(undefined, {
    skip: shouldSearch,
  });

  const {
    data: searchData,
    status: searchStatus,
    refetch: refetchSearch,
  } = useGetSearchCoinsQuery(debouncedSearchValue, {
    skip: !shouldSearch,
  });

  const coins = shouldSearch ? (searchData ?? []) : (topSearchData ?? []);

  const status = shouldSearch ? searchStatus : topSearchStatus;

  const refetch = shouldSearch ? refetchSearch : refetchTopSearch;

  const title = shouldSearch ? 'Search Results' : 'Top Searches';

  return {
    searchValue,
    setSearchValue,
    coins,
    title,
    status,
    refetch,
  };
};
