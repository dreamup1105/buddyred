import React, { useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  Row,
  Col,
  Space,
  Divider,
  Tooltip,
  Popover,
  Checkbox,
  Dropdown,
  Menu,
} from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import type { TableProps } from 'antd/es/table';
import {
  ReloadOutlined,
  SettingOutlined,
  ColumnHeightOutlined,
} from '@ant-design/icons';
import type {
  ProTableColumn,
  ActionRef,
  ActionType,
  TableOptions,
} from '../../type';
import styles from '../../index.less';

interface IComponentProps<T> {
  title: string | ReactNode | undefined;
  columns: ProTableColumn<T>[];
  actionRef: ActionRef;
  options?: TableOptions;
  tableSize?: TableProps<T>['size'];
  toolBarRender?: (() => ReactNode[] | false) | false;
  onColumnChange: (values: CheckboxValueType[]) => void;
  onDensityChange: (sizeType: TableProps<T>['size']) => void;
}

const ToolbarRender = <T extends Record<string, any>>({
  title,
  actionRef,
  columns,
  options,
  tableSize,
  toolBarRender,
  onColumnChange,
  onDensityChange,
}: IComponentProps<T>) => {
  const defaultColumnCheckedValues = useMemo(
    () =>
      columns
        .filter((col) => !col.hideInTable)
        .map((col) => col.title) as string[],
    [columns],
  );
  const toolbarColumnsCheckboxDom = useMemo(
    () =>
      columns
        .filter((col) => !col.hideInTable)
        .map((col) => (
          <div className="settingListItem" key={col.title as string}>
            <Checkbox value={col.title} key={`checkbox-${col.title}`} />
            <span className="columnName" key={`label-${col.title}`}>
              {col.title}
            </span>
          </div>
        )),
    [columns],
  );
  const settingPopoverContent = (
    <div className="settingList">
      <Checkbox.Group
        onChange={onColumnChange}
        defaultValue={defaultColumnCheckedValues}
      >
        {toolbarColumnsCheckboxDom}
      </Checkbox.Group>
    </div>
  );

  const onMenuClick = ({ key }: any) => {
    onDensityChange(key);
  };

  const densityMenus = (
    <Menu
      onClick={onMenuClick}
      style={{ width: '100px' }}
      selectedKeys={[tableSize as string]}
      defaultSelectedKeys={['default']}
    >
      <Menu.Item key="default">默认</Menu.Item>
      <Menu.Item key="middle">中等</Menu.Item>
      <Menu.Item key="small">紧凑</Menu.Item>
    </Menu>
  );

  const toolbarDom = (
    <Space size="middle">
      {options?.reload && (
        <Tooltip title="刷新">
          <ReloadOutlined
            onClick={() => (actionRef?.current as ActionType)?.reload()}
            className={styles.refreshIcon}
          />
        </Tooltip>
      )}
      {options?.density && (
        <Dropdown overlay={densityMenus}>
          <Tooltip title="密度">
            <ColumnHeightOutlined className={styles.columnIcon} />
          </Tooltip>
        </Dropdown>
      )}
      {options?.setting && (
        <Popover
          content={settingPopoverContent}
          title="列展示"
          trigger="click"
          placement="bottomLeft"
        >
          <Tooltip title="列展示">
            <SettingOutlined className={styles.columnIcon} />
          </Tooltip>
        </Popover>
      )}
    </Space>
  );

  // @ts-ignore
  if (!title && toolBarRender === false) {
    return null;
  }

  return (
    <Row className={styles.toolbar}>
      <Col span={8} className={styles.toolbarLeft}>
        {title}
      </Col>
      <Col span={16} className={styles.toolbarRight}>
        {toolBarRender === false ? null : (
          <>
            <Space>{toolBarRender?.()}</Space>
            {!!toolBarRender && <Divider type="vertical" />}
            {toolbarDom}
          </>
        )}
      </Col>
    </Row>
  );
};

export default ToolbarRender;
