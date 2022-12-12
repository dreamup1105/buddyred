import React, { useRef, useState } from 'react';
import { DatePicker, Row, Col } from 'antd';
import ProTable from '@/components/ProTable';
import useUserInfo from '@/hooks/useUserInfo';
import useDepartments from '@/hooks/useDepartments';
import DepartmentSelector from '@/components/DepartmentSelector';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { ITableListItem, IFetchTableFormItem } from '../type';
import {
  getSelectDepartmentStartingAPI,
  getSelectStartingUpAPI,
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

// 全院开机率
const StartingUpHospitalPage: React.FC = () => {
  const { currentUser } = useUserInfo();
  const actionRef = useRef<ActionType>();
  const orgId = currentUser?.org.id;
  const { departmentsTreeData } = useDepartments({ orgId: orgId! }, true);
  const [hospitailStatic, setHospitailStatic] = useState<ITableListItem>();

  // 查看详情
  // const onRecordDetail = (record: ITableListItem) => {
  //   console.log(record);
  // }

  const getHospitalData = async (params: IFetchTableFormItem) => {
    try {
      let dataArr = [];
      const { data } = await getSelectStartingUpAPI(params);
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
      title: '应开机时长(h)',
      dataIndex: 'shouldDuration',
      key: 'shouldDuration',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '停机时长(h)',
      dataIndex: 'stopDuration',
      key: 'stopDuration',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '实际开机时长(h)',
      dataIndex: 'practicalDuration',
      key: 'practicalDuration',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '开机率(%)',
      dataIndex: 'ratio',
      key: 'ratio',
      width: 100,
      hideInSearch: true,
    },
    // {
    //   title: '操作',
    //   dataIndex: 'employeeNo',
    //   key: 'employeeNo',
    //   width: 100,
    //   hideInSearch: true,
    //   render: (_, record) => {
    //     return <a onClick={() => onRecordDetail(record)}>详情</a>
    //   }
    // }
  ];

  return (
    <>
      <Row className={styles.static}>
        <Col span={5}>
          <div className={styles.staticTitle}>
            {hospitailStatic?.shouldDuration}h
          </div>
          <div>全院应开机时长</div>
        </Col>
        <Col span={5}>
          <div className={styles.staticTitle}>
            {hospitailStatic?.stopDuration}h
          </div>
          <div>全院停机时长</div>
        </Col>
        <Col span={5}>
          <div className={styles.staticTitle}>
            {hospitailStatic?.practicalDuration}h
          </div>
          <div>全院实际开机时长</div>
        </Col>
        <Col span={5}>
          <div className={styles.staticTitle}>{hospitailStatic?.ratio}%</div>
          <div>全院开机率</div>
        </Col>
      </Row>
      <ProTable<ITableListItem, typeof DefaultQuery>
        rowKey="departmentId"
        title="全院开机率列表"
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
          return getSelectDepartmentStartingAPI({
            ...params,
            departmentId,
          });
        }}
      />
    </>
  );
};

export default StartingUpHospitalPage;
