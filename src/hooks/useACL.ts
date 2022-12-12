import useSubAuthorities from './useSubAuthorities';
import useGlobalAuthorities from './useGlobalAuthorities';

/**
 * 访问控制列表权限
 * @returns
 */
export default function useACL() {
  const subAuthorities = useSubAuthorities();
  const globalAuthorities = useGlobalAuthorities();
  const isACL =
    !subAuthorities?.includes('ALL') && !globalAuthorities.includes('ALL');

  return {
    isACL,
  };
}
