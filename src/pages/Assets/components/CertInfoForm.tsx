import React, { useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Upload, message } from 'antd';
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
import styles from '../index.less';

interface IComponentProps {
  readonly?: boolean;
}

interface IInitialValues {
  operation: OperationType;
  attachmentCategorys: ICertCategoryItem[];
  attachments?: Attachment[]; 
}

/**
 * ICertCategoryItem[] => Attachment[]
 * @param certificates
 */
const transformAttachments = (
  certificates: ICertCategoryItem[],
): Attachment[] => {
  const attachments: Attachment[] = [];

  certificates.forEach((cert) => {
    if (cert.fileList) {
      cert.fileList.forEach((file: any) => {
        attachments.push({
          category: cert.key,
          fileName: file.name,
          contentType: file.type,
          contentLength: file.size,
          // res: file.response.Data.key,
          res: file.uid,
        });
      });
    }
  });

  return attachments;
};

// 资证信息
export default forwardRef(({
  readonly = false,
}: IComponentProps, ref) => {
  const { token, loadToken } = useUploadHook();
  const [previewImages, setPreviewImages] = useState<DataType[]>([]);
  const [certificates, setCertificates] = useState<ICertCategoryItem[]>([]);
  const [previewModalVisible, setPreviewModalVisible] = useState<boolean>(
    false,
  );
  const [defaultPhotoIndex, setDefaultPhotoIndex] = useState<number>(0);

  const beforeUpload = async (file: File): Promise<any> => {
    const isLt5M = (file.size / 1024 / 1024) < 5;
    if (!isLt5M) {
      message.error('图片大小不能大于5M');
      return Upload.LIST_IGNORE;
    }
    await loadToken();
    return true;
  }

  const onPreview = async (file: UploadFile, category: ICertCategoryItem) => {
    if (!file.url && !file.preview) {
      // eslint-disable-next-line no-param-reassign
      file.preview = (await getBase64(file.originFileObj as File)) as string;
    }
    const currentFileList = certificates.filter(c => c.key === category.key)[0].fileList;
    if (currentFileList?.length) {
      setPreviewImages(currentFileList.map((c: any) => ({ src: c.url || `${ResourcePath}${c.uid}` })));
      setDefaultPhotoIndex(currentFileList.findIndex((c: any) => c.uid === file.uid));
    }
    setPreviewModalVisible(true);
  };

  const init = ({ attachments = [], operation, attachmentCategorys }: IInitialValues) => {
    if (operation === OperationType.INPUT) {
      setCertificates(attachmentCategorys);
      return;
    }
    setCertificates(() => attachmentCategorys.map((cert) => ({
      ...cert,
      fileList: attachments
        .filter((a) => a.category === cert.key)
        .map((file) => ({
          url: `${ResourcePath}${file.res}`,
          type: file.contentType,
          size: file.contentLength,
          status: 'done',
          name: file.fileName,
          uid: file.res,
        })),
      }))
    );
  };

  const onChange = (fileList: UploadFile[], category: ICertCategoryItem) => {
    setCertificates((prevCerts) => prevCerts.map((cert) => {
        if (cert.key === category.key) {
          return {
            ...cert,
            fileList,
          };
        }
        return cert;
      })
    )
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

  const renderUploadBtn = (category: ICertCategoryItem) => (
    <div>
      <Upload
        action={UploadHost}
        accept=".jpg, .jpeg, .png"
        listType="picture-card"
        beforeUpload={beforeUpload}
        onPreview={(file) => onPreview(file, category)}
        onChange={
          readonly
            ? undefined
            : ({ fileList }) => onChange(fileList, category)
        }
        fileList={category.fileList}
        showUploadList={{ showRemoveIcon: !readonly }}
        style={{ width: '100%' }}
        data={getExtraData}
      >
        {readonly ? null : (
          <>
            <PlusOutlined />
            <div>上传照片</div>
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
      {certificates.map((c) => (
        <div key={c.key} className={styles.certBlock}>
          <h4>{ c.value }</h4>
          {renderUploadBtn(c)}
        </div>
      ))}
      <Preview
        defaultIndex={defaultPhotoIndex}
        images={previewImages}
        visible={previewModalVisible}
        onClose={onClosePreview}
      />
    </div>
  );
});

