import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { FormInstance } from 'antd/es/form';
import ProTable from '@/components/ProTable';
import { tableHeight } from '@/utils/utils';
import { ScarpStatusEnum, ScarpStatus } from './type';
import type { ITableItem } from './type';
import { Select, Button, Badge, message, Input, Popconfirm } from 'antd';
import useSubAuthorities from '@/hooks/useSubAuthorities';
import EquipmentSelect, {
  BizType,
} from '@/components/Equipment/EquipmentSelect';
import EquipmentDetailModal from '@/components/Equipment/Detail';
import type { SelectFunc } from '@/components/Equipment/EquipmentSelect';
import useACL from '@/hooks/useACL';
import ScarpDetailModal from './components/detail';
import {
  getEquipmentInfo,
  saveOrUpdate,
  scarpListPage,
  getOrderInfo,
} from './service';
import useUserInfo from '@/hooks/useUserInfo';
import { ResourcePath } from '@/utils/constants';
const { Option } = Select;

const DefaultQuery = {
  current: 1,
  pageSize: 30,
  deptId: undefined,
  keyword: '', // 关键字，设备名称、申报人姓名、设备所属单位名称、审批人姓名、报废单号
  scrapStatus: null, //INIT,REPORTING,PASS,REJECT
};

const ScarpSheetPage: React.FC = () => {
  const { currentUser } = useUserInfo();
  const { isACL } = useACL();
  const employeeId = currentUser?.employee.id;
  const orgId = currentUser?.org.id;
  const subAuthorities = useSubAuthorities();
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [equipmentId, setEquipmentId] = useState<number>();
  const [
    equipmentDetailModalVisible,
    setEquipmentDetailModalVisible,
  ] = useState(false);
  const [equipmentSelectVisible, setEquipmentSelectVisible] = useState(false);
  const [scarpDetailVisible, setScarpDetailVisible] = useState(false);
  const [equipmentDetail, setEquipmentDetail] = useState({});
  const [scarpDetailType, setScarpDetailType] = useState<string>();
  const [scarpDetailTitle, setScarpDetailTitle] = useState<string>();
  // const [fileList, setFileList] = useState([]);

  // 查看详情
  const onTableDetailClick = async (record: ITableItem) => {
    try {
      const { data } = await getOrderInfo(record.id);
      if (data.simpleAttachmentInfoList) {
        data.attachmentFileList = data.simpleAttachmentInfoList.map(
          (item: any) => {
            return {
              url: `${ResourcePath}${item.res}`,
              type: item.contentType,
              size: item.contentLength,
              status: 'done',
              name: item.fileName,
              uid: item.res,
            };
          },
        );
      }
      setScarpDetailVisible(true);
      setScarpDetailType(record.scrapStatus);
      const itemConfig = ScarpStatusEnum.get(data.scrapStatus);
      setScarpDetailTitle(itemConfig.label);
      setEquipmentDetail(data);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  // 审核
  const onAuditClick = async (record: ITableItem) => {
    try {
      const { data } = await getOrderInfo(record.id);
      if (data.simpleAttachmentInfoList) {
        data.attachmentFileList = data.simpleAttachmentInfoList.map(
          (item: any) => {
            return {
              url: `${ResourcePath}${item.res}`,
              type: item.contentType,
              size: item.contentLength,
              status: 'done',
              name: item.fileName,
              uid: item.res,
            };
          },
        );
      }
      setScarpDetailVisible(true);
      setScarpDetailType(record.scrapStatus);
      const itemConfig = ScarpStatusEnum.get(data.scrapStatus);
      setScarpDetailTitle(itemConfig.label);
      setEquipmentDetail(data);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  // 新建
  const onAddSCarpClick = () => {
    setEquipmentSelectVisible(true);
  };

  // 选择设备返回的数据
  const onSelectEquipments: SelectFunc = async ({ selectedRows = [] }) => {
    setEquipmentSelectVisible(false);
    const { data, code, msg } = await getEquipmentInfo(selectedRows[0].id);
    if (code == 0) {
      const configData = {
        ...data,
        scrapReason: '',
        identifyAdvice: '',
      };
      setEquipmentDetail(configData);
      setScarpDetailType(ScarpStatus.INIT);
      setScarpDetailVisible(true);
    } else {
      message.error(msg);
    }
  };

  //点击设备名称查看设备详情
  const onEquipmentDetailClick = async (record: ITableItem) => {
    setEquipmentId(record.equipmentId);
    setEquipmentDetailModalVisible(true);
  };

  // 设备详情取消
  const onCancenEquimentDetailModal = () => {
    setEquipmentId(undefined);
    setEquipmentDetailModalVisible(false);
  };

  // 报废详情弹框确认
  const onScarpDetailSubmit = async (type = '', detail = {}) => {
    try {
      await saveOrUpdate(detail);
      setScarpDetailVisible(false);
      setEquipmentDetail({});
      actionRef.current?.reset();
      switch (type) {
        case ScarpStatus.INIT: //存草稿
          message.success('保存草稿成功');
          break;
        case ScarpStatus.REPORTING: //保存
          message.success('保存成功');
          break;
        case ScarpStatus.PASS: //通过
          message.success('审批通过成功');
          break;
        case ScarpStatus.REJECT: //驳回
          message.success('审批驳回成功');
          break;
      }
    } catch (err: any) {
      message.error(err.message);
    }
  };

  // 报废详情单关闭
  const onScarpDetailCancel = () => {
    setScarpDetailVisible(false);
    setEquipmentDetail({});
  };

  // 撤销
  const onRevokeClick = async (record: ITableItem) => {
    const params = {
      ...record,
      scrapStatus: 'CANCEL',
    };
    try {
      await saveOrUpdate(params);
      actionRef.current?.reset();
      message.success('撤销成功');
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const scrapStatusOptions = [
    {
      label: '草稿',
      value: ScarpStatus.INIT,
    },
    {
      label: '申请中',
      value: ScarpStatus.REPORTING,
    },
    {
      label: '通过',
      value: ScarpStatus.PASS,
    },
    {
      label: '驳回',
      value: ScarpStatus.REJECT,
    },
  ];

  const columns: ProTableColumn<ITableItem>[] = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      key: 'keyword',
      hideInTable: true,
      renderFormItem: () => (
        <Input placeholder="单号/设备名称/所属科室/申报人/审批人" />
      ),
    },
    {
      title: '单据编号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '设备名称',
      dataIndex: 'equipmentName',
      key: 'equipmentName',
      width: 160,
      hideInSearch: true,
      render: (_, record) => {
        return (
          <a onClick={() => onEquipmentDetailClick(record)}>
            {record.equipmentName}
          </a>
        );
      },
    },
    {
      title: '所属科室',
      dataIndex: 'equipmentDeptName',
      key: 'equipmentDeptName',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'scrapStatus',
      key: 'scrapStatus',
      width: 120,
      render: (val) => {
        const itemConfig = ScarpStatusEnum.get(val);
        return <Badge status={itemConfig?.color} text={itemConfig?.label} />;
      },
      renderFormItem: () => {
        return (
          <Select>
            {scrapStatusOptions.map((item) => (
              <Option value={item.value} key={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '申报人',
      dataIndex: 'reportPersonName',
      key: 'reportPersonName',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '申报时间',
      dataIndex: 'reportTime',
      key: 'reportTime',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '审批人',
      dataIndex: 'approvalPersonName',
      key: 'approvalPersonName',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '审批时间',
      dataIndex: 'approvalTime',
      key: 'approvalTime',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      key: 'operations',
      width: 150,
      hideInSearch: true,
      fixed: 'right',
      render: (_, record) => {
        return (
          <div>
            <a onClick={() => onTableDetailClick(record)}>
              {record.scrapStatus == ScarpStatus.INIT ? '编辑' : '详情'}
            </a>
            {employeeId == record.reportPerson &&
              (record.scrapStatus == ScarpStatus.INIT ||
                record.scrapStatus == ScarpStatus.REPORTING) && (
                <Popconfirm
                  title="确定撤销吗?"
                  onConfirm={() => onRevokeClick(record)}
                >
                  <a style={{ marginLeft: '10px' }}>撤销</a>
                </Popconfirm>
              )}
            {/* 有审核权限的用户 并且单据处于申请中 才显示审核按钮 */}
            {subAuthorities?.includes('AUDIT') &&
              record.scrapStatus == ScarpStatus.REPORTING && (
                <a
                  style={{ marginLeft: '10px' }}
                  onClick={() => onAuditClick(record)}
                >
                  审核
                </a>
              )}
          </div>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<ITableItem, typeof DefaultQuery>
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
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={onAddSCarpClick}
          >
            新建报废单
          </Button>,
          // <Button
          //   key="export"
          //   icon={<ExportOutlined />}
          //   href={exportAdverseEventReportRecords(currentUser!.org.id, true)}
          // >
          //   导出报废单
          // </Button>,
        ]}
        request={async (query) => {
          const { current, pageSize, keyword, scrapStatus } = query;
          return await scarpListPage({
            orgId,
            isAcl: isACL,
            current: Number(current) || 1,
            pageSize: Number(pageSize) || 30,
            keyword,
            scrapStatus: scrapStatus == '' ? null : scrapStatus,
          });
        }}
      />

      {/* 选择设备弹框 */}
      <EquipmentSelect
        isACL={isACL}
        multiple={false}
        bizType={BizType.EMPTY}
        visible={equipmentSelectVisible}
        onSelect={onSelectEquipments}
        onCancel={() => setEquipmentSelectVisible(false)}
      />

      {/* 设备详情 */}
      <EquipmentDetailModal
        id={equipmentId}
        visible={equipmentDetailModalVisible}
        onCancel={onCancenEquimentDetailModal}
      />

      {/* 报废详情 */}
      <ScarpDetailModal
        title={scarpDetailTitle}
        detail={equipmentDetail}
        visible={scarpDetailVisible}
        type={scarpDetailType}
        onSubmit={onScarpDetailSubmit}
        onCancel={onScarpDetailCancel}
      />
    </PageContainer>
  );
};

export default ScarpSheetPage;
