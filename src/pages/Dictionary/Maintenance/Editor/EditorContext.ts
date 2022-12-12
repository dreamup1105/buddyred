import React from 'react';
import type { EditorState, EditorDispatchFunc } from './hooks/useAction';

interface EditorContextProps {
  editorState: EditorState;
  dispatch: EditorDispatchFunc;
}

export default React.createContext({} as EditorContextProps);
