import clsx from 'clsx';
import Image from 'next/image';
import type { CardData } from '../../types';
import styles from './Card.module.scss';

type CardProps = { data: CardData[number] };

export const Card = ({ data }: CardProps) => {
  const cardClass = clsx(styles['card'], {
    [styles['card-big']]: data.typeCard === 'big',
  });

  const imageParams = {
    width: data.typeCard === 'big' ? 774 : 328,
    height: data.typeCard === 'big' ? 362 : 340,
  };
  return (
    <div className={cardClass}>
      <Image
        className={styles['image']}
        src={data.imageSrc}
        alt={data.imageAlt}
        {...imageParams}
      />

      <div className={styles['content']}>
        <h3 className={styles['title']}>
          <span className="highlight">{data.titleHighlight}</span> {data.title}
        </h3>
        <p className={styles['description']}>{data.description}</p>
      </div>
    </div>
  );
};
