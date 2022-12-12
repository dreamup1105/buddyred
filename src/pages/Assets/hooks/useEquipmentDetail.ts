import { useState } from 'react';
import useUserInfo from '@/hooks/useUserInfo';
import type { EquipmentDetailEx, ITimelineItem } from '../type';
import { batchFetchEquipmentInfo, fetchEquipmentTimeline } from '../service';
import { fetchAttachments } from '@/services/global';

export default function useEquipmentDetail() {
  const { currentUser } = useUserInfo();
  const orgId = currentUser?.org.id;
  const [loading, setLoading] = useState<boolean>(false);
  const [equipmentDetail, setEquipmentDetail] = useState<
    EquipmentDetailEx | undefined
  >();
  const [hispitalLogo, setHispitalLogo] = useState<string>();
  const [timelineItems, setTimelineItems] = useState<ITimelineItem[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false); 

  // 获取设备详情 
  const loadEquipmentDetail = async (id: number) => {
    setLoading(true);
    try {
      const { data } = await batchFetchEquipmentInfo({
        ids: [id]
      });
      if (data?.length) {
        setEquipmentDetail(data[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 获取组织机构logo 
  const LoadHistoryLogo = async () => {
    setLoading(true);
    try {
      const { data } = await fetchAttachments(orgId);
      setHispitalLogo(data[0].res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 获取设备维保历史
  const loadTimeline = async (id: number) => {
    try {
      const { data, code } = await fetchEquipmentTimeline(id, {});
      if (code === 0) {
        setTimelineItems(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimelineLoading(false);
    }
  }

  const clearEquipmentTimeline = () => {
    setTimelineItems([]);
  }

  const clearEquipmentDetail = () => {
    setEquipmentDetail(undefined);
    clearEquipmentTimeline();
  }

  return {
    loading,
    equipmentDetail,
    timelineItems,
    timelineLoading,
    hispitalLogo,
    loadTimeline,
    loadEquipmentDetail,
    clearEquipmentDetail,
    clearEquipmentTimeline,
    LoadHistoryLogo
  };
}
