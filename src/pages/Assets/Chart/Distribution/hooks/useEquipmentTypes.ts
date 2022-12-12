import { useState } from 'react';
import useMount from '@/hooks/useMount';
import { fetchNameDictionarys } from '@/services/dictionary';
import { NameDictionarysEnum } from '@/utils/constants';

export default function useEquipmentTypes() {
  const [types, setTypes] = useState<{ label: string; value: string }[]>([]);

  const loadEquipmentTypes = async () => {
    try {
      const { data = [] } = await fetchNameDictionarys(NameDictionarysEnum.EQUIPMENT_TYPE);
      setTypes(data.map(item => ({
        label: item.name,
        value: item.name,
      })));
    } catch (error) {
      console.error(error);
    }
  }

  useMount(loadEquipmentTypes);

  return [
    {
      label: '全部',
      value: '全部',
    },
    ...types,
  ];
}
