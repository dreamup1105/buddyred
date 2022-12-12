import { useState } from 'react';
import type { IRemoteSelectOption } from '../components/RemoteSelect';

type ComponentType = 
  | 'equipment-manufacturer' // 设备厂商
  | 'equipment-product'  // 设备名称

export default function useRemoteSelectStatus (): [
  boolean, 
  boolean, 
  React.Dispatch<React.SetStateAction<boolean>>,
  React.Dispatch<React.SetStateAction<boolean>>,
  (type: ComponentType, option?: IRemoteSelectOption) => void
] {
  const [productDisabled, setProductDisabled] = useState(false);
  const [modelDisabled, setModelDisabled] = useState(false);

  const updateStatus = (type: ComponentType, option?: IRemoteSelectOption) => {
    switch (type) {
      case 'equipment-manufacturer':
        setProductDisabled(!(option?.label || option?.value));
        break;
      case 'equipment-product':
        setModelDisabled(!(option?.label || option?.value));
        break;
      default: break;
    }
  }

  return [
    productDisabled,
    modelDisabled,
    setProductDisabled,
    setModelDisabled,
    updateStatus,
  ];
}