import React from 'react';
import { Link } from 'umi';
import type { ReactNode } from 'react';
import IconFont from '@/components/IconFont';
import styles from '../index.less';

export interface IComponentProps {
  href: string;
  title: string;
  icon: string;
  enTitle: string | ReactNode;
  bgColor: string;
  count?: number;
  disabled?: boolean;
}

const getCountFontSize = (count: number) => {
  const len = count.toString().length;

  switch (len) {
    case 0:
    case 1:
    case 2:
      return 40;
    case 3:
      return 32;
    case 4:
      return 26;
    case 5:
      return 20;
    default:
      return 12;
  }
};

const MenuCard: React.FC<IComponentProps> = ({
  href,
  icon,
  title,
  enTitle,
  bgColor,
  count,
  disabled,
}) => {
  return (
    <Link
      to={href}
      className={`${styles.cardWrapper} ${disabled ? styles.disabled : ''}`}
      style={{ background: bgColor }}
    >
      <div style={{ position: 'relative', width: '100%', height: '42px' }}>
        <div className={styles.iconWrapper}>
          <IconFont type={icon} className={styles.icon} />
        </div>
        {typeof count === 'number' && (
          <div
            className={styles.count}
            style={{ fontSize: getCountFontSize(count) }}
          >
            {count}
          </div>
        )}
      </div>
      <div className={styles.nameWrapper}>
        <h6 className={styles.title}>{title}</h6>
        <h6 className={styles.enTitle}>{enTitle}</h6>
      </div>
    </Link>
  );
};

export default MenuCard;
