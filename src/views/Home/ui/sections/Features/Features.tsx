import { CARD_DATA } from './consts';
import { Card } from './components/Card/Card';
import styles from './Features.module.scss';

export const Features = () => {
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
