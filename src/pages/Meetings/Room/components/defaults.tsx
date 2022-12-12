import React from 'react';
import * as Type from './types';

export const Loader = (): React.ReactElement => <div>加载会议...</div>;

export const Props: Type.Props = {
  domain: 'hy.bjyixiu.com',
  roomName: (Math.random() + 0.48151642).toString(36).substring(2),
};

export const ContainerStyle: React.CSSProperties = {
  width: '800px',
  height: '400px',
};

export const FrameStyle = (loading: boolean): React.CSSProperties => ({
  display: loading ? 'none' : 'block',
  width: '100%',
  height: '100%',
});
