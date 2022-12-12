import { SettingOutlined } from '@ant-design/icons';
import { useModel, history } from 'umi';
import { Menu, Avatar, Spin } from 'antd';
import React from 'react';
import { ResourcePath, DefaultAvatarUrl } from '@/utils/constants';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const AvatarDropdown: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState!;
  const onMenuClick = (event: {
    key: React.Key;
    keyPath: React.Key[];
    item: React.ReactInstance;
    domEvent: React.MouseEvent<HTMLElement>;
  }) => {
    switch (event.key) {
      case 'settings':
        history.push(`/account/settings`);
        break;
      default:
        break;
    }
  };

  const menuHeaderDropdown = (
    <Menu
      className={styles.menu}
      selectedKeys={[]}
      onClick={(event) => onMenuClick(event as any)}
    >
      {/* <Menu.Item key="center">
        <UserOutlined />
        登录密码
      </Menu.Item> */}
      <Menu.Item key="settings">
        <SettingOutlined />
        个人设置
      </Menu.Item>
      {/* <Menu.Divider />
      <Menu.Item key="logout">
        <LogoutOutlined />
        用户名
      </Menu.Item> */}
    </Menu>
  );

  const renderUsername = () => {
    const user = currentUser?.user;

    if (!user) {
      return '未知用户';
    }

    if (user.isAdmin) {
      return '管理员';
    }

    const employee = currentUser?.employee;

    return employee ? employee.name : '未知用户';
  };

  return (
    <HeaderDropdown overlay={menuHeaderDropdown} placement="bottomCenter">
      <span className={`${styles.action} ${styles.account}`}>
        {currentUser?.user ? (
          <>
            <Avatar
              size="small"
              className={styles.avatar}
              src={
                currentUser.employee?.avatar
                  ? `${ResourcePath}${currentUser.employee?.avatar}-100`
                  : DefaultAvatarUrl
              }
              alt="avatar"
            />
            <span className={`${styles.name} anticon`}>{renderUsername()}</span>
          </>
        ) : (
          <Spin
            size="small"
            style={{
              marginLeft: 8,
              marginRight: 8,
            }}
          />
        )}
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;

// class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
//   onMenuClick = (event: {
//     key: React.Key;
//     keyPath: React.Key[];
//     item: React.ReactInstance;
//     domEvent: React.MouseEvent<HTMLElement>;
//   }) => {
//     const { key } = event;

//     if (key === 'logout') {
//       const { dispatch } = this.props;

//       if (dispatch) {
//         dispatch({
//           type: 'login/logout',
//         });
//       }

//       return;
//     }

//     history.push(`/account/${key}`);
//   };

//   render(): React.ReactNode {
//     const {
//       currentUser = {
//         avatar: '',
//         name: '',
//       },
//       menu,
//     } = this.props;
//     const menuHeaderDropdown = (
//       <Menu
//         className={styles.menu}
//         selectedKeys={[]}
//         onClick={this.onMenuClick}
//       >
//         {menu && (
//           <Menu.Item key="center">
//             <UserOutlined />
//             个人中心
//           </Menu.Item>
//         )}
//         {menu && (
//           <Menu.Item key="settings">
//             <SettingOutlined />
//             个人设置
//           </Menu.Item>
//         )}
//         {menu && <Menu.Divider />}

//         <Menu.Item key="logout">
//           <LogoutOutlined />
//           退出登录
//         </Menu.Item>
//       </Menu>
//     );
//     return currentUser && currentUser.name ? (
//       <HeaderDropdown overlay={menuHeaderDropdown}>
//         <span className={`${styles.action} ${styles.account}`}>
//           <Avatar
//             size="small"
//             className={styles.avatar}
//             src={currentUser.avatar}
//             alt="avatar"
//           />
//           <span className={`${styles.name} anticon`}>{currentUser.name}</span>
//         </span>
//       </HeaderDropdown>
//     ) : (
//       <span className={`${styles.action} ${styles.account}`}>
//         <Spin
//           size="small"
//           style={{
//             marginLeft: 8,
//             marginRight: 8,
//           }}
//         />
//       </span>
//     );
//   }
// }

// export default connect(({ user }: ConnectState) => ({
//   currentUser: user.currentUser,
// }))(AvatarDropdown);
