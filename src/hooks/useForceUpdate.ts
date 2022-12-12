import { useReducer } from 'react';

export default function useForceUpdate() {
  return useReducer((v: number) => v + 1, 0)[0];
}
