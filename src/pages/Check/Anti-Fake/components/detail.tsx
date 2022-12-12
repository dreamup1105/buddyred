import React, { useRef, useState } from 'react';
import { Modal, Button, Upload, Descriptions } from 'antd';
import { UploadHost } from '@/services/qiniu';
import QRCode from 'qrcode.react';
import type { UploadFile } from 'antd/es/upload/interface';
import { getBase64 } from '@/utils/utils';
import usePreview from '@/hooks/usePreview';
import Preview from '@/components/Preview';
import { genAntiFakeQrCode } from '@/utils/utils';
// import type { ITableListItem } from '../type';
import PrintContainer from '@/components/PrintContainer';
import usePrint from '@/hooks/usePrint';
import styles from '../index.less';

interface IModalProps {
  visible: boolean;
  detail: any;
  onCancel: () => void;
}

const DetailDodal: React.FC<IModalProps> = ({
  visible = false,
  detail = {},
  onCancel,
}) => {
  const uploadRef = useRef();
  const [btnAuditLoading, setBtnAuditLoading] = useState<boolean>(false);
  const {
    componentRef: detailPrintComponentRef,
    onPrint: onBatchPrintDetails,
  } = usePrint();
  const [
    previewImages,
    previewModalVisible,
    defaultPhotoIndex,
    updatePreviewImages,
    showPreviewModal,
    onClosePreview,
  ] = usePreview();

  const onPreview = async (file: UploadFile) => {
    if (file.type?.indexOf('image') != -1) {
      if (!file.url && !file.preview) {
        // eslint-disable-next-line no-param-reassign
        file.preview = (await getBase64(file.originFileObj as File)) as string;
      }
      const uploadCurrent: any = uploadRef.current;
      const currentFileList = uploadCurrent.fileList.filter(
        (item: any) => item.type?.indexOf('image') != -1,
      );
      if (currentFileList?.length) {
        updatePreviewImages(currentFileList, file);
      }
      showPreviewModal();
    } else {
      window.open(file.url + '?attname=' + file.name, '_blank');
    }
  };

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

  return (
    <>
      <Modal
        title={`防伪信息`}
        visible={visible}
        width="800px"
        maskClosable={false}
        destroyOnClose={true}
        onCancel={onModalCancel}
        footer={
          <>
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
        <div className={styles.titleWrapper}>
          {!!detail?.securityCode && (
            <div className={styles.qrcodeWrapper}>
              <QRCode
                size={57}
                renderAs={'svg'}
                value={genAntiFakeQrCode(detail.securityCode)}
              />
            </div>
          )}
          <h1>{detail?.orgName}</h1>
          <h4>检测防伪信息表</h4>
        </div>
        <div>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="名称">
              {detail?.reportTitle}
            </Descriptions.Item>
            <Descriptions.Item label="检测人">
              {detail?.detectPerson}
            </Descriptions.Item>
            <Descriptions.Item label="检测工具">
              {detail?.detectTool}
            </Descriptions.Item>
            <Descriptions.Item label="检测时间">
              {detail?.detectTime}
            </Descriptions.Item>
            <Descriptions.Item label="送检医院">
              {detail?.hospitalName}
            </Descriptions.Item>
            <Descriptions.Item label="送检设备">
              {detail?.detectEquipment}
            </Descriptions.Item>
            <Descriptions.Item label="报告上传时间" span={2}>
              {detail?.importReportTime}
            </Descriptions.Item>
            <Descriptions.Item label="检测报告" span={2}>
              <Upload
                disabled
                ref={uploadRef}
                action={UploadHost}
                listType="picture-card"
                onPreview={onPreview}
                fileList={detail?.simpleAttachmentInfoList}
              />
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Modal>
      <Preview
        defaultIndex={defaultPhotoIndex}
        images={previewImages}
        visible={previewModalVisible}
        onClose={onClosePreview}
      />
      <PrintContainer>
        <div ref={detailPrintComponentRef} className={styles.QRCode}>
          <QRCode
            size={100}
            renderAs={'svg'}
            value={genAntiFakeQrCode(detail.securityCode)}
          />
          <div>{detail?.orgName}</div>
        </div>
      </PrintContainer>
    </>
  );
};

export default DetailDodal;
