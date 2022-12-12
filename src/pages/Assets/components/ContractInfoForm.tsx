import React, { useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Upload, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { DataType } from '@/components/Preview';
import Preview from '@/components/Preview';
import { getBase64 } from '@/utils/utils';
import { UploadHost } from '@/services/qiniu';
import { ResourcePath } from '@/utils/constants';
import type { UploadFile } from 'antd/es/upload/interface';
import useUploadHook from '@/hooks/useUploadHook';
import type { ICertCategoryItem} from '../type';
import { OperationType } from '../type';

interface IComponentProps {
  readonly?: boolean;
}

interface IInitialValues {
  operation: OperationType;
  attachmentCategorys: ICertCategoryItem[];
  attachments?: Attachment[]; 
  contract?: Attachment[];
}

/**
 * ICertCategoryItem[] => Attachment[]
 * @param certificates
 */
const transformAttachments = (
  certificates: any[],
): Attachment[] => {
  const attachments: Attachment[] = [];
  certificates.forEach((cert) => {
    attachments.push({
      category: 'EQUIPMENT_CONTRCAT',
      fileName: cert.name,
      contentType: cert.type,
      contentLength: cert.size,
      res: cert.uid,
    });
  });

  return attachments;
};

// 合同信息
export default forwardRef(({
  readonly = false,
}: IComponentProps, ref) => {
  const { token, loadToken } = useUploadHook();
  const [previewImages, setPreviewImages] = useState<DataType[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [previewModalVisible, setPreviewModalVisible] = useState<boolean>(
    false,
  );
  const [defaultPhotoIndex, setDefaultPhotoIndex] = useState<number>(0);

  const beforeUpload = async (file: File): Promise<any> => {
    console.log(file);
    await loadToken();
    return true;
  }

  // 查看文件
  const onPreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = (await getBase64(file.originFileObj as File)) as string;
    }
    // 如果文件包含图片类型，打开遮罩层显示图片，其他类型的文件打开新窗口
    if (file.type?.indexOf('image') != -1) {
      const imageList = certificates.map((item: any) => (
        {
          src: `${ResourcePath}${item.uid}`,
          uid: item.uid
        }
      ));
      setPreviewImages(imageList);
      // 定位到点击的图片，弹框显示点击的图片
      imageList.forEach((item: any, index: number) => {
        if (item.uid == file.uid) {
          setDefaultPhotoIndex(index);
        }
      })
      setPreviewModalVisible(true);
    } else {
      window.open(`${ResourcePath}${file.uid}?attname=${file.name}`);
    }
  };

  const init = ({ contract = [], operation }: IInitialValues) => {
    if (operation === OperationType.INPUT) {
      setCertificates(contract);
      return;
    }
    setCertificates(() => contract.map((file) => ({
      url: `${ResourcePath}${file.res}`,
      type: file.contentType,
      size: file.contentLength,
      status: 'done',
      name: file.fileName,
      uid: file.res,
      }))
    );
  };

  const onChange = (fileList: UploadFile[]) => {
    fileList.forEach((item) => {
      if (item.response) {
        item.url = `${ResourcePath}${item.response?.data.key}`;
        item.type = item.type;
        item.size = item.size;
        item.status = 'done';
        item.name = item.name;
        item.uid = item.uid;
      }
    })
    setCertificates(fileList);
  };

  const getExtraData = useCallback((file: UploadFile) => {
    return {
      token,
      key: `${file.uid}`,
    };
  }, [token]);

  const onClosePreview = () => {
    setPreviewModalVisible(false);
    setDefaultPhotoIndex(0);
  }

  const renderUploadBtn = () => (
    <div>
      <Upload
        action={UploadHost}
        listType="picture-card"
        beforeUpload={beforeUpload}
        onPreview={(file) => onPreview(file)}
        onChange={
          readonly
            ? undefined
            : ({ fileList }) => onChange(fileList)}
        fileList={certificates}
        showUploadList={{ showRemoveIcon: !readonly }}
        style={{ width: '100%' }}
        data={getExtraData}
      >
        {readonly ? null : (
          <>
            <PlusOutlined />
            <div>上传文件</div>
          </>
        )}
      </Upload>
    </div>
  );

  useImperativeHandle(ref, () => ({
    init,
    getFieldsValue: () => {
      return transformAttachments(certificates);
    },
    resetFields: () => {
      setCertificates([]);
    },
  }));

  return (
    <div>
      {renderUploadBtn()}
      {
        previewImages.length > 0
        ? <Preview
          defaultIndex={defaultPhotoIndex}
          images={previewImages}
          visible={previewModalVisible}
          onClose={onClosePreview}
        />
        : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }
      
    </div>
  );
});

