import React, { useState } from 'react';
import { List, Avatar, Popconfirm, message } from 'antd';
import useUserInfo from '@/hooks/useUserInfo';
import useMount from '@/hooks/useMount';
import { unbindWechat, fetchWechatAccounts } from '@/services/wx';
import styles from '../index.less';

const WechatConfig: React.FC = () => {
  const { currentUser } = useUserInfo();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<WechatUserInfo[]>([]);

  const init = async () => {
    setLoading(true);
    try {
      const { data, code } = await fetchWechatAccounts();
      if (code === 0) {
        setDataSource(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 解绑
  const onUnbind = async (item: WechatUserInfo) => {
    if (!currentUser?.user.id) {
      return;
    }
    try {
      const { code } = await unbindWechat(currentUser?.user.id, item.openid);
      if (code === 0) {
        message.success('解绑成功');
        init();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useMount(init);

  return (
    <>
      <h6 className={styles.configTitle}>微信设置</h6>
      <List
        itemLayout="horizontal"
        dataSource={dataSource}
        loading={loading}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Popconfirm
                key="unbind"
                title="确定要解绑该账号吗？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => onUnbind(item)}
              >
                <a>解绑</a>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.headimgurl} />}
              title={item.nickname}
              description={item.bindTime}
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default WechatConfig;
