import React, { useState, useRef } from 'react';
import {
  Menu,
  Modal,
  Button,
  message,
  Divider,
  Dropdown,
  Popconfirm,
  TreeSelect,
} from 'antd';
import { useModel } from 'umi';
import useMount from '@/hooks/useMount';
import useDepartments from '@/hooks/useDepartments';
import {
  PlusOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { tableHeight } from '@/utils/utils';
import { PageContainer } from '@ant-design/pro-layout';
import { resetPassword } from '@/services/account';
import { fetchGroupRoles } from '@/pages/User/Role/service';
import type { IGroupRoleItem } from '@/pages/User/Role/type';
import ProTable from '@/components/ProTable';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import styles from './index.less';
import type { ITableListItem, EmployeeDetail } from './type';
import { OperationType } from './type';
import CreateEmployeeForm from './components/CreateEmployeeForm';
import DetailModal from './components/Detail';
import AccountModal from './components/Account';
import {
  fetchEmployees,
  fetchEmployee,
  delEmployee,
  delAccount,
} from './service';

const defaultQuery = {
  name: '',
  phone: '',
  current: 1,
  username: '',
  pageSize: 30,
  employeeNo: '',
  primaryDepartmentId: null,
};

const OrganizationStructurePage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const orgId = initialState!.currentUser?.org.id;
  const { loadDepartments, departmentsTreeData } = useDepartments({
    orgId: orgId!,
  });
  const actionRef = useRef<ActionType>();
  const [currentRecord, setCurrentRecord] = useState<
    ITableListItem | undefined
  >();
  const [createHumanFormVisible, setCreateHumanFormVisible] = useState<boolean>(
    false,
  );
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [accountModalVisible, setAccountModalVisible] = useState<boolean>(
    false,
  );
  const [
    createHumanFormInitialValues,
    setCreateHumanFormInitialValues,
  ] = useState<EmployeeDetail>();
  const [operation, setOperation] = useState<OperationType>(OperationType.NOOP);
  const [groupRoles, setGroupRoles] = useState<IGroupRoleItem[]>([]);
  const [detailModalLoading, setDetailModalLoading] = useState<boolean>(false);

  /**
   * 获取人员详情信息
   */
  const loadEmployeeDetail = async (id: number) => {
    setDetailModalLoading(true);
    try {
      const { data } = await fetchEmployee(id || currentRecord!.id);
      setCreateHumanFormInitialValues(data);
    } catch (error) {
      console.error(error);
    } finally {
      setDetailModalLoading(false);
    }
  };

  const loadGroupRoles = async () => {
    try {
      const { data } = await fetchGroupRoles();
      setGroupRoles(data);
    } catch (error) {
      console.error(error);
    }
  };

  const onCreateHuman = () => {
    setOperation(OperationType.CREATE);
    setCreateHumanFormVisible(true);
  };

  const onClickOperation = async (
    record: ITableListItem,
    action: OperationType,
  ) => {
    setOperation(action);
    setCurrentRecord(record);
    switch (action) {
      case OperationType.EDIT:
        loadEmployeeDetail(record.id);
        setCreateHumanFormVisible(true);
        break;
      case OperationType.VIEW:
        loadEmployeeDetail(record.id);
        setDetailModalVisible(true);
        break;
      case OperationType.DELETE:
        try {
          await delEmployee(record.id);
          message.success('删除成功');
          actionRef.current?.reload();
        } catch (error) {
          message.error(`${error}`);
          console.error(error);
        }
        break;
      default:
        break;
    }
  };

  // 创建员工
  const onSubmitCreateHumanForm = () => {
    setCreateHumanFormVisible(false);
    setCreateHumanFormInitialValues(undefined);
    actionRef.current?.reload(operation === OperationType.CREATE);
    message.success(
      operation === OperationType.CREATE ? '新增成功' : '修改成功',
    );
  };

  // 创建/更新账号
  const onSubmitCreateAccount = (msg: string) => {
    message.success(msg);
    actionRef.current?.reload();
    setAccountModalVisible(false);
  };

  const onCancelCreateAccount = () => {
    setCurrentRecord(undefined);
    setAccountModalVisible(false);
  };

  const onCancelCreateHumanForm = () => {
    setCreateHumanFormVisible(false);
    setCreateHumanFormInitialValues(undefined);
  };

  const onCancelDetailModal = () => {
    setDetailModalVisible(false);
  };

  const onClickMoreMenu = async ({ key }: any, record: ITableListItem) => {
    setCurrentRecord(record);
    switch (key) {
      case 'createAccount':
      case 'updateAccount':
        setAccountModalVisible(true);
        break;
      case 'deleteAccount':
        Modal.confirm({
          title: '确定要删除账号吗?',
          icon: <ExclamationCircleOutlined />,
          onOk: async () => {
            await delAccount(record!.accountId);
            message.success('删除账号成功');
            actionRef.current?.reload();
          },
        });
        break;
      case 'reset':
        Modal.confirm({
          title: '确定要重置密码吗?',
          icon: <ExclamationCircleOutlined />,
          onOk: async () => {
            await resetPassword(record.accountId);
            message.success('密码重置成功');
          },
        });
        break;
      default:
        break;
    }
  };

  const renderMoreMenus = (record: ITableListItem) => (
    <Menu onClick={(option) => onClickMoreMenu(option, record)}>
      {record.accountId ? (
        <>
          <Menu.Item key="updateAccount">更新账号</Menu.Item>
          <Menu.Item key="deleteAccount">删除账号</Menu.Item>
        </>
      ) : (
        <Menu.Item key="createAccount">新建账号</Menu.Item>
      )}
      <Menu.Item key="reset" disabled={!record.accountId}>
        重置密码
      </Menu.Item>
    </Menu>
  );

  const columns: ProTableColumn<ITableListItem>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '员工编号',
      dataIndex: 'employeeNo',
      key: 'employeeNo',
      width: 140,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 140,
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      key: 'roleName',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      hideInSearch: true,
      width: 140,
    },
    {
      title: '部门',
      dataIndex: 'primaryDepartmentId',
      key: 'primaryDepartmentName',
      valueType: 'tree-select',
      width: 120,
      render: (_, record) => {
        return record.primaryDepartmentName;
      },
      renderFormItem: () => (
        <TreeSelect
          showSearch
          placeholder="请选择"
          treeData={departmentsTreeData}
          treeDefaultExpandAll
          treeNodeFilterProp="title"
          virtual={false}
        />
      ),
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      width: 220,
      hideInSearch: true,
      render: (_: string, record: ITableListItem) => {
        return (
          <>
            <a onClick={() => onClickOperation(record, OperationType.EDIT)}>
              编辑
            </a>
            <Divider type="vertical" />
            <a onClick={() => onClickOperation(record, OperationType.VIEW)}>
              详情
            </a>
            <Divider type="vertical" />
            {!record.accountId && (
              <>
                <Popconfirm
                  title="确定要删除该条记录吗？"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() =>
                    onClickOperation(record, OperationType.DELETE)
                  }
                >
                  <a>删除</a>
                </Popconfirm>
                <Divider type="vertical" />
              </>
            )}

            <Dropdown overlay={renderMoreMenus(record)}>
              <a>
                更多
                <DownOutlined />
              </a>
            </Dropdown>
          </>
        );
      },
    },
  ];

  useMount(() => {
    loadDepartments();
    loadGroupRoles();
  });

  return (
    <PageContainer className={styles.wrapper}>
      <ProTable<ITableListItem, typeof defaultQuery>
        rowKey="id"
        title="人力资源列表"
        columns={columns}
        defaultQuery={defaultQuery}
        actionRef={actionRef}
        formProps={{
          style: {
            marginBottom: '20px',
          },
        }}
        tableProps={{
          scroll: {
            y: tableHeight,
          },
        }}
        toolBarRender={() => [
          <Button key="create" type="primary" onClick={onCreateHuman}>
            <PlusOutlined />
            新增
          </Button>,
        ]}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              onClickOperation(record, OperationType.EDIT);
            },
          };
        }}
        request={async (query) => {
          const {
            pageSize,
            current,
            name,
            phone,
            username,
            employeeNo,
            primaryDepartmentId,
          } = query;
          return fetchEmployees(
            { name, phone, employeeNo, primaryDepartmentId, username },
            false,
            Number(current) || 1,
            Number(pageSize) || 30,
          ) as Promise<{
            total: number;
            data: any[];
          }>;
        }}
        hooks={{
          beforeInit: (query) => {
            return {
              ...defaultQuery,
              ...query,
              primaryDepartmentId: query.primaryDepartmentId
                ? Number(query.primaryDepartmentId)
                : undefined,
            };
          },
          beforeSubmit: (formValues) => {
            return {
              ...formValues,
              current: 1,
            };
          },
        }}
      />
      <CreateEmployeeForm
        loading={detailModalLoading}
        operation={operation}
        visible={createHumanFormVisible}
        initialValues={createHumanFormInitialValues}
        departmentTreeData={departmentsTreeData}
        onSubmit={onSubmitCreateHumanForm}
        onCancel={onCancelCreateHumanForm}
      />
      <DetailModal
        loading={detailModalLoading}
        visible={detailModalVisible}
        initialDetail={createHumanFormInitialValues}
        onCancel={onCancelDetailModal}
      />
      <AccountModal
        visible={accountModalVisible}
        currentRecord={currentRecord}
        accountType="Employee"
        roles={groupRoles}
        onSubmit={onSubmitCreateAccount}
        onCancel={onCancelCreateAccount}
      />
    </PageContainer>
  );
};

export default OrganizationStructurePage;
