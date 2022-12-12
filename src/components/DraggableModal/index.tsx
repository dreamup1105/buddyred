import React, { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Modal } from 'antd';
import Draggable from 'react-draggable';
import type { ModalProps } from 'antd/es/modal';

type IComponentProps = {
  children: ReactNode | null;
  title: string | ReactNode;
} & Omit<ModalProps, 'title'>;

const DraggableModal: React.FC<IComponentProps> = ({
  children,
  title,
  ...restProps
}) => {
  const [modalDisabled, setModalDisabled] = useState(false);
  const draggleRef = useRef<HTMLDivElement | null>(null);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });

  const onStart = (event: any, uiData: any) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect: DOMRect | undefined =
      draggleRef?.current?.getBoundingClientRect();

    const left = targetRect?.left || 0;
    const right = targetRect?.right || 0;
    const top = targetRect?.top || 0;
    const bottom = targetRect?.bottom || 0;

    setBounds({
      left: -left + uiData?.x,
      right: clientWidth - (right - uiData?.x),
      top: -top + uiData?.y,
      bottom: clientHeight - (bottom - uiData?.y),
    });
  };

  useEffect(() => {
    if (!restProps.visible && draggleRef.current) {
      const draggableNode = draggleRef.current;
      setTimeout(() => {
        draggableNode.style.transform = 'translate(0px, 0px)';
      }, 0);
    }
  }, [restProps.visible, draggleRef.current]);

  return (
    <Modal
      {...restProps}
      title={
        <div
          style={{
            width: '100%',
            cursor: 'move',
          }}
          onMouseOver={() => {
            if (modalDisabled) {
              setModalDisabled(false);
            }
          }}
          onMouseOut={() => {
            setModalDisabled(true);
          }}
          onFocus={() => {}}
          onBlur={() => {}}
        >
          {title}
        </div>
      }
      modalRender={(modal) => (
        <Draggable
          disabled={modalDisabled}
          bounds={bounds}
          onStart={(event, uiData) => onStart(event, uiData)}
        >
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
    >
      {children}
    </Modal>
  );
};

export default DraggableModal;
