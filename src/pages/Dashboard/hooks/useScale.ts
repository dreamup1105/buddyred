/* eslint-disable no-param-reassign */
import { useState } from 'react';
import type { RefObject } from 'react';
import useMount from '@/hooks/useMount';
import useUnmount from '@/hooks/useUnmount';

const designWidth = 2560; // 视觉稿宽度
const designHeight = 1440; // 视觉稿高度

export default function useScale(ref?: RefObject<HTMLDivElement>) {
  const [scale, setScale] = useState({
    scaleX: 1,
    scaleY: 1,
  });
  const refreshScale = () => {
    document.body.style.width = `${designWidth}px`;
    document.body.style.height = `${designHeight}px`;
    document.body.style.overflow = 'hidden';

    const docWidth = document.documentElement.clientWidth;
    const docHeight = document.documentElement.clientHeight;
    let widthRatio = docWidth / designWidth;
    let heightRatio = docHeight / designHeight;
    setScale({
      scaleX: widthRatio,
      scaleY: heightRatio,
    });
    if (ref?.current) {
      ref.current.style.transform = `scale(${widthRatio},${heightRatio})`;
    }
    setTimeout(() => {
      const lateWidth = document.documentElement.clientWidth;
      const lateHeight = document.documentElement.clientHeight;

      if (lateWidth === docWidth) return;

      widthRatio = lateWidth / designWidth;
      heightRatio = lateHeight / designHeight;
      setScale({
        scaleX: widthRatio,
        scaleY: heightRatio,
      });
      if (ref?.current) {
        ref.current!.style.transform = `scale(${widthRatio},${heightRatio})`;
      }
    }, 0);
  };

  const pageshowHandler = (e: PageTransitionEvent) => {
    if (e.persisted) {
      refreshScale();
    }
  };

  useMount(() => {
    refreshScale();
    window.addEventListener('pageshow', pageshowHandler, false);
    window.addEventListener('resize', refreshScale, false);
  });

  useUnmount(() => {
    window.removeEventListener('pageshow', pageshowHandler);
    window.removeEventListener('resize', refreshScale);
  });

  return {
    scale,
  };
}
