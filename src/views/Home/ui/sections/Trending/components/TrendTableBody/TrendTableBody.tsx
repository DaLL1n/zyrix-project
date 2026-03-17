import { CoinRow, getTrendCoin } from '@/entities/coin';

import { Table } from '@/shared/ui';

export const TrendTableBody = async () => {
  const coins = await getTrendCoin();

  return (
    <Table.Body>
      {coins.map((coin, index) => (
        <CoinRow key={coin.id} coin={coin} index={index} />
      ))}
    </Table.Body>
  );
};
