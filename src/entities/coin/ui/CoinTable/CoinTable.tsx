import { Table } from '@/shared/ui';

type CoinTableProps = {
  headers: string[];
  children: React.ReactNode;
};

export const CoinTable = ({ headers, children }: CoinTableProps) => {
  return (
    <Table>
      <Table.Top headers={headers} />
      {children}
    </Table>
  );
};
