import { request } from 'umi';

/**
 * 重置密码
 * @param accountId
 */
export async function resetPassword(accountId: number) {
  return request(`/v3/account/resetPassword/${accountId}`, {
    method: 'PUT',
  });
}

/**
 * 修改密码
 * @param uId 用户id
 * @param password 旧密码
 * @param newPassword 新密码
 * @returns
 */
export async function modifyPassword(
  uId: number,
  password: string,
  newPassword: string,
) {
  return request(`/v3/account/changePassword/${uId}`, {
    method: 'PUT',
    data: {
      password,
      newPassword,
    },
  });
}

/**
 * 发送验证码（找回密码功能）
 * @param phone
 * @returns
 */
export async function sendVerifyCode(phone: string) {
  return request(`/v3/account/sendVerifyCode/${phone}`);
}

/**
 * 修改密码（手机验证码方式修改）
 * @param data
 * @returns
 */
export async function modifyPasswordByVerifyCode(data: {
  code: string;
  newPwd: string;
  oldPwd?: string;
  phone: string;
  secondPwd: string;
}) {
  return request(`/v3/account/changePasswordByCode`, {
    data,
    method: 'POST',
  });
}
