import React, { useContext } from 'react';
import {
  Row,
  Col,
  Tooltip,
  Button,
  Popconfirm,
  Dropdown,
  Menu,
  Space,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import omit from 'omit.js';
import EditorContext from '../../EditorContext';
import { EditorAction } from '../../hooks/useAction';
import { normalizeStyleAttrs } from '../../helper';
import EditableCell from '../EditableCell';
import type { IComponentNode, IDetailItem } from '../../type';
import styles from '../../index.less';

interface IComponentProps {
  component: IComponentNode;
}

const GroupNode: React.FC<IComponentProps> = ({ component }) => {
  const editorContext = useContext(EditorContext);
  const { mode, activeComponent } = editorContext.editorState;
  const isEdit = mode === 'EDIT';
  const isActive = activeComponent?.id === component.id;
  const wrapperClassname = !isEdit
    ? `${styles.componentPreviewWrapper}`
    : `${styles.componentWrapper} ${
        isActive ? styles.componentWrapperActive : ''
      }`;
  const wrapperStyles = normalizeStyleAttrs(
    omit(component.properties?.style, ['isHideBottomBorder']),
  );

  const onClickOption = (option: any, record: IComponentNode) => {
    switch (record.type) {
      case 'GROUP':
        editorContext?.dispatch({
          type:
            option.key === 'before'
              ? EditorAction.ADD_GROUP_BEFORE
              : EditorAction.ADD_GROUP_AFTER,
          payload: {
            record,
          },
        });
        break;
      case 'BIZ_ITEM':
        editorContext.dispatch({
          type: EditorAction.ADD_BIZ_ITEM,
          payload: {
            type: option.key,
            record,
          },
        });
        break;
      default:
        break;
    }
  };

  const renderMoreMenus = (record: IComponentNode) => (
    <Menu onClick={(option) => onClickOption(option, record)}>
      <Menu.Item key="before">
        向上添加一{record.type === 'BIZ_ITEM' ? '行' : '组'}
      </Menu.Item>
      <Menu.Item key="after">
        向下添加一{record.type === 'BIZ_ITEM' ? '行' : '组'}
      </Menu.Item>
    </Menu>
  );

  const renderDetail = (details: IDetailItem[]) =>
    details.map((detail) => {
      let codeVal: string | string[] = '';

      switch (mode) {
        case 'PREVIEW_WITH_VALUE':
        case 'DETAIL':
          codeVal = detail.value?.val ?? '___';
          break;
        case 'EDIT':
          codeVal = `___`;
          break;
        default:
          codeVal = '___';
      }

      return (
        // eslint-disable-next-line react/no-array-index-key
        <div key={detail.id} style={{ padding: '5px 0' }}>
          {Array.isArray(codeVal) ? (
            <Row gutter={8} align="top">
              <Col>{detail.label}</Col>
              <Col>
                {codeVal.map((val, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={index} style={{ textDecoration: 'underline' }}>
                    {val}
                  </div>
                ))}
              </Col>
              <Col>{detail.spec}</Col>
            </Row>
          ) : (
            <>
              <span>{detail.label}</span>
              <span
                style={{
                  marginLeft: 5,
                  marginRight: 5,
                  textDecoration: 'underline',
                }}
              >
                {codeVal}
              </span>
              <span>{detail.spec}</span>
            </>
          )}
        </div>
      );
    });

  return (
    <div
      className={`${wrapperClassname} report-node`}
      style={wrapperStyles}
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
      <div className={styles.editableGroupWrapper}>
        {/* <div
          className={styles.editableGroupContentWrapper}
          style={{
            // eslint-disable-next-line @typescript-eslint/dot-notation
            borderBottom: component.properties?.style?.['isHideBottomBorder']
              ? 'none'
              : '1px solid #0d74c6',
          }} */}
        <div
          className={`${styles.editableGroupContentWrapper} ${
            component.properties?.style?.isHideBottomBorder
              ? styles.hideBottomBorder
              : ''
          }`}
        >
          {isEdit && (
            <div className={styles.editableGroupOper}>
              <Space>
                <Popconfirm
                  title="确认要删除该组吗?"
                  onConfirm={() =>
                    editorContext?.dispatch({
                      type: EditorAction.DELETE_GROUP,
                      payload: {
                        id: component.id,
                      },
                    })
                  }
                  okText="确认"
                  cancelText="取消"
                >
                  <Tooltip title="删除组">
                    <DeleteOutlined />
                  </Tooltip>
                </Popconfirm>
                <Dropdown overlay={renderMoreMenus(component)}>
                  <PlusOutlined />
                </Dropdown>
              </Space>
            </div>
          )}
          <EditableCell
            initialValue={component.properties!.groupName}
            readonly={!isEdit}
            editable
            onSave={(value) =>
              editorContext?.dispatch({
                type: EditorAction.SAVE,
                payload: {
                  value,
                  type: 'GROUP',
                  parentId: null,
                  id: component.id,
                },
              })
            }
            className={`${styles.editableGroupTitle} ${styles.editableRow}`}
            style={{
              borderBottom:
                !component.children?.length &&
                !component.properties?.style?.isHideBottomBorder
                  ? '1px solid #0d74c6'
                  : 'none',
            }}
          />
          <div>
            {component.children &&
              component.children.map((item) => (
                <Row key={item.id} className={styles.editableItemRow}>
                  <Col span={5} className={styles.editableItemCol}>
                    <div className={styles.editableItemColName}>
                      <EditableCell
                        initialValue={item.properties!.name}
                        editable
                        // readonly={!isEdit}
                        readonly
                        onSave={(value) =>
                          editorContext?.dispatch({
                            type: EditorAction.SAVE,
                            payload: {
                              value,
                              type: 'BIZ_ITEM',
                              parentId: component.id,
                              id: item.id,
                            },
                          })
                        }
                        className={styles.editableRow}
                      />
                    </div>
                  </Col>
                  <Col span={19} className={styles.editableDetailCol}>
                    <div className={styles.editableItemColDetail}>
                      <Row>
                        <Col span={!isEdit ? 24 : 20}>
                          {item.properties!.details &&
                            renderDetail(item.properties!.details)}
                        </Col>
                        {isEdit && (
                          <Col span={4} className={styles.editableDetailColDel}>
                            <div className={styles.editableDetailColDelIcon}>
                              <Space>
                                <Tooltip title="删除">
                                  <DeleteOutlined
                                    onClick={() =>
                                      editorContext?.dispatch({
                                        type: EditorAction.DELETE_BIZ_ITEM,
                                        payload: {
                                          parentId: item.parentId!,
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
                  </Col>
                </Row>
              ))}
          </div>
        </div>
        {isActive && isEdit ? (
          <div>
            <Button
              type="primary"
              style={{ width: '100%', marginTop: 20 }}
              onClick={() =>
                editorContext.dispatch({ type: EditorAction.ADD_BIZ_ITEM })
              }
            >
              添加保养项
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default GroupNode;
