import { useRouteMatch, useModel } from 'umi';

export default function useCurrentRoute() {
  const { initialState } = useModel('@@initialState');
  const currentRoute = useRouteMatch();

  return initialState?.routesMap?.get(currentRoute.path);
}
