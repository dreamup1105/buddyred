import { useState } from 'react';
import type { IAdverseEventParams } from '../type';
import { fetchAdverseEventParams } from '../service';

export default function useAdverseEventParams() {
  const [params, setParams] = useState<IAdverseEventParams>();

  const loadAdverseEventParams = async () => {
    try {
      const { code, data } = await fetchAdverseEventParams();
      if (code === 0) {
        setParams(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    params,
    loadAdverseEventParams,
  };
}
