import { useModel } from 'umi';

/**
 * 全局权限
 * @returns
 */
export default function useGlobalAuthorities() {
  const { initialState } = useModel('@@initialState');

  return initialState?.globalAuthorities ?? [];
}
