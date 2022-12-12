import React, { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import useUnmount from '@/hooks/useUnmount';
import useScale from '@/pages/Dashboard/hooks/useScale';
import type { ActionRef } from './type';
import styles from './index.less';

interface IComponentProps<T> {
  rowKey: string;
  dataSource: T[];
  columns: {
    title: string;
    dataIndex: string;
    key: string;
    render?: (text: any, record: T) => ReactNode;
    width?: number | string;
  }[];
  actionRef?: ActionRef;
  scroll?: {
    x?: number;
    y?: number;
  };
  onScrollToBottom?: () => any;
  tableHeaderStyle?: CSSProperties;
  tableBodyStyle?: CSSProperties;
}

// const defaultScrollSpeed = 50;

const ScrollableTable = <T extends any>({
  rowKey,
  columns = [],
  dataSource,
  scroll,
  actionRef,
  onScrollToBottom,
  tableHeaderStyle,
  tableBodyStyle,
}: IComponentProps<T>) => {
  const { scale } = useScale();
  const rowHeight = useRef<number>();
  const scaleYRef = useRef<number>(scale.scaleY);
  const tableBodyRef = useRef<HTMLTableElement>(null);
  const tableBodyWrapperRef = useRef<HTMLDivElement>(null);
  const scrollTop = useRef<number>(0);
  const frameId = useRef<number>();
  const bodyStyle: CSSProperties = scroll?.y
    ? {
        maxHeight: scroll.y,
        overflowY: 'scroll',
      }
    : {};

  const getRowHeight = () => {
    if (tableBodyRef.current && scroll?.y) {
      return (
        (tableBodyRef.current.querySelector('tbody td')!.clientHeight + 2) *
        scale.scaleY
      );
    }
    return 36;
  };

  const stopScrollTask = () => {
    if (frameId.current) {
      cancelAnimationFrame(frameId.current);
    }
  };

  const startScrollTask = () => {
    stopScrollTask();
    if (tableBodyRef.current && scroll?.y) {
      rowHeight.current = getRowHeight();
      const tick = () => {
        const tableHeight = dataSource.length * rowHeight.current!;
        if (
          tableHeight - scrollTop.current * scaleYRef.current <=
          scroll.y! * scaleYRef.current
        ) {
          if (tableHeight > scroll.y!) {
            onScrollToBottom?.();
          }
        } else {
          scrollTop.current += 1;
          tableBodyWrapperRef.current!.scrollTop = scrollTop.current;
          frameId.current = requestAnimationFrame(tick);
        }
      };

      frameId.current = requestAnimationFrame(tick);
    }
  };

  if (actionRef) {
    // eslint-disable-next-line no-param-reassign
    actionRef.current = {
      restart: () => {
        scrollTop.current = 0;
      },
      stop: stopScrollTask,
    };
  }

  const onMouseEnter = () => {
    stopScrollTask();
  };

  const onMouseLeave = () => {
    scrollTop.current = tableBodyWrapperRef.current!.scrollTop;
    startScrollTask();
  };

  useUnmount(stopScrollTask);

  useEffect(() => {
    if (dataSource.length) {
      startScrollTask();
    }
  }, [dataSource]);

  useEffect(() => {
    scaleYRef.current = scale.scaleY;
    if (dataSource.length && tableBodyRef.current) {
      rowHeight.current = getRowHeight();
    }
  }, [scale.scaleY, dataSource]);

  return (
    <div
      className={styles.tableWrapper}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.header}>
        <table style={{ ...tableHeaderStyle }}>
          <colgroup>
            {columns.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key}>{c.title}</th>
              ))}
            </tr>
          </thead>
        </table>
      </div>
      <div
        className={styles.body}
        style={{ ...bodyStyle }}
        ref={tableBodyWrapperRef}
      >
        <table style={{ ...tableBodyStyle }} ref={tableBodyRef}>
          <colgroup>
            {columns.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>
          <tbody>
            {dataSource.map((item) => (
              <tr key={item[rowKey]}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render
                      ? column.render(item[column.dataIndex], item)
                      : item[column.dataIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScrollableTable;
