import React from 'react';
import Editor from '@/pages/Dictionary/Maintenance/Editor/Editor';
import Parts from '@/pages/Repair/Management/components/Parts';
import type { IComponentNode } from '@/pages/Dictionary/Maintenance/Editor/type';
import type { Part } from '@/pages/Repair/type';
import styles from '../index.less';

interface IComponentProps {
  reason: string | undefined;
  parts: Part[];
  componentData: IComponentNode[];
}

const MaintenanceReport: React.FC<IComponentProps> = ({
  reason,
  parts,
  componentData,
}) => {
  return (
    <div className="maintenanceReport">
      <Editor mode="DETAIL" componentData={componentData} />
      {parts && parts.length ? (
        <div style={{ padding: '20px' }} className={'report-node'}>
          <Parts parts={parts} theme="maintenance" />
        </div>
      ) : null}
      {reason != '' && (
        <div style={{ padding: '0 20px' }}>
          <span className={styles.resonLable}>审核意见：</span>
          <span className={styles.resonValue}>{reason}</span>
        </div>
      )}
    </div>
  );
};

export default MaintenanceReport;
