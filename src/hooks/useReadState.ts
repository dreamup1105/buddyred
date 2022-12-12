import useUserInfo from './useUserInfo';
import { fetchUnreadCount, markRead } from '@/pages/Message/User/service';

// 未读消息数
export default function useReadState() {
  const { currentUser, setInitialState, initialState } = useUserInfo();

  const loadUnreadCount = async () => {
    if (!currentUser?.user.id) {
      return;
    }
    try {
      const { data = 0 } = await fetchUnreadCount(currentUser?.user.id);
      setInitialState({
        ...initialState,
        message: {
          unreadCount: data,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const singleMarkRead = async (id: string) => {
    try {
      const { code } = await markRead(id);
      if (code === 0) {
        loadUnreadCount();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    loadUnreadCount,
    singleMarkRead,
  };
}
