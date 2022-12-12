import React, { useEffect, useState } from 'react';
import { message, List, Card, Form, Select } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { statMainAPI, statEqCntByConditionAPI } from '../Equipment/service';
import useENG from '@/hooks/useENG';
import BarChartOutlined from '@ant-design/icons/lib/icons/BarChartOutlined';
import { statTypeOptions } from '../Equipment/type';
import { statType } from './type';
import style from './index.less';
import { history } from 'umi';
import { StatTypeMap } from '../Equipment/type';

// 签约统计
const EquipmentStatisticsPage: React.FC = () => {
  const { isEng } = useENG();
  const [hospitalCount, setHospitalCount] = useState<number>(0);
  const [equipmentCount, setEquipmentCount] = useState<number>(0);
  const [dataSource, setDataSource] = useState();

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
  const statEqCntByCondition = async (type: string) => {
    try {
      const { data } = await statEqCntByConditionAPI({
        isEng,
        statType: type,
      });
      // 设备制造商/使用年限没有id，使用name代替
      const ooptions = data.map((item: any) => {
        return {
          title: `${
            type == statType.BY_USEFUL_AGE
              ? item.statName + '年'
              : item.statName
          }`,
          id: item.statId || item.statName,
          value: `${item.cnt}台`,
          statType: type,
        };
      });
      setDataSource(ooptions);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const cardClick = (item: any) => {
    const itemConfig = StatTypeMap.get(item.statType)!;
    history.push(
      `/equipment-statistics/equipment?statType=${item.statType}&${itemConfig.key}=${item.id}`,
    );
  };

  const statTypeChange = (value: string) => {
    statEqCntByCondition(value);
  };

  useEffect(() => {
    statMain();
    statEqCntByCondition(statType.BY_HOSPITAL);
  }, []);

  return (
    <PageContainer>
      <Form
        name="basic"
        layout="inline"
        className={style.btForm}
        initialValues={{ statType: statType.BY_HOSPITAL }}
      >
        <Form.Item label="类型选择" name="statType">
          <Select
            style={{ width: '220px' }}
            showSearch
            placeholder="请选择"
            onChange={statTypeChange}
            options={statTypeOptions}
          />
        </Form.Item>
        <Form.Item>
          签约医院<span className={style.countNumber}>{hospitalCount}</span>家
        </Form.Item>
        <Form.Item>
          签约设备<span className={style.countNumber}>{equipmentCount}</span>台
        </Form.Item>
      </Form>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={dataSource}
        renderItem={(item: any) => (
          <List.Item>
            <Card title={item.title} hoverable onClick={() => cardClick(item)}>
              <BarChartOutlined
                style={{
                  color: '#1890ff',
                  fontSize: '32px',
                  marginRight: '16px',
                }}
              />
              <span className={style.count}>{item.value}</span>
            </Card>
          </List.Item>
        )}
      />
    </PageContainer>
  );
};

export default EquipmentStatisticsPage;
