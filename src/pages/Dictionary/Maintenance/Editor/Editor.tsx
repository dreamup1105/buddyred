import React, { useEffect } from 'react';
import type { MutableRefObject } from 'react';
import { Button, Row, Col } from 'antd';
import type { ITemplateContext } from '@/pages/Dictionary/Maintenance/Template/type';
import FormRender from './components/Form/FormRender';
import HeaderNode from './components/Template/HeaderNode';
import GroupNode from './components/Template/GroupNode';
import ContextNode from './components/Template/ContextNode';
import PlaceholderNode from './components/Placeholder';
import BizItemsModal from './components/MaintainItemsModal';
import ContextItemsModal from './components/ContextModal';
import EditorContext from './EditorContext';
import useAction, { EditorAction } from './hooks/useAction';
import type {
  IComponentNode,
  IMaintainItemWithVersion,
  EditorRenderMode,
  ActionType,
} from './type';
import styles from './index.less';
// import ItemDetailsModal from './components/ItemDetailsModal';

interface IComponentProps {
  componentData: IComponentNode[];
  bizItems?: IMaintainItemWithVersion[];
  templateForItems?: IMaintainItemWithVersion[];
  contexts?: ITemplateContext[];
  onChange?: (componentData: IComponentNode[]) => void;
  mode: EditorRenderMode;
  actionRef?: MutableRefObject<ActionType | undefined>;
  [key: string]: any;
}

const Editor: React.FC<IComponentProps> = ({
  componentData,
  bizItems = [],
  templateForItems = [],
  contexts = [],
  mode = 'EDIT',
  actionRef,
  onChange,
  ...restProps
}) => {
  const isEdit = mode === 'EDIT';
  const [editorState, dispatch] = useAction();
  const hasGroup = !!editorState?.componentData.filter(
    (item) => item.type === 'GROUP',
  ).length;

  const canvasDom = (
    <div className={styles.canvas} {...restProps}>
      {editorState?.componentData?.map((component) => {
        switch (component.type) {
          case 'HEADER':
            return <HeaderNode key={component.id} component={component} />;
          case 'CONTEXT':
            return <ContextNode key={component.id} component={component} />;
          case 'GROUP':
            return <GroupNode key={component.id} component={component} />;
          default:
            return null;
        }
      })}
      {isEdit && !hasGroup && <PlaceholderNode title="保养项目区域" />}
      {isEdit && (
        <div>
          <Button
            type="primary"
            style={{ width: '100%', marginTop: 20 }}
            onClick={() => dispatch({ type: EditorAction.ADD_GROUP })}
          >
            添加组
          </Button>
        </div>
      )}
    </div>
  );

  /**
   * 每种mode的布局形式是不同的
   * DETAIL：常用于具体业务的详情展示，（例：保养管理-已完成-详情）需在Modal中平铺内容
   * EDIT：编辑状态下，分为左中右3栏布局（组件区、画布区、属性区）
   * PREVIEW: 预览状态下，就是将编辑状态下的组件区和属性区隐藏，仅留下画布预览区并居中显示
   * @returns
   */
  const renderCanvasLayout = () => {
    switch (mode) {
      case 'DETAIL':
        return canvasDom;
      case 'EDIT':
        return (
          <>
            <Row gutter={16}>
              <Col span={6} />
              <Col
                span={12}
                className={styles.etitorColWrapper}
                style={{ height: window.innerHeight - 180 }}
              >
                {canvasDom}
              </Col>
              <Col span={6}>
                <FormRender />
              </Col>
            </Row>
          </>
        );
      case 'PREVIEW':
        return (
          <Row gutter={16} justify="center">
            <Col span={12}>{canvasDom}</Col>
          </Row>
        );
      default:
        return canvasDom;
    }
  };

  useEffect(() => {
    dispatch({
      type: EditorAction.SET_COMPONENT_DATA,
      payload: {
        componentData,
      },
    });
  }, [componentData]);

  useEffect(() => {
    dispatch({
      type: EditorAction.SET_MODE,
      payload: {
        mode,
      },
    });
  }, [mode]);

  useEffect(() => {
    if (actionRef) {
      // eslint-disable-next-line no-param-reassign
      actionRef.current = {
        getComponentData: () => {
          return editorState.componentData;
        },
        updateSpecVersion: (items) => {
          dispatch({
            type: EditorAction.UPDATE_SPEC_VERSION,
            payload: {
              bizItems: items,
            },
          });
        },
      };
    }
  }, [actionRef, editorState.componentData, dispatch]);

  useEffect(() => {
    onChange?.(editorState.componentData);
    dispatch({
      type: EditorAction.UPDATE_ACTIVE_COMPONENT,
    });
  }, [editorState.componentData, onChange]);

  return (
    <>
      <EditorContext.Provider value={{ editorState, dispatch }}>
        {renderCanvasLayout()}
      </EditorContext.Provider>
      {mode === 'EDIT' && (
        <>
          <BizItemsModal
            visible={editorState.bizItemsModalVisible}
            initialItemList={bizItems}
            templateForItemList={templateForItems}
            onCancel={() =>
              dispatch({ type: EditorAction.HIDE_MAINTAIN_ITEMS_MODAL })
            }
            onSelect={(selectedItem) =>
              dispatch({
                type: EditorAction.INSERT_BIZ_ITEM,
                payload: {
                  selectedItem,
                },
              })
            }
          />
          {/* 添加上下文弹框 */}
          <ContextItemsModal
            visible={editorState.contextModalVisible}
            initialContextList={contexts}
            onCancel={() => dispatch({ type: EditorAction.HIDE_CONTEXT_MODAL })}
            onSelect={(selectedItem) =>
              dispatch({
                type: EditorAction.INSERT_CONTEXT_ITEM,
                payload: {
                  selectedItem,
                },
              })
            }
          />
        </>
      )}
    </>
  );
};

export default Editor;
