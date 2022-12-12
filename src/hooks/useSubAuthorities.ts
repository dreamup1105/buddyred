import useCurrentRoute from './useCurrentRoute';

/**
 * 菜单子权限
 * @returns
 */
export default function useSubAuthorities(): string[] | undefined {
  const currentRoute = useCurrentRoute();

  return currentRoute?.authority
    ? (currentRoute.authority
        .map((item) => item.flag)
        .filter(Boolean) as string[])
    : undefined;
}
