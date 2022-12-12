import React, { useRef, useEffect } from 'react';
import { Row, Col } from 'antd';
import * as echarts from 'echarts/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import ArrowRed from '@/assets/dashboard/arrow-red.png';
import { fetchEquipmentTypesByDepartmentsStat } from '@/pages/Assets/Chart/service';
import { DataTransformers } from '@/pages/Assets/Chart/helper';
import useEquipmentTypeEcharts from '@/pages/Assets/Chart/Type/hooks/useEcharts';
import Corner from './Corner';
import useSummaryEcharts from '../hooks/useEcharts';
import useMount from '@/hooks/useMount';
import type { IOrgSummary } from '../type';
import styles from '../index.less';

interface IComponentProps {
  orgSummary: IOrgSummary | undefined;
}

const DashboardLeft: React.FC<IComponentProps> = ({ orgSummary }) => {
  const equipmentTypeChartRef = useRef<ReactEChartsCore | null>(null);
  const summaryChartRef = useRef<ReactEChartsCore | null>(null);
  const { echartsOptions, setEchartsData } = useEquipmentTypeEcharts(
    equipmentTypeChartRef,
    false,
    'name',
    'Type',
  );
  const { options: summaryChartOptions, setEchartsData: setSummaryChartData } =
    useSummaryEcharts(summaryChartRef, false, 'Summary');

  const loadEquipmentTypeChartsDataSource = async () => {
    try {
      const { data = [] } = await fetchEquipmentTypesByDepartmentsStat(
        'name',
        [],
      );
      const transformedData = DataTransformers.transformDataToPIEChart(data);
      setEchartsData(transformedData);
    } catch (error) {
      console.error(error);
    }
  };

  useMount(() => {
    loadEquipmentTypeChartsDataSource();
  });

  useEffect(() => {
    if (orgSummary) {
      const xAxis: string[] = [];
      const repairYAxis: number[] = [];
      const inspectionYAxis: number[] = [];
      const maintainYAxis: number[] = [];

      orgSummary.monthStats.forEach((item) => {
        xAxis.push(item.statMonthStr);
        repairYAxis.push(item.repairCount);
        maintainYAxis.push(item.maintainCount);
        inspectionYAxis.push(item.inspectionCount);
      });

      setSummaryChartData({
        xAxis,
        yAxis: [inspectionYAxis, repairYAxis, maintainYAxis],
      });
    }
  }, [orgSummary]);

  return (
    <div className={styles.left}>
      <div className={styles.top}>
        <Corner />
        <div className={styles.title}>
          <img src={ArrowRed} />
          全院设备
        </div>
        <div className={styles.topInner}>
          <Row gutter={20}>
            <Col span={12}>
              <div className={`${styles.cardItem} ${styles.cardItem1}`}>
                <div className={styles.cardItemInner}>
                  <h6>设备总数</h6>
                  <div>{orgSummary?.totalStat.equipmentCount}</div>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className={`${styles.cardItem} ${styles.cardItem2}`}>
                <div className={styles.cardItemInner}>
                  <h6>在修设备</h6>
                  <div>{orgSummary?.totalStat.repairingCount}</div>
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={20} style={{ marginTop: 20 }}>
            <Col span={12}>
              <div className={`${styles.cardItem} ${styles.cardItem3}`}>
                <div className={styles.cardItemInner}>
                  <h6>在保养设备</h6>
                  <div>{orgSummary?.totalStat.maintainingCount}</div>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className={`${styles.cardItem} ${styles.cardItem4}`}>
                <div className={styles.cardItemInner}>
                  <h6>在巡检设备</h6>
                  <div>{orgSummary?.totalStat.inspectingCount}</div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div className={styles.middle}>
        <Corner />
        <div className={styles.title}>
          <img src={ArrowRed} />
          设备类型占比
        </div>
        <div className={styles.middleInner}>
          <ReactEChartsCore
            ref={(e) => {
              equipmentTypeChartRef.current = e;
            }}
            echarts={echarts}
            option={echartsOptions}
            notMerge={true}
            lazyUpdate={true}
            theme={'theme_name'}
            style={{
              height: 300,
            }}
          />
        </div>
      </div>
      <div className={styles.bottom}>
        <Corner />
        <div className={styles.title}>
          <img src={ArrowRed} />
          业务趋势
        </div>
        <div className={styles.bottomInner}>
          <ReactEChartsCore
            ref={(e) => {
              summaryChartRef.current = e;
            }}
            echarts={echarts}
            option={summaryChartOptions}
            notMerge={true}
            lazyUpdate={true}
            theme={'theme_name'}
            style={{
              height: 350,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardLeft;
