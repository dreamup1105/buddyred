import { Form, Input } from 'antd';
import React, { useState, useContext, useEffect, useRef } from 'react';
import EditableContext from './EditableContext';

interface EditableCellProps<RecordType> {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: string;
  record: RecordType;
  rowIndex: number;
  inputProps?: {
    type: string;
    [key: string]: any;
  };
  handleSave: (record: RecordType, rowIndex: number) => void;
}

function EditableCell<RecordType>({
  title,
  editable,
  children,
  dataIndex,
  record,
  rowIndex,
  inputProps,
  handleSave,
  ...restProps
}: EditableCellProps<RecordType>) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<Input>();
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing && inputRef.current !== undefined) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values }, rowIndex);
    } catch (err) {
      console.log('Save failed:', err);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} 必填`,
          },
        ]}
      >
        <Input
          ref={inputRef as any}
          onPressEnter={save}
          onBlur={save}
          {...inputProps}
        />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
}

export default EditableCell;
