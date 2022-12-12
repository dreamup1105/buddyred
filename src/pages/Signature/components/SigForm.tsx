import React, { useState } from 'react';
import { Form, Input, Checkbox, DatePicker, Row, Col } from 'antd';
import moment from 'moment';
import type { FormInstance } from 'antd/es/form/Form';
import type { TeamDetail } from '@/pages/Team/type';
import EquipmentList from './EquipmentList';
import PictureUpload from './PictureUpload';

const { RangePicker } = DatePicker;
const defaultBeginDate = moment(new Date());
const defaultEndDate = moment(new Date()).add(1, 'year');

interface SigFormProps {
  form: FormInstance;
  team?: TeamDetail;
}
const SigForm: React.FC<SigFormProps> = ({ form, team }) => {
  const [refresh, setRefresh] = useState<boolean>(false);
  if (!team) return null;
  const equipmentIds = form.getFieldValue('equipmentIds');
  return (
    <Form
      form={form}
      layout="horizontal"
      labelCol={{ span: 6 }}
      labelAlign="left"
      initialValues={{
        siteOrgName: team.siteOrgName,
        orgName: team.orgName,
        leaderName: team.leaderName,
        sigScope: [
          'sigScopeRepairs',
          'sigScopeMaintain',
          'sigScopeInspection',
          'sigScopeMeasurement',
        ],
        equipmentIds: [],
        sigDate: [defaultBeginDate, defaultEndDate],
        attachments: [],
      }}
      onValuesChange={() => {
        setRefresh(!refresh);
      }}
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label="甲方" name="siteOrgName">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="乙方" name="orgName">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="工程师负责人" name="leaderName">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="签约范围"
            name="sigScope"
            rules={[{ required: true, message: '请选择至少一个签约项目' }]}
          >
            <Checkbox.Group>
              <Checkbox value="sigScopeRepairs">维修</Checkbox>
              <Checkbox value="sigScopeMaintain">保养</Checkbox>
              <Checkbox value="sigScopeInspection">巡检</Checkbox>
              <Checkbox value="sigScopeMeasurement">计量检测</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="协议期限"
            name="sigDate"
            rules={[{ required: true, message: '请填写开始和结束日期' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={24} style={{ marginBottom: 16 }}>
          <Form.Item
            label={`签约设备（已选：${
              equipmentIds ? equipmentIds.length : 0
            }个）`}
            labelCol={{ span: 23 }}
            name="equipmentIds"
            rules={[{ required: true, message: '请选择至少一个设备' }]}
          >
            <EquipmentList team={team} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="合同附件"
            labelCol={{ span: 23 }}
            name="attachments"
            rules={[{ required: true, message: '请上传合同附件' }]}
          >
            <PictureUpload />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SigForm;
