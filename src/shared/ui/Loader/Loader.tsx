import { Icon } from '../Icon/Icon';
import styles from './Loader.module.scss';

type LoaderProps = {
  width: number;
  height: number;
  className?: string;
};

export const Loader = ({ width, height, className }: LoaderProps) => {
  return (
    <div className={`${styles.loader} ${className || ''}`}>
      <div className={styles.coin}>
        <span className={styles.engraving}>
          <Icon name="loader" width={width} height={height} />
        </span>
      </div>
    </div>
  );
};
