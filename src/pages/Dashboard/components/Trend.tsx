import React from 'react';
import IconFont from '@/components/IconFont';
import styles from '../index.less';

interface IComponentProps {
  ratio?: number | undefined;
  count?: number | undefined;
  type?: 'Repair' | 'Inspection' | 'Maintain';
}

const StatTrend: React.FC<IComponentProps> = ({ ratio, count, type }) => {
  let color: string;
  let icon: string;

  switch (type) {
    case 'Inspection':
    case 'Maintain':
      color = '#0071bc';
      if ((ratio && ratio > 0) || (count && count > 0)) {
        icon = 'iconshangsheng';
      } else {
        icon = 'iconxiajiang';
      }

      break;
    case 'Repair':
      if ((ratio && ratio > 0) || (count && count > 0)) {
        color = 'red';
        icon = 'iconshangsheng';
      } else {
        color = 'green';
        icon = 'iconxiajiang';
      }
      break;
    default:
      break;
  }

  const renderRadio = () => {
    if (
      typeof ratio !== 'number' &&
      (typeof count !== 'number' || count === 0)
    ) {
      return '-';
    }
    return (
      <>
        <IconFont
          type={icon}
          style={{ color, fontSize: 25, verticalAlign: 'middle' }}
        />
        {ratio ? `${ratio}` : `${Math.abs(count!)}台`}
      </>
    );
  };

  return <div className={styles.statTrendWrapper}>{renderRadio()}</div>;
};

export default StatTrend;
