import React from 'react';
import { Modal, Row, Col, Typography, Button } from 'antd';
import styles from '../index.less';
import type { IFetchDetailItem } from '../type';
import * as echarts from 'echarts/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
]);

const { Paragraph } = Typography;

interface IComponentProps {
  visible: boolean;
  data: IFetchDetailItem;
  voltageData: any;
  paramColData: any;
  onCancel: () => void;
}

const DetailModal: React.FC<IComponentProps> = ({
  visible,
  data,
  voltageData,
  paramColData,
  onCancel,
}) => {
  return (
    <Modal
      title="耗电明细"
      visible={visible}
      width="1000px"
      onCancel={onCancel}
      footer={<Button onClick={onCancel}>关闭</Button>}
    >
      <Row style={{ marginBottom: 20 }}>
        <Col span={12}>
          <Paragraph>设备名称：{data.name ?? '--'}</Paragraph>
        </Col>
        <Col span={12}>
          <Paragraph>设备型号：{data.modelName ?? '--'}</Paragraph>
        </Col>
        <Col span={12}>
          <Paragraph>设备厂商：{data.manufacturerName ?? '--'}</Paragraph>
        </Col>
        <Col span={12}>
          {/* <StatusBar status={data.status} /> */}
          <Paragraph>
            当前状态：
            {data.status === 0 ? (
              <span style={{ color: '#87d068' }}>正常</span>
            ) : (
              <span style={{ color: 'red' }}>
                {data.status ? '维修中' : '--'}
              </span>
            )}
          </Paragraph>
        </Col>
      </Row>
      <Row>
        <Col flex={1} className={styles.paramCol}>
          <ReactEChartsCore
            echarts={echarts}
            option={voltageData}
            notMerge={true}
            lazyUpdate={true}
            theme={'theme_name'}
            style={{
              width: 450,
              height: 250,
            }}
          />
        </Col>
        <Col flex={1} className={styles.paramCol}>
          <ReactEChartsCore
            echarts={echarts}
            option={paramColData}
            notMerge={true}
            lazyUpdate={true}
            theme={'theme_name'}
            style={{
              width: 450,
              height: 250,
            }}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default DetailModal;
