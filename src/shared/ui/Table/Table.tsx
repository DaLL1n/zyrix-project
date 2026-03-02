import styles from './Table.module.scss';

type OtherTableProps = {
  className?: string;
};

type TableProps = OtherTableProps & {
  children: React.ReactNode;
};
type TableHeaderProps = OtherTableProps & {
  headers: string[];
  tableTitle?: string;
};
type TableBodyProps = TableProps;

const TableRoot = ({ children, className }: TableProps) => {
  return (
    <div className={`${styles['table']} ${className || ''}`}>{children}</div>
  );
};

const TableTop = ({ headers, className, tableTitle }: TableHeaderProps) => {
  return (
    <div className={`${styles['top']}`}>
      {tableTitle && <h2 className={styles['title']}>{tableTitle}</h2>}
      <div className={styles['headers']}>
        {headers.map((title) => (
          <div
            className={`${styles['header-cell']} ${className || ''}`}
            key={title}
          >
            <span className={styles['column-header']}>{title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TableBody = ({ children, className }: TableBodyProps) => {
  return (
    <div className={`${styles['body']} ${className || ''}`}>
      <ul className={styles['list']}>{children}</ul>
    </div>
  );
};

export const Table = Object.assign(TableRoot, {
  Top: TableTop,
  Body: TableBody,
});
