import React from 'react';
import { useModel } from 'umi';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Space,
  DatePicker,
  TreeSelect,
} from 'antd';
import { DownOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons';
import type { ActionRef, ActionType } from '@/components/ProTable';
import useDepartments from '@/hooks/useDepartments';
import useMount from '@/hooks/useMount';
import { PageType } from '../type';

interface IComponentProps {
  pageType?: PageType;
  collapsed: boolean;
  loading: boolean;
  actionRef: ActionRef;
  onSearch: () => void;
  onClickCollapse: () => void;
}

const { RangePicker } = DatePicker;

const StatusSearchForm: React.FC<IComponentProps> = ({
  loading,
  collapsed,
  actionRef,
  pageType = PageType.MAINTENANCE,
  onSearch,
  onClickCollapse,
}) => {
  const { initialState } = useModel('@@initialState');
  const orgId = initialState!.currentUser?.org.id;
  const { departmentsTreeData, loadDepartments } = useDepartments({
    orgId: orgId!,
  });
  const initPersonNameLabel =
    pageType === PageType.MAINTENANCE ? '保养执行人' : '工程师';

  useMount(loadDepartments);

  return collapsed ? (
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item name="equipmentName">
          <Input placeholder="请输入设备名称" suffix={<SearchOutlined />} />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Space>
          <Button onClick={() => onSearch?.()} loading={loading} type="primary">
            搜索
          </Button>
          <Button onClick={() => (actionRef.current as ActionType).reset()}>
            重置
          </Button>
        </Space>
      </Col>
      <Col span={12} style={{ textAlign: 'right' }}>
        <a onClick={onClickCollapse}>
          更多搜索
          <DownOutlined />
        </a>
      </Col>
    </Row>
  ) : (
    <>
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <a onClick={onClickCollapse}>
            收起
            <UpOutlined />
          </a>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="设备名称" name="equipmentName">
            <Input placeholder="请输入设备名称" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="生产厂商" name="manufacturerName">
            <Input placeholder="请输入生产厂商" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="报单时间" name="since">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="设备型号" name="modelName">
            <Input placeholder="请输入设备型号" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="设备序列号" name="sn">
            <Input placeholder="请输入设备序列号" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="设备编号" name="equipmentNo">
            <Input placeholder="请输入设备编号" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="科室" name="departmentId">
            <TreeSelect
              multiple
              placeholder="请选择"
              treeData={departmentsTreeData}
              treeDefaultExpandAll
              virtual={false}
            />
          </Form.Item>
        </Col>
        {/* <Col span={8}>
          <Form.Item label="状态" name="status">
            <Select placeholder="请选择">
              {StatusOptions.map((option) => (
                <Select.Option key={option.status} value={option.status}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col> */}
        <Col span={8}>
          <Form.Item label={initPersonNameLabel}>
            <Input placeholder={`请输入${initPersonNameLabel}名称`} />
          </Form.Item>
        </Col>
        <Col span={8} style={{ textAlign: 'right', alignSelf: 'center' }}>
          <Space>
            <Button onClick={() => (actionRef.current as ActionType).reset()}>
              重置
            </Button>
            <Button type="primary" loading={loading} onClick={onSearch}>
              查询
            </Button>
          </Space>
        </Col>
      </Row>
    </>
  );
};

export default StatusSearchForm;
