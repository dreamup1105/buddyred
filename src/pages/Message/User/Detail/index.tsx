import React, { useState, useEffect } from 'react';
import { Descriptions, message, Breadcrumb } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import useMount from '@/hooks/useMount';
import useReadState from '@/hooks/useReadState';
import { useParams, Link } from 'umi';
import { fetchMessageDetail } from '../service';
import type { IMessageItem } from '../../SentMessage/type';

const MessageDetail: React.FC = () => {
  const params = useParams<{ id: string | undefined }>();
  const [detail, setDetail] = useState<IMessageItem>();
  const { singleMarkRead } = useReadState();

  const loadMessageDetail = async () => {
    if (!params?.id) {
      message.error('无效的消息id');
      return;
    }
    singleMarkRead(params.id);
    try {
      const { code, data } = await fetchMessageDetail(params.id);
      if (code === 0) {
        setDetail(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderBreadcrumb = () => {
    return (
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href="/">首页</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={'/message/user'} replace>
            我的消息
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>详情</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={'/message/user'} replace>
            返回上一级
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
    );
  };

  useMount(() => {
    document.title = '消息详情';
    loadMessageDetail();
  });

  useEffect(() => {
    loadMessageDetail();
  }, [params?.id]);

  return (
    <PageContainer
      header={{
        breadcrumbRender: () => renderBreadcrumb(),
      }}
    >
      <Descriptions bordered style={{ background: '#fff', marginTop: '20px' }}>
        <Descriptions.Item label="标题" span={2}>
          {detail?.title ?? '-'}
        </Descriptions.Item>
        <Descriptions.Item label="发送时间">
          {detail?.createdTime ?? '-'}
        </Descriptions.Item>
        <Descriptions.Item label="内容" span={3}>
          {detail?.content ?? '-'}
        </Descriptions.Item>
      </Descriptions>
    </PageContainer>
  );
};

export default MessageDetail;
