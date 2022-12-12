import { request } from 'umi';
import type {
  Team,
  TeamDetail,
  Teammate,
  ListTeamCondition,
  TeamWithEngineers,
} from './type';

/* 获取工程师组列表 */
export async function fetchTeams(
  data: ListTeamCondition,
  page?: number,
  pageSize?: number,
): Promise<Required<ResponseBody<TeamDetail[]>>> {
  const url = page
    ? `/v3/mt/list?pageNum=${page}&pageSize=${pageSize}`
    : '/v3/mt/list';
  return request(url, {
    method: 'POST',
    data,
  });
}

/* 获取工程师组列表(包含工程师) */
export async function fetchTeamsWithEngineers(
  data: ListTeamCondition,
  page?: number,
  pageSize?: number,
): ResponseBodyWithPromise<TeamWithEngineers[]> {
  const url = page
    ? `/v3/mt/list2?pageNum=${page}&pageSize=${pageSize}`
    : '/v3/mt/list2';
  return request(url, {
    method: 'POST',
    data,
  });
}

/* 获取组成员 */
export async function fetchTeammates(
  crId: string | number,
): ResponseBodyWithPromise<Teammate[]> {
  return request(`/v3/mt/get/engineers/${crId}`);
}

/* 创建+修改工程师组 */
export async function postTeam(team: Team): ResponseBodyWithPromise {
  const url = `/v3/mt/save`;
  return request(url, {
    method: 'POST',
    data: {
      team,
      engineers: team.engineers,
    },
  });
}

/* 删除工程师组 */
export async function deleteTeam(
  crId: string | number,
): ResponseBodyWithPromise {
  const url = `/v3/mt/delete/${crId}`;
  return request(url, {
    method: 'DELETE',
  });
}
