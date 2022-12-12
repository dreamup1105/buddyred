import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@/components/ProTable';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import { TemplateBizType } from '@/pages/Dictionary/Maintenance/Editor/type';
import { tableHeight } from '@/utils/utils';
import { Button, Divider, message, Popconfirm, Radio } from 'antd';
import useMount from '@/hooks/useMount';
import { fetchTemplates, fetchVersions, deleteTemplate } from './service';
import type { ITableListItem } from './type';
import { OperationType } from './type';
import VersionSelect from './components/VersionSelect';
import useUserInfo from '@/hooks/useUserInfo';
import { TemplateFor } from '../type';
import type { FormInstance } from 'antd/es/form';

interface IQuery {
  current: number;
  pageSize: number;
  name: string;
  specVerNo: number | undefined;
  specVerTag: string;
  applyType: TemplateBizType | undefined;
  orgId: number | null;
  templateFor: string;
}

const DefaultQuery: IQuery = {
  current: 1,
  pageSize: 30,
  name: '',
  specVerNo: undefined,
  specVerTag: '',
  applyType: undefined,
  orgId: null,
  templateFor: TemplateFor.OTHER_PLATFORM,
};

// 保养模板
const MaintenanceTemplatePage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [versions, setVersions] = useState<{ label: string; value: number }[]>(
    [],
  );
  const [versionSelectVisible, setVersionSelectVisible] = useState(false);
  const { currentUser } = useUserInfo();
  const isAdmin = currentUser?.user.isAdmin;
  const orgId = currentUser?.org.id;

  const onClickOperation = async (
    record: ITableListItem,
    action: OperationType,
  ) => {
    switch (action) {
      case OperationType.DELETE:
        await deleteTemplate(record.id);
        message.success('删除成功');
        actionRef.current?.reload();
        break;
      case OperationType.EDIT:
        window.location.href = `//${window.location.host}/dictionary/maintenance/template/edit?id=${record.id}&specId=${record.specVerId}&verId=${record.verId}`;
        break;
      case OperationType.PREVIEW:
        window.location.href = `//${window.location.host}/dictionary/maintenance/template/preview?from=database&id=${record.id}&verId=${record.verId}`;
        break;
      default:
        break;
    }
  };

  const onAddTemplate = () => {
    setVersionSelectVisible(true);
  };

  const loadVersions = async () => {
    try {
      const { data = [] } = await fetchVersions({
        orgId: isAdmin ? null : orgId,
        templateFor: isAdmin
          ? TemplateFor.PLATFORM
          : TemplateFor.OTHER_PLATFORM,
      });
      setVersions(
        data.map((item) => ({
          label: `${item.tag ?? ''}（v${item.verNo}）`,
          value: item.id,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const columns: ProTableColumn<ITableListItem>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '保养规范版本',
      dataIndex: 'specVerTag',
    },
    {
      title: '保养规范版本号',
      dataIndex: 'specVerNo',
    },
    {
      title: '操作',
      hideInSearch: true,
      render: (_, record) => {
        if (
          !isAdmin &&
          (record.templateFor == TemplateFor.PLATFORM ||
            record.templateFor == null)
        ) {
          return [
            <a
              key="detail"
              onClick={() => onClickOperation(record, OperationType.PREVIEW)}
            >
              预览
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
          <Divider key="divider1" type="vertical" />,
          <a
            key="Preview"
            onClick={() => onClickOperation(record, OperationType.PREVIEW)}
          >
            预览
          </a>,
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

  useMount(() => {
    loadVersions();
  });

  return (
    <PageContainer>
      <ProTable<ITableListItem, IQuery>
        columns={columns}
        defaultQuery={DefaultQuery}
        rowKey="id"
        title="保养模板列表"
        actionRef={actionRef}
        formRef={formRef}
        tableProps={{
          scroll: {
            y: tableHeight,
          },
        }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={onAddTemplate}
          >
            新建模板
          </Button>,
        ]}
        request={async (query) => {
          const {
            current,
            pageSize,
            name,
            specVerNo,
            specVerTag,
            templateFor,
          } = query;
          return fetchTemplates(
            {
              name,
              specVerNo,
              specVerTag,
              orgId: isAdmin
                ? null
                : templateFor == TemplateFor.PLATFORM
                ? null
                : orgId,
              templateFor: isAdmin ? TemplateFor.PLATFORM : templateFor,
              applyType: TemplateBizType.MAINTAIN,
            },
            Number(current) || 1,
            Number(pageSize) || 30,
          );
        }}
        hooks={{
          onReset: () => {
            formRef.current?.setFieldsValue({
              templateFor: TemplateFor.OTHER_PLATFORM,
            });
          },
        }}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              onClickOperation(record, OperationType.EDIT);
            },
          };
        }}
      />
      <VersionSelect
        visible={versionSelectVisible}
        options={versions}
        onSubmit={(specId) => {
          window.location.href = `//${window.location.host}/dictionary/maintenance/template/add?specId=${specId}`;
        }}
        onCancel={() => setVersionSelectVisible(false)}
      />
    </PageContainer>
  );
};

export default MaintenanceTemplatePage;
