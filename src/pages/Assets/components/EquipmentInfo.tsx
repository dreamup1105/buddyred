import React, { forwardRef } from 'react';
import { Descriptions, Space } from 'antd';
import QRCode from 'qrcode.react';
import moment from 'moment';
import { accMul, genEquipmentQrCode } from '@/utils/utils';
import { ResourcePath, AttachmentCategory } from '@/utils/constants';
import type {
  EquipmentDetailEx
} from '../type';
import {
  EquipmentSourceTextEnum,
  EquipmentWarrantyStatusTextEnum,
} from '../type';
import styles from '../index.less';

interface IComponentProps {
  detail: EquipmentDetailEx | undefined;
  isPrint?: boolean;
}

const footerDateContent = (
  <p style={{ textAlign: 'right', marginTop: 17 }}>
    <span style={{ fontWeight: 600 }}>打印日期：</span>
    {moment().format('YYYY-MM-DD')}
  </p>
);

export default forwardRef(
  ({ detail, isPrint = false }: IComponentProps, ref: any) => {
    const equipmentPhotots = (detail?.attachments || []).filter(
      (a) => a.category === AttachmentCategory.EQUIPMENT_PHOTO,
    );

    return (
      <div className={`${styles.equipmentInfoWrapper} ${isPrint ? 'page-break' : ''}`} ref={ref}>
        <div className={styles.titleWrapper}>
          {!!(detail?.equipment.id) && (
            <div className={styles.qrcodeWrapper}>
              <QRCode size={57} renderAs={'svg'} value={genEquipmentQrCode(detail.equipment.id)} />
            </div>
          )}
          <h1>{detail?.org?.name}</h1>
          <h4>固定资产管理信息表</h4>
        </div>
        <div className={styles.primaryWrapper}>
          <Descriptions column={2}>
            <Descriptions.Item label="设备编号">
              {detail?.equipment?.equipmentNo}
            </Descriptions.Item>
            <Descriptions.Item label="设备类型">
              {detail?.equipment?.typeName}
            </Descriptions.Item>
            <Descriptions.Item label="所属科室">
              {detail?.equipment?.departmentName}
            </Descriptions.Item>
            <Descriptions.Item label="设备负责人">
              {detail?.equipment?.srcContactPerson}
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div className={styles.tableWrapper}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="设备名称">
              {detail?.equipment?.equipNameNew}
            </Descriptions.Item>
            <Descriptions.Item label="设备厂商">
              {detail?.equipment?.manufacturerName}
            </Descriptions.Item>
            <Descriptions.Item label="设备型号">
              {detail?.equipment?.modelName}
            </Descriptions.Item>
            <Descriptions.Item label="设备序列号">
              {detail?.equipment?.sn}
            </Descriptions.Item>
            <Descriptions.Item label="所在房间" span={2}>
              {detail?.equipment?.roomNo}
            </Descriptions.Item>
            <Descriptions.Item label="首次启用日期">
              {detail?.equipment?.initialUseDate}
            </Descriptions.Item>
            <Descriptions.Item label="使用年限">
              {detail?.equipment?.usefulAge}
            </Descriptions.Item>
            <Descriptions.Item label="生产日期">
              {detail?.equipment?.productionDate}
            </Descriptions.Item>
            <Descriptions.Item label="年折旧率">
              {detail?.equipment?.depreciationRate ? `${accMul(detail.equipment.depreciationRate, 100)}%` : ''}
            </Descriptions.Item>
            <Descriptions.Item label="设备来源">
              {detail?.equipment?.obtainedBy &&
                EquipmentSourceTextEnum[detail.equipment.obtainedBy]}
            </Descriptions.Item>
            <Descriptions.Item label="设备购买日期">
              {detail?.equipment?.obtainedDate}
            </Descriptions.Item>
            <Descriptions.Item label="购买金额(元)">
              {detail?.equipment?.originWorth}
            </Descriptions.Item>
            <Descriptions.Item label="折旧后价值(元)">
              {detail?.equipment?.netWorth}
            </Descriptions.Item>
            <Descriptions.Item label="供货单位">
              {detail?.equipment?.obtainedFrom}
            </Descriptions.Item>
            <Descriptions.Item label="供货联系人">
              {detail?.equipment?.srcContactPerson}
            </Descriptions.Item>
            <Descriptions.Item label="供货电话">
              {detail?.equipment?.srcContactTel}
            </Descriptions.Item>
            <Descriptions.Item label="是否在保">
              {detail?.equipment?.warranthyStatus &&
                EquipmentWarrantyStatusTextEnum[
                  detail.equipment.warranthyStatus
                ]}
            </Descriptions.Item>
            <Descriptions.Item label="保养周期(天)">
              {detail?.equipment?.maintainPeriod}
            </Descriptions.Item>
            <Descriptions.Item label="保修结束日期">
              {detail?.equipment?.warranthyEndDate}
            </Descriptions.Item>
            {isPrint && (
              <Descriptions.Item label="设备照片">
                <Space>
                  {equipmentPhotots.map((e) => (
                    <img
                      src={`${ResourcePath}${e.res}`}
                      alt="设备图片"
                      key={e.res}
                    />
                  ))}
                </Space>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="注册证号" span={2}>
              {detail?.equipment?.registrationNumber}
            </Descriptions.Item>
          </Descriptions>
          { isPrint && footerDateContent }
        </div>
      </div>
    );
  },
);
