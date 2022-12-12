import { useState } from 'react';
import useACL from '@/hooks/useACL';
import { fetchEquipmentsTotalPrice } from '../service';
import { getParsedTag, normalizeDepartmentId } from '../helper';

export default function useEquipmentsPriceTotal (orgId: number | undefined) {
  const { isACL } = useACL();
  const [priceTotal, setPriceTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const loadEquipmentsPriceTotal = async (query: any) => {
    setLoading(true);
    try {
      const { 
        tag,
        departmentId,
        startInitialUseDate, 
        endInitialUseDate, 
        minOriginWorth, 
        maxOriginWorth, 
      } = query;
      const { code, data } = await fetchEquipmentsTotalPrice({
        ...query,
        tag: getParsedTag(tag),
        departmentId: normalizeDepartmentId(departmentId),
        orgId,
        originWorth: {
          minValue: Number(minOriginWorth),
          maxValue: Number(maxOriginWorth),
        },
        initialUseDate: {
          minValue: startInitialUseDate,
          maxValue: endInitialUseDate,
        },
      }, isACL);
      if (code === 0) {
        setPriceTotal(data ?? 0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    priceTotal,
    loadEquipmentsPriceTotal,
  }
}