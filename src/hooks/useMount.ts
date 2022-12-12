import { useEffect } from 'react';

export default function useMount(fn: any) {
  useEffect(() => {
    if (typeof fn === 'function') {
      fn();
    }
  }, []);
}
