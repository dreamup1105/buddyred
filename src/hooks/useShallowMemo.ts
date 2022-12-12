import { useRef, useEffect } from 'react';
import shallowEqual from 'shallowequal';

type CustomEquals<T> = (previous: T | undefined, current: T) => boolean;

export default function useShallowMemo<T>(
  value: T,
  equals: CustomEquals<T> = shallowEqual,
) {
  const cache = useRef<T>(value);
  const equalsRef = useRef(equals);

  useEffect(() => {
    equalsRef.current = equals;
  }, [equals]);

  useEffect(() => {
    if (!equalsRef.current(cache.current, value)) {
      cache.current = value;
    }
  }, [value]);

  return equals(cache.current, value) ? cache.current : value;
}
