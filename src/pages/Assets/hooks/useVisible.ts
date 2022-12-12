import { useReducer } from 'react';

type VisibleActionType = {
  type:
    | 'showDetailModal'
    | 'showVersionSelectorModal'
    | 'showEquipmentInputModal'
    | 'showEquipmentImportModal'
    | 'showTimeline'
    | 'hideDetailModal'
    | 'hideVersionSelectorModal'
    | 'hideEquipmentInputModal'
    | 'hideEquipmentImportModal'
    | 'hideTimeline'
};

const initialVisibleState = {
  timelineDrawerVisible: false,
  detailModalVisible: false,
  versionSelectorModalVisible: false,
  equipmentInputModalVisible: false,
  equipmentImportModalVisible: false,
};

const reducer = (
  state: typeof initialVisibleState,
  action: VisibleActionType,
) => {
  switch (action.type) {
    case 'showDetailModal':
      return { ...state, detailModalVisible: true };
    case 'showVersionSelectorModal':
      return { ...state, versionSelectorModalVisible: true };
    case 'showEquipmentInputModal':
      return { ...state, equipmentInputModalVisible: true };
    case 'showEquipmentImportModal':
      return { ...state, equipmentImportModalVisible: true };
    case 'showTimeline':
      return { ...state, timelineDrawerVisible: true};
    case 'hideDetailModal':
      return { ...state, detailModalVisible: false };
    case 'hideVersionSelectorModal':
      return { ...state, versionSelectorModalVisible: false };
    case 'hideEquipmentInputModal':
      return { ...state, equipmentInputModalVisible: false };
    case 'hideEquipmentImportModal':
      return { ...state, equipmentImportModalVisible: false };
    case 'hideTimeline':
      return { ...state, timelineDrawerVisible: false };
    default:
      return { ...state };
  }
};

export default function useVisible() {
  const [visibleState, dispatch] = useReducer(reducer, initialVisibleState);

  return {
    visibleState,
    dispatch,
  };
}
