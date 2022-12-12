import React, { useState, useEffect, useRef } from 'react';
import { Divider, Button, message, Popconfirm } from 'antd';
import { history } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { TemplateBizTextType } from '@/pages/Dictionary/Maintenance/Editor/type';
import ProTable from '@/components/ProTable';
import type { ProTableColumn, ActionType } from '@/components/ProTable';
import TemplateSelectorModal from '@/components/SelectorModal/Template';
import { addTemplate, deleteTemplate } from '../../../service';
import type { ITemplateItem } from '@/pages/Crm/Customer/type';
import type { CustomerDetailTemplate } from '../../../type';

interface IComponentProps {
  initialData: CustomerDetailTemplate[] | undefined;
  hospitalName?: string;
}

const TemplateTab: React.FC<IComponentProps> = ({
  initialData,
  hospitalName,
}) => {
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState(false);
  const [dataSource, setDataSource] = useState<CustomerDetailTemplate[]>([]);
  const {
    location: { query },
  } = history;

  const onAddTemplate = () => {
    actionRef.current?.resetSearchForm();
    actionRef.current?.reload();
    setVisible(true);
  };

  // 添加模板确认 - 一条
  const onSelectTemplate = async (selectedItem: ITemplateItem) => {
    setVisible(false);
    if (!query?.id) {
      return;
    }
    try {
      const { code, data } = await addTemplate({
        crId: Number(query.id),
        templateIds: [selectedItem.id],
      });
      if (code === 0) {
        setDataSource((prevData) => [data[0], ...prevData]);
        message.success('添加成功');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 添加模版确认 - 多条
  const onSelectTemplateAll = async (selectedIds: number[]) => {
    if (selectedIds.length == 0) {
      message.warning('请选择模板');
      return;
    }
    if (!query?.id) {
      return;
    }
    try {
      const { code, data } = await addTemplate({
        crId: Number(query.id),
        templateIds: selectedIds,
      });
      if (code === 0) {
        const dataNew: any = data;
        setDataSource((prevData) => [...dataNew, ...prevData]);
        setVisible(false);
        message.success('添加成功');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 删除模板
  const onDelTemplate = async (record: CustomerDetailTemplate) => {
    if (!query?.id) {
      return;
    }
    try {
      const { code } = await deleteTemplate(Number(query.id), record.id);
      if (code === 0) {
        message.success('删除成功');
        setDataSource((prevData) => prevData.filter((i) => i.id !== record.id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns: ProTableColumn<CustomerDetailTemplate>[] = [
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
      hideInSearch: true,
    },
    {
      title: '类型',
      dataIndex: 'applyType',
      key: 'applyType',
      hideInSearch: true,
      render: (type) => TemplateBizTextType[type] ?? '',
    },
    {
      title: '规范版本',
      dataIndex: 'specVerNo',
      key: 'specVerNo',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <>
            <a
              onClick={() =>
                window.open(
                  `//${window.location.host}/dictionary/maintenance/template/preview?from=database&id=${record.id}&verId=${record.verId}`,
                )
              }
            >
              预览
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定要删除该条记录吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => onDelTemplate(record)}
            >
              <a>删除</a>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    if (initialData) {
      setDataSource(initialData);
    }
  }, [initialData]);

  return (
    <>
      <ProTable
        rowKey="id"
        columns={columns}
        isSyncToUrl={false}
        dataSource={dataSource}
        tableProps={{
          pagination: false,
        }}
        toolBarRender={() => {
          return [
            <Button key="create" type="primary" onClick={onAddTemplate}>
              <PlusOutlined />
              添加模板
            </Button>,
          ];
        }}
      />
      <TemplateSelectorModal
        crId={query?.id ? Number(query.id) : undefined}
        hospitalName={hospitalName}
        visible={visible}
        actionRef={actionRef}
        onCancel={() => {
          setVisible(false);
        }}
        onSelect={onSelectTemplate}
        onSelectAll={onSelectTemplateAll}
      />
    </>
  );
};

export default TemplateTab;
