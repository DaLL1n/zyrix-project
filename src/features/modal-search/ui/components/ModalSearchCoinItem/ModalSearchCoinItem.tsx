import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { formatPriceChange, type SearchCoin } from '@/entities/coin';
import { formatCurrency } from '@/shared/lib';
import { Button, Icon } from '@/shared/ui';
import styles from './ModalSearchCoinItem.module.scss';

type ModalSearchCoinItemProps = {
  coin: SearchCoin;
};

export const ModalSearchCoinItem = memo(
  ({ coin }: ModalSearchCoinItemProps) => {
    const { id, name, symbol, image, price, priceChange24h } = coin;
    const { priceChange, cellClass } = formatPriceChange(priceChange24h ?? 0);

    return (
      <li className={styles['coin-item']}>
        <Link className={styles['coin-link']} href={id} title={name}>
          <span className={styles['coin-label']}>
            <Image
              className={styles['coin-icon']}
              src={image}
              width={24}
              height={24}
              alt={name}
              unoptimized
            />
            <span>{symbol} USDT</span>
          </span>
          <span className={styles['price']}>{formatCurrency(price)}</span>
          <span className={clsx(styles['price-change'], styles[cellClass])}>
            {priceChange}
          </span>
        </Link>
        <Button
          variant="iconOnly"
          className={styles['favorite-button']}
          aria-label={`Add ${name} to favorites`}
        >
          <Icon
            className={styles['favorite-icon']}
            name="favorite-star"
            width={14}
            height={14}
          />
          <Icon
            className={styles['favorite-icon-filled']}
            name="favorite-star-filled"
            width={14}
            height={14}
          />
        </Button>
      </li>
    );
  },
);
