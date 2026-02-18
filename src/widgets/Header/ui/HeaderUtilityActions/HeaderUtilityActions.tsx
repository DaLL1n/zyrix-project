import { Button, Icon } from '@/shared/ui';

import styles from './HeaderUtilityActions.module.scss';

/**
 * @description UI-компонент для рендера панели утилит в шапке сайта с кнопкой поиска и смены языка.
 *
 * @returns Готовый элемент с иконкой поиска и переключения языка.
 */
export const HeaderUtilityActions = () => {
  return (
    <div className={styles['utility-actions']}>
      <Button variant="iconOnly">
        <Icon name="search" width={24} height={24} aria-label="Search" />
      </Button>
      <Button variant="iconOnly">
        <Icon
          name="earth-lang"
          width={24}
          height={24}
          aria-label="Change language"
        />
      </Button>
    </div>
  );
};
