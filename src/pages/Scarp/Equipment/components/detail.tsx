import React from 'react';
import { Descriptions, Modal, Button, Image } from 'antd';
import styles from '../index.less';
import type { ScarpDetailItem } from '../type';
import { ScarpStatusEnum } from '../type';
import { ResourcePath } from '@/utils/constants';

interface ScarpDetailProps {
  detail: ScarpDetailItem | any;
  visible: boolean;
  onCancel: () => void;
}

const ScarpDetailModal: React.FC<ScarpDetailProps> = ({
  detail,
  visible,
  onCancel,
}) => {
  const itemConfig = ScarpStatusEnum.get(detail.scrapStatus);
  const fileList = detail.simpleAttachmentInfoList || [];
  return (
    <>
      <Modal
        title={`设备报废单`}
        visible={visible}
        width="1000px"
        onCancel={onCancel}
        bodyStyle={{ height: 650, overflow: 'auto' }}
        footer={
          <>
            <Button onClick={onCancel}>关闭</Button>
          </>
        }
      >
        <h1 className={styles.scarpTitle}>设备报废单</h1>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="单据编号">
            {detail.orderNo}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            {itemConfig?.label}
          </Descriptions.Item>
          <Descriptions.Item label="申请时间">
            {detail.reportTime}
          </Descriptions.Item>
          <Descriptions.Item label="申请人">
            {detail.reportPersonName}
          </Descriptions.Item>
          <Descriptions.Item label="所属科室">
            {detail.equipmentDeptName}
          </Descriptions.Item>
          <Descriptions.Item label="设备类型">
            {detail.eqType}
          </Descriptions.Item>
          <Descriptions.Item label="设备厂商">
            {detail.eqVendor}
          </Descriptions.Item>
          <Descriptions.Item label="设备名称">
            {detail.equipmentName}
          </Descriptions.Item>
          <Descriptions.Item label="设备型号">
            {detail.eqModel}
          </Descriptions.Item>
          <Descriptions.Item label="设备编号">{detail.eqNo}</Descriptions.Item>
          <Descriptions.Item label="维修次数">
            {detail.repairTimes}
          </Descriptions.Item>
          <Descriptions.Item label="维修费用">
            ¥{detail.repairCost}
          </Descriptions.Item>
          <Descriptions.Item label="保养次数">
            {detail.maintainTimes}
          </Descriptions.Item>
          <Descriptions.Item label="保养总费用">--</Descriptions.Item>
          <Descriptions.Item label="换配件数量">
            {detail.partCount}
          </Descriptions.Item>
          <Descriptions.Item label="配件总金额">
            ¥{detail.partCost}
          </Descriptions.Item>
          <Descriptions.Item label="报废原因" span={2}>
            {detail.scrapReason}
          </Descriptions.Item>
          <Descriptions.Item label="技术人员鉴定意见" span={2}>
            {detail.identifyAdvice}
          </Descriptions.Item>
          <Descriptions.Item label="附件" span={2}>
            <Image.PreviewGroup>
              {fileList.map((item: any) => (
                <span className={styles.detailImage} key={item.res}>
                  <Image width={100} src={`${ResourcePath}${item.res}`} />
                </span>
              ))}
            </Image.PreviewGroup>
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default ScarpDetailModal;
