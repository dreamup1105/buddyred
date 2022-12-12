import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { FormInstance } from 'antd/es/form';
import ProTable from '@/components/ProTable';
import { tableHeight } from '@/utils/utils';
import { EquipmentStatusEnum } from './type';
import type { ITableListItem } from './type';
import { Badge, message, Input, Button } from 'antd';
// import useSubAuthorities from '@/hooks/useSubAuthorities';
import EquipmentDetailModal from '@/components/Equipment/Detail';
import useACL from '@/hooks/useACL';
import ScarpDetailModal from './components/detail';
import {
  getEquipmentInfo,
  getScrapInfoByEquipment,
  ScarpEquipmentListExport,
} from './service';
import DepartmentSelector from '@/components/DepartmentSelector';
import useDepartments from '@/hooks/useDepartments';
import useUserInfo from '@/hooks/useUserInfo';
import { normalizeDepartmentId } from '@/pages/Assets/helper';
import { download } from '@/utils/utils';
import { PrinterOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd/es/table';
import PrintContainer from '@/components/PrintContainer';
import EquipmentInfo from '@/pages/Assets/components/EquipmentInfo';
import usePrint from '@/hooks/usePrint';
import type { EquipmentDetailEx } from '@/pages/Assets/type';
import { batchFetchEquipmentInfo } from '@/pages/Assets/service';

const DefaultQuery = {
  current: 1,
  pageSize: 30,
  keyword: '', // 名称/品牌/型号/序列号输入关键字模糊搜索
  departmentIds: [],
  equipmentNo: '',
};

const ScarpSheetPage: React.FC = () => {
  const { currentUser } = useUserInfo();
  const { isACL } = useACL();
  const orgId = currentUser?.org.id;
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [equipmentId, setEquipmentId] = useState<number>();
  const [
    equipmentDetailModalVisible,
    setEquipmentDetailModalVisible,
  ] = useState(false);
  const [scarpDetailVisible, setScarpDetailVisible] = useState<boolean>(false);
  const [equipmentDetail, setEquipmentDetail] = useState({});
  const { departmentsTreeData } = useDepartments({ orgId: orgId! }, true);
  const [exporting, setExporting] = useState<boolean>(false);
  const [printing, setPriting] = useState<boolean>(false);
  const [selectedEquipKeys, setSelectedEquipKeys] = useState<number[]>([]);
  const {
    componentRef: detailPrintComponentRef,
    onPrint: onBatchPrintDetails,
  } = usePrint();
  const [equipmentDetailsForPrint, setEquipmentDetailsForPrint] = useState<
    EquipmentDetailEx[]
  >([]);

  // 查看详情
  const onTableDetailClick = async (record: ITableListItem) => {
    try {
      const { data } = await getScrapInfoByEquipment(record.id);
      setScarpDetailVisible(true);
      setEquipmentDetail(data);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  //点击设备名称查看设备详情
  const onEquipmentDetailClick = (record: ITableListItem) => {
    setEquipmentId(record.id);
    setEquipmentDetailModalVisible(true);
  };

  // 导出Excel
  const onExportExcel = async () => {
    setExporting(true);
    try {
      const tableQuery = actionRef.current?.getQuery();
      const { departmentIds, keyword } = tableQuery;
      const { data, response } = await ScarpEquipmentListExport({
        departmentIds: normalizeDepartmentId(departmentIds),
        keyword: keyword,
        orgId,
        isAcl: isACL,
      });
      download(data, response);
      message.success('导出成功');
    } catch (err: any) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  const rowSelection: TableProps<ITableListItem>['rowSelection'] = {
    preserveSelectedRowKeys: true,
    selectedRowKeys: selectedEquipKeys,
    onChange: (selectedRowKeys) => {
      setSelectedEquipKeys(selectedRowKeys as number[]);
    },
  };

  // 打印设备详情
  const onPrint = async () => {
    if (selectedEquipKeys.length > 20) {
      message.warning(`批量打印设备详情单次不能超过20个，请重新进行选择`);
      return;
    }
    setPriting(true);
    try {
      const params = {
        ids: selectedEquipKeys,
      };
      const { data } = await batchFetchEquipmentInfo(params);
      setEquipmentDetailsForPrint(data);
      onBatchPrintDetails!();
    } catch (err) {
      console.log(err);
    } finally {
      setPriting(false);
    }
  };

  const columns: ProTableColumn<ITableListItem>[] = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      key: 'keyword',
      renderFormItem: () => <Input placeholder="设备/型号/序列号" />,
    },
    {
      title: '设备名称',
      dataIndex: 'equipNameNew',
      key: 'equipNameNew',
      width: 160,
      hideInSearch: true,
      render: (_, record) => {
        return (
          <a onClick={() => onEquipmentDetailClick(record)}>
            {record.equipNameNew}
          </a>
        );
      },
    },
    {
      title: '设备自编号',
      dataIndex: 'equipmentNo',
      key: 'equipmentNo',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '科室',
      dataIndex: 'departmentIds',
      key: 'departmentIds',
      hideInTable: true,
      renderFormItem: () => (
        <DepartmentSelector
          treeSelectProps={{
            multiple: true,
            treeData: departmentsTreeData,
            virtual: false,
          }}
        />
      ),
    },
    {
      title: '设备型号',
      dataIndex: 'modelName',
      key: 'modelName',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '设备厂商',
      dataIndex: 'manufacturerName',
      key: 'manufacturerName',
      width: 210,
      hideInSearch: true,
    },
    {
      title: '签约状态',
      dataIndex: 'isSigned',
      key: 'isSigned',
      width: 120,
      hideInSearch: true,
      render: (status: boolean) => {
        switch (status) {
          case true:
            return <span style={{ color: '#52c41a' }}>签约</span>;
            break;
          case false:
            return <span style={{ color: 'red' }}>未签约</span>;
            break;
          default:
            return '';
        }
      },
    },
    {
      title: '设备序列号',
      dataIndex: 'sn',
      key: 'sn',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '设备状态',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      hideInSearch: true,
      render: (status: EquipmentStatusEnum) => {
        switch (status) {
          case EquipmentStatusEnum.UNUSED:
            return <Badge status="default" text="停用" />;
          case EquipmentStatusEnum.READY:
            return <Badge status="success" text="启用中" />;
          default:
            return '';
        }
      },
    },
    {
      title: '设备类型',
      dataIndex: 'typeName',
      key: 'typeName',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '购买金额',
      dataIndex: 'originWorth',
      key: 'originWorth',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '购买时间',
      dataIndex: 'obtainedDate',
      key: 'obtainedDate',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '生产时间',
      dataIndex: 'productionDate',
      key: 'productionDate',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '录入时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '使用年限',
      dataIndex: 'usefulAge',
      key: 'usefulAge',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      key: 'operations',
      width: 100,
      hideInSearch: true,
      fixed: 'right',
      render: (_, record) => {
        return <a onClick={() => onTableDetailClick(record)}>报废详情</a>;
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<ITableListItem, typeof DefaultQuery>
        rowKey="id"
        title="报废单列表"
        defaultQuery={DefaultQuery}
        columns={columns}
        actionRef={actionRef}
        formRef={formRef}
        tableProps={{
          scroll: {
            y: tableHeight,
          },
        }}
        rowSelection={rowSelection}
        toolBarRender={() => [
          selectedEquipKeys.length > 0 ? (
            <Button
              key="print"
              type="primary"
              loading={printing}
              onClick={onPrint}
            >
              <PrinterOutlined />
              打印设备详情
            </Button>
          ) : (
            <span key="noPrint" />
          ),
          <Button
            key="button"
            type="primary"
            loading={exporting}
            onClick={onExportExcel}
          >
            导出报废设备Excel
          </Button>,
        ]}
        request={async (query) => {
          const {
            current,
            pageSize,
            keyword,
            departmentIds,
            equipmentNo,
          } = query;
          return await getEquipmentInfo({
            current,
            pageSize,
            orgId,
            keyword,
            departmentIds: normalizeDepartmentId(departmentIds),
            isAcl: isACL,
            equipmentNo,
          });
        }}
        hooks={{
          beforeInit: (query) => {
            const { departmentIds } = query;
            return {
              ...query,
              departmentIds: normalizeDepartmentId(departmentIds),
            };
          },
          onFormValuesChange: (changeValues) => {
            if (changeValues.departmentId) {
              formRef.current?.setFieldsValue({
                departmentIds: changeValues.departmentId,
              });
            }
          },
        }}
      />

      {/* 设备详情 */}
      <EquipmentDetailModal
        id={equipmentId}
        visible={equipmentDetailModalVisible}
        onCancel={() => setEquipmentDetailModalVisible(false)}
      />

      {/* 报废详情 */}
      <ScarpDetailModal
        detail={equipmentDetail}
        visible={scarpDetailVisible}
        onCancel={() => setScarpDetailVisible(false)}
      />

      {/* 打印设备详情 */}
      <PrintContainer>
        <div ref={detailPrintComponentRef}>
          {equipmentDetailsForPrint.map((e) => (
            <EquipmentInfo key={e.equipment.id} isPrint detail={e} />
          ))}
        </div>
      </PrintContainer>
    </PageContainer>
  );
};

export default ScarpSheetPage;
