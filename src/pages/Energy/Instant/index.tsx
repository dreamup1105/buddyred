import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@/components/ProTable';
import useUserInfo from '@/hooks/useUserInfo';
import useDepartments from '@/hooks/useDepartments';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import DepartmentSelector from '@/components/DepartmentSelector';
import { normalizeDepartmentId } from '@/pages/Assets/helper';
import useACL from '@/hooks/useACL';
import type { ITableListItem, IFetchDetailItem } from './type';
import DetailModal from './components/DetailModal';
import HistoryDetail from './components/historyModal';
import {
  fetchInstantConsumption,
  fetchInstantDetailConsumption,
} from './service';
import Statistic from './components/Statistic';
import { fetchPowerConsumption } from '../Department/service';
import { tableHeight } from '@/utils/utils';

const DefaultQuery = {
  departmentIds: [],
  current: 1,
  pageSize: 30,
};

// echart options
const echartsOptions = (options: any) => {
  return {
    title: {
      text: options.title,
      x: 'center',
      y: 'bottom',
    },
    tooltip: {
      trigger: 'axis',
      formatter: `{b0}: {c0}${options.unit}`,
      alwaysShowContent: true,
    },
    grid: {
      top: '5%',
      left: '0',
      right: '0',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: options.xAxis,
      axisLabel: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      name: options.unit,
      scale: true, //y轴刻度是否从0开始
      axisLine: {
        show: true,
        lineStyle: {
          color: '#5470C6',
        },
      },
      axisLabel: {
        show: true,
      },
    },
    series: [
      {
        data: options.data,
        type: 'line',
        label: {
          show: true,
          valueAnimation: true,
          position: 'top',
          fontSize: 16,
          color: 'transparent',
        },
        // itemStyle : { normal: {label : {show: true}}}  //拐点数据显示
      },
    ],
  };
};
const intervalTime: number = 5000;

// 科室设备瞬时电压电流明细
const EnergyInstantPage: React.FC = () => {
  const { isACL } = useACL();
  const actionRef = useRef<ActionType>();
  const { currentUser } = useUserInfo();
  const orgId = currentUser?.org.id;
  const { departmentsTreeData } = useDepartments({ orgId: orgId! }, true);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  const [equipmentId, setEquipmentId] = useState<number>();
  const [voltageData, setVoltageData] = useState<any>({});
  const [paramColData, setParamColData] = useState<any>({});
  const [detailData, setDetailData] = useState<IFetchDetailItem>({});
  const [timer, setTimer] = useState<any>(null);
  const [statisticData, setStatisticData] = useState<any>({});

  /**
   * 查看详情 - 接口  获取当前时间作为图表的横坐标
   * @param dataObj 表格基础数据
   * @param record 点击的列表数据
   */
  const getDetailData = async (
    voltage: any,
    paramCol: any,
    record: ITableListItem,
  ) => {
    const date: Date = new Date();
    const hh: number = date.getHours();
    const mm: number = date.getMinutes();
    const ss: number = date.getSeconds();
    const xAdd = `${hh < 10 ? '0' + hh : hh}时${mm < 10 ? '0' + mm : mm}分${
      ss < 10 ? '0' + ss : ss
    }秒`;
    const { code, data, msg } = await fetchInstantDetailConsumption({
      equipmentId: record.equipmentId,
    });
    if (code == 0) {
      setDetailData(data);
      voltage.xAxis = [...voltage.xAxis, xAdd];
      paramCol.xAxis = [...paramCol.xAxis, xAdd];
      voltage.data = [...voltage.data, data.voltage];
      paramCol.data = [...paramCol.data, data.current];
      if (voltage.xAxis.length >= 50) {
        voltage.xAxis.shift();
        paramCol.xAxis.shift();
        voltage.data.shift();
        paramCol.data.shift();
      }
      setVoltageData(echartsOptions(voltage));
      setParamColData(echartsOptions(paramCol));
    } else {
      console.log(msg);
    }
  };

  // 点击列表查看明细
  const onViewDetail = async (record: ITableListItem) => {
    clearInterval(timer);
    const voltageDataObj: any = {
      xAxis: [],
      data: [],
      unit: 'V',
      title: '瞬时电压（V）',
    };
    const paramColDataObj: any = {
      xAxis: [],
      data: [],
      unit: 'A',
      title: '瞬时电流（A）',
    };
    // 进入弹框之前先清除之前的数据
    setDetailData({});
    setVoltageData(echartsOptions(voltageDataObj));
    setParamColData(echartsOptions(paramColDataObj));

    setDetailModalVisible(true);
    getDetailData(voltageDataObj, paramColDataObj, record);
    setTimer(
      setInterval(() => {
        getDetailData(voltageDataObj, paramColDataObj, record);
      }, intervalTime),
    );
  };

  // 关闭弹框 清除定时器并初始化数据
  const cancaleModal = () => {
    clearInterval(timer);
    setDetailModalVisible(false);
  };

  // 点击历史耗电
  const onViewHistory = (record: ITableListItem) => {
    setHistoryVisible(true);
    setEquipmentId(record.equipmentId);
  };

  const columns: ProTableColumn<ITableListItem>[] = [
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
      hideInSearch: true,
    },
    {
      title: '科室',
      dataIndex: 'departmentIds',
      key: 'departmentIds',
      align: 'center',
      renderFormItem: () => (
        <DepartmentSelector
          treeSelectProps={{
            multiple: true,
            treeData: departmentsTreeData,
            virtual: false,
          }}
        />
      ),
      hideInTable: true,
    },
    {
      title: '设备名称',
      dataIndex: 'equipNameNew',
      key: 'equipNameNew',
      hideInSearch: true,
    },
    {
      title: '设备型号',
      dataIndex: 'modelName',
      key: 'modelName',
      hideInSearch: true,
    },
    {
      title: '设备厂商',
      dataIndex: 'manufacturerName',
      key: 'manufacturerName',
      hideInSearch: true,
    },
    {
      title: '设备序列号',
      dataIndex: 'sn',
      key: 'sn',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '设备类型',
      dataIndex: 'typeName',
      key: 'typeName',
      hideInSearch: true,
    },
    {
      title: '运行状态',
      dataIndex: 'runType',
      key: 'runType',
      hideInSearch: true,
      render: (val) => (val == '0' ? '未运行' : '运行'),
    },
    {
      title: '电压(V)',
      dataIndex: 'voltage',
      key: 'voltage',
      hideInSearch: true,
    },
    {
      title: '电流(A)',
      dataIndex: 'current',
      key: 'current',
      hideInSearch: true,
    },
    {
      title: '温度(℃)',
      dataIndex: 'temperature',
      key: 'temperature',
      hideInSearch: true,
    },
    {
      title: '使用年限(年)',
      dataIndex: 'usageTime',
      key: 'usageTime',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '使用人数',
      dataIndex: 'checkPeopleNum',
      key: 'checkPeopleNum',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'Operations',
      key: 'Operations',
      width: 160,
      hideInSearch: true,
      render: (_, record) => {
        return (
          <div>
            <a onClick={() => onViewDetail(record)}>瞬时耗电</a>
            <a
              style={{ marginLeft: '10px' }}
              onClick={() => onViewHistory(record)}
            >
              历史耗电
            </a>
          </div>
        );
      },
    },
  ];
  return (
    <PageContainer>
      <Statistic data={statisticData} />
      <ProTable<ITableListItem, typeof DefaultQuery>
        rowKey="sn"
        title="设备耗电明细"
        defaultQuery={DefaultQuery}
        columns={columns}
        actionRef={actionRef}
        tableProps={{
          scroll: {
            y: tableHeight,
          },
        }}
        request={async (query) => {
          const { departmentIds, current, pageSize } = query;
          let momentPower = 0;
          let deptOpen = 0;
          let deptNoOpe = 0;
          let deptFault = 0;
          const { data } = await fetchPowerConsumption(isACL, {
            departmentIds: normalizeDepartmentId(departmentIds) ?? [],
            orgId,
          });
          data.deptEquipmentList.forEach((item) => {
            momentPower += item.momentPower;
            deptOpen += item.deptOpenEquipment;
            deptNoOpe += item.deptNoOpeEquipment;
            deptFault += item.deptFaultEquipment;
          });
          setStatisticData({
            momentPower: momentPower,
            deptOpenEquipment: deptOpen,
            deptNoOpeEquipment: deptNoOpe,
            deptFaultEquipment: deptFault,
          });
          console.log(data);
          return fetchInstantConsumption(isACL, {
            departmentIds: normalizeDepartmentId(departmentIds) ?? [],
            orgId,
            pageNum: Number(current) || 1,
            pageSize: Number(pageSize) || 30,
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
        }}
      />
      <DetailModal
        visible={detailModalVisible}
        data={detailData}
        voltageData={voltageData}
        paramColData={paramColData}
        onCancel={cancaleModal}
      />
      <HistoryDetail
        visible={historyVisible}
        id={equipmentId}
        onCancel={() => setHistoryVisible(false)}
      />
    </PageContainer>
  );
};

export default EnergyInstantPage;
