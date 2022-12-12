import { useState } from 'react';
import type { Part } from '../type';
import { fetchParts } from '../service';

export default function useParts() {
  const [parts, setParts] = useState<Part[]>([]);

  const loadParts = async (taskId: number | string) => {
    const { data = [] } = await fetchParts(taskId!);
    setParts(data);
  };

  return {
    parts,
    loadParts,
  };
}
