import { request } from 'umi';
import Cookies from 'js-cookie';

import type {
  IFetchMeetingItem,
  IFetchHistoryItem,
  IMsgSendRequest,
} from './type';

// userId
const muid = Cookies.get('muid');
// nickName
const muname = Cookies.get('muname');

// get meetings by user_id
export async function fetchMeetingsByUserId(): ResponseBodyWithPromise<
  IFetchMeetingItem[]
> {
  return request(`/v3/meetings/getByUser/${muid}`, {
    method: 'GET',
  });
}

// get meeting by id
export async function fetchMeetingById(
  meetingId: string,
): ResponseBodyWithPromise<IFetchMeetingItem> {
  return request(`/v3/meetings/get/${meetingId}`, {
    method: 'GET',
  });
}

// save meeting
export async function saveMeeting(data: IFetchMeetingItem) {
  data.userId = muid;
  return request(`/v3/meetings/save`, {
    method: 'POST',
    data,
  });
}

// delete meeting by id
export async function deleteMeetingById(meetingId: number) {
  return request(`/v3/meetings/delete/${meetingId}`, {
    method: 'DELETE',
  });
}

// get meeting_histories by user_id
export async function fetchHistoriesByUserId(): ResponseBodyWithPromise<
  IFetchHistoryItem[]
> {
  return request(`/v3/meeting_histories/getByUser/${muid}`, {
    method: 'GET',
  });
}

// get meeting_history by id
export async function fetchHistoryById(
  meetingId: number,
): ResponseBodyWithPromise<IFetchHistoryItem> {
  return request(`/v3/meeting_histories/get/${meetingId}`, {
    method: 'GET',
  });
}

// save meeting_history
export async function saveHistory(data: IFetchHistoryItem) {
  data.userId = muid;
  if (!('nickName' in data)) {
    data.nickName = muname;
  }
  return request(`/v3/meeting_histories/save`, {
    method: 'POST',
    data,
  });
}

// delete meeting_history by id
export async function deleteHistoryById(meetingId: number) {
  return request(`/v3/meeting_histories/delete/${meetingId}`, {
    method: 'DELETE',
  });
}

// msg sender
export async function msgSend(data: IMsgSendRequest) {
  data.uid = muid;
  return request(`/msg/v1/sender/schedule?uid=${muid}`, {
    method: 'POST',
    data,
  });
}
