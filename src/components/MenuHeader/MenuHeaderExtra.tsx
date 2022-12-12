import type { CSSProperties } from 'react';
import React from 'react';
import { useModel } from 'umi';
import DefaultAvator from '@/assets/defaultAvator.png';

interface ComponentProps {
  userInfo: CurrentUserInfo;
}

const wrapperStyle: CSSProperties = {
  padding: 14,
  textAlign: 'center',
};

/**
 * 对标ProTable的操作栏
 * @param param0
 */
const MenuHeader: React.FC<ComponentProps> = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState!;
  return (
    <div style={wrapperStyle} className="role-wrapper">
      <img src={DefaultAvator} alt="用户头像" className="role-avator" />
      <span className="role-name">{currentUser?.user.username}</span>
    </div>
  );
};

export default MenuHeader;
