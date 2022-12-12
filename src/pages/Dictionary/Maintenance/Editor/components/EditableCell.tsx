import React, { useState, useRef, useEffect } from 'react';
import { Form, Input } from 'antd';
import type { FormItemProps } from 'antd/es/form/FormItem';
import styles from '../index.less';

interface IComponentProps {
  editable: boolean;
  readonly?: boolean;
  colon?: boolean;
  initialValue: string | undefined;
  rules?: FormItemProps['rules'];
  onSave: (value: string) => void;
  [p: string]: any;
}

const EditableCell: React.FC<IComponentProps> = ({
  editable,
  readonly = false,
  colon = false,
  initialValue = '标题',
  rules,
  onSave,
  ...restProps
}) => {
  const [form] = Form.useForm();
  const [value, setValue] = useState(initialValue);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<Input>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  useEffect(() => {
    form.setFieldsValue({
      value: initialValue,
    });
    setValue(initialValue);
  }, [initialValue]);

  const toggleEdit = () => {
    if (readonly) {
      return;
    }
    setEditing(!editing);
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      setValue(values?.value);
      onSave(values?.value);
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode;

  if (editable) {
    childNode = editing ? (
      <Form form={form}>
        <Form.Item style={{ margin: 0 }} name="value" rules={rules}>
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      </Form>
    ) : (
      <div
        className={styles.editableCellValueWrap}
        style={{ paddingRight: 24, textAlign: 'center' }}
        onClick={toggleEdit}
      >
        {value}
        {colon ? ' :' : ''}
      </div>
    );
  }

  return <div {...restProps}>{childNode}</div>;
};

export default EditableCell;
