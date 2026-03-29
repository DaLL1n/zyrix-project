'use client';

import { useEscapeKey, useScrollOutside } from '@/shared/lib/hooks';
import { Button, Icon, Input, Loader } from '@/shared/ui';
import { useEffectEvent } from 'react';
import { useModalSearchCoins } from '../model/useModalSearchCoins';
import { ModalSearchCoinItem } from './components/ModalSearchCoinItem/ModalSearchCoinItem';
import styles from './ModalSearch.module.scss';

type ModalSearchProps = {
  onCloseAction: () => void;
};

export const ModalSearch = ({ onCloseAction }: ModalSearchProps) => {
  const { coins, searchValue, setSearchValue, title, status, refetch } =
    useModalSearchCoins();

  const closeModalEscape = useEffectEvent(onCloseAction);
  useEscapeKey(closeModalEscape);
  useScrollOutside(() => onCloseAction());

  const content = () => {
    switch (status) {
      case 'pending':
        return (
          <div className={styles['loader-container']}>
            <Loader className={styles['loader']} width={75} height={75} />
          </div>
        );
      case 'fulfilled':
        return (
          <ul className={styles['coins-list']}>
            {coins.map((coin) => (
              <ModalSearchCoinItem key={coin.id} coin={coin} />
            ))}
          </ul>
        );
      case 'rejected':
        return (
          <div className={styles['error']}>
            <p className={styles['error-message']}>Failed to load data.</p>
            <Button
              className={styles['retry-button']}
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        );
    }
  };

  const noDataContent = () => {
    if (coins.length === 0 && status === 'fulfilled') {
      return (
        <div className={styles['no-data']}>
          <Icon name="no-data" width={120} height={150} />
        </div>
      );
    }
  };

  return (
    <div className={styles['modal-search']}>
      <div className={styles['wrapper']}>
        <div className={styles['input-container']}>
          <Input
            className={styles['input']}
            type="search"
            placeholder="Search"
            aria-label="Search coins"
            icon={
              <Icon
                className={styles['input-icon']}
                name="search"
                width={16}
                height={16}
                aria-hidden
              />
            }
            autoComplete="off"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
        </div>
        <h2 className={styles['title']}>{title}</h2>
        {content()}
        {noDataContent()}
      </div>
    </div>
  );
};
