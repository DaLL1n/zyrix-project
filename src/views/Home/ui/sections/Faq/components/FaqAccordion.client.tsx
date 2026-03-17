'use client';

import { Accordion } from '@/shared/ui';
import { FAQ_ITEMS } from '../constants';
import { useState } from 'react';
import styles from './FaqAccordion.module.scss';

export const FaqAccordion = () => {
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  return (
    <ul className={styles['accordion-list']}>
      {FAQ_ITEMS.map((item) => (
        <li className={styles['accordion-item']} key={item.id}>
          <Accordion
            item={item}
            openItemId={openItemId}
            setOpenItemId={setOpenItemId}
          />
        </li>
      ))}
    </ul>
  );
};
