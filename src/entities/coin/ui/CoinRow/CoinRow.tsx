import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { formatCurrency } from '@/shared/lib';
import type { Coin } from '../../model/schemas';
import { formatPriceChange } from '../../lib/formatPriceChange';
import { SparklineTrend } from '../SparklineTrend/SparklineTrend.client';
import styles from './CoinRow.module.scss';

type CoinRowProps = {
  className?: string;
  coin: Coin;
  index: number;
};

const Cell = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles['cell']}>{children}</div>;
};

export const CoinRow = ({ className, coin, index }: CoinRowProps) => {
  const {
    id,
    name,
    current_price,
    image,
    price_change_percentage_24h,
    sparkline_in_7d,
    symbol,
  } = coin;

  const { price } = sparkline_in_7d;

  const { priceChange, cellClass } = formatPriceChange(
    price_change_percentage_24h ?? 0,
  );

  return (
    <li className={`${styles['item']} ${className || ''}`}>
      <Link className={styles['link']} href={`/coin/${id}`}>
        <Cell>
          <span className={styles['cell-position']}>{index + 1}</span>
        </Cell>
        <Cell>
          <Image
            className={styles['coin-image']}
            src={image}
            alt={name}
            width={32}
            height={32}
            unoptimized
          />
          <span className={styles['name']}>{name}</span>
          <span className={styles['symbol']}>{symbol}</span>
        </Cell>

        <Cell>
          <span className={styles['price']}>
            {formatCurrency(current_price)}
          </span>
        </Cell>
        <Cell>
          <span className={clsx(styles['price-change'], styles[cellClass])}>
            {priceChange}
          </span>
        </Cell>
        <Cell>
          <SparklineTrend priceChange={price} />
        </Cell>
        <Cell>
          <span className={styles['trade']}>Trade</span>
        </Cell>
      </Link>
    </li>
  );
};
