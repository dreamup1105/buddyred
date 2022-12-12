import React, { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@/components/ProTable';
import type { ProTableColumn, ActionType } from '@/components/ProTable';
import {
  Button,
  Divider,
  message,
  Popconfirm,
  Breadcrumb,
  Space,
  Tag,
  Radio,
} from 'antd';
import { fetchVersions } from '@/pages/Dictionary/Maintenance/Template/service';
import { getParsedTag } from '@/pages/Assets/helper';
import RemoteSelect from '@/pages/Assets/components/RemoteSelect';
import useMount from '@/hooks/useMount';
import useQuery from '@/hooks/useQuery';
import { tableHeight } from '@/utils/utils';
import type { IVersionItem } from '@/pages/Dictionary/Maintenance/Template/type';
import type {
  IMaintainItemWithVersion,
  IMaintainItemDetailWithVersion,
} from '@/pages/Dictionary/Maintenance/Editor/type';
import {
  fetchMaintainItemsWithVersion,
  fetchSpecVersion,
} from '@/pages/Dictionary/Maintenance/Editor/service';
import {
  fetchMaintainItems,
  fetchMaintainItemDetails,
  deleteMaintainItem,
  createVersion,
} from './service';
import CreateItemForm from './components/CreateItemForm';
import CreateVersionForm from './components/CreateVersionForm';
import HistoryVersionModal from './components/HistoryVersion';
import type { FormInstance } from 'antd/es/form';
import type {
  ITableListItem,
  IMaintainItemDetail,
  IMaintainItemDetailWithTransformOptions,
} from './type';
import { OperationType } from './type';
import useUserInfo from '@/hooks/useUserInfo';
import { TemplateFor } from '../type';

interface IQuery {
  current: number;
  pageSize: number;
  name: string;
  tagName: string | undefined;
  versionId: number | undefined;
  orgId: number | null;
  templateFor: string;
}

const getBizConfig = (query: Record<string, any>) => {
  const { versionId } = query;

  if (versionId) {
    return {
      isHistory: true,
      versionId: Number(versionId),
    };
  }

  return {
    isHistory: false,
  };
};

export const filterMaintainItem = (
  name: string,
  tags: string[],
  item: IMaintainItemWithVersion,
) => {
  const hasName = !!name;
  const hasTags = !!tags?.length;

  if (!hasName && !hasTags) {
    return true;
  }

  if (hasName && !hasTags) {
    return item.name.includes(name);
  }

  if (!hasName && hasTags) {
    return item.itemTags?.some((tag) => tags.includes(tag));
  }

  if (hasName && hasTags) {
    return (
      item.name.includes(name) &&
      tags.some((tag) => item.itemTags.includes(tag))
    );
  }

  return false;
};

const DefaultHistoryVersion = {
  id: -1,
  lastModifiedBy: -1,
  lastModifiedByName: '',
  lastModifiedTime: '',
  size: 0,
  tag: '',
  ts: '',
  verNo: 0,
};

const DefaultQuery: IQuery = {
  current: 1,
  pageSize: 30,
  name: '',
  tagName: '',
  orgId: null,
  templateFor: TemplateFor.OTHER_PLATFORM,
  versionId: undefined,
};

// 保养项目
const MaintenanceItemPage: React.FC = () => {
  const { currentUser } = useUserInfo();
  const isAdmin = currentUser?.user.isAdmin;
  const orgId = currentUser?.org.id;
  const [currentQuery] = useQuery(DefaultQuery);
  const bizConfig = getBizConfig(currentQuery);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [createVersionFormVisible, setCreateVersionFormVisible] = useState(
    false,
  );
  const [createItemFormVisible, setCreateItemFormVisible] = useState(false);
  const [historyVersionModalVisible, setHistoryVersionModalVisible] = useState(
    false,
  );
  const [historyVersion, setHistoryVersion] = useState<IVersionItem>(
    DefaultHistoryVersion,
  ); // 历史版本基本信息
  const allHistoryItemsRef = useRef<IMaintainItemWithVersion[]>([]);
  const [operation, setOperation] = useState<OperationType>(OperationType.NOOP);
  const [allHistoryVersions, setAllHistoryVersions] = useState<IVersionItem[]>(
    [],
  ); // 历史版本列表（全量）
  const [templateForString, setTemplateForString] = useState<string>(
    TemplateFor.OTHER_PLATFORM,
  );
  const [
    createItemFormInitialValues,
    setCreateItemFormInitialValues,
  ] = useState<
    | {
        id: number;
        name: string;
        tags?: string[];
        details: IMaintainItemDetailWithTransformOptions[];
      }
    | undefined
  >(undefined); // 保养项目表单初始值（用于编辑场景）
  const isFetchedAllHistoryItems = useRef(false); // 判断是否已经请求过全量的历史版本保养项目集

  // 获取保养指标项列表
  const loadMaintainItemDetails = async (id: number) => {
    const { data = [] } = await fetchMaintainItemDetails({ miId: id });
    return data;
  };

  // 获取保养项目历史版本列表
  const loadMaintainItemVersions = async () => {
    const { data = [] } = await fetchVersions({
      orgId: isAdmin ? null : orgId,
      templateFor: isAdmin ? TemplateFor.PLATFORM : TemplateFor.OTHER_PLATFORM,
    });
    setAllHistoryVersions(data);
  };

  // 获取历史版本基本信息
  const loadHistoryVersionInfo = async () => {
    try {
      const res = await fetchSpecVersion(Number(bizConfig.versionId));
      setHistoryVersion(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // 渲染面包屑
  const renderBreadcrumb = () => {
    return bizConfig.isHistory ? (
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href="/">首页</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>字典管理</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/dictionary/maintenance/item">保养项目</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{`${historyVersion?.verNo}（${historyVersion?.tag}-${historyVersion?.lastModifiedTime}）`}</Breadcrumb.Item>
      </Breadcrumb>
    ) : (
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href="/">首页</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>字典管理</Breadcrumb.Item>
        <Breadcrumb.Item>保养项目</Breadcrumb.Item>
      </Breadcrumb>
    );
  };

  const onClickOperation = async (
    record: ITableListItem,
    action: OperationType,
  ) => {
    setOperation(action);
    switch (action) {
      case OperationType.DELETE:
        await deleteMaintainItem(record.id!);
        message.success('删除成功');
        actionRef.current?.reload();
        break;
      case OperationType.EDIT:
      case OperationType.VIEW:
        // eslint-disable-next-line no-case-declarations
        let details;
        if (bizConfig.isHistory) {
          details = (
            (record as IMaintainItemWithVersion).details || []
          ).map((i, id) => ({ ...i, id }));
        } else {
          // eslint-disable-next-line no-case-declarations
          details = await loadMaintainItemDetails(record.id!);
        }

        setCreateItemFormInitialValues({
          id: record.id!,
          name: record.name,
          tags: record.itemTags,
          details: details.map(
            (
              item:
                | (IMaintainItemDetailWithVersion & { id: number })
                | IMaintainItemDetail,
            ) => ({
              ...item,
              options: item?.options?.map((option) => ({
                label: option,
                key: option,
              })),
              component:
                item?.options?.length && item.options.length > 1
                  ? 'select'
                  : 'input',
            }),
          ),
        });
        setCreateItemFormVisible(true);
        break;
      default:
        break;
    }
  };

  const columns: ProTableColumn<ITableListItem>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '标签',
      dataIndex: 'tagName',
      key: 'tagName',
      hideInTable: true,
      renderFormItem: () => (
        <RemoteSelect
          templateForString={templateForString}
          onlySelect
          type="biz-item-tag"
          placeholder="请选择"
        />
      ),
    },
    {
      title: '标签',
      dataIndex: 'itemTags',
      key: 'itemTags',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <Space>
            {record.itemTags
              ? record.itemTags?.map((i) => <Tag key={i}>{i}</Tag>)
              : '-'}
          </Space>
        );
      },
    },
    {
      title: '最后修改时间',
      dataIndex: 'lastModifiedTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      hideInSearch: true,
      render: (_, record) => {
        if (
          bizConfig.isHistory ||
          (!isAdmin &&
            (record.templateFor == TemplateFor.PLATFORM ||
              record.templateFor == null))
        ) {
          return [
            <a
              key="detail"
              onClick={() => onClickOperation(record, OperationType.VIEW)}
            >
              详情
            </a>,
          ];
        }
        return [
          <a
            key="edit"
            onClick={() => onClickOperation(record, OperationType.EDIT)}
          >
            编辑
          </a>,
          <Divider key="divider1" type="vertical" />,
          <a
            key="detail"
            onClick={() => onClickOperation(record, OperationType.VIEW)}
          >
            详情
          </a>,
          <Divider key="divider2" type="vertical" />,
          <Popconfirm
            key="delete"
            title="确定要删除该项目吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={() => onClickOperation(record, OperationType.DELETE)}
          >
            <a>删除</a>
          </Popconfirm>,
        ];
      },
    },
  ];

  /**
   * 添加筛选类型，医院和工程师可以选择查看本机构或者平台的模板
   * 查看平台的模版时，只能查看，无编辑删除权限
   * 平台模板只有平台有权限编辑删除
   */
  if (!isAdmin) {
    const typeColumn = {
      title: '所属机构',
      dataIndex: 'templateFor',
      key: 'templateFor',
      hideInTable: true,
      renderFormItem: () => (
        <Radio.Group>
          <Radio value={TemplateFor.OTHER_PLATFORM}>本机构</Radio>
          <Radio value={TemplateFor.PLATFORM}>平台</Radio>
        </Radio.Group>
      ),
    };
    columns.splice(1, 0, typeColumn);
  }

  // 添加保养项目
  const onAddItem = () => {
    setOperation(OperationType.CREATE);
    setCreateItemFormVisible(true);
  };

  // 创建版本
  const onCreateVersion = async (tag: string = '') => {
    await createVersion({
      orgId: isAdmin ? null : orgId,
      tag,
      templateFor: isAdmin ? TemplateFor.PLATFORM : TemplateFor.OTHER_PLATFORM,
    });
    loadMaintainItemVersions();
    setCreateVersionFormVisible(false);
    message.success('创建版本成功');
  };

  const onCreateItemSubmit = () => {
    setCreateItemFormVisible(false);
    setCreateItemFormInitialValues(undefined);
    actionRef.current?.reload(true);
  };

  // 查看历史版本
  const onViewHistoryVersion = () => {
    setHistoryVersionModalVisible(true);
  };

  useMount(() => {
    if (!bizConfig.isHistory) {
      loadMaintainItemVersions();
    } else {
      loadHistoryVersionInfo();
    }
  });

  return (
    <PageContainer
      header={{
        title: bizConfig.isHistory ? `${historyVersion?.verNo}` : '保养项目',
        breadcrumbRender: () => renderBreadcrumb(),
      }}
    >
      <ProTable<ITableListItem, IQuery>
        columns={columns}
        rowKey="id"
        tableProps={{
          scroll: {
            y: tableHeight,
          },
        }}
        request={async (query) => {
          try {
            const { name, tagName, current, pageSize, templateFor } = query;
            const parsedTag = getParsedTag(tagName);
            if (bizConfig.isHistory) {
              const start =
                ((Number(current) || 1) - 1) * (Number(pageSize) || 30);
              const end = start + (Number(pageSize) || 30);
              let allItems: IMaintainItemWithVersion[];
              if (isFetchedAllHistoryItems.current) {
                allItems = allHistoryItemsRef.current;
              } else {
                const { data } = await fetchMaintainItemsWithVersion(
                  bizConfig.versionId!,
                );
                allItems = data.items;
                isFetchedAllHistoryItems.current = true;
                allHistoryItemsRef.current = data.items;
              }
              const filteredItems = allItems.filter((item) =>
                filterMaintainItem(name, parsedTag, item),
              );

              // eslint-disable-next-line consistent-return
              return {
                success: true,
                data: filteredItems.slice(start, end),
                total: filteredItems.length,
              };
            }
            const res = await fetchMaintainItems(
              {
                name,
                tagName: parsedTag,
                orgId: isAdmin
                  ? null
                  : templateFor == TemplateFor.PLATFORM
                  ? null
                  : orgId,
                templateFor: isAdmin ? TemplateFor.PLATFORM : templateFor,
              },
              Number(current),
              Number(pageSize),
            );
            // eslint-disable-next-line consistent-return
            return {
              ...res,
              success: true,
            } as any;
          } catch (error) {
            console.error(error);
            return {
              success: true,
              data: [],
              total: 0,
            };
          }
        }}
        hooks={{
          beforeInit: (query) => {
            const { tagName } = query;
            const parsedTag = getParsedTag(tagName);
            return {
              ...DefaultQuery,
              ...query,
              tagName: parsedTag,
              collapsed: false,
              templateFor: TemplateFor.OTHER_PLATFORM,
            };
          },
          beforeSubmit: (formValues) => {
            const { tagName = [] } = formValues;
            return {
              ...formValues,
              tagName: tagName?.length ? JSON.stringify(tagName) : undefined,
              current: 1,
            };
          },
          onFormValuesChange: (formChangeValue) => {
            if (formChangeValue.templateFor) {
              setTemplateForString(formChangeValue.templateFor);
              formRef.current?.setFieldsValue({
                tagName: [],
              });
            }
          },
          onReset: () => {
            formRef.current?.setFieldsValue({
              templateFor: TemplateFor.OTHER_PLATFORM,
            });
            setTemplateForString(TemplateFor.OTHER_PLATFORM);
          },
        }}
        defaultQuery={DefaultQuery}
        actionRef={actionRef}
        formRef={formRef}
        title="保养项目列表"
        toolBarRender={
          bizConfig.isHistory
            ? undefined
            : () => {
                if (bizConfig.isHistory) {
                  return [];
                }
                return [
                  <Button
                    key="button"
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={onAddItem}
                  >
                    新建
                  </Button>,
                  <Button
                    key="version"
                    onClick={() => setCreateVersionFormVisible(true)}
                  >
                    创建版本
                  </Button>,
                  <Button key="history" onClick={onViewHistoryVersion}>
                    查看历史版本
                  </Button>,
                ];
              }
        }
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              onClickOperation(record, OperationType.EDIT);
            },
          };
        }}
      />
      <CreateItemForm
        visible={createItemFormVisible}
        operation={operation}
        initialValues={createItemFormInitialValues}
        onCancel={() => {
          setCreateItemFormInitialValues(undefined);
          setCreateItemFormVisible(false);
        }}
        onSubmit={onCreateItemSubmit}
      />
      <CreateVersionForm
        visible={createVersionFormVisible}
        onSubmit={onCreateVersion}
        onCancel={() => setCreateVersionFormVisible(false)}
      />
      <HistoryVersionModal
        visible={historyVersionModalVisible}
        allHistoryVersions={allHistoryVersions}
        onCancel={() => setHistoryVersionModalVisible(false)}
      />
    </PageContainer>
  );
};

export default MaintenanceItemPage;
