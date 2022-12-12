import React, { useEffect, useContext } from 'react';
import { Form, InputNumber, Tabs, Button, Checkbox } from 'antd';
import EditorContext from '../../EditorContext';
import { EditorAction } from '../../hooks/useAction';

const { TabPane } = Tabs;
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const FormRender: React.FC = () => {
  const editorContext = useContext(EditorContext);
  const activeComponent = editorContext?.editorState?.activeComponent;
  const [form] = Form.useForm();
  const onSubmit = async () => {
    try {
      const formValues = await form.validateFields();
      editorContext.dispatch({
        type: EditorAction.APPLY_ATTRS,
        payload: {
          attrs: formValues,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({ ...activeComponent?.properties?.style });
  }, [activeComponent]);

  if (activeComponent?.type !== 'GROUP') {
    return null;
  }

  return (
    <Tabs type="card">
      <TabPane tab="节点属性">
        <Form form={form} labelCol={{ span: 7 }}>
          <Form.Item label="上边距" name="marginTop">
            <InputNumber style={{ width: '200px' }} />
          </Form.Item>
          <Form.Item label="下边距" name="marginBottom">
            <InputNumber style={{ width: '200px' }} />
          </Form.Item>
          <Form.Item
            label="是否隐藏下边框"
            name="isHideBottomBorder"
            valuePropName="checked"
            tooltip="避免组与组之间在无边距的情况下，边框出现重合的现象"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="button" onClick={onSubmit}>
              应用
            </Button>
          </Form.Item>
        </Form>
      </TabPane>
    </Tabs>
  );
};

export default FormRender;
