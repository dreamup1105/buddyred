import React, { useState, useEffect, Fragment } from 'react';
import useUnmount from '@/hooks/useUnmount';
import { Modal, Result, Divider } from 'antd';
import { useInterval } from 'ahooks';
import { history } from 'umi';
import { PageType } from '../type';

interface IComponentProps {
  visible: boolean;
  pageType: PageType;
  onCancel: () => void;
  onContinue: () => void;
}

const BizTextMap = new Map([
  [
    PageType.MAINTENANCE,
    {
      redirectUrl: '/maintenance',
      title: '保养单已经发布',
      actionText: '继续发起保养',
    },
  ],
  [
    PageType.REPAIR,
    {
      redirectUrl: '/repair/management',
      title: '维修单已经发布',
      actionText: '继续报修',
    },
  ],
  [
    PageType.SIMPLE_REPAIR,
    {
      redirectUrl: '/repair/management',
      title: '现场确认后请前往固定资产-设备管理功能维护完整信息或者合并信息',
      actionText: '完善信息',
    },
  ],
]);

const MaintenanceResult: React.FC<IComponentProps> = ({
  visible,
  pageType = PageType.MAINTENANCE,
  onCancel,
  onContinue,
}) => {
  const [count, setCount] = useState(8);
  const [interval, setInterval] = useState<number | null>(1000);
  const currentConfig = BizTextMap.get(pageType)!;

  const goBack = () => {
    history.replace(currentConfig.redirectUrl);
  };

  const clear = () => setInterval(null);

  const handleContinue = () => {
    clear();
    onContinue();
  };

  const onModalCancel = () => {
    clear();
    onCancel();
  };

  useEffect(() => {
    if (visible) {
      setInterval(1000);
    } else {
      clear();
    }
  }, [visible]);

  useInterval(() => {
    if (count === 0) {
      goBack();
      return;
    }
    setCount(count - 1);
  }, interval);

  useUnmount(() => {
    clear();
  });

  return (
    <Modal visible={visible} onCancel={onModalCancel} footer={null}>
      <Result
        status="success"
        title={currentConfig.title}
        subTitle={`${count !== 0 ? '0' : ''}${count}秒后返回`}
        extra={[
          <Fragment key="extra">
            <a key="goon" onClick={handleContinue} style={{ color: '#000' }}>
              {currentConfig.actionText}
            </a>
            <Divider key="divider1" type="vertical" />
            <a key="back" onClick={goBack}>
              返回
            </a>
          </Fragment>,
        ]}
      />
    </Modal>
  );
};

export default MaintenanceResult;
