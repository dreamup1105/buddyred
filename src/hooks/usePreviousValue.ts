import { useRef } from 'react';

export default function usePreviousValue(value: any) {
  const previous = useRef(undefined);
  const previousValue = previous.current;
  previous.current = value;
  return previousValue;
}
