import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import type { TeamDetail } from '@/pages/Team/type';
import type { DataType } from '@/components/Preview';
import { ResourcePath } from '@/utils/constants';
import { fetchAttachments } from '@/services/global';
import PictureView from './PictureView';

interface AttachmentViewProps {
  team: TeamDetail;
}
const AttachmentView: React.FC<AttachmentViewProps> = ({ team }) => {
  const [images, setImages] = useState<DataType[]>([]);

  useEffect(() => {
    async function loadImages() {
      try {
        const { data } = await fetchAttachments(team.id);
        setImages(
          data.map(({ res }) => {
            return {
              src: `${ResourcePath}${res}`,
            };
          }),
        );
      } catch (err) {
        message.error(err.msg || err.message);
      }
    }
    loadImages();
  }, [team]);

  return <PictureView images={images} />;
};

export default AttachmentView;
