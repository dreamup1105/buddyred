import { useState } from 'react';
import useMount from '@/hooks/useMount';
import { buildTree } from '@/utils/utils';
import { fetchNameDictionarys } from '@/services/dictionary';
import { NameDictionarysEnum } from '@/utils/constants';
import useAttachmentCategorys from './useAttachmentCategorys';
import { fetchManufacturers } from '../service';
import type { IManufacturerItem, EquipmentTypeItem } from '../type';

export default function useInitialData () {
  const [fetching, setFetching] = useState(false);
  const [manufacturers, setManufacturers] = useState<IManufacturerItem[]>([]);
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentTypeItem[]>([]);
  const { attachmentCategorys, loadAttachmentCategorys} = useAttachmentCategorys();

  // 获取设备制造商
  const loadManufacturers = async () => {
    try {
      const { data } = await fetchManufacturers();
      setManufacturers(data);
    } catch (error) {
      console.error(error);
    }
  };

  // 获取设备类型
  const loadEquipmentTypes = async () => {
    try {
      const { data = [] } = await fetchNameDictionarys(
        NameDictionarysEnum.EQUIPMENT_TYPE,
      );
      const formatData = data.map((d: EquipmentTypeItem) => ({
        ...d,
        value: d.id,
        title: d.name,
        selectable: d.childrenNumber === 0,
      }));
      setEquipmentTypes(buildTree(formatData, 0, 'parentId'));
    } catch (error) {
      console.error(error);
    }
  };

  useMount(() => {
    setFetching(true);
    Promise.allSettled([loadManufacturers(), loadEquipmentTypes(), loadAttachmentCategorys()]).finally(() => {
      setFetching(false);
    });
  });

  return {
    fetching,
    manufacturers,
    equipmentTypes,
    attachmentCategorys,
    loadEquipmentTypes,
  }
}
