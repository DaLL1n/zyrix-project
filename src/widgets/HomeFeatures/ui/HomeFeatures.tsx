import { CARD_DATA } from '../model/constants';
import { Card } from './components/Card/Card';
import styles from './HomeFeatures.module.scss';

export const HomeFeatures = () => {
  return (
    <section className={styles['features']}>
      <div className="container">
        <h2 className={styles['title']}>
          <span className="highlight">Powering</span> Your Crypto Journey
        </h2>
        <ul className={styles['card-list']}>
          {CARD_DATA.map((card) => {
            return (
              <li
                className={styles[`card-item-${card.typeCard}`]}
                key={card.id}
              >
                <Card data={card} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
