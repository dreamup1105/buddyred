import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { RollbackOutlined } from '@ant-design/icons';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { FormInstance } from 'antd/es/form';
import ProTable from '@/components/ProTable';
import { momentToString, tableHeight, WithoutTimeFormat } from '@/utils/utils';
import type { customRecordTable, ICardItem } from '../type';
import { Input, DatePicker } from 'antd';
import useACL from '@/hooks/useACL';
import { selectGroupInspectionRecordAPI } from '../service';
import useUserInfo from '@/hooks/useUserInfo';
import InfoModal from './info';
const RangePicker: any = DatePicker.RangePicker;
import styles from '../index.less';

const DefaultQuery = {
  current: 1,
  pageSize: 30,
  keyword: '', // 关键字-自检人
  startTime: undefined, //自检时间-开始时间
  endTime: undefined, //自检时间-结束时间
  groupId: undefined,
  date: undefined,
};

interface IComponentProps {
  onBack: () => void;
  cardItem: ICardItem;
  selectDate: any;
}

const CustomMadeRecordListPgae: React.FC<IComponentProps> = ({
  onBack,
  cardItem,
  selectDate,
}) => {
  const { currentUser } = useUserInfo();
  const { isACL } = useACL();
  const orgId = currentUser?.org.id;
  const isHospital = !!currentUser?.isHospital;
  const crId = currentUser!.currentCustomer?.id;
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();

  const [recordView, setRecordView] = useState<customRecordTable>();
  const [infoVisible, setInfoVisible] = useState<boolean>(false);

  // 查看详情 编辑 删除
  const onViewDetail = async (record: customRecordTable) => {
    setRecordView(record);
    setInfoVisible(true);
  };

  const columns: ProTableColumn<customRecordTable>[] = [
    {
      title: '序号',
      key: 'index',
      width: 65,
      render: (t: any, r: any, index: number) => index + 1,
      hideInSearch: true,
    },
    {
      title: '关键字',
      dataIndex: 'keyword',
      key: 'keyword',
      hideInTable: true,
      renderFormItem: () => <Input placeholder="自检人" />,
    },
    {
      title: '自检时间',
      dataIndex: 'date',
      key: 'date',
      hideInTable: true,
      renderFormItem: () => <RangePicker />,
    },
    {
      title: '巡检组名称',
      dataIndex: 'groupName',
      key: 'groupName',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '所在科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '设备数量',
      dataIndex: 'equipmentCount',
      key: 'equipmentCount',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '正常数量',
      dataIndex: 'normalCount',
      key: 'normalCount',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '异常数量',
      dataIndex: 'abnormalCount',
      key: 'abnormalCount',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '维修中数量',
      dataIndex: 'inRepairCount',
      key: 'inRepairCount',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '转借数量',
      dataIndex: 'inSecondedCount',
      key: 'inSecondedCount',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '未自检数量',
      dataIndex: 'notInspectionCount',
      key: 'notInspectionCount',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '自检人',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '自检时间',
      dataIndex: 'updDate',
      key: 'updDate',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      key: 'operations',
      width: 80,
      hideInSearch: true,
      fixed: 'right',
      render: (_, record) => {
        return (
          <>
            <a onClick={() => onViewDetail(record)}>详情</a>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    if (selectDate) {
      // console.log(formRef);
      formRef.current?.setFieldsValue({
        date: selectDate,
      });
    }
  }, [selectDate]);

  return (
    <>
      <PageContainer>
        <div className={styles.rollBack}>
          <RollbackOutlined
            className={styles.rollBackIcon}
            onClick={() => onBack()}
          />
        </div>
        <ProTable<customRecordTable, typeof DefaultQuery>
          rowKey="id"
          isSyncToUrl={false}
          title={`${cardItem.groupName} 定制巡检列表`}
          defaultQuery={DefaultQuery}
          columns={columns}
          actionRef={actionRef}
          formRef={formRef}
          tableProps={{
            scroll: {
              y: tableHeight,
            },
          }}
          request={(query) => {
            const { current, pageSize, keyword, date } = query;
            console.log(query);
            const params = {
              orgId,
              current: Number(current) || 1,
              pageSize: Number(pageSize) || 30,
              keyword,
              startTime:
                (date?.[0] &&
                  momentToString(date[0], WithoutTimeFormat) + ' 00:00:00') ||
                undefined,
              endTime:
                (date?.[1] &&
                  momentToString(date[1], WithoutTimeFormat) + ' 23:59:59') ||
                undefined,
              isAcl: isHospital ? isACL : undefined,
              crId: !isHospital ? crId : undefined,
              groupId: cardItem.groupId,
            };
            return selectGroupInspectionRecordAPI(params);
          }}
        />
      </PageContainer>

      {/* 定制巡检详情弹框 */}
      <InfoModal
        visible={infoVisible}
        record={recordView}
        onCancel={() => setInfoVisible(false)}
      />
    </>
  );
};

export default CustomMadeRecordListPgae;
