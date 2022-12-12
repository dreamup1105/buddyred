import { useState } from 'react';
import type { DataType } from '@/components/Preview';
import type { UploadFile } from 'antd/es/upload/interface';
import { ResourcePath } from '@/utils/constants';

export default function usePreview(): [
  DataType[],
  boolean,
  number,
  (fileList: DataType[], file: UploadFile) => void,
  () => void,
  () => void,
] {
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [defaultPhotoIndex, setDefaultPhotoIndex] = useState(0);
  const [previewImages, setPreviewImages] = useState<DataType[]>([]);

  const onClose = () => {
    setPreviewModalVisible(false);
    setDefaultPhotoIndex(0);
  };

  const updatePreviewImages = (fileList: DataType[], file: UploadFile) => {
    setPreviewImages(
      fileList.map((c: any) => ({
        src: c.url || `${ResourcePath}${c.response?.data?.key}`,
      })),
    );
    setDefaultPhotoIndex(fileList.findIndex((c: any) => c.uid === file.uid));
  };

  const showPreviewModal = () => setPreviewModalVisible(true);

  return [
    previewImages,
    previewModalVisible,
    defaultPhotoIndex,
    updatePreviewImages,
    showPreviewModal,
    onClose,
  ];
}
