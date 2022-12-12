import React, { useState } from 'react';
import { Modal, Button, Descriptions, Table } from 'antd';
import QRCode from 'qrcode.react';
import { genCheckEquipmentCode } from '@/utils/utils';
import PrintContainer from '@/components/PrintContainer';
import usePrint from '@/hooks/usePrint';
import styles from '../index.less';
import type { ITableListItem, detectTooleItem } from '../type';

interface IModalProps {
  visible: boolean;
  itemType?: any;
  detail?: ITableListItem;
  onCancel: () => void;
}

const DetailDodal: React.FC<IModalProps> = ({
  visible = false,
  itemType = {},
  detail = {},
  onCancel,
}) => {
  const [btnAuditLoading, setBtnAuditLoading] = useState<boolean>(false);
  const {
    componentRef: reportPrintComponentRef,
    onPrint: onReportPrintDetails,
  } = usePrint();

  // 打印报告
  const onReportPrint = async () => {
    setBtnAuditLoading(true);
    onReportPrintDetails();
    setBtnAuditLoading(false);
  };

  const {
    componentRef: detailPrintComponentRef,
    onPrint: onBatchPrintDetails,
  } = usePrint();

  // 打印二维码
  const onModalPrint = async () => {
    setBtnAuditLoading(true);
    onBatchPrintDetails();
    setBtnAuditLoading(false);
  };

  // 取消
  const onModalCancel = () => {
    onCancel();
  };

  const recordColumns = [
    {
      title: '检测项',
      dataIndex: 'detectionItem',
      key: 'detectionItem',
      render: (_: any, record: any) => {
        return (
          <span>
            {itemType[record.detectionItem]}{' '}
            {record.detectionSubtitle
              ? '(' + record.detectionSubtitle + ')'
              : ''}
          </span>
        );
      },
    },
    {
      title: '检测结果',
      dataIndex: 'detectRes',
      key: 'detectRes',
      width: 120,
      render: (_: any, record: any) => {
        const detectResList: any = [];
        if (typeof record.detectRes == 'object') {
          for (const key in record.detectRes) {
            detectResList.push({
              label: key,
              value: record.detectRes[key],
            });
          }
        }
        return record.detectRes
          ? typeof record.detectRes == 'object'
            ? detectResList.map((detectItem: any) => (
                <div key={detectItem.label}>
                  {detectItem.label}: {detectItem.value}
                </div>
              ))
            : record.detectRes
          : '-';
      },
    },
    {
      title: '判定标准',
      dataIndex: 'requirements',
      key: 'requirements',
      onCell: (record: any) => ({
        colSpan: record.isAsk == 1 ? 1 : 3,
      }),
      render: (_: any, record: any) => {
        return record.isAsk == 1 ? (
          record.requirements
        ) : (
          <div style={{ textAlign: 'center' }}>不具备检测条件</div>
        );
      },
    },
    {
      title: '单项判定',
      dataIndex: 'decision',
      key: 'decision',
      width: 140,
      onCell: (record: any) => ({
        colSpan: record.isAsk == 1 ? 3 : 0,
      }),
      render: (_: any, record: any) => {
        return record.isAsk == 1 ? record.decision : '不具备检测条件';
      },
    },
  ];

  const baseDetail = () => {
    return (
      <>
        <div className={styles.titleWrapper}>
          {!!detail?.securityCode && (
            <div className={styles.qrcodeWrapper}>
              <QRCode
                size={57}
                renderAs={'svg'}
                value={genCheckEquipmentCode(detail.securityCode)}
              />
            </div>
          )}
          <h1>{detail?.title}</h1>
          <h4>设备检测报告</h4>
        </div>
        <div>
          <Descriptions
            bordered
            column={2}
            labelStyle={{ minWidth: '140px', padding: '16px 12px' }}
            contentStyle={{ minWidth: '180px' }}
          >
            <Descriptions.Item label="委托单位">
              {detail?.basicInfo?.entrustCompany}
            </Descriptions.Item>
            <Descriptions.Item label="受检单位">
              {detail?.basicInfo?.hospital}
            </Descriptions.Item>
            <Descriptions.Item label="地址">
              {detail?.basicInfo?.address}
            </Descriptions.Item>
            <Descriptions.Item label="检测类型">
              {detail?.basicInfo?.checkType}
            </Descriptions.Item>
            <Descriptions.Item label="检测类别">
              {detail?.basicInfo?.checkCategory}
            </Descriptions.Item>
            <Descriptions.Item label="检测项目">
              {detail?.basicInfo?.checkItem}
            </Descriptions.Item>
            <Descriptions.Item label="设备名称">
              {detail?.basicInfo?.eqName}
            </Descriptions.Item>
            <Descriptions.Item label="设备型号">
              {detail?.basicInfo?.eqVersion}
            </Descriptions.Item>
            <Descriptions.Item label="受检台数">
              {detail?.basicInfo?.eqNumber}
            </Descriptions.Item>
            <Descriptions.Item label="生产厂家">
              {detail?.basicInfo?.manufacturer}
            </Descriptions.Item>
            <Descriptions.Item label="额定容量">
              {detail?.basicInfo?.ratedCapacity}
            </Descriptions.Item>
            <Descriptions.Item label="出厂编号">
              {detail?.basicInfo?.manufacturingNo}
            </Descriptions.Item>
            <Descriptions.Item label="安装日期">
              {detail?.basicInfo?.fixTime}
            </Descriptions.Item>
            <Descriptions.Item label="陪同人员确认签字">
              {detail?.basicInfo?.escortPerson}
            </Descriptions.Item>
            <Descriptions.Item label="联系电话">
              {detail?.basicInfo?.phoneNumber}
            </Descriptions.Item>
            <Descriptions.Item label="依据标准" span={2}>
              {detail?.basicInfo?.accordingWork}
            </Descriptions.Item>
            <Descriptions.Item label="检测工具" span={2}>
              {detail?.tools?.map((item: detectTooleItem) => (
                <div key={item.id}>
                  {item.version}
                  <span style={{ marginRight: '10px' }} />
                  {item.name}
                  <span style={{ marginRight: '10px' }} />
                  {item.number}
                </div>
              ))}
            </Descriptions.Item>
          </Descriptions>
          <Table
            rowKey="id"
            style={{ marginTop: '20px' }}
            dataSource={detail?.records}
            columns={recordColumns}
            bordered
            pagination={false}
          />
        </div>
      </>
    );
  };

  return (
    <>
      <Modal
        title={`设备检测报告`}
        visible={visible}
        width="800px"
        bodyStyle={{ height: 600, overflow: 'auto' }}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={onModalCancel}
        footer={
          <>
            <Button
              type="primary"
              loading={btnAuditLoading}
              onClick={() => onReportPrint()}
            >
              打印报告
            </Button>
            <Button
              type="primary"
              loading={btnAuditLoading}
              onClick={() => onModalPrint()}
            >
              打印二维码
            </Button>

            <Button onClick={onModalCancel}>取消</Button>
          </>
        }
      >
        {baseDetail()}
      </Modal>
      <PrintContainer>
        <div ref={reportPrintComponentRef} className={styles.reportPrint}>
          {baseDetail()}
        </div>
      </PrintContainer>
      <PrintContainer>
        <div ref={detailPrintComponentRef} className={styles.QRCode}>
          <QRCode
            size={100}
            renderAs={'svg'}
            value={genCheckEquipmentCode(detail.securityCode)}
          />
          <div>{detail?.basicInfo?.eqName}</div>
        </div>
      </PrintContainer>
    </>
  );
};

export default DetailDodal;
