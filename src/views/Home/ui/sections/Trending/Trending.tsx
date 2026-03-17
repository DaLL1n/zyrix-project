import { Suspense } from 'react';

import { CoinTable } from '@/entities/coin';
import { TrendTableBody } from './components/TrendTableBody/TrendTableBody';
import { HEADERS_TABLE } from './constants';
import styles from './Trending.module.scss';

export const Trending = () => {
  return (
    <section className={styles['trending']}>
      <div className="container">
        <h2 className={styles['title']}>
          <span className="highlight">Market</span> Trend
        </h2>
        <CoinTable headers={HEADERS_TABLE}>
          <Suspense>
            <TrendTableBody />
          </Suspense>
        </CoinTable>
      </div>
    </section>
  );
};
