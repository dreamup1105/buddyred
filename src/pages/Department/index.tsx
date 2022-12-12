import React, { useState, useMemo } from 'react';
import { Space, Table, message, Popconfirm, Button, Divider } from 'antd';
import { useModel } from 'umi';
import useMount from '@/hooks/useMount';
import { PageContainer } from '@ant-design/pro-layout';
import { fetchEmployees } from '@/pages/Employee/service';
import type { EmployeeItem } from '@/pages/Employee/type';
import { buildTree, highlightRowClassName } from '@/utils/utils';
import TableToolbar from '@/components/TableToolbar';
import { PlusOutlined } from '@ant-design/icons';
import type { ITableListItem, DepartmentDetail } from './type';
import { OperationType } from './type';
import CreateDeptForm from './components/CreateDeptForm';
import { fetchDepartments, fetchDepartment, delDepartment } from './service';

/**
 * 从当前部门节点向上递归寻找父级节点
 * @param currentDepartments 当前已存在的部门树
 * @param currentId 当前部门节点id
 */
const findParentPath = (
  currentDepartments: ITableListItem[],
  currentRecord: ITableListItem,
): ITableListItem[] => {
  const temp: ITableListItem[] = [];
  const currentId = currentRecord.id;
  const walkDeptTrees = (parentDepartments: ITableListItem[], id: number) => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < parentDepartments.length; i++) {
      const item = parentDepartments[i];
      if (item.id === id) {
        temp.push(item);
        walkDeptTrees(currentDepartments, item.parentDepartmentId);
        break;
      } else if (item.children) {
        walkDeptTrees(item.children, id);
      }
    }
  };
  walkDeptTrees(currentDepartments, currentId);
  return temp;
};

/**
 *
 * @param trees
 * @param id
 * @param currentOperation
 * @param newDepartment
 * @param subDepartments
 */
const walkDepartments = (
  trees: ITableListItem[],
  id: number,
  currentOperation: OperationType,
  newDepartment: DepartmentDetail | ITableListItem,
  subDepartments?: DepartmentDetail[],
): ITableListItem[] => {
  return trees.map((t) => {
    if (t.id === id) {
      switch (currentOperation) {
        case OperationType.EDIT:
          return {
            ...t,
            ...newDepartment,
          };
        case OperationType.DELETE:
          // eslint-disable-next-line no-case-declarations
          const newChilds = t!.children!.filter(
            (c) => c.id !== newDepartment.id,
          );
          return {
            ...t,
            children: newChilds.length ? newChilds : null,
          };
        case OperationType.EXPAND:
          return {
            ...t,
            children: subDepartments!.map((i: DepartmentDetail) => ({
              ...i,
              children: i.childrenNumber ? [] : null,
            })),
          };
        default:
          return {
            ...t,
            children: t.children
              ? [...t.children, newDepartment]
              : [newDepartment],
          };
      }
    }
    if (t.children) {
      return {
        ...t,
        children: walkDepartments(
          t.children,
          id,
          currentOperation,
          newDepartment,
          subDepartments,
        ),
      };
    }
    return t;
  });
};

const DepartmentPage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [departments, setDepartments] = useState<ITableListItem[]>([]);
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<
    ITableListItem | undefined
  >();
  const [createDeptFormVisible, setCreateDeptFormVisible] =
    useState<boolean>(false);
  const [operation, setOperation] = useState<OperationType>(OperationType.NOOP);
  const [createDeptFormInitialValues, setCreateDeptFormInitialValues] =
    useState<DepartmentDetail>();
  const orgId = initialState!.currentUser?.org.id;
  const deptParentsPath = useMemo(() => {
    if (!currentRecord) {
      return '无';
    }
    const paths = findParentPath(departments, currentRecord).reverse();

    switch (operation) {
      case OperationType.CREATE_SUB:
        return paths.map((i) => i.name).join('/');
      case OperationType.EDIT:
      case OperationType.CREATE_SIBLING:
        return paths.length === 1
          ? '无'
          : paths
              .slice(0, paths.length - 1)
              .map((i) => i.name)
              .join('/');

      default:
        return '';
    }
  }, [departments, currentRecord, currentRecord?.id, operation]);

  /**
   * 获取部门树
   * @param record
   */
  const loadOrgStructureTree = async () =>
    // record?: ITableListItem,
    // currentOperation?: Operation,
    {
      if (loading) {
        return;
      }
      setLoading(true);
      try {
        // // 取子级数据
        // if (record) {
        //   const { data } = await fetchDepartments({
        //     parentDepartmentId: record.id,
        //   });
        //   setDepartments((prevDepartments) =>
        //     walkDepartments(
        //       prevDepartments,
        //       record.id,
        //       currentOperation!,
        //       record,
        //       data,
        //     ),
        //   );
        // } else {
        //   // 取根级数据
        //   const { data } = await fetchDepartments({ orgId }, false);
        //   setDepartments(buildTree(data, null, 'parentDepartmentId'));
        // }
        const { data } = await fetchDepartments({ orgId }, false);
        setDepartments(buildTree(data, null, 'parentDepartmentId'));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  /**
   * 获取部门详情信息
   */
  const loadDepartmentDetail = async (record?: ITableListItem) => {
    try {
      const id = record ? record.id : currentRecord!.id;
      const { data } = await fetchDepartment(id);
      setCreateDeptFormInitialValues(data);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 获取主管列表
   */
  const loadEmployeeList = async (record?: ITableListItem) => {
    try {
      const params = record ? { orgId: record.orgId } : { orgId };
      const { data } = await fetchEmployees(params);
      setEmployees(data);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 删除部门
   */
  const onDelDepartment = async (record: ITableListItem) => {
    try {
      if (record.children && record.children.length) {
        message.error('不能直接删除父级部门，请从子级部门开始删除');
        return;
      }

      setOperation(OperationType.DELETE);
      await delDepartment(record.id);
      message.success('删除成功');

      const paths = findParentPath(departments, record!);

      if (paths.length === 1) {
        setDepartments((prevDepartments) =>
          prevDepartments.filter((d) => d.id !== record!.id),
        );
      } else {
        setDepartments(
          walkDepartments(
            departments,
            paths[1].id,
            OperationType.DELETE,
            record,
          ),
        );
      }

      setCurrentRecord(undefined);
    } catch (error) {
      message.error('删除失败');
      console.error(error);
    }
  };

  const onClickOperation = (
    record: ITableListItem | undefined,
    action: OperationType,
  ) => {
    setOperation(action);
    switch (action) {
      case OperationType.CREATE_SUB: // 新增下级部门
        if (!record) {
          message.warning('请选择相应父级部门');
          return;
        }
        loadDepartmentDetail(record);
        loadEmployeeList(record);
        setCreateDeptFormVisible(true);
        break;

      case OperationType.CREATE_SIBLING: // 创建同级部门
        if (record) {
          loadDepartmentDetail(record);
        }
        loadEmployeeList(record);
        setCreateDeptFormVisible(true);
        break;

      case OperationType.EDIT: // 编辑
        loadDepartmentDetail(record);
        loadEmployeeList(record);
        setCreateDeptFormVisible(true);
        break;

      case OperationType.DELETE: // 删除
        onDelDepartment(record!);
        break;

      default:
        break;
    }
  };

  const onTableClick = (record: ITableListItem) => {
    setCurrentRecord(record);
  };

  const onTableDoubleClick = () => {
    onClickOperation(currentRecord, OperationType.EDIT);
  };

  /**
   * 部门操作表单成功后的回调
   * @param newDepartment 新增/修改后的部门对象
   * @param currentOperation 当前正在进行的操作
   */
  const onSubmitCreateDeptForm = (
    newDepartment: DepartmentDetail,
    currentOperation: OperationType,
  ) => {
    switch (currentOperation) {
      case OperationType.CREATE_SIBLING:
        if (!currentRecord || currentRecord?.parentDepartmentId === null) {
          // 在顶级部门
          setDepartments((prevDepartments) => {
            return [...prevDepartments, newDepartment];
          });
        } else {
          // 非顶级部门
          setDepartments((prevDepartments) =>
            walkDepartments(
              prevDepartments,
              currentRecord!.parentDepartmentId,
              currentOperation,
              newDepartment,
            ),
          );
        }
        break;

      case OperationType.EDIT:
      case OperationType.CREATE_SUB:
        setDepartments((prevDepartments) =>
          walkDepartments(
            prevDepartments,
            currentRecord!.id,
            currentOperation,
            newDepartment,
          ),
        );
        break;

      default:
        break;
    }

    setCreateDeptFormVisible(false);
    setCreateDeptFormInitialValues(undefined);
  };

  const onCancelCreateDeptForm = () => {
    setCreateDeptFormVisible(false);
    setCreateDeptFormInitialValues(undefined);
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '部门编号',
      dataIndex: 'departmentNo',
      key: 'departmentNo',
    },
    {
      title: '主管',
      dataIndex: 'leaderName',
      key: 'leaderName',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '操作',
      render: (_: string, record: ITableListItem) => {
        return (
          <>
            <a onClick={() => onClickOperation(record, OperationType.EDIT)}>
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定要删除该条记录吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => onDelDepartment(record)}
            >
              <a>删除</a>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const operContent = (
    <Space>
      <Button
        type="primary"
        onClick={() =>
          onClickOperation(currentRecord, OperationType.CREATE_SIBLING)
        }
      >
        <PlusOutlined />
        新增同级部门
      </Button>
      <Button
        type="primary"
        disabled={Boolean(!currentRecord)}
        onClick={() =>
          onClickOperation(currentRecord, OperationType.CREATE_SUB)
        }
      >
        <PlusOutlined />
        新增子级部门
      </Button>
    </Space>
  );

  useMount(() => {
    loadOrgStructureTree();
  });

  return (
    <PageContainer>
      <TableToolbar
        isAffix
        offsetTop={0}
        title="组织架构列表"
        columns={columns}
        operContent={operContent}
      />
      <Table<ITableListItem>
        rowKey="id"
        columns={columns}
        dataSource={departments}
        loading={loading}
        pagination={false}
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
        rowClassName={(record) =>
          highlightRowClassName(record.id, currentRecord?.id)
        }
      />
      <CreateDeptForm
        orgId={orgId}
        operation={operation}
        visible={createDeptFormVisible}
        deptParentsPath={deptParentsPath}
        initialValues={createDeptFormInitialValues}
        employees={employees}
        onSubmit={onSubmitCreateDeptForm}
        onCancel={onCancelCreateDeptForm}
      />
    </PageContainer>
  );
};

export default DepartmentPage;
