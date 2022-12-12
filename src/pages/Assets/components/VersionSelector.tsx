import React, { useState } from 'react';
import { Modal } from 'antd';
import classNames from 'classnames';
import { CheckOutlined } from '@ant-design/icons';
import type { ImportVersion } from '../type';
import styles from '../index.less';

interface IComponentProps {
  visible: boolean;
  onDone: (version: ImportVersion) => void;
  onCancel: () => void;
}

const VersionSelector: React.FC<IComponentProps> = ({
  visible,
  onDone,
  onCancel,
}) => {
  const [selectedVersion, setSelectedVersion] = useState<ImportVersion>('V3');
  const onSelect = (value: ImportVersion) => {
    setSelectedVersion(value);
  };

  const onModalOk = () => {
    setSelectedVersion('V3');
    onDone(selectedVersion);
  };

  const onModalCancel = () => {
    setSelectedVersion('V3');
    onCancel();
  };

  return (
    <Modal
      title="请选择导入文件的版本"
      visible={visible}
      width={500}
      okText="下一步"
      onCancel={onModalCancel}
      onOk={onModalOk}
    >
      <div className={styles.versionOptionWrapper}>
        <div
          className={classNames(
            styles.versionOption,
            selectedVersion === 'V1' ? styles.active : '',
          )}
          onClick={() => onSelect('V1')}
        >
          旧版
          {selectedVersion === 'V1' && (
            <CheckOutlined
              style={{ position: 'absolute', right: 5, bottom: 5 }}
            />
          )}
        </div>
        <div
          className={classNames(
            styles.versionOption,
            selectedVersion === 'V3' ? styles.active : '',
          )}
          onClick={() => onSelect('V3')}
        >
          新版
          {selectedVersion === 'V3' && (
            <CheckOutlined
              style={{ position: 'absolute', right: 5, bottom: 5 }}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default VersionSelector;
