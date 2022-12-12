import { useModel } from 'umi';

export default function useUserInfo() {
  const { initialState, setInitialState } = useModel('@@initialState');

  return {
    initialState,
    currentUser: initialState?.currentUser,
    setInitialState,
  };
}
