import React, { useState } from 'react';
import { Avatar, Row, Col, Popover, Badge } from 'antd';
import useMount from '@/hooks/useMount';
import useUserInfo from '@/hooks/useUserInfo';
import { ResourcePath, DefaultAvatarUrl } from '@/utils/constants';
import { fetchEngineersAvators } from '../service';
import type { IAvatarItem } from '../type';
import styles from '../index.less';

const EngineerAvatars: React.FC = () => {
  const { currentUser } = useUserInfo();
  const [isOverLimit, setIsOverLimit] = useState(false);
  const [avatars, setAvatars] = useState<IAvatarItem[]>([]);
  const [isEmpty, setIsEmpty] = useState(false);

  const loadEngineerAvators = async () => {
    if (!currentUser?.org.id) {
      return;
    }
    try {
      const { code, data } = await fetchEngineersAvators(currentUser?.org.id);
      if (code === 0) {
        if (data?.length > 6) {
          setIsOverLimit(true);
        }
        if (data?.length === 0) {
          setIsEmpty(true);
        }
        setAvatars(data);
      } else {
        setIsEmpty(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderAvatarItem = (avatar: IAvatarItem, index: number) => {
    return (
      <Col span={4} key={avatar.picKey ? avatar.picKey : `${index}`}>
        <Badge
          color={avatar.engineerStatus ? 'orange' : 'green'}
          count={avatar.engineerStatus ? '忙' : '闲'}
        >
          <Avatar
            src={
              avatar.picKey
                ? `${ResourcePath}${avatar.picKey}-100`
                : DefaultAvatarUrl
            }
            size={70}
          />
        </Badge>

        <p>{avatar.name}</p>
      </Col>
    );
  };

  useMount(loadEngineerAvators);

  return (
    <div className={styles.engineerAvatarsWrapper}>
      {isEmpty && <div className={styles.emptyWrapper}>暂无数据</div>}
      <Row>
        {(isOverLimit ? avatars.slice(0, 5) : avatars).map(renderAvatarItem)}
        {isOverLimit && (
          <Col span={4}>
            <Popover
              trigger="hover"
              content={
                <div style={{ width: 500 }}>
                  <Row>{avatars.slice(5).map(renderAvatarItem)}</Row>
                </div>
              }
            >
              <Avatar
                style={{
                  color: '#f56a00',
                  backgroundColor: '#fde3cf',
                  fontSize: 30,
                }}
                size={70}
              >
                +{avatars.length - 5 > 99 ? '99' : avatars.length - 5}
              </Avatar>
            </Popover>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default EngineerAvatars;
