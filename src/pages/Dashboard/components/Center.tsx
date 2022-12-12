import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import ScrollableTable from '@/components/ScrollableTable';
import type { ActionType } from '@/components/ScrollableTable/type';
import useUnmount from '@/hooks/useUnmount';
import ArrowPurple from '@/assets/dashboard/arrow-purple.png';
import ArrowGreen from '@/assets/dashboard/arrow-green.png';
import ArrowYellow from '@/assets/dashboard/arrow-yellow.png';
import { Tag } from 'antd';
import { fetchInspectionStat } from '../service';
import Corner from './Corner';
import CurrentMonthStat from './CurrentMonthStat';
import useEcharts from '../hooks/useEcharts';
import type { IOrgSummary, IInspectionStatItem } from '../type';
import styles from '../index.less';

interface IComponentProps {
  orgSummary: IOrgSummary | undefined;
}

const DashboardCenter: React.FC<IComponentProps> = ({ orgSummary }) => {
  const [current, setCurrent] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const actionRef = useRef<ActionType>();
  const repairChartRef = useRef<ReactEChartsCore | null>(null);
  const maintainChartRef = useRef<ReactEChartsCore | null>(null);
  const reFetchTimer = useRef<NodeJS.Timeout | null>(null);
  const { options: repairChartOptions, setEchartsData: setRepairChartData } =
    useEcharts(repairChartRef, false, 'Repair');
  const {
    options: maintainChartOptions,
    setEchartsData: setMaintainChartData,
  } = useEcharts(maintainChartRef, false, 'Maintain');
  const [inspectionStatDataSource, setInspectionStatDataSource] = useState<
    IInspectionStatItem[]
  >([]);

  const columns = [
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
    },
    {
      title: '设备总数',
      dataIndex: 'equipmentCount',
      key: 'equipmentCount',
    },
    {
      title: '正常数',
      dataIndex: 'normalCount',
      key: 'normalCount',
      render: (_: number, record: IInspectionStatItem) => {
        return <span style={{ color: '#87d068' }}>{record.normalCount}</span>;
      },
    },
    {
      title: '异常数',
      dataIndex: 'abnormalCount',
      key: 'abnormalCount',
      render: (_: number, record: IInspectionStatItem) => {
        return (
          <span style={{ color: record.abnormalCount > 0 ? 'red' : '#fff' }}>
            {record.abnormalCount}
          </span>
        );
      },
    },
    {
      title: '提交时间',
      dataIndex: 'commitTime',
      key: 'commitTime',
    },
    {
      title: '验收状态',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      render: (_: boolean, record: IInspectionStatItem) => {
        if (record.auditStatus) {
          return <Tag color="#87d068">已验收</Tag>;
        }
        return <Tag>未验收</Tag>;
      },
    },
  ];

  const loadInspectionDataSource = async () => {
    try {
      const { code, data } = await fetchInspectionStat({
        pageNum: current,
        pageSize: 20,
      });
      if (code === 0) {
        if (data.length < 20) {
          setHasMoreData(false);
        }
        setInspectionStatDataSource((prevData) => [...prevData, ...data]);
      }
    } catch (error) {
      console.error(error);
      if (reFetchTimer.current) {
        clearTimeout(reFetchTimer.current);
      }
      reFetchTimer.current = setTimeout(loadInspectionDataSource, 5000);
    }
  };

  const onScrollToBottom = async () => {
    if (hasMoreData) {
      setCurrent((prevCurrent) => prevCurrent + 1);
    } else {
      actionRef.current?.stop();
      setHasMoreData(true);
      setTimeout(() => {
        setInspectionStatDataSource([]);
        actionRef.current?.restart();
        if (current === 1) {
          loadInspectionDataSource();
        } else {
          setCurrent(1);
        }
      }, 3000);
    }
  };

  useEffect(() => {
    if (orgSummary) {
      const xAxis: string[] = [];
      const repairYAxis: number[] = [];
      const maintainYAxis: number[] = [];

      orgSummary.monthStats.forEach((item) => {
        xAxis.push(item.statMonthStr);
        repairYAxis.push(item.repairCount);
        maintainYAxis.push(item.maintainCount);
      });

      setRepairChartData({
        xAxis,
        yAxis: repairYAxis,
      });
      setMaintainChartData({
        xAxis,
        yAxis: maintainYAxis,
      });
    }
  }, [orgSummary]);

  useEffect(() => {
    loadInspectionDataSource();
  }, [current]);

  useUnmount(() => {
    if (reFetchTimer.current) {
      clearTimeout(reFetchTimer.current);
    }
  });

  return (
    <div className={styles.center}>
      <div className={styles.centerTop}>
        <Corner />
        <div className={styles.centerInner}>
          <CurrentMonthStat orgSummary={orgSummary} />
        </div>
      </div>
      <div className={styles.centerInspectionChartContainer}>
        <Corner />
        <div className={styles.title}>
          <img src={ArrowPurple} />
          巡检统计
        </div>
        <ScrollableTable<any>
          rowKey="id"
          columns={columns}
          dataSource={inspectionStatDataSource}
          actionRef={actionRef}
          onScrollToBottom={onScrollToBottom}
          scroll={{
            y: 210,
          }}
          tableHeaderStyle={{
            width: '100%',
            height: 40,
            textAlign: 'center',
          }}
          tableBodyStyle={{
            width: '100%',
            textAlign: 'center',
          }}
        />
      </div>
      <div className={styles.centerMaintainChartContainer}>
        <Corner />
        <div className={styles.title}>
          <img src={ArrowGreen} />
          维修统计
        </div>
        <ReactEChartsCore
          ref={(e) => {
            repairChartRef.current = e;
          }}
          echarts={echarts}
          option={repairChartOptions}
          notMerge={true}
          lazyUpdate={true}
          theme={'theme_name'}
          style={{
            height: 320,
          }}
        />
      </div>
      <div className={styles.centerRepairChartContainer}>
        <Corner />
        <div className={styles.title}>
          <img src={ArrowYellow} />
          保养统计
        </div>
        <ReactEChartsCore
          ref={(e) => {
            maintainChartRef.current = e;
          }}
          echarts={echarts}
          option={maintainChartOptions}
          notMerge={true}
          lazyUpdate={true}
          theme={'theme_name'}
          style={{
            height: 320,
          }}
        />
      </div>
    </div>
  );
};

export default DashboardCenter;
