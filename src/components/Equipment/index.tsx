import React, {
  Fragment,
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Tag, Form, Badge, TreeSelect, Button, Input } from 'antd';
import { SelectOutlined } from '@ant-design/icons';
import ProTable from '@/components/ProTable';
import type {
  ActionType as ProTableActionType,
  ProTableColumn,
} from '@/components/ProTable';
import useMount from '@/hooks/useMount';
import useUserInfo from '@/hooks/useUserInfo';
import useDepartments from '@/hooks/useDepartments';
import useExclude from '@/pages/Assets/hooks/useExclude';
import { WithoutTimeFormat, momentToString } from '@/utils/utils';
import type { ITableListItem } from '@/pages/Assets/type';
import { EquipmentStatusEnum } from '@/pages/Assets/type';
import { fetchEquipments as fetchACLEquipments } from '@/pages/Equipment/service';
import { fetchEquipments } from '@/pages/Assets/service';
import { BizType } from './EquipmentSelect';

export interface ActionType {
  reload: () => void;
  getSelectedRows: () => ITableListItem[];
  getSelectedRowKeys: () => React.Key[];
  getSelectedRowsCount: () => number;
  getFullSelectStatus: () => boolean;
}

interface IComponentProps {
  /**
   * 查询是否受可见性控制
   */
  bizType: BizType;
  isACL?: boolean;
  multiple?: boolean;
  enableFullSelect?: boolean; // 开启全选
  currentRecord?: any;
  onSelect?: (record: ITableListItem) => void;
  onRowSelectionChange?: (selectedCount: number) => void;
}

export default forwardRef(
  (
    {
      bizType = BizType.EMPTY,
      isACL = true,
      multiple,
      enableFullSelect = false,
      currentRecord,
      onSelect,
      onRowSelectionChange,
    }: IComponentProps,
    ref,
  ) => {
    const [searchForm] = Form.useForm();
    const actionRef = useRef<ProTableActionType>();
    const { currentUser } = useUserInfo();
    const orgId = currentUser?.org.id;
    const siteOrgId = currentUser!.currentCustomer?.siteOrgId;
    const isMaintainer = currentUser?.isMaintainer;
    // 登录用户为医生时直接获取orgId，当登录用户为工程师时，需要获取当前所选择的医院的orgId
    const { departmentsTreeData, loadDepartments } = useDepartments({
      orgId: isMaintainer ? siteOrgId : orgId!,
    });
    const [selectedRows, setSelectedRows] = useState<ITableListItem[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
    const [isCurrentFullSelect, setIsCurrentFullSelect] = useState(false);
    const [
      fullSelectTotal, // 全选数量
      currentPageCache, // 当前页表格数据缓存
      excludeEquipmentKeys, // 排除的设备Id集合
      updatePageCache, // 更新当前页表格数据缓存
    ] = useExclude(isCurrentFullSelect, selectedRowKeys);

    const onFullSelect = () => {
      if (!enableFullSelect) {
        return;
      }
      setIsCurrentFullSelect(!isCurrentFullSelect);
      if (!isCurrentFullSelect) {
        setSelectedRowKeys(currentPageCache.map((item) => item.id));
      } else {
        setSelectedRowKeys([]);
      }
    };

    const columns: ProTableColumn<ITableListItem>[] = [
      {
        title: '关键字',
        dataIndex: 'q',
        key: 'q',
        hideInTable: true,
        renderFormItem: () => <Input placeholder="设备/型号/序列号/品牌" />,
      },
      {
        title: '设备自编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        align: 'center',
        width: 160,
      },
      {
        title: '科室',
        dataIndex: 'departmentName',
        key: 'departmentName',
        align: 'center',
        hideInSearch: true,
      },
      {
        title: '科室',
        dataIndex: 'departmentId',
        key: 'departmentId',
        hideInTable: true,
        hideInSearch: bizType == BizType.SIMPLE_REPAIR ? true : false,
        renderFormItem: () => (
          <TreeSelect
            multiple
            placeholder="请选择"
            treeData={departmentsTreeData}
            treeNodeFilterProp="title"
            treeDefaultExpandAll
            virtual={false}
          />
        ),
      },
      {
        title: '设备名称',
        dataIndex: 'equipNameNew',
        key: 'equipNameNew',
        align: 'center',
        width: 200,
        hideInSearch: true,
      },
      {
        title: '设备型号',
        dataIndex: 'modelName',
        key: 'modelName',
        align: 'center',
        width: 140,
        hideInSearch: true,
      },
      {
        title: '设备厂商',
        dataIndex: 'manufacturerName',
        key: 'manufacturerName',
        align: 'center',
        width: 250,
        hideInSearch: true,
      },
      {
        title: '设备序列号',
        dataIndex: 'sn',
        key: 'sn',
        align: 'center',
        width: 160,
        hideInSearch: true,
      },
      {
        title: '设备状态',
        dataIndex: 'status',
        key: 'status',
        hideInSearch: true,
        align: 'center',
        render: (status: EquipmentStatusEnum) => {
          switch (status) {
            case EquipmentStatusEnum.UNUSED:
              return <Badge status="default" text="停用" />;
            case EquipmentStatusEnum.READY:
              return <Badge status="success" text="启用中" />;
            default:
              return '';
          }
        },
      },
      {
        title: '签约状态',
        dataIndex: 'isSigned',
        key: 'isSigned',
        align: 'center',
        hideInSearch: true,
        render: (isSigned: boolean) => {
          if (isSigned) {
            return <Tag color="#87d068">已签约</Tag>;
          }
          return <Tag>未签约</Tag>;
        },
      },
      {
        title: '使用年限',
        dataIndex: 'usefulAge',
        key: 'usefulAge',
        hideInSearch: true,
        align: 'center',
        defaultSortOrder: 'descend' as DefaultSortOrder,
        sorter: (a: ITableListItem, b: ITableListItem) =>
          a.usefulAge - b.usefulAge,
      },
    ];

    const operationColumn: ProTableColumn<ITableListItem> = {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      hideInSearch: true,
      align: 'center',
      fixed: 'right',
      render: (_, record) => <a onClick={() => onSelect?.(record)}>选择</a>,
    };

    useImperativeHandle(
      ref,
      () => ({
        getSelectedRows: () => selectedRows,
        getSelectedRowKeys: () => {
          if (enableFullSelect && isCurrentFullSelect) {
            return excludeEquipmentKeys;
          }
          return selectedRowKeys;
        },
        getSelectedRowsCount: () => {
          if (enableFullSelect && isCurrentFullSelect) {
            return fullSelectTotal;
          }
          return selectedRowKeys.length;
        },
        getFullSelectStatus: () => isCurrentFullSelect,
        reload: () => {
          setSelectedRowKeys([]);
          setSelectedRows([]);
          setIsCurrentFullSelect(false);
          searchForm.resetFields();
        },
      }),
      [
        enableFullSelect,
        isCurrentFullSelect,
        excludeEquipmentKeys,
        selectedRowKeys,
        selectedRows,
      ],
    );

    useMount(() => {
      loadDepartments();
    });

    useEffect(() => {
      onRowSelectionChange?.(
        isCurrentFullSelect ? fullSelectTotal : selectedRowKeys.length,
      );
      if (currentRecord) {
        actionRef.current?.reload();
      }
    }, [isCurrentFullSelect, fullSelectTotal, selectedRowKeys, currentRecord]);

    return (
      <div>
        <ProTable<ITableListItem, any>
          rowKey="id"
          title="设备列表"
          columns={multiple ? columns : [...columns, operationColumn]}
          actionRef={actionRef}
          isSyncToUrl={false}
          rowSelection={
            multiple
              ? {
                  selectedRowKeys,
                  onChange: (keys: React.Key[], rows: ITableListItem[]) => {
                    setSelectedRowKeys(keys as number[]);
                    setSelectedRows(rows);
                  },
                  preserveSelectedRowKeys: true,
                  type: 'checkbox',
                }
              : undefined
          }
          formProps={{
            labelCol: { span: 9 },
          }}
          tableProps={{
            scroll: {
              x: 1600,
              y: 310,
            },
          }}
          request={async (formValues) => {
            try {
              const service = isACL ? fetchACLEquipments : fetchEquipments;
              const {
                q,
                equipmentNo,
                departmentId,
                usefulAge = [],
                originWorth = [],
                initialUseDate = [],
                current = 1,
                pageSize = 10,
              } = formValues;

              const formData: any = {
                q,
                equipmentNo,
                departmentId,
                usefulAge: {
                  minValue: usefulAge[0],
                  maxValue: usefulAge[1],
                },
                originWorth: {
                  minValue: originWorth[0],
                  maxValue: originWorth[1],
                },
                initialUseDate: {
                  minValue:
                    initialUseDate[0] &&
                    momentToString(initialUseDate[0], WithoutTimeFormat),
                  maxValue:
                    initialUseDate[1] &&
                    momentToString(initialUseDate[1], WithoutTimeFormat),
                },
              };

              if (currentUser?.isMaintainer) {
                formData.crId = currentUser!.currentCustomer?.id;
              } else {
                formData.orgId = orgId!;
              }

              if (
                bizType !== BizType.EMPTY &&
                bizType !== BizType.SIMPLE_REPAIR
              ) {
                formData.agreeType = bizType;
              }
              if (bizType == BizType.SIMPLE_REPAIR) {
                formData.departmentId = [currentRecord.departmentId];
              }

              return service(formData, current, pageSize);
            } catch (error) {
              console.error(error);
              return {
                success: false,
              };
            }
          }}
          hooks={{
            onLoad: (equipments, total) => {
              updatePageCache(equipments, total);
              if (isCurrentFullSelect) {
                setSelectedRowKeys(
                  equipments
                    .map((item) => item.id)
                    .filter((id) => !excludeEquipmentKeys.has(id)),
                );
              }
            },
          }}
          toolBarRender={() => [
            <Fragment key="fragment">
              {enableFullSelect && (
                <>
                  {isCurrentFullSelect && (
                    <span style={{ color: 'red' }}>
                      全量选择：该机构下的所有设备
                    </span>
                  )}
                  <Button type="primary" onClick={() => onFullSelect()}>
                    <SelectOutlined />
                    {isCurrentFullSelect ? '取消全量选择' : '全量选择'}
                  </Button>
                </>
              )}
            </Fragment>,
          ]}
        />
      </div>
    );
  },
);
