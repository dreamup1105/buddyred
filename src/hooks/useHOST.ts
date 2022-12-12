import useSubAuthorities from './useSubAuthorities';
import useGlobalAuthorities from './useGlobalAuthorities';
/**
 * 访问控制列表权限-全部医院
 * @returns
 */
export default function useHOST() {
  const subAuthorities = useSubAuthorities();
  const globalAuthorities = useGlobalAuthorities();
  const isHost =
    !subAuthorities?.includes('ALLHOST') &&
    !globalAuthorities.includes('ALLHOST');

  return {
    isHost,
  };
}
