import React from 'react';
import { Row, Col, Form, Typography } from 'antd';
import type { TeamDetail } from '../type';
import TeammateList from './TeammateList';
import styles from './Detail.less';

const { Text } = Typography;

interface DetailProps {
  team?: TeamDetail;
}
const Detail: React.FC<DetailProps> = ({ team }) => {
  if (!team) return null;
  const { name, leaderName, orgName, siteOrgName } = team;
  return (
    <Form
      labelCol={{ span: 6 }}
      labelAlign="left"
      className={styles.teamDetail}
    >
      <Row>
        <Col span={12}>
          <Form.Item label="组名">
            <Text strong>{name}</Text>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="负责人">
            <Text strong>{leaderName}</Text>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="机构">
            <Text strong>{orgName}</Text>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="驻点机构">
            <Text strong>{siteOrgName}</Text>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="组成员"
            labelCol={{ span: 23 }}
            wrapperCol={{ span: 24 }}
          >
            <TeammateList team={team} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default Detail;
