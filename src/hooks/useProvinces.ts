import { useState } from 'react';
import { fetchCodeDictionarys } from '@/services/dictionary';
import { CodeDictionarysEnum } from '@/utils/constants';
import useMount from './useMount';

export default function useProvinces() {
  const [provinces, setProvinces] = useState<AddressOption[]>([]);

  const loadProvinces = async () => {
    const { data } = await fetchCodeDictionarys(
      CodeDictionarysEnum.REGION_CODE,
      {
        parentId: 0,
      },
    );
    setProvinces(
      data.map((i: AddressOption) => ({
        ...i,
        label: i.name,
        value: i.code,
        isLeaf: i.childrenNumber === 0,
      })),
    );
  };

  useMount(() => {
    loadProvinces();
  });

  return provinces;
}
