import React from 'react';
import { Col, Row, Form, Space, Divider, Typography, Tag } from 'antd';
import type { TeamDetail } from '@/pages/Team/type';
import {
  StatusMap,
  StatusColorMap,
  SigStatus,
  AuthStatus,
} from '@/pages/Team/type';
import { SigScopeMap } from '../type';
import EquipmentList from './EquipmentList';
import AttachmentView from './AttachmentView';
import styles from './SigDetail.less';

const { Text } = Typography;

interface SigDetailProps {
  team?: TeamDetail;
}
const SigDetail: React.FC<SigDetailProps> = ({ team }) => {
  if (!team) return null;
  const {
    orgName,
    siteOrgName,
    leaderName,
    sigBeginDate,
    sigEndDate,
    authStatus,
    sigStatus,
    authApply,
  } = team;
  return (
    <Form labelCol={{ span: 6 }} labelAlign="left" className={styles.sigDetail}>
      <Row>
        <Col span={12}>
          <Form.Item label="甲方">
            <Text strong>{siteOrgName}</Text>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="乙方">
            <Text strong>{orgName}</Text>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="工程师负责人">
            <Text strong>{leaderName}</Text>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="签约范围">
            <Space>
              {((t) => {
                const nodes: React.ReactNode[] = [];
                SigScopeMap.forEach((text, key) => {
                  if (t[key] === true) {
                    nodes.push(
                      <Text key={`${text}t`} strong>
                        {text}
                      </Text>,
                    );
                    nodes.push(<Divider key={`${text}d`} type="vertical" />);
                  }
                });
                if (nodes.length > 1) {
                  nodes.pop();
                } else {
                  return '无';
                }
                return nodes;
              })(team)}
            </Space>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="签约有效期">
            {sigStatus === SigStatus.SIG_ACCEPTED ||
            sigStatus === SigStatus.SIG_APPLIED ? (
              <Space>
                <Text strong>{sigBeginDate}</Text>至
                <Text strong>{sigEndDate}</Text>
              </Space>
            ) : (
              '无'
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="签约状态">
            <Tag color={StatusColorMap.get(authStatus)}>
              {StatusMap.get(authStatus)}
            </Tag>
            <Tag color={StatusColorMap.get(sigStatus)}>
              {StatusMap.get(sigStatus)}
            </Tag>
          </Form.Item>
        </Col>
        {authStatus === AuthStatus.AUTH_APPLIED ? (
          <Col span={24}>
            <Form.Item label="授权申请留言" labelCol={{ span: 3 }}>
              {authApply}
            </Form.Item>
          </Col>
        ) : (
          ''
        )}
        {authStatus === AuthStatus.AUTH_ACCEPTED
          ? [
              <Col key="l" span={24}>
                <Form.Item label="授权的设备" />
              </Col>,
              <Col key="t" span={24} style={{ marginBottom: 24 }}>
                <EquipmentList selectAble={false} team={team} />
              </Col>,
            ]
          : ''}
        {sigStatus === SigStatus.SIG_APPLIED ||
        sigStatus === SigStatus.SIG_ACCEPTED
          ? [
              <Col key="l" span={24}>
                <Form.Item label="签约的设备" />
              </Col>,
              <Col key="t" span={24} style={{ marginBottom: 24 }}>
                <EquipmentList isSig selectAble={false} team={team} />
              </Col>,
            ]
          : ''}
        {sigStatus === SigStatus.SIG_APPLIED ||
        sigStatus === SigStatus.SIG_ACCEPTED
          ? [
              <Col key="l" span={24}>
                <Form.Item label="合同照片" />
              </Col>,
              <Col key="t" span={24}>
                <AttachmentView team={team} />
              </Col>,
            ]
          : ''}
      </Row>
    </Form>
  );
};

export default SigDetail;
