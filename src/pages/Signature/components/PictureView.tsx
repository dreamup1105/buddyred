import React, { useState } from 'react';
import type { DataType } from '@/components/Preview';
import Preview from '@/components/Preview';

interface PictureViewProps {
  images: DataType[];
}
const PictureView: React.FC<PictureViewProps> = ({ images }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [viewIndex, setViewIndex] = useState<number>(0);

  const handleOpenViewer = (index: number) => {
    setViewIndex(index);
    setVisible(true);
  };
  const handleCloseViewer = () => {
    setVisible(false);
  };

  return (
    <span className="ant-upload-picture-card-wrapper">
      <div className="ant-upload-list ant-upload-list-picture-card">
        {images.map((_, index) => (
          <div key={_.src} className="ant-upload-list-picture-card-container">
            <div
              className="ant-upload-list-item ant-upload-list-item-list-type-picture-card"
              onClick={() => handleOpenViewer(index)}
            >
              <div className="ant-upload-list-item-info">
                <span className="ant-upload-span">
                  <img
                    src={_.src}
                    alt=""
                    className="ant-upload-list-item-image"
                    crossOrigin="anonymous"
                  />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Preview
        defaultIndex={viewIndex}
        visible={visible}
        images={images}
        onClose={handleCloseViewer}
      />
    </span>
  );
};

export default PictureView;
