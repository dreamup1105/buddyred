import React, { useState } from 'react';
import {
  Space,
  Button,
  Descriptions,
  Card,
  Divider,
  Checkbox,
  Modal,
  message,
} from 'antd';
import { history } from 'umi';
import SignFormContainer from '../../hooks/useSignForm';
import { ensureSign } from '../../service';
import { SignProjectsOptions } from '../../type';

const { confirm } = Modal;

const StepResult: React.FC = () => {
  const signForm = SignFormContainer.useContainer();
  const [loading, setLoading] = useState(false);

  const onConfirmSign = async () => {
    confirm({
      title: '确定要进行签约吗？',
      onOk: async () => {
        if (loading) {
          return;
        }
        setLoading(true);
        try {
          const { code } = await ensureSign(signForm.values.id!);
          if (code === 0) {
            message.success('签约成功');
            history.replace('/crm/sign');
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <Card style={{ width: 500, margin: '0 auto' }} bordered={false}>
      <Descriptions>
        <Descriptions.Item label="签约公司" span={3}>
          {signForm.values.companyName}
        </Descriptions.Item>
        <Descriptions.Item label="签约开始日期" span={3}>
          {signForm.values.startDate}
        </Descriptions.Item>
        <Descriptions.Item label="签约结束日期" span={3}>
          {signForm.values.endDate}
        </Descriptions.Item>
        <Descriptions.Item label="签约项目" span={3}>
          <Checkbox.Group
            options={SignProjectsOptions}
            value={signForm.values.projects}
            disabled
          />
        </Descriptions.Item>
        <Descriptions.Item label="签约设备" span={3}>
          {signForm.values.euqipmentCount}台
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      <div style={{ textAlign: 'center' }}>
        <Space>
          <Button
            onClick={() => {
              signForm.updateForm((prevValues) => ({
                ...prevValues,
                current: 1,
              }));
            }}
          >
            上一步
          </Button>
          <Button type="primary" onClick={onConfirmSign} loading={loading}>
            确定签约
          </Button>
        </Space>
      </div>
    </Card>
  );
};

export default StepResult;
