import styles from './HeroStats.module.scss';

export const HeroStats = () => {
  return (
    <div className={styles['stats']} aria-label="Platform statistics">
      <div className={styles['wrapper']}>
        <dl className={styles['list']}>
          <div className={styles['item']}>
            <div className={styles['content']}>
              <dt className={styles['value']}>150</dt>
              <dd className={styles['label']}>Countries Covered</dd>
            </div>
          </div>
          <div className={styles['item']}>
            <div className={styles['content']}>
              <dt className={styles['value']}>30M</dt>
              <dd className={styles['label']}>Global Investors</dd>
            </div>
          </div>
          <div className={styles['item']}>
            <div className={styles['content']}>
              <dt className={styles['value']}>700+</dt>
              <dd className={styles['label']}>Coins</dd>
            </div>
          </div>
          <div className={styles['item']}>
            <div className={styles['content']}>
              <dt className={styles['value']}>$1.54B</dt>
              <dd className={styles['label']}>24h Trading Volume</dd>
            </div>
          </div>
        </dl>
      </div>
    </div>
  );
};
