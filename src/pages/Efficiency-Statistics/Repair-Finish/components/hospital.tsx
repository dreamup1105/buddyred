import React, { useRef, useState } from 'react';
import { DatePicker, Row, Col } from 'antd';
import ProTable from '@/components/ProTable';
import useUserInfo from '@/hooks/useUserInfo';
import useDepartments from '@/hooks/useDepartments';
import DepartmentSelector from '@/components/DepartmentSelector';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { ITableListItem, IFetchTableFormItem } from '../type';
import {
  queryCompleteMaintenanceAPI,
  queryDepartmentMaintenanceAPI,
} from '../service';
import { tableHeight } from '@/utils/utils';
import { momentToString, WithoutTimeFormat } from '@/utils/utils';
const { RangePicker } = DatePicker;
import styles from '../index.less';

const DefaultQuery = {
  current: 1,
  pageSize: 30,
  date: undefined,
  departmentId: undefined,
};

// 科室开机率列表
const StartingUpHospitalPage: React.FC = () => {
  const { currentUser } = useUserInfo();
  const actionRef = useRef<ActionType>();
  const orgId = currentUser?.org.id;
  const { departmentsTreeData } = useDepartments({ orgId: orgId! }, true);
  const [hospitailStatic, setHospitailStatic] = useState<ITableListItem>();

  const getHospitalData = async (params: IFetchTableFormItem) => {
    try {
      let dataArr = [];
      const { data } = await queryCompleteMaintenanceAPI(params);
      dataArr = data;
      setHospitailStatic(dataArr);
    } catch (err) {
      console.log(err);
    }
  };

  const columns: ProTableColumn<ITableListItem>[] = [
    {
      title: '序号',
      key: 'index',
      width: 65,
      render: (t: any, r: any, index: number) => index + 1,
      hideInSearch: true,
    },
    {
      title: '科室',
      dataIndex: 'departmentId',
      key: 'departmentId',
      hideInTable: true,
      renderFormItem: () => (
        <DepartmentSelector
          treeSelectProps={{
            treeData: departmentsTreeData,
            virtual: false,
          }}
        />
      ),
    },
    {
      title: '起止时间',
      dataIndex: 'date',
      key: 'date',
      hideInTable: true,
      renderFormItem: () => <RangePicker />,
    },
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '报修次数',
      dataIndex: 'repairsFrequency',
      key: 'repairsFrequency',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '维修完成次数',
      dataIndex: 'accomplishFrequency',
      key: 'accomplishFrequency',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '完成率(%)',
      dataIndex: 'ratio',
      key: 'ratio',
      width: 100,
      hideInSearch: true,
    },
  ];

  return (
    <>
      <Row className={styles.static}>
        <Col span={5}>
          <div className={styles.staticTitle}>
            {hospitailStatic?.repairsFrequency}
          </div>
          <div>报修次数</div>
        </Col>
        <Col span={5}>
          <div className={styles.staticTitle}>
            {hospitailStatic?.accomplishFrequency}
          </div>
          <div>维修完成次数</div>
        </Col>
        <Col span={5}>
          <div className={styles.staticTitle}>{hospitailStatic?.ratio}%</div>
          <div>完成率</div>
        </Col>
      </Row>
      <ProTable<ITableListItem, typeof DefaultQuery>
        rowKey="departmentId"
        title="全院科室维修完成率"
        defaultQuery={DefaultQuery}
        actionRef={actionRef}
        columns={columns}
        isSyncToUrl={false}
        tableProps={{
          scroll: {
            y: tableHeight,
          },
        }}
        request={async (query) => {
          const { current, pageSize, date, departmentId } = query;
          const params = {
            current: Number(current) || 1,
            pageSize: Number(pageSize) || 30,
            startTime:
              (date?.[0] &&
                momentToString(date[0], WithoutTimeFormat) + ' 00:00:00') ||
              undefined,
            endTime:
              (date?.[1] &&
                momentToString(date[1], WithoutTimeFormat) + ' 23:59:59') ||
              undefined,
          };
          getHospitalData(params);
          return queryDepartmentMaintenanceAPI({
            ...params,
            departmentId,
          });
        }}
      />
    </>
  );
};

export default StartingUpHospitalPage;
