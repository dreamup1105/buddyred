import type { ReactNode } from 'react';
import React from 'react';
import { ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { Space, Tooltip, Divider, Popover, Checkbox, Affix } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import styles from './index.less';

interface IComponentProps {
  title: string | ReactNode; // 表格标题
  isAffix?: boolean;
  offsetTop?: number;
  operContent?: ReactNode; // 操作内容，比如 新增
  columns: any;
  onRefresh?: () => void; // 点击刷新icon时触发的函数
  onColumnChange?: (values: any) => void;
}

/**
 * 对标ProTable的操作栏
 * @param param0
 */
const TableToolbar: React.FC<IComponentProps> = ({
  title,
  isAffix = false,
  offsetTop,
  operContent,
  columns = [],
  onRefresh,
  onColumnChange,
}) => {
  const onChange = (values: CheckboxValueType[]) => {
    if (onColumnChange) {
      onColumnChange(columns.filter((col: any) => values.includes(col.title)));
    }
  };
  const defaultCheckedValues = columns.map((col: any) => col.title);
  const popoverContent = (
    <div className="settingList">
      <Checkbox.Group onChange={onChange} defaultValue={defaultCheckedValues}>
        {columns.map((col: any) => (
          <div className="settingListItem" key={col.title}>
            <Checkbox value={col.title} key={`checkbox-${col.title}`} />
            <span className="columnName" key={`label-${col.title}`}>
              {col.title}
            </span>
          </div>
        ))}
      </Checkbox.Group>
    </div>
  );
  const renderContent = () => {
    return (
      <div className={styles.tableToolbar}>
        <div className={styles.tableToolbarTitle}>{title}</div>
        <div className={styles.tableToolbarOption}>
          {operContent && <Space>{operContent}</Space>}
          {(onRefresh || onColumnChange) && <Divider type="vertical" />}
          <Space>
            {onRefresh && (
              <Tooltip title="刷新">
                <ReloadOutlined
                  onClick={() => onRefresh()}
                  className={styles.refreshIcon}
                />
              </Tooltip>
            )}
            {onColumnChange && (
              <Popover
                content={popoverContent}
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
        </div>
      </div>
    );
  };

  return isAffix ? (
    <Affix offsetTop={offsetTop || 0}>{renderContent()}</Affix>
  ) : (
    renderContent()
  );
};

export default TableToolbar;
