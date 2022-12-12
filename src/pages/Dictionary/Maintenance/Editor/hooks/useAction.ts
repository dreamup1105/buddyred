import { useReducer } from 'react';
import { componentAction } from '../helper';
import type {
  IComponentNode,
  ActiveRecord,
  EditorRenderMode,
  ActiveContextRecord,
} from '../type';
import { InitComponentData } from '../type';

export enum EditorAction {
  ADD_GROUP = 'ADD_GROUP', // 添加组
  ADD_GROUP_BEFORE = 'ADD_GROUP_BEFORE', // 向上添加一组
  ADD_GROUP_AFTER = 'ADD_GROUP_AFTER', // 向下添加一组
  ADD_BIZ_ITEM = 'ADD_BIZ_ITEM', // 添加保养项目
  ADD_BIZ_ITEM_BEFORE = 'ADD_BIZ_ITEM_BEFORE', // 向上添加一个保养项目
  ADD_BIZ_ITEM_AFTER = 'ADD_BIZ_ITEM_AFTER', // 向下添加一个保养项目
  ADD_CONTEXT = 'ADD_CONTEXT', // 添加上下文
  DELETE_GROUP = 'DELETE_GROUP', // 删除组
  DELETE_BIZ_ITEM = 'DELETE_BIZ_ITEM', // 删除保养项目
  DELETE_CONTEXT_ITEM = 'DELETE_CONTEXT_ITEM', // 删除上下文项目
  SET_ACTIVE_COMPONENT = 'SET_ACTIVE_COMPONENT', // 设置当前组件为选中状态
  UPDATE_ACTIVE_COMPONENT = 'UPDATE_ACTIVE_COMPONENT', // 更新选中组件
  SET_ACTIVE_RECORD = 'SET_ACTIVE_RECORD', // 设备当前记录为选中状态
  SET_COMPONENT_DATA = 'SET_COMPONENT_DATA', // 设置组件树值
  SET_MODE = 'SET_MODE', // 设置模式
  INSERT_BIZ_ITEM = 'INSERT_BIZ_ITEM', // 在给定位置插入保养项目
  INSERT_CONTEXT_ITEM = 'INSERT_CONTEXT_ITEM', // 在给定位置插入上下文项
  SHOW_MAINTAIN_ITEMS_MODAL = 'SHOW_MAINTAIN_ITEMS_MODAL', // 显示保养项目选择Modal
  HIDE_MAINTAIN_ITEMS_MODAL = 'HIDE_MAINTAIN_ITEMS_MODAL',
  SHOW_CONTEXT_MODAL = 'SHOW_CONTEXT_MODAL', // 显示上下文选择Modal
  HIDE_CONTEXT_MODAL = 'HIDE_CONTEXT_MODAL',
  APPLY_ATTRS = 'APPLY_ATTRS', // 应用节点属性
  SAVE = 'SAVE', // 单元格保存
  INIT = 'INIT', // 初始化
  UPDATE_SPEC_VERSION = 'UPDATE_SPEC_VERSION', // 更新业务项版本
}

export interface EditorState {
  activeComponent: IComponentNode | undefined;
  componentData: IComponentNode[];
  activeRecord: ActiveRecord; // 当前激活的保养项
  activeContextRecord: ActiveContextRecord; // 当前激活的上下文项
  bizItemsModalVisible: boolean;
  contextModalVisible: boolean;
  mode: EditorRenderMode;
}

export type EditorDispatchFunc = (params: {
  type: EditorAction;
  payload?: any;
}) => void;

const DefaultState: EditorState = {
  activeComponent: undefined,
  activeRecord: undefined,
  activeContextRecord: undefined,
  mode: 'EDIT',
  componentData: InitComponentData,
  bizItemsModalVisible: false,
  contextModalVisible: false,
};

function reducer(
  state: EditorState,
  action: { type: EditorAction; payload?: any },
): EditorState {
  switch (action.type) {
    case EditorAction.ADD_GROUP:
      return {
        ...state,
        componentData: componentAction.addGroup(state.componentData),
      };
    case EditorAction.ADD_GROUP_BEFORE:
      return {
        ...state,
        componentData: componentAction.addGroup(
          state.componentData,
          'before',
          action.payload.record,
        ),
      };
    case EditorAction.ADD_GROUP_AFTER:
      return {
        ...state,
        componentData: componentAction.addGroup(
          state.componentData,
          'after',
          action.payload.record,
        ),
      };
    case EditorAction.ADD_BIZ_ITEM:
      return {
        ...state,
        activeRecord: action.payload?.type
          ? {
              type: action.payload.type,
              record: action.payload.record,
            }
          : undefined,
        bizItemsModalVisible: true,
      };
    case EditorAction.ADD_CONTEXT:
      return {
        ...state,
        activeContextRecord: {
          type: action.payload.type,
          record: action.payload.record,
          position: action.payload.position,
        },
        contextModalVisible: true,
      };
    case EditorAction.ADD_BIZ_ITEM_BEFORE:
      return state;
    case EditorAction.ADD_BIZ_ITEM_AFTER:
      return state;
    case EditorAction.DELETE_GROUP:
      return {
        ...state,
        componentData: componentAction.deleteGroup(
          state.componentData,
          action.payload.id,
        ),
      };
    case EditorAction.DELETE_BIZ_ITEM:
      return {
        ...state,
        componentData: componentAction.deleteBizItem(
          state.componentData,
          action.payload.parentId,
          action.payload.id,
        ),
      };
    case EditorAction.DELETE_CONTEXT_ITEM:
      return {
        ...state,
        componentData: componentAction.deleteContextItem(
          state.componentData,
          action.payload.id,
        ),
      };
    case EditorAction.SET_ACTIVE_COMPONENT:
      return {
        ...state,
        activeComponent: action.payload.activeComponent,
      };
    case EditorAction.SET_ACTIVE_RECORD:
      return {
        ...state,
        activeRecord: action.payload.activeRecord,
      };
    case EditorAction.APPLY_ATTRS:
      return {
        ...state,
        componentData: componentAction.applyAttrs(
          state.componentData,
          state.activeComponent,
          action.payload.attrs,
        ),
      };
    case EditorAction.SAVE:
      return {
        ...state,
        componentData: componentAction.save(
          state.componentData,
          action.payload.value,
          action.payload.type,
          action.payload.parentId,
          action.payload.id,
        ),
      };
    case EditorAction.INIT:
      return action.payload || DefaultState;
    case EditorAction.SHOW_MAINTAIN_ITEMS_MODAL:
      return {
        ...state,
        bizItemsModalVisible: true,
      };
    case EditorAction.HIDE_MAINTAIN_ITEMS_MODAL:
      return {
        ...state,
        bizItemsModalVisible: false,
      };
    case EditorAction.SHOW_CONTEXT_MODAL:
      return {
        ...state,
        contextModalVisible: true,
      };
    case EditorAction.HIDE_CONTEXT_MODAL:
      return {
        ...state,
        contextModalVisible: false,
      };
    case EditorAction.SET_COMPONENT_DATA:
      return {
        ...state,
        componentData: action.payload.componentData,
      };
    case EditorAction.SET_MODE:
      return {
        ...state,
        mode: action.payload.mode,
      };
    case EditorAction.INSERT_BIZ_ITEM:
      return {
        ...state,
        componentData: componentAction.insertBizItem(
          state.componentData,
          state.activeComponent,
          action.payload.selectedItem,
          state.activeRecord,
        ),
        bizItemsModalVisible: false,
        activeRecord: undefined,
      };
    case EditorAction.INSERT_CONTEXT_ITEM:
      return {
        ...state,
        componentData: componentAction.insertContextItem(
          state.componentData,
          action.payload.selectedItem,
          state.activeContextRecord,
        ),
        contextModalVisible: false,
        activeContextRecord: undefined,
      };
    case EditorAction.UPDATE_ACTIVE_COMPONENT:
      if (!state.activeComponent) {
        return state;
      }
      return {
        ...state,
        activeComponent: getActiveComponent(
          state.activeComponent.id,
          state.componentData,
        ),
      };
    case EditorAction.UPDATE_SPEC_VERSION:
      return {
        ...state,
        componentData: componentAction.updateSpecVersion(
          state.componentData,
          action.payload.bizItems,
        ),
      };
    default:
      return state;
  }
}

function getActiveComponent(id: string, componentData: IComponentNode[]) {
  return componentData.find((item) => item.id === id);
}

export default function useAction(): [EditorState, EditorDispatchFunc] {
  const [state, dispatch] = useReducer(reducer, DefaultState);
  return [state, dispatch];
}
