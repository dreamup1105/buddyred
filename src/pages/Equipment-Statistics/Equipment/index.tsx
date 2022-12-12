import React, { useRef, useState } from 'react';
import { Button, message, DatePicker, Badge, Input, Select, Tag } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { WalletOutlined } from '@ant-design/icons';
import ProTable from '@/components/ProTable';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { ITableListItem } from './type';
import {
  listCrEquipmentAPI,
  statisticalExportAPI,
  statMainAPI,
  statEqCntByConditionAPI,
} from './service';
import type { FormInstance } from 'antd/es/form';
import useENG from '@/hooks/useENG';
import { download, tableHeight } from '@/utils/utils';
import { statTypeOptions, EquipmentStatusEnum, StatTypeMap } from './type';
import { ScrapStatusMap } from '@/utils/constants';
import EquipmentDetailModal from '@/components/Equipment/Detail';
import HistoryModal from './components/historyModal';

const DefaultQuery: any = {
  current: 1,
  pageSize: 30,
  eqType: undefined,
  eqUsefulAge: undefined,
  keyword: undefined,
  manufacturerName: undefined,
  statType: undefined,
  hospitalId: undefined,
};

// 签约设备
const EquipmentStatisticsPage: React.FC = () => {
  const { isEng } = useENG();
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [hospitalCount, setHospitalCount] = useState<number>(0);
  const [equipmentCount, setEquipmentCount] = useState<number>(0);
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectLabel, setSelectLabel] = useState<string>('医院');
  const [selectKey, setSelectKey] = useState<string>('hospitalId');
  const [equipmentId, setEquipmentId] = useState<number>();
  const [
    equipmentDetailModalVisible,
    setEquipmentDetailModalVisible,
  ] = useState(false);
  const [eqId, setEqId] = useState<number>();
  const [historyViseble, setHistoryViseble] = useState<boolean>(false);

  // 点击签约历史
  const onRecordClick = (record: ITableListItem) => {
    setEqId(record.id);
    setHistoryViseble(true);
  };

  // 导出excel
  const onExport = async () => {
    setExportLoading(true);
    try {
      const query = actionRef.current?.getQuery();
      query.isEng = isEng;
      const { data, response } = await statisticalExportAPI(query);
      download(data, response);
      message.success('导出Excel成功');
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setExportLoading(false);
    }
  };

  // 获取设备总数和医院总数
  const statMain = async () => {
    const params = {
      isEng: isEng,
    };
    try {
      const { data } = await statMainAPI(params);
      setHospitalCount(data.hosCnt);
      setEquipmentCount(data.eqCnt);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  // 不同纬度数量统计
  const statEqCntByCondition = async (statType: string) => {
    setSelectOptions([]);
    try {
      const { data } = await statEqCntByConditionAPI({
        isEng,
        statType,
      });
      // 设备制造商/使用年限没有id，使用name代替
      const ooptions = data.map((item: any) => {
        return {
          label: `${
            statType == 'BY_USEFUL_AGE' ? item.statName + '年' : item.statName
          }(${item.cnt}台)`,
          value: item.statId ? item.statId.toString() : item.statName,
        };
      });
      setSelectOptions(ooptions);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  // 查看设备详情
  const equipmentClick = (record: ITableListItem) => {
    setEquipmentId(record.id);
    setEquipmentDetailModalVisible(true);
  };

  // 签约历史弹框取消按钮
  const onModalCancel = () => {
    setHistoryViseble(false);
  };

  const columns: ProTableColumn<ITableListItem>[] = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      key: 'keyword',
      hideInTable: true,
      renderFormItem: () => {
        return <Input placeholder="名称/别名/科室/医院/编号/型号/制造商" />;
      },
    },
    {
      title: '统计类型',
      dataIndex: 'statType',
      key: 'statType',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Select
            allowClear
            showSearch
            placeholder="请选择签统计类型"
            options={statTypeOptions}
          />
        );
      },
    },
    {
      title: selectLabel,
      dataIndex: selectKey,
      key: selectKey,
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Select
            allowClear
            showSearch
            placeholder="请选择"
            options={selectOptions}
          />
        );
      },
    },
    {
      title: '序号',
      key: 'index',
      width: 65,
      hideInSearch: true,
      render: (t: any, r: any, index: number) => index + 1,
    },
    {
      title: '设备自编号',
      dataIndex: 'equipmentNo',
      key: 'equipmentNo',
      align: 'center',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 140,
      hideInSearch: true,
      renderFormItem: () => {
        return <DatePicker.RangePicker style={{ width: '100%' }} />;
      },
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      hideInSearch: true,
      width: 220,
      render: (_, record) => {
        return <a onClick={() => equipmentClick(record)}>{record.name}</a>;
      },
    },
    {
      title: '设备别名',
      dataIndex: 'alias',
      key: 'alias',
      hideInSearch: true,
      width: 180,
    },
    {
      title: '设备型号',
      dataIndex: 'modelName',
      key: 'modelName',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '设备厂商',
      dataIndex: 'manufacturerName',
      key: 'manufacturerName',
      hideInSearch: true,
      width: 250,
    },
    {
      title: '所属医院',
      dataIndex: 'hosName',
      key: 'hosName',
      hideInSearch: true,
      width: 180,
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
      title: '报废状态',
      dataIndex: 'isScrap',
      key: 'isScrap',
      width: 100,
      hideInSearch: true,
      render: (status) => {
        const itemConfig = ScrapStatusMap.get(status);
        return (
          <Tag color={itemConfig?.color ?? 'default'}>{itemConfig?.label}</Tag>
        );
      },
    },
    {
      title: '设备序列号',
      dataIndex: 'sn',
      key: 'sn',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '设备状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      hideInSearch: true,
      align: 'center',
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
      align: 'center',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '购买金额',
      dataIndex: 'originWorth',
      key: 'originWorth',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '购买时间',
      dataIndex: 'obtainedDate',
      key: 'obtainedDate',
      align: 'center',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '生产时间',
      dataIndex: 'productionDate',
      key: 'productionDate',
      align: 'center',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '录入时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      align: 'center',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '使用年限',
      dataIndex: 'usefulAge',
      key: 'usefulAge',
      align: 'center',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'operation',
      key: 'operation',
      width: 110,
      hideInSearch: true,
      render: (_, record) => {
        return <a onClick={() => onRecordClick(record)}>签约历史</a>;
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<ITableListItem, typeof DefaultQuery>
        rowKey="id"
        title={
          <>
            <span style={{ marginRight: '20px' }}>
              签约医院: <span style={{ color: 'red' }}>{hospitalCount}</span>家
            </span>
            <span>
              签约设备:<span style={{ color: 'red' }}>{equipmentCount}</span>台
            </span>
          </>
        }
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
            type="primary"
            icon={<WalletOutlined />}
            loading={exportLoading}
            onClick={onExport}
          >
            导出Excel
          </Button>,
        ]}
        request={async (query) => {
          const params = formRef.current?.getFieldsValue();
          const {
            current,
            pageSize,
            keyword,
            statType,
            manufacturerName,
            eqType,
            hospitalId,
            eqUsefulAge,
          } = query;
          statMain();
          return listCrEquipmentAPI({
            pageNum: Number(current) || 1,
            pageSize: Number(pageSize) || 30,
            keyword,
            isEng,
            manufacturerName,
            eqType,
            hospitalId,
            eqUsefulAge,
            statType,
            ...params,
          });
        }}
        hooks={{
          beforeInit: (query) => {
            if (query.statType) {
              const itemConfig = StatTypeMap.get(query.statType)!;
              setSelectLabel(itemConfig.label);
              setSelectKey(itemConfig.key);
              statEqCntByCondition(query.statType);
              formRef.current?.setFieldsValue({
                [itemConfig.key]: query[itemConfig.key],
              });
            }
            return {
              ...query,
              collapsed: false,
            };
          },
          onFormValuesChange: (formChangeValue, values) => {
            formRef.current?.setFieldsValue({
              manufacturerName: undefined,
              eqType: undefined,
              hospitalId: undefined,
              eqUsefulAge: undefined,
            });
            if (values.statType) {
              const itemConfig = StatTypeMap.get(values.statType)!;
              formRef.current?.setFieldsValue({
                [itemConfig.key]: values[itemConfig.key],
              });
              setSelectLabel(itemConfig.label);
              setSelectKey(itemConfig.key);
              statEqCntByCondition(values.statType);
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

      {/* 签约历史 */}
      <HistoryModal
        eqId={eqId}
        visible={historyViseble}
        onModalCancel={onModalCancel}
      />
    </PageContainer>
  );
};

export default EquipmentStatisticsPage;
