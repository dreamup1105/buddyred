import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Form, Row, Col, Empty } from 'antd';
import { WithoutTimeFormat, momentToString } from '@/utils/utils';
import useUserInfo from '@/hooks/useUserInfo';
import useACL from '@/hooks/useACL';
import { fetchACLInspectionStat, fetchInspectionStat } from '../service';
import SearchForm from './components/SearchForm';
import useMount from '@/hooks/useMount';
import OverallStat from './components/OverallStat';
import PieChart from './components/PieChart';
import InspectionProgress from './components/Progress';
import moment from 'moment';
import type { InspectionStatItem } from '../type';
import styles from './index.less';

const InspectionDailyPage: React.FC = () => {
  const { currentUser } = useUserInfo();
  const [searchForm] = Form.useForm();
  const { isACL } = useACL();
  const isMaintainer = !!currentUser?.isMaintainer; // 是否为工程师
  const [loading, setLoading] = useState(false);
  const [overallStatInfo, setOverallStatInfo] = useState<
    InspectionStatItem | undefined
  >(); // 总体统计
  // const [departmentStats, setDepartmentStats] = useState<InspectionStatItem[]>(
  //   [],
  // ); // 部门级别统计列表数据
  const loadDailyInspectionStat = async (isGroupByDepartment?: boolean) => {
    if (currentUser?.isCustomersEmpty) {
      return;
    }
    setLoading(true);
    try {
      const { inspectionDate } = searchForm.getFieldsValue();
      const inspectionDateStr = momentToString(
        inspectionDate,
        WithoutTimeFormat,
      );

      const service = isACL ? fetchACLInspectionStat : fetchInspectionStat;
      const formData: any = {
        startTime: `${inspectionDateStr} 00:00:00`,
        endTime: `${inspectionDateStr} 23:59:59`,
        groupByDepartment: !!isGroupByDepartment,
      };
      // if (isGroupByDepartment) {
      //   setDepartmentStats(data);
      // } else {
      //   setOverallStatInfo(data?.length ? data[0] : undefined);
      // }

      if (isACL && isMaintainer) {
        formData.crId = currentUser!.currentCustomer?.id;
      }

      const { data = [] } = await service(formData);

      setOverallStatInfo(data?.length ? data[0] : undefined);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 时间选择
  const onFormValuesChange = () => {
    loadDailyInspectionStat();
    loadDailyInspectionStat(true);
  };

  useMount(() => {
    searchForm.setFieldsValue({
      inspectionDate: moment(),
    });
    loadDailyInspectionStat();
    loadDailyInspectionStat(true);
  });

  return (
    <PageContainer>
      <Card
        title="日巡检统计"
        extra={
          <SearchForm onValuesChange={onFormValuesChange} form={searchForm} />
        }
        style={{ width: '100%' }}
      >
        <Row style={{ marginBottom: 50 }}>
          <Col span={8}>
            <OverallStat statInfo={overallStatInfo} />
          </Col>
          <Col span={16}>
            {overallStatInfo ? (
              <Row>
                <Col span={12} style={{ position: 'relative' }}>
                  <div className={styles.progressWrapper}>
                    <InspectionProgress statInfo={overallStatInfo} />
                  </div>
                </Col>
                <Col span={12}>
                  <PieChart statInfo={overallStatInfo} loading={loading} />
                </Col>
              </Row>
            ) : (
              <Empty description="暂无数据" />
            )}
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default InspectionDailyPage;
