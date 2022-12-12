import React, { useState, useRef } from 'react';
import {
  PlusOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import {
  Menu,
  Badge,
  Modal,
  Button,
  Select,
  message,
  Divider,
  Dropdown,
  Popconfirm,
} from 'antd';
import type { Dispatch } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import useMount from '@/hooks/useMount';
import useProvinces from '@/hooks/useProvinces';
import { fetchTemplates } from '@/services/template';
// import { resetPassword } from '@/services/account';
import { OrgStatus, OrgType, OrgStatusEnum } from '@/utils/constants';
import { tableHeight } from '@/utils/utils';
import ProTable from '@/components/ProTable';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import Address from '@/components/Address';
import AccountModal from '@/pages/Employee/components/Account';
import CreateOrgForm from './components/CreateOrgForm';
import DetailModal from './components/Detail';
import TemplateModal from './components/Template';
import PasswordModal from './components/setPasswordAdmin';
import {
  fetchOrganizations,
  fetchOrganization,
  delOrganization,
  deleteAdminAccount,
  setPasswordByAdminAPI,
} from './service';
import type { ITableListItem, AddressOption, OrgDetail } from './type';
import { OperationType, OrgStatusRecordEnum } from './type';
import styles from './index.less';

interface IPageProps {
  dispatch: Dispatch;
  provinces: AddressOption[];
}

const { Option } = Select;
const defaultQuery = {
  current: 1,
  pageSize: 30,
  name: '',
  phone: '',
  alias: '',
  username: '',
  regionCode: [],
  status: undefined,
  orgType: undefined,
};

const OrganizationPage: React.FC<IPageProps> = () => {
  const actionRef = useRef<ActionType>();
  const provinces = useProvinces();
  const [createOrgFormVisible, setCreateOrgFormVisible] = useState<boolean>(
    false,
  );
  const [
    createOrgFormInitialValues,
    setCreateOrgFormInitialValues,
  ] = useState<OrgDetail>();
  const [operation, setOperation] = useState<OperationType>(OperationType.NOOP);
  const [templates, setTemplates] = useState<Template.ITemplateItem[]>([]);
  const [detailModalLoading, setDetailModalLoading] = useState<boolean>(false);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [accountModalVisible, setAccountModalVisible] = useState<boolean>(
    false,
  );
  const [templateModalVisible, setTemplateModalVisible] = useState<boolean>(
    false,
  );
  const [currentRecord, setCurrentRecord] = useState<
    ITableListItem | undefined
  >();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  // 加载机构详情
  const loadOrganization = async (record?: ITableListItem) => {
    setDetailModalLoading(true);
    try {
      const id = record ? record.id : currentRecord!.id;
      const { data } = await fetchOrganization(id);
      setCreateOrgFormInitialValues(data);
    } catch (error) {
      console.error(error);
    } finally {
      setDetailModalLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const { data } = await fetchTemplates();
      setTemplates(data);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitCreateOrgForm = () => {
    message.success(
      operation === OperationType.CREATE ? '新增成功' : '编辑成功',
    );
    actionRef.current?.reload(true);
    setCreateOrgFormVisible(false);
    setCreateOrgFormInitialValues(undefined);
  };

  /**
   * 账号新建/更新 提交
   * @param msg
   */
  const onSubmitCreateAccount = (msg: string) => {
    message.success(msg);
    setAccountModalVisible(false);
    actionRef.current?.reload();
  };

  /**
   * 设定模板提交
   */
  const onSubmitSetTemplate = () => {
    message.success('模板设定成功');
    setTemplateModalVisible(false);
    setCurrentRecord(undefined);
    actionRef.current?.reload();
  };

  const onCancelCreateOrgForm = () => {
    setCreateOrgFormVisible(false);
    setCreateOrgFormInitialValues(undefined);
  };

  const onCancelDetailModal = () => {
    setCreateOrgFormInitialValues(undefined);
    setDetailModalVisible(false);
  };

  /**
   * 详情
   * @param record
   */
  const onViewDetail = (record: ITableListItem) => {
    loadOrganization(record);
    setDetailModalVisible(true);
  };

  /**
   * 创建
   */
  const onCreateOrg = () => {
    setCreateOrgFormInitialValues(undefined);
    setOperation(OperationType.CREATE);
    setCreateOrgFormVisible(true);
  };

  /**
   * 修改
   */
  const onEditOrg = (record?: ITableListItem) => {
    setOperation(OperationType.EDIT);
    loadOrganization(record);
    setCreateOrgFormVisible(true);
  };

  /**
   * 删除
   */
  const onDelOrg = async (record: ITableListItem) => {
    try {
      await delOrganization(record.id);
      message.success('删除成功');
      actionRef.current?.reload();
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 单击表格事件
   * @param record
   */
  const onTableClick = (record: ITableListItem) => {
    setCurrentRecord(record);
  };

  /**
   * 双击表格事件
   */
  const onTableDoubleClick = () => {
    setOperation(OperationType.EDIT);
    loadOrganization();
    setCreateOrgFormVisible(true);
  };

  const onClickMoreMenu = async ({ key }: any, record: ITableListItem) => {
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
            await deleteAdminAccount(record!.accountId);
            message.success('删除账号成功');
            actionRef.current?.reload();
          },
        });
        break;
      case 'reset':
        // Modal.confirm({
        //   title: '确定要重置密码吗?',
        //   icon: <ExclamationCircleOutlined />,
        //   onOk: async () => {
        //     await resetPassword(record.accountId);
        //     message.success('密码重置成功');
        //     actionRef.current?.reload();
        //   },
        // });
        setCurrentRecord(record);
        setPasswordVisible(true);
        break;
      case 'setTemplate':
        setTemplateModalVisible(true);
        break;
      default:
        break;
    }
  };

  // 重置密码
  const onSubmitPasswordVisible = async (pwd: string) => {
    try {
      await setPasswordByAdminAPI(pwd, currentRecord?.accountId);
      message.success('重置密码成功');
      setPasswordVisible(false);
    } catch (err) {
      console.log(err);
    }
  };

  const onCancelAccount = () => {
    setAccountModalVisible(false);
    setCurrentRecord(undefined);
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
      <Menu.Item key="setTemplate">设定模板</Menu.Item>
    </Menu>
  );

  const columns: ProTableColumn<ITableListItem>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '机构简称',
      dataIndex: 'alias',
      key: 'alias',
    },
    {
      title: '统一社会信用代码',
      hideInSearch: true,
      dataIndex: 'uscc',
      key: 'uscc',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '行政区划',
      dataIndex: 'regionCode',
      key: 'regionCode',
      hideInTable: true,
      renderFormItem: () => <Address provinces={provinces} />,
    },
    {
      title: '机构类型',
      dataIndex: 'orgType',
      key: 'orgType',
      hideInTable: true,
      renderFormItem: () => (
        <Select>
          {OrgType.filter((item) => item.key !== 'PLATFORM').map((i) => (
            <Option key={i.key} value={i.key}>
              {i.value}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: '邮箱',
      hideInSearch: true,
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: OrgStatusRecordEnum) => {
        switch (text) {
          case OrgStatusRecordEnum.ACCEPTED:
            return (
              <>
                <Badge status="success" />
                {OrgStatusEnum[text]}
              </>
            );
          case OrgStatusRecordEnum.DRAFT:
            return (
              <>
                <Badge status="processing" />
                {OrgStatusEnum[text]}
              </>
            );
          case OrgStatusRecordEnum.REJECTED:
            return (
              <>
                <Badge status="error" />
                {OrgStatusEnum[text]}
              </>
            );
          default:
            return OrgStatusEnum[text];
        }
      },
      renderFormItem: () => (
        <Select>
          {OrgStatus.map((i) => (
            <Option key={i.key} value={i.key}>
              {i.value}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: '模板',
      hideInSearch: true,
      dataIndex: 'templateName',
      key: 'templateName',
    },
    {
      title: '操作',
      hideInSearch: true,
      fixed: 'right',
      render: (_: string, record: ITableListItem) => (
        <>
          <a onClick={() => onEditOrg(record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => onViewDetail(record)}>详情</a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定要删除该条记录吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={() => onDelOrg(record)}
          >
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <Dropdown overlay={renderMoreMenus(record)}>
            <a>
              更多
              <DownOutlined />
            </a>
          </Dropdown>
        </>
      ),
    },
  ];

  useMount(loadTemplates);

  return (
    <PageContainer className={styles.wrapper}>
      <ProTable<ITableListItem, typeof defaultQuery>
        rowKey="id"
        title="机构列表"
        defaultQuery={defaultQuery}
        actionRef={actionRef}
        columns={columns}
        formProps={{
          labelCol: {
            span: 5,
          },
        }}
        tableProps={{
          scroll: {
            x: 2000,
            y: tableHeight,
          },
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              onTableClick(record);
            },
            onDoubleClick: () => {
              onTableDoubleClick();
            },
          };
        }}
        request={async (query) => {
          const {
            name,
            status,
            orgType,
            phone,
            regionCode,
            current,
            pageSize,
            alias,
            username,
          } = query;
          return fetchOrganizations(current!, pageSize!, {
            name,
            username,
            status,
            orgType,
            phone,
            alias,
            regionCode: regionCode
              ? regionCode[regionCode.length - 1]
              : undefined,
          });
        }}
        toolBarRender={() => [
          <Button key="create" type="primary" onClick={onCreateOrg}>
            <PlusOutlined />
            新增
          </Button>,
        ]}
        hooks={{
          beforeInit: (query) => {
            return {
              ...query,
              collapsed: !(
                (query.regionCode && query.regionCode.length) ||
                query.orgType ||
                query.status
              ),
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
      <CreateOrgForm
        loading={detailModalLoading}
        operation={operation}
        provinces={provinces}
        initialValues={createOrgFormInitialValues}
        visible={createOrgFormVisible}
        onSubmit={onSubmitCreateOrgForm}
        onCancel={onCancelCreateOrgForm}
      />
      <DetailModal
        loading={detailModalLoading}
        visible={detailModalVisible}
        onCancel={onCancelDetailModal}
        initialDetail={createOrgFormInitialValues}
      />
      <AccountModal
        accountType="Org"
        visible={accountModalVisible}
        currentRecord={currentRecord}
        onSubmit={onSubmitCreateAccount}
        onCancel={() => onCancelAccount()}
      />
      <TemplateModal
        visible={templateModalVisible}
        templates={templates}
        currentRecord={currentRecord}
        onSubmit={() => onSubmitSetTemplate()}
        onCancel={() => {
          setCurrentRecord(undefined);
          setTemplateModalVisible(false);
        }}
      />
      {/* 重置密码弹框 */}
      <PasswordModal
        visible={passwordVisible}
        onCancel={() => setPasswordVisible(false)}
        onSubmit={onSubmitPasswordVisible}
      />
    </PageContainer>
  );
};

export default OrganizationPage;
