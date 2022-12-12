import React, { useContext } from 'react';
import { Row, Col, Dropdown, Menu, Button, Space, Tooltip } from 'antd';
import type { MenuProps } from 'antd/es/menu/index';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import EditorContext from '../../EditorContext';
import useTemplateContext from '../../hooks/useTemplateContext';
import { EditorAction } from '../../hooks/useAction';
import EditableCell from '../EditableCell';
import PlaceholderNode from '../Placeholder';
import type { IComponentNode } from '../../type';
import styles from '../../index.less';

interface IComponentProps {
  component: IComponentNode;
}

const Placeholder = ` ___ `;

const ContextNode: React.FC<IComponentProps> = ({ component }) => {
  const editorContext = useContext(EditorContext);
  const { mode, activeComponent } = editorContext.editorState;
  const isEdit = mode === 'EDIT';
  const active = activeComponent?.id === component.id;
  const [topContexts, bottomContexts, lastRowContext] =
    useTemplateContext(component);

  const onClickOption = (option: any, record: IComponentNode) => {
    editorContext.dispatch({
      type: EditorAction.ADD_CONTEXT,
      payload: {
        type: record.properties?.contextType,
        record,
        position: option.key,
      },
    });
  };

  const renderMoreMenus = (record: IComponentNode) => (
    <Menu onClick={(option) => onClickOption(option, record)}>
      <Menu.Item key="before">向前添加一项</Menu.Item>
      <Menu.Item key="after">向后添加一项</Menu.Item>
    </Menu>
  );

  const renderName = (item: IComponentNode, colon: boolean) => {
    return (
      <EditableCell
        initialValue={item.properties?.name}
        editable
        colon={colon}
        // readonly={mode !== 'EDIT'}
        readonly
        onSave={(value) =>
          editorContext?.dispatch({
            type: EditorAction.SAVE,
            payload: {
              value,
              type: 'CONTEXT_ITEM',
              parentId: 'context',
              id: item.id,
            },
          })
        }
        className={styles.editableRow}
      />
    );
  };

  const renderDetail = (item: IComponentNode) => {
    let value: string;
    switch (mode) {
      case 'PREVIEW_WITH_VALUE':
      case 'DETAIL':
        value = item.properties?.contextValue || '___';
        break;
      case 'EDIT':
        value = `{{${item.properties?.contextCode}}}`;
        break;
      default:
        value = Placeholder;
        break;
    }

    return (
      <div key={item.id} className={styles.contextValueWrapper}>
        <Row>
          <Col span={!isEdit ? 24 : 20}>{value}</Col>
          {isEdit && (
            <Col span={4}>
              <div className={styles.editableContextOper}>
                <Space>
                  <Tooltip title="删除上下文">
                    <DeleteOutlined
                      onClick={() =>
                        editorContext?.dispatch({
                          type: EditorAction.DELETE_CONTEXT_ITEM,
                          payload: {
                            id: item.id,
                          },
                        })
                      }
                    />
                  </Tooltip>
                  <Dropdown overlay={renderMoreMenus(item)}>
                    <PlusOutlined />
                  </Dropdown>
                </Space>
              </div>
            </Col>
          )}
        </Row>
      </div>
    );
  };

  const renderBottomRow = (item: IComponentNode, extra?: boolean) => {
    return (
      <>
        <Col span={4} className={styles.editableItemCol}>
          <div className={styles.editableItemColName}>
            {renderName(item, false)}
          </div>
        </Col>
        <Col span={extra ? 20 : 8} className={styles.editableDetailCol}>
          <div className={styles.editableItemColDetail}>
            {renderDetail(item)}
          </div>
        </Col>
      </>
    );
  };

  const onMenuClick: MenuProps['onClick'] = ({ key }) => {
    editorContext.dispatch({
      type: EditorAction.ADD_CONTEXT,
      payload: {
        type: key,
      },
    });
  };

  const operMenu = (
    <Menu onClick={onMenuClick}>
      <Menu.Item key="top">上方</Menu.Item>
      <Menu.Item key="bottom">下方</Menu.Item>
    </Menu>
  );

  return (
    <div
      className={`${
        !isEdit
          ? `${styles.componentPreviewWrapper} report-node`
          : `${styles.componentWrapper} ${
              active ? styles.componentWrapperActive : ''
            }`
      } `}
      style={{ marginBottom: 20 }}
      onClick={(e) => {
        if (mode !== 'EDIT') {
          return;
        }
        e.stopPropagation();
        editorContext.dispatch({
          type: EditorAction.SET_ACTIVE_COMPONENT,
          payload: {
            activeComponent: component,
          },
        });
      }}
    >
      <Row>
        {topContexts?.map((item) => (
          <Col span={12} key={item.id}>
            <Row>
              <Col span={10}>{renderName(item, true)}</Col>
              <Col span={14}>{renderDetail(item)}</Col>
            </Row>
          </Col>
        ))}
      </Row>
      <div className={styles.editableSystemBottomWrapper}>
        {bottomContexts?.map((item) => (
          <Row className={styles.editableItemRow} key={item[0].id}>
            {renderBottomRow(item[0])}
            {renderBottomRow(item[1])}
          </Row>
        ))}
        {!!lastRowContext && (
          <Row className={styles.editableItemRow} key={lastRowContext.id}>
            {renderBottomRow(lastRowContext, true)}
          </Row>
        )}
      </div>
      {isEdit && component.children?.length === 0 && (
        <PlaceholderNode title="系统上下文区域" />
      )}
      {isEdit && (
        <div>
          <Dropdown overlay={operMenu}>
            <Button style={{ width: '100%', marginTop: 50 }} type="primary">
              添加上下文
            </Button>
          </Dropdown>
        </div>
      )}
    </div>
  );
};

export default ContextNode;
