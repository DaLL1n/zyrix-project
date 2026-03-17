import type { Dispatch, SetStateAction } from 'react';
import clsx from 'clsx';
import { Icon } from '../Icon/Icon';
import { Button } from '../Button/Button';
import styles from './Accordion.module.scss';

type AccordionItem = {
  id: string;
  question: string;
  answer: string;
};

type AccordionProps = {
  openItemId: string | null;
  setOpenItemId: Dispatch<SetStateAction<string | null>>;
  item: AccordionItem;
};

export const Accordion = ({
  openItemId,
  setOpenItemId,
  item,
}: AccordionProps) => {
  // Состояние раскрытия определяется по id активного элемента из родителя.
  const isItemOpen = item.id === openItemId;
  const buttonId = `${item.id}-trigger`;
  const contentId = `${item.id}-content`;

  const handleToggleAccordion = () => {
    // Повторный клик по открытому элементу закрывает его, иначе открывает текущий.
    setOpenItemId((prev) => (prev === item.id ? null : item.id));
  };

  const accordionClass = clsx(styles['accordion'], {
    [styles['open']]: isItemOpen,
  });

  return (
    <div className={accordionClass}>
      <h3 className={styles['header']}>
        <Button
          className={styles['button-trigger']}
          variant="iconOnly"
          id={buttonId}
          type="button"
          aria-expanded={isItemOpen}
          aria-controls={contentId}
          onClick={handleToggleAccordion}
        >
          <span className={styles['question']}>{item.question}</span>
          <Icon
            className={styles['icon-arrow']}
            name="faq-arrow"
            width={24}
            height={24}
          />
        </Button>
      </h3>

      <div
        className={styles['body']}
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
      >
        <p className={styles['content']}>{item.answer}</p>
      </div>
    </div>
  );
};
