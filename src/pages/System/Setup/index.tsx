import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Input,
  Form,
  Table,
  Pagination,
  Space,
  Button,
  Popconfirm,
  Tabs,
  InputNumber,
  message,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import useMount from '@/hooks/useMount';
import useQuery from '@/hooks/useQuery';
import type { ITableListItem } from './type';
import {
  fetchOwnerSetupList,
  fetchGlobalSetup,
  resetSetupByOwner,
  resetGlobalSetup,
  saveSetupByOwner,
  saveGlobalSetup,
} from './service';
import styles from './index.less';

type TableField =
  | 'assignTimeoutMinutes'
  | 'acceptTimeoutHours'
  | 'evaluateTimeoutHours'
  | 'transferTimeoutHours';

const { TabPane } = Tabs;
const defaultQuery = {
  pageSize: 10,
  current: 1,
  name: '',
  activeTab: 'OrgTab',
};

const SetupPage: React.FC = () => {
  const [searchForm] = Form.useForm();
  const [query, setQuery] = useQuery(defaultQuery);
  const [loading, setLoading] = useState<boolean>(false);
  const [globalLoading, setGlobalLoading] = useState<boolean>(false);
  const [orgSetupList, setOrgSetupList] = useState<ITableListItem[]>([]);
  const [globalSetupList, setGlobalSetupList] = useState<ITableListItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  // 加载机构设置列表
  const loadOrgSetupList = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const { name, pageSize, current } = query;
      const { data, total: totals } = await fetchOwnerSetupList(
        Number(current),
        Number(pageSize!),
        { name },
      );
      setOrgSetupList([...data]);
      setTotal(totals);
    } catch (ex) {
      console.error(ex);
    } finally {
      setLoading(false);
    }
  };

  // 加载系统设置列表
  const loadGlobalSetupList = async () => {
    setGlobalLoading(true);
    try {
      const { data } = await fetchGlobalSetup();
      setGlobalSetupList([{ ...data }]);
    } catch (error) {
      console.error(error);
    } finally {
      setGlobalLoading(false);
    }
  };

  // inputNumber blur
  const handleFieldBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    record: ITableListItem,
    field: TableField,
  ) => {
    const { value } = e.target;
    const walkList = (list: ITableListItem[]) =>
      list.map((item) => {
        if (record.ownerId === item.ownerId) {
          return {
            ...item,
            [field]: Number(value),
          };
        }
        return { ...item };
      });

    switch (query.activeTab) {
      case 'OrgTab':
        setOrgSetupList(walkList);
        break;
      case 'GlobalTab':
        setGlobalSetupList(walkList);
        break;
      default:
        break;
    }
  };

  // 保存
  const onSaveSetup = async (record: ITableListItem) => {
    try {
      if (query.activeTab === 'GlobalTab') {
        await saveGlobalSetup(record);
        loadGlobalSetupList();
      } else {
        await saveSetupByOwner(record.ownerId, record);
        loadOrgSetupList();
      }
      message.success('保存成功');
    } catch (error) {
      console.error(error);
    }
  };

  // 重置
  const onResetSetup = async (record: ITableListItem) => {
    try {
      if (query.activeTab === 'GlobalTab') {
        await resetGlobalSetup();
        loadGlobalSetupList();
      } else {
        await resetSetupByOwner(record.ownerId);
        loadOrgSetupList();
      }
      message.success('重置成功');
    } catch (error) {
      console.error(error);
    }
  };

  // 查询
  const onSearch = () => {
    const { name } = searchForm.getFieldsValue();
    setQuery((prevQuery) => ({
      ...prevQuery,
      name,
      current: 1,
    }));
  };

  // 重置查询
  const onReset = () => {
    searchForm.resetFields();
    setQuery(() => ({ ...defaultQuery }));
  };

  const init = () => {
    searchForm.setFieldsValue({ ...defaultQuery, ...query });
    setQuery(() => ({ ...defaultQuery, ...query }));
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'ownerName',
      key: 'ownerName',
    },
    {
      title: '接单时限',
      dataIndex: 'assignTimeoutMinutes',
      key: 'assignTimeoutMinutes',
      render: (text: number, record: ITableListItem) => (
        <InputNumber
          value={text}
          onBlur={(e) => handleFieldBlur(e, record, 'assignTimeoutMinutes')}
          className={styles.inputNumber}
        />
      ),
    },
    {
      title: '自动确认及验收时限',
      dataIndex: 'acceptTimeoutHours',
      key: 'acceptTimeoutHours',
      render: (text: number, record: ITableListItem) => (
        <InputNumber
          value={text}
          onBlur={(e) => handleFieldBlur(e, record, 'acceptTimeoutHours')}
          className={styles.inputNumber}
        />
      ),
    },
    {
      title: '默认评价时限',
      dataIndex: 'evaluateTimeoutHours',
      key: 'evaluateTimeoutHours',
      render: (text: number, record: ITableListItem) => (
        <InputNumber
          value={text}
          onBlur={(e) => handleFieldBlur(e, record, 'evaluateTimeoutHours')}
          className={styles.inputNumber}
        />
      ),
    },
    {
      title: '自动转单时限',
      dataIndex: 'transferTimeoutHours',
      key: 'transferTimeoutHours',
      render: (text: number, record: ITableListItem) => (
        <InputNumber
          value={text}
          onBlur={(e) => handleFieldBlur(e, record, 'transferTimeoutHours')}
          className={styles.inputNumber}
        />
      ),
    },
    {
      title: '操作',
      key: 'operation',
      render: (_: any, record: ITableListItem) => (
        <Space>
          <Popconfirm
            title="确定保存该记录吗?"
            onConfirm={() => onSaveSetup(record)}
          >
            <Button type="primary">保存</Button>
          </Popconfirm>
          <Popconfirm
            title="确定重置该记录吗?"
            onConfirm={() => onResetSetup(record)}
          >
            <Button>重置</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onPageChange = (page: number) => {
    setQuery((prevQuery: any) => ({
      ...prevQuery,
      current: page,
    }));
  };

  const onShowSizeChange = (current: number, pageSize: number) => {
    setQuery((prevQuery: any) => ({
      ...prevQuery,
      pageSize,
    }));
  };

  const onTabChange = (key: string) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      activeTab: key,
    }));
  };

  useEffect(() => {
    loadOrgSetupList();
  }, [query, query.current, query.pageSize]);

  useMount(() => {
    init();
    loadGlobalSetupList();
  });

  return (
    <PageContainer className={styles.wrapper}>
      <div className={styles.headerSearchWrapper}>
        <Row style={{ marginBottom: 24 }}>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Form form={searchForm}>
              <Form.Item name="name" label="名称">
                <Input placeholder="请填写" />
              </Form.Item>
            </Form>
          </Col>
          <Col span={18} style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => onReset()}>重置</Button>
              <Button
                type="primary"
                onClick={() => onSearch()}
                loading={loading}
              >
                查询
              </Button>
            </Space>
          </Col>
        </Row>
      </div>
      <Tabs
        className={styles.tabsWrapper}
        onChange={onTabChange}
        activeKey={query.activeTab}
      >
        <TabPane tab="机构" key="OrgTab">
          <Table<ITableListItem>
            rowKey="ownerId"
            columns={columns}
            dataSource={orgSetupList}
            loading={loading}
            pagination={false}
          />
          <Pagination
            current={Number(query.current || 1)}
            pageSize={Number(query.pageSize || 10)}
            total={total}
            showSizeChanger
            showQuickJumper
            showTotal={(totals) => `共${totals}条记录`}
            onChange={onPageChange}
            onShowSizeChange={onShowSizeChange}
            style={{ textAlign: 'right', marginTop: 16 }}
          />
        </TabPane>
        <TabPane tab="系统" key="GlobalTab">
          <Table<ITableListItem>
            rowKey="ownerId"
            columns={columns}
            dataSource={globalSetupList}
            loading={globalLoading}
            pagination={false}
          />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default SetupPage;
