import React, { useState, useEffect } from 'react';
import { PhotoSlider } from 'react-photo-view';

export type DataType = {
  key?: string;
  src: string;
  originRef?: HTMLElement | null;
  intro?: React.ReactNode;
};

interface PreviewProps {
  visible: boolean;
  images: DataType[];
  defaultIndex: number;
  onClose: () => void;
}

const Preview: React.FC<PreviewProps> = ({
  visible,
  images,
  defaultIndex = 0,
  onClose,
}) => {
  const [index, setIndex] = useState<number>(defaultIndex);

  useEffect(() => {
    if (visible) {
      setIndex(defaultIndex);
    }
  }, [defaultIndex, visible]);

  return (
    <PhotoSlider
      images={images}
      visible={visible}
      onClose={onClose}
      index={index}
      onIndexChange={setIndex}
    />
  );
};

export default Preview;
