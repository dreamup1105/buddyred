import React from 'react';
import omit from 'omit.js';
import RepairReport from './RepairReport';
import type { IBatchRepairReportItem } from '../type';
import styles from '../index.less';

interface IComponentProps {
  reports: IBatchRepairReportItem[];
  rawImages: string[][];
}

const RepairReports: React.FC<IComponentProps> = ({ reports, rawImages }) => {
  return (
    <div className={`${styles.repairReportsWrapper} repairReportsWrapper`}>
      {reports.map((report, index) => (
        <RepairReport
          key={report.repairTask.id}
          task={report.repairTask}
          detail={{ ...omit(report, ['repairTask']) }}
          rawImages={rawImages[index]}
        />
      ))}
    </div>
  );
};

export default RepairReports;
