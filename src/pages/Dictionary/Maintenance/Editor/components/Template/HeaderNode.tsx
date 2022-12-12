import React, { useContext } from 'react';
import DefaultLogo from '@/assets/yxk-logo.png';
import EditorContext from '../../EditorContext';
import { EditorAction } from '../../hooks/useAction';
import EditableCell from '../EditableCell';
import type { IComponentNode } from '../../type';
import styles from '../../index.less';

interface IComponentProps {
  component: IComponentNode;
}

const HeaderNode: React.FC<IComponentProps> = ({ component }) => {
  const editorContext = useContext(EditorContext);
  const { mode } = editorContext.editorState;
  const isEdit = mode === 'EDIT';

  return (
    <div className={`${styles.componentHeaderWrapper} report-node`}>
      <div className={!isEdit ? styles.componentPreviewWrapper : ''}>
        <img
          src={component.properties!.logoSrc || DefaultLogo}
          className={styles.editableHeaderLogo}
        />
        <div>
          <EditableCell
            className={`${styles.editableHeaderTitle} ${styles.editableRow}`}
            initialValue={component.properties!.title}
            editable
            readonly={!isEdit}
            onSave={(row) => {
              editorContext?.dispatch({
                type: EditorAction.SAVE,
                payload: {
                  value: row,
                  type: 'TITLE',
                },
              });
            }}
          />
        </div>
        <div>
          <EditableCell
            className={`${styles.editableHeaderSubtitle} ${styles.editableRow}`}
            initialValue={component.properties!.subTitle}
            editable
            readonly={!isEdit}
            onSave={(row) => {
              editorContext?.dispatch({
                type: EditorAction.SAVE,
                payload: {
                  value: row,
                  type: 'SUB_TITLE',
                },
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderNode;
