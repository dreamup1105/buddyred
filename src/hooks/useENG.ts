import useSubAuthorities from './useSubAuthorities';
import useGlobalAuthorities from './useGlobalAuthorities';
/**
 * 访问控制列表权限-工程师列表
 * @returns
 */
export default function useENG() {
  const subAuthorities = useSubAuthorities();
  const globalAuthorities = useGlobalAuthorities();
  const isEng =
    !subAuthorities?.includes('ALLENG') &&
    !globalAuthorities.includes('ALLENG');

  return {
    isEng,
  };
}
