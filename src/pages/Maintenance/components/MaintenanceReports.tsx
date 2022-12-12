import React from 'react';
import { injectDataToTemplate } from '../hooks/useTemplate';
import MaintenanceReport from './MaintenanceReport';
import type { ITaskDetailsWithTemplateItem } from '../type';
import styles from '../index.less';

interface IComponentProps {
  reports: ITaskDetailsWithTemplateItem[];
}

const MaintenanceReports: React.FC<IComponentProps> = ({ reports }) => {
  const renderReport = (report: ITaskDetailsWithTemplateItem) => {
    const { ext: taskDetail, maintainTaskData: taskValues, template } = report;
    const { content, version } = JSON.parse(template.body);
    const componentData = injectDataToTemplate(
      content,
      version,
      taskValues?.values || [],
      taskValues?.context || [],
      taskDetail,
    );
    return (
      <MaintenanceReport
        reason={report.maintainTask.reason2}
        key={report.maintainTask.id}
        parts={report.repairPartList}
        componentData={componentData}
      />
    );
  };
  return (
    <div className={`${styles.maintainReportsWrapper} maintainReportsWrapper`}>
      {reports.map((report) => renderReport(report))}
    </div>
  );
};

export default MaintenanceReports;
