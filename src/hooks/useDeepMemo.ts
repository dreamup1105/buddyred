import deepEqual from 'fast-deep-equal';
import useShallowMemo from './useShallowMemo';

export default function useDeepMemo<T>(value: T): T {
  return useShallowMemo(value, deepEqual);
}
