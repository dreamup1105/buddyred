import React, { useState } from 'react';
import { message, Upload } from 'antd';
import type {
  RcFile,
  UploadChangeParam,
  UploadFile,
} from 'antd/es/upload/interface';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import type { DataType } from '@/components/Preview';
import Preview from '@/components/Preview';
import { getBase64 } from '@/utils/utils';
import { withToken } from '@/utils/withToken';
import type { ExtendedUploadFile } from '../type';
import { postAttachment } from '../service';

/**
 * controled FormItem
 */
interface PictureUploadProps {
  value?: ExtendedUploadFile[];
  onChange?: (value: ExtendedUploadFile[]) => void;
}
const PictureUpload: React.FC<PictureUploadProps> = ({ value, onChange }) => {
  const [viewIndex, setViewIndex] = useState<number>(0);
  const [viewerVisible, setViewerVisible] = useState<boolean>(false);

  const handleCheckFile = async (file: RcFile): Promise<any> => {
    const isOverSize = file.size > 2097125;
    if (isOverSize) {
      message.error('图片大小必须小于2MB');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleChangeFiles = async ({
    file,
    fileList,
  }: UploadChangeParam<ExtendedUploadFile>) => {
    if (!onChange) return;
    // 初次载入文件时，获取并设置base64值，用于预览
    if (file.src === undefined && file.status === 'uploading') {
      const result = await getBase64(file.originFileObj as File);
      const newValue: ExtendedUploadFile[] = [];
      if (value === undefined) {
        newValue.push({ ...file, src: result as string });
      } else {
        fileList.forEach((_) => {
          if (_.uid !== file.uid) {
            newValue.push(_);
          } else {
            newValue.push({ ...file, src: result as string });
          }
        });
      }
      onChange(newValue);
    } else if (
      file.res === undefined &&
      file.status === 'done' &&
      file.response
    ) {
      onChange(
        fileList.map((_) => {
          if (_.uid === file.uid) {
            return { ..._, res: _.response.data.hash };
          }
          return _;
        }),
      );
    } else {
      onChange(fileList);
    }
  };

  const handleViewFiles = (file: UploadFile) => {
    if (value !== undefined) {
      setViewIndex(value.indexOf(file));
      setViewerVisible(true);
    }
  };

  const handleRemoveFile = ({ uid }: UploadFile) => {
    if (value !== undefined && onChange) {
      const newValue: ExtendedUploadFile[] = [];
      value.forEach((_) => {
        if (uid !== _.uid) {
          newValue.push(_);
        }
      });
      onChange(newValue);
    }
  };

  // todo 调整上传方法（postAttachment），以提供完整的上传进度展示效果（options.onProgress）
  const uploadRequest = async (options: UploadRequestOption<any>) => {
    try {
      const res = await withToken((token) =>
        postAttachment(options.file as File, token),
      );
      options.onSuccess?.(res, new XMLHttpRequest());
    } catch (err) {
      options.onError?.(err);
    }
  };

  return (
    <>
      <Upload
        type="select"
        accept=".jpg,.jpeg,.png"
        listType="picture-card"
        fileList={value}
        beforeUpload={handleCheckFile}
        onChange={handleChangeFiles}
        onRemove={handleRemoveFile}
        onPreview={handleViewFiles}
        customRequest={uploadRequest}
      >
        + Upload
      </Upload>
      <Preview
        defaultIndex={viewIndex}
        visible={viewerVisible}
        images={(value as DataType[]) || []}
        onClose={() => setViewerVisible(false)}
      />
    </>
  );
};

export default PictureUpload;
