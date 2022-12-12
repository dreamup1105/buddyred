import React, { useState, useRef } from 'react';
import { fetchTasks } from '@/pages/Repair/Management/service';
import type { ITaskItem } from '@/pages/Repair/Management/type';
import useMount from '@/hooks/useMount';
import useUnmount from '@/hooks/useUnmount';
import useUserInfo from '@/hooks/useUserInfo';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { batchFetchAttachmentsX } from '@/services/global';
import { AttachmentCategory } from '@/utils/constants';
import ArrowRed from '@/assets/dashboard/arrow-red.png';
import { OrderStatus } from '@/pages/Maintenance/type';
import EngineerAvatars from './EngineerAvatars';
import Corner from './Corner';
import RepairListItem from './RepairListItem';
import styles from '../index.less';

const defaultTaskDelay = 20000;

const DashboardRight: React.FC = () => {
  const { currentUser } = useUserInfo();
  const actionRef = useRef<any>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const restartTimer = useRef<NodeJS.Timeout | null>(null);
  const currentRef = useRef(1);
  const [loading, setLoading] = useState(false);
  const hasMoreDataRef = useRef(true);
  const [dataSource, setDataSource] = useState<(ITaskItem & { res: string })[]>(
    [],
  );

  const loadEquipmentImages = async (rawData: ITaskItem[]) => {
    const bizIds = new Set(rawData.map((i) => i.id));
    try {
      const { code, data } = await batchFetchAttachmentsX({
        bizId: [...bizIds],
        category: [AttachmentCategory.EQUIPMENT_PHOTO],
      });
      if (code === 0) {
        setDataSource(
          rawData.map((item) => {
            return {
              ...item,
              res: data[item.id]?.[0].res,
            };
          }),
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  actionRef.current = {
    startTask: () => {
      actionRef.current.stopTask();
      timer.current = setInterval(() => {
        if (hasMoreDataRef.current) {
          actionRef.current.loadTasks();
        }
      }, defaultTaskDelay);
    },
    stopTask: () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    },
    loadTasks: async () => {
      if (!currentUser?.org.id) {
        return;
      }
      setLoading(true);
      try {
        const { code, data } = await fetchTasks(
          {
            orgId: [currentUser.org.id],
            status: [
              OrderStatus.RECORDING,
              OrderStatus.PENDING,
              OrderStatus.PENDING_RECORD,
              OrderStatus.INIT,
              OrderStatus.ASSIGNED,
              OrderStatus.DOING,
              OrderStatus.FIXED,
            ],
          },
          false,
          currentRef.current,
          7,
        );
        if (code === 0) {
          if (data.length === 0) {
            actionRef.current.stopTask();
            hasMoreDataRef.current = false;
            actionRef.current.restartTask();
          } else {
            currentRef.current += 1;
            await loadEquipmentImages(data);
            if (data.length < 7) {
              actionRef.current.stopTask();
              hasMoreDataRef.current = false;
              actionRef.current.restartTask();
            }
          }
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    },
    restartTask: () => {
      actionRef.current.stopRestartTask();
      restartTimer.current = setTimeout(() => {
        currentRef.current = 1;
        hasMoreDataRef.current = true;
        actionRef.current.startTask();
      }, 0);
    },
    stopRestartTask: () => {
      if (restartTimer.current) {
        clearTimeout(restartTimer.current);
      }
    },
  };

  useMount(() => {
    actionRef.current.loadTasks();
    actionRef.current.startTask();
  });

  useUnmount(() => {
    actionRef.current.stopTask();
    actionRef.current.stopRestartTask();
  });

  return (
    <div className={styles.right}>
      <div className={styles.top}>
        <Corner />
        <div className={styles.title}>
          <img src={ArrowRed} />
          工程师
        </div>
        <EngineerAvatars />
      </div>
      <div className={styles.bottom}>
        <Corner />
        <div className={styles.title}>
          <img src={ArrowRed} />
          维修一览
        </div>
        <Spin
          spinning={loading}
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        >
          {dataSource.map((item) => (
            <RepairListItem key={item.id} record={item} />
          ))}
        </Spin>
      </div>
    </div>
  );
};

export default DashboardRight;
