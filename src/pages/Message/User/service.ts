import { request } from 'umi';

// 标记为已读
export async function markRead(id: string) {
  return request(`/msg/v1/reader/read/${id}`, {
    method: 'PUT',
  });
}

// 全部置为已读
export async function drainMessage() {
  return request(`/msg/v1/reader/drain`, {
    method: 'PUT',
  });
}

// 获取未读消息数
export async function fetchUnreadCount(uId: number) {
  return request(`/msg/v1/reader/unread/count?uid=${uId}`, {
    method: 'POST',
  });
}

// 查询消息详情
export async function fetchMessageDetail(id: string) {
  return request(`/msg/v1/reader/get/own/${id}`);
}
