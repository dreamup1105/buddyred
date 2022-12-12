import React, { useCallback, useRef, useState } from 'react';
import { Descriptions, Modal, Button, Input, Tag, Upload, message } from 'antd';
import useSubAuthorities from '@/hooks/useSubAuthorities';
import useUserInfo from '@/hooks/useUserInfo';
import styles from '../index.less';
import type { ScarpDetailItem } from '../type';
import { ScarpStatus, ScarpStatusEnum } from '../type';
import { UploadHost } from '@/services/qiniu';
import useUploadHook from '@/hooks/useUploadHook';
import type { UploadFile } from 'antd/es/upload/interface';
import { getBase64 } from '@/utils/utils';
import { useModel } from 'umi';
import usePreview from '@/hooks/usePreview';
import Preview from '@/components/Preview';
import { PlusOutlined } from '@ant-design/icons';
const { TextArea } = Input;

interface ScarpDetailProps {
  title?: string;
  detail: ScarpDetailItem | any;
  visible: boolean;
  type?: string; //查看类型  DETAIL ADD EDIT AUDIT
  onCancel: () => void; // 关闭
  onSubmit: (type: string, detail: any) => void;
}

const ScarpDetailModal: React.FC<ScarpDetailProps> = ({
  title = '新增',
  detail = {},
  visible,
  type = ScarpStatus.INIT,
  onCancel,
  onSubmit,
}) => {
  const uploadRef = useRef();
  const { initialState } = useModel('@@initialState');
  const { token, loadToken } = useUploadHook();
  const userId = initialState?.currentUser?.user.id;
  const { currentUser } = useUserInfo();
  const employeeId = currentUser?.employee.id;
  const subAuthorities = useSubAuthorities();
  const [loading, setLoading] = useState(false);
  const [
    previewImages,
    previewModalVisible,
    defaultPhotoIndex,
    updatePreviewImages,
    showPreviewModal,
    onClosePreview,
  ] = usePreview();
  // 报废原因
  const scrapReasonChange = (e: any) => {
    detail.scrapReason = e.target.value;
  };
  // 技术人员鉴定意见
  const identifyAdviceChange = (e: any) => {
    detail.identifyAdvice = e.target.value;
  };
  const itemConfig = ScarpStatusEnum.get(detail.scrapStatus);

  const beforeUpload = async (file: File): Promise<any> => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能大于5M');
      return Upload.LIST_IGNORE;
    }
    // 在上传的过程中判断文件类型是否是图片格式
    if (
      file.type.indexOf('image/png') == 0 ||
      file.type.indexOf('image/jpeg') == 0 ||
      file.type.indexOf('image/jpg') == 0
    ) {
    } else {
      message.error('只能上传.png/.jpg/.jpeg格式的图片');
      return Upload.LIST_IGNORE;
    }
    await loadToken();
    return true;
  };

  const getExtraData = useCallback(
    (file: UploadFile) => {
      return {
        token,
        key: `${Date.now()}-${file.uid}-${userId}`,
      };
    },
    [token],
  );

  const onFileChange = ({ file }: any) => {
    if (file.status === 'error') {
      message.error('图片上传失败');
    }
  };

  const onPreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      // eslint-disable-next-line no-param-reassign
      file.preview = (await getBase64(file.originFileObj as File)) as string;
    }
    const uploadCurrent: any = uploadRef.current;
    const currentFileList: any = uploadCurrent.fileList;
    if (currentFileList?.length) {
      updatePreviewImages(currentFileList, file);
    }
    showPreviewModal();
  };

  const onConfirm = async (status: string) => {
    setLoading(true);
    const uploadCurrent: any = uploadRef.current;
    const attachmentList: any = uploadCurrent.fileList;
    detail.simpleAttachmentInfoList = attachmentList.map((item: any) => {
      return {
        category: 'EQUIPMENT_SCRAP_PHOTO',
        contentLength: item.size,
        contentType: item.type,
        fileName: item.name,
        res: item.response?.data?.key || item.uid,
      };
    });
    detail.scrapStatus = status;
    // detail.attachmentFileList = null;
    delete detail.attachmentFileList;
    await onSubmit(status, detail);
    setLoading(false);
  };

  return (
    <>
      <Modal
        title={`设备报废单-${title}`}
        visible={visible}
        width="1000px"
        maskClosable={false}
        destroyOnClose={true}
        onCancel={onCancel}
        bodyStyle={{ height: 650, overflow: 'auto' }}
        footer={
          <>
            {type == ScarpStatus.INIT && (
              <Button
                type="primary"
                loading={loading}
                onClick={() => onConfirm(ScarpStatus.INIT)}
              >
                草稿
              </Button>
            )}
            {type == ScarpStatus.INIT && (
              <Button
                type="primary"
                loading={loading}
                onClick={() => onConfirm(ScarpStatus.REPORTING)}
              >
                保存
              </Button>
            )}
            {subAuthorities?.includes('AUDIT') &&
              type == ScarpStatus.REPORTING && (
                <Button
                  type="primary"
                  loading={loading}
                  onClick={() => onConfirm(ScarpStatus.PASS)}
                >
                  通过
                </Button>
              )}
            {subAuthorities?.includes('AUDIT') &&
              type == ScarpStatus.REPORTING && (
                <Button
                  type="primary"
                  danger
                  loading={loading}
                  onClick={() => onConfirm(ScarpStatus.REJECT)}
                >
                  驳回
                </Button>
              )}
            {/* 撤销申请按钮，新建设备的时候不显示，只有申请人才有撤销功能,只有在草稿状态和审核状态才能撤销 */}
            {(type == ScarpStatus.INIT || type == ScarpStatus.REPORTING) &&
              detail.orderNo &&
              employeeId == detail.reportPerson && (
                <Button
                  type="primary"
                  danger
                  loading={loading}
                  onClick={() => onConfirm('CANCEL')}
                >
                  撤销申请
                </Button>
              )}
            <Button onClick={onCancel}>关闭</Button>
          </>
        }
      >
        <h1 className={styles.scarpTitle}>设备报废单</h1>
        {/* 通过 detail.orderNo 判断是编辑还是新增设备 */}
        <Descriptions bordered column={2} size="small">
          {detail.orderNo && (
            <>
              <Descriptions.Item label="单据编号">
                {detail.orderNo}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={itemConfig?.color}>{itemConfig?.label}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="申请人">
                {detail.reportPersonName}
              </Descriptions.Item>
              <Descriptions.Item label="申请时间">
                {detail.reportTime}
              </Descriptions.Item>
            </>
          )}
          {(detail.scrapStatus == ScarpStatus.PASS ||
            detail.scrapStatus == ScarpStatus.REJECT) && (
            <>
              <Descriptions.Item label="审批人">
                {detail.approvalPersonName}
              </Descriptions.Item>
              <Descriptions.Item label="审批时间">
                {detail.approvalTime}
              </Descriptions.Item>
            </>
          )}
          <Descriptions.Item label="设备名称">
            {detail.equipmentName}
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
            {type == ScarpStatus.INIT ? (
              <TextArea
                onChange={scrapReasonChange}
                showCount
                defaultValue={detail.scrapReason}
                rows={4}
              />
            ) : (
              detail.scrapReason
            )}
          </Descriptions.Item>
          <Descriptions.Item label="技术人员鉴定意见" span={2}>
            {type == ScarpStatus.INIT ? (
              <TextArea
                onChange={identifyAdviceChange}
                showCount
                defaultValue={detail.identifyAdvice}
                rows={4}
              />
            ) : (
              detail.identifyAdvice
            )}
          </Descriptions.Item>
          <Descriptions.Item label="图片" span={2}>
            <Upload
              disabled={type != ScarpStatus.INIT}
              ref={uploadRef}
              action={UploadHost}
              defaultFileList={detail.attachmentFileList}
              accept=".png, .jpg, .jpeg"
              beforeUpload={beforeUpload}
              listType="picture-card"
              data={getExtraData}
              onChange={onFileChange}
              onPreview={onPreview}
            >
              {type == ScarpStatus.INIT && (
                <>
                  <PlusOutlined />
                  <div>上传照片</div>
                </>
              )}
            </Upload>
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      <Preview
        defaultIndex={defaultPhotoIndex}
        images={previewImages}
        visible={previewModalVisible}
        onClose={onClosePreview}
      />
    </>
  );
};

export default ScarpDetailModal;
