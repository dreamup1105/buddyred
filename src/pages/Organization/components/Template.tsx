import React, { useState, useEffect } from 'react';
import { setTemplateToOrg } from '@/services/template';
import { DownOutlined } from '@ant-design/icons';
import { Modal, Table, Space, Button, Dropdown, Menu, Radio } from 'antd';
import type { ITableListItem } from '../type';

interface IComponentProps {
  visible: boolean;
  templates: Template.ITemplateItem[];
  currentRecord: ITableListItem | undefined;
  onSubmit: () => void;
  onCancel: () => void;
}

const Template: React.FC<IComponentProps> = ({
  visible,
  templates,
  currentRecord,
  onSubmit,
  onCancel,
}) => {
  const [currentTemplate, setCurrentTemplate] = useState<number>();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const onModalCancel = () => {
    setCurrentTemplate(undefined);
    onCancel();
  };

  const onMenuClick = async ({ key }: any) => {
    setConfirmLoading(true);
    try {
      await setTemplateToOrg({
        group: currentRecord!.id,
        includeRoles: key === 'include',
        template: currentTemplate!,
      });
      onSubmit();
      setCurrentTemplate(undefined);
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Template.ITemplateItem) => {
        return (
          <Radio
            value={record.id}
            onClick={() => setCurrentTemplate(record.id)}
            checked={currentTemplate === record.id}
          >
            {name}
          </Radio>
        );
      },
    },
    {
      title: '说明',
      dataIndex: 'note',
      key: 'note',
    },
  ];

  const btnMenu = (
    <Menu onClick={onMenuClick}>
      <Menu.Item key="include">包含角色</Menu.Item>
      <Menu.Item key="exclude">不包含角色</Menu.Item>
    </Menu>
  );

  useEffect(() => {
    if (currentRecord?.templateID) {
      setCurrentTemplate(currentRecord.templateID);
    }
  }, [currentRecord?.templateID]);

  return (
    <Modal
      title="设定模板"
      visible={visible}
      okText="保存"
      cancelText="取消"
      onCancel={onModalCancel}
      width={750}
      bodyStyle={{ height: 400, overflow: 'auto' }}
      footer={[
        <Space key="space">
          <Button key="close" onClick={onModalCancel}>
            关闭
          </Button>
          <Dropdown
            key="setTemplate"
            overlay={btnMenu}
            disabled={!currentTemplate}
          >
            <Button key="template" type="primary" loading={confirmLoading}>
              设定模板
              <DownOutlined />
            </Button>
          </Dropdown>
        </Space>,
      ]}
      forceRender
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={templates}
        pagination={false}
      />
    </Modal>
  );
};

export default Template;
