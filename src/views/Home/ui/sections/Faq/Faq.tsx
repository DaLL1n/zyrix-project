import { FaqAccordion } from './components/FaqAccordion.client';
import styles from './Faq.module.scss';

export const Faq = () => {
  return (
    <section className={styles['faq']} aria-labelledby="faq-title">
      <div className="container">
        <h2 className={styles['faq-title']} id="faq-title">
          Frequently Asked <span className="highlight">Questions</span>
        </h2>
        <FaqAccordion />
      </div>
    </section>
  );
};
