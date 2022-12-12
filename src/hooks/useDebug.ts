import { useRef } from 'react';

export function useRenderTimes(): number {
  const count = useRef(0);

  count.current += 1;

  return count.current;
}
