import Image from 'next/image';
import { Button } from '@/shared/ui';
import { PATHS } from '@/shared/config';
import globeIllustration from '../assets/globe.svg';
import styles from './Hero.module.scss';

export const Hero = () => {
  return (
    <section className={styles['hero']} role="hero">
      <div className={styles['wrapper']}>
        <div className={styles['content']}>
          <div className={styles['text-content']}>
            <h1 className={styles['title']}>
              Trade, Invest, and Build Your{' '}
              <span className="highlight">Future</span>!
            </h1>
            <div className={styles['tags-wrapper']}>
              <span className={styles['tag']}>Safe</span>
              <span className={styles['tag']}>Fast</span>
              <span className={styles['tag']}>Stable</span>
              <span className={styles['tag']}>Reliable</span>
            </div>
          </div>
          <Button className={styles['button-cta']} href={PATHS.MARKET}>
            <span className={styles['button-cta-inner']}>Start Trading</span>
          </Button>
        </div>
        <div className={styles['image-wrapper']}>
          <Image
            className={styles['image']}
            src={globeIllustration}
            alt="Globe illustration"
            width={680}
            height={650}
            priority
          />
        </div>
      </div>
    </section>
  );
};
