'use client';

import { useState } from 'react';
import { Button, Icon } from '@/shared/ui';
import { ModalSearch } from '@/features/modal-search';
import styles from './UtilityActions.module.scss';

export const UtilityActions = () => {
  const [isOpenModalSearch, setIsOpenModalSearch] = useState<boolean>(false);

  const handleOpenModalSearch = () => {
    setIsOpenModalSearch((prev) => !prev);
  };

  return (
    <div className={styles['utility-actions']}>
      <Button
        className={styles['button-search']}
        variant="iconOnly"
        onClick={handleOpenModalSearch}
      >
        <Icon
          className={styles['icon']}
          name="search"
          width={24}
          height={24}
          aria-label="Search"
        />
      </Button>
      {isOpenModalSearch && (
        <ModalSearch onClose={() => setIsOpenModalSearch(false)} />
      )}
      <Button className={styles['button-language']} variant="iconOnly">
        <Icon
          className={styles['icon']}
          name="earth-lang"
          width={24}
          height={24}
          aria-label="Change language"
        />
      </Button>
    </div>
  );
};
