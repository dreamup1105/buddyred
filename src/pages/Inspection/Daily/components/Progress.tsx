import React from 'react';
import { Progress } from 'antd';
import type { InspectionStatItem } from '../../type';

interface IComponentProps {
  statInfo: InspectionStatItem | undefined;
}

const getPercent = (statInfo: InspectionStatItem) => {
  if (
    typeof statInfo.alreadyInspectionDepartmentCount === 'number' &&
    typeof statInfo.notInspectionDepartmentCount === 'number'
  ) {
    const totalEquipments =
      statInfo.alreadyInspectionDepartmentCount +
      statInfo.notInspectionDepartmentCount;
    return Number(
      (
        (statInfo.alreadyInspectionDepartmentCount * 100) /
        totalEquipments
      ).toFixed(2),
    );
  }
  return 0;
};

const InspectionProgress: React.FC<IComponentProps> = ({ statInfo }) => {
  if (!statInfo) {
    return null;
  }

  return (
    <Progress
      type="circle"
      percent={getPercent(statInfo)}
      format={(percent) => `进度 ${percent}%`}
      width={160}
    />
  );
};

export default InspectionProgress;
