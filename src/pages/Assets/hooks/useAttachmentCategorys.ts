import { useState } from 'react';
import { fetchAttachmentCategorys } from '../service';
import type { ICertCategoryItem } from '../type';

// 附件类别
export default function useAttachmentCategorys () {
  const [attachmentCategorys, setAttachmentCategorys] = useState<
    ICertCategoryItem[]
  >([]);

  // 获取附件类别
  const loadAttachmentCategorys = async () => {
    try {
      const { data } = await fetchAttachmentCategorys();
      setAttachmentCategorys(data);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    attachmentCategorys,
    loadAttachmentCategorys,
  }
}