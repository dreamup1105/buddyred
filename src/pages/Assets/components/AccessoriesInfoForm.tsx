import type { CSSProperties, ChangeEvent } from 'react';
import React, { useState, forwardRef, useImperativeHandle, Fragment } from 'react';
import { Row, Col, Form, Input, Button, Descriptions, Empty, Divider } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import RemoteSelect from './RemoteSelect';
import type { ComponentType as RemoteSelectType } from './RemoteSelect';
import { getParts } from '../service';
import type { IAccessoriesItem } from '../type';

interface IComponentProps {
  readonly?: boolean;
}

const fieldWrapperStyle = {
  borderTop: '1px dashed #d9d9d9',
  paddingTop: 25,
}

const btnStyle = {
  position: 'absolute',
  left: '50%',
  top: '40%',
  transform: 'translate3d(-50%, -50%, 0)',
}

const defaultAccessory = {
  id: undefined,
  manufacturerName: undefined,
  manufacturerId: undefined,
  modelId: undefined,
  modelName: undefined,
  name: undefined,
  productName: undefined,
  productId: undefined,
  sn: undefined,
  productDisabled: true,
  modelDisabled: true,
  validateRes: {
    manufacturer: {
      validateStatus: undefined,
      errorMsg: null,
    },
    product: {
      validateStatus: undefined,
      errorMsg: null,
    },
    model: {
      validateStatus: undefined,
      errorMsg: null,
    },
    name: {
      validateStatus: undefined,
      errorMsg: null,
    }
  }
}

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

function validateField(
  value: any,
  label: string
): { validateStatus: ValidateStatus; errorMsg: string | null } {
  if (!value) {
    return {
      validateStatus: 'error',
      errorMsg: `${label}不能为空`,
    };
  }
  return {
    validateStatus: undefined,
    errorMsg: null,
  };
}

function validateName(name: string | undefined): { validateStatus: ValidateStatus; errorMsg: string | null } {
  if (!name?.trim()) {
    return {
      validateStatus: 'error',
      errorMsg: '别名不能为空',
    };
  }
  return {
    validateStatus: undefined,
    errorMsg: null,
  };
}

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 16 },
};

type IAccessoriesItemWithOtherProps = IAccessoriesItem & {
  manufacturerId: number;
  productId: number;
  productDisabled: boolean;
  modelDisabled: boolean;
  validateRes: {
    manufacturer: {
      validateStatus: ValidateStatus;
      errorMsg: string | null;
    },
    product: {
      validateStatus: ValidateStatus;
      errorMsg: string | null;
    },
    model: {
      validateStatus: ValidateStatus;
      errorMsg: string | null;
    },
    name: {
      validateStatus: ValidateStatus;
      errorMsg: string | null;
    }
  }
}

// 附件信息
export default forwardRef(({ readonly }: IComponentProps, ref) => {
  const [form] = Form.useForm();
  const [accessories, setAccessories] = useState<Partial<IAccessoriesItemWithOtherProps>[]>([]);

  const onAdd = () => {
    setAccessories((prevAccessories) => [...prevAccessories, defaultAccessory]);
  }

  const onRemove = (index: number) => {
    setAccessories(prevAccessories => prevAccessories.filter((_, accessoryIndex) => index !== accessoryIndex));
  }

  const onRemoteSelectChange = (option: any, index: number, type: RemoteSelectType) => {
    setAccessories(prevAccessories => prevAccessories.map((accessory, accessoryIndex) => {
      if (index === accessoryIndex) {
        switch (type) {
          case 'equipment-manufacturer': // 附件厂商
            return {
              ...accessory,
              manufacturerName: option.label,
              manufacturerId: option.value,
              productName: undefined,
              productId: undefined,
              modelId: undefined,
              modelName: undefined,
              modelDisabled: true,
              productDisabled: !(option?.label || option?.value),
              validateRes: {
                ...accessory.validateRes!,
                manufacturer: validateField(option?.label, '附件厂商'),
              }
            }
          case 'equipment-product': // 附件名称
            return {
              ...accessory,
              productName: option.label,
              productId: option.value,
              modelId: undefined,
              modelName: undefined,
              modelDisabled: !(option?.label || option?.value),
              validateRes: {
                ...accessory.validateRes!,
                product: validateField(option?.label, '附件名称'),
              }
            }
          case 'equipment-model': // 附件型号
            return {
              ...accessory,
              modelId: option.value,
              modelName: option.label,
              validateRes: {
                ...accessory.validateRes!,
                model: validateField(option?.label, '附件型号'),
              }
            }
          default: return accessory;
        }
      }
      return accessory;
    }));
  }

  // 别名change
  const onNameChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    setAccessories(prevAccessories => prevAccessories.map((accessory, accessoryIndex) => {
      if (accessoryIndex === index) {
        return {
          ...accessory,
          name: value,
          validateRes: {
            ...accessory.validateRes!,
            name: validateName(value),
          }
        }
      }
      return accessory;
    }));
  }

  // 序列号change
  const onSnChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    setAccessories(prevAccessories => prevAccessories.map((accessory, accessoryIndex) => {
      if (accessoryIndex === index) {
        return {
          ...accessory,
          sn: value,
        }
      }
      return accessory;
    }));
  }

  const validateAccessories = () => {
    let hasError = false;
    const validatedAccessories = accessories.map(accessory => {
      const manufacturerValidateRes = validateField(accessory.manufacturerName, '附件厂商');
      const productValidateRes = validateField(accessory.productName, '附件名称');
      const modelValidateRes = validateField(accessory.modelName, '附件型号');
      const nameValidateRes = validateName(accessory.name);

      if (manufacturerValidateRes.validateStatus === 'error' ||
        productValidateRes.validateStatus === 'error' ||
        modelValidateRes.validateStatus === 'error' ||
        nameValidateRes.validateStatus === 'error'
      ) {
        hasError = true;
      }

      return {
        ...accessory,
        validateRes: {
          manufacturer: manufacturerValidateRes,
          product: productValidateRes,
          model: modelValidateRes,
          name: nameValidateRes,
        }
      }
    });

    setAccessories(validatedAccessories);
    return { 
      hasError,
      validatedAccessories,
    }
  }

  const renderAccessory = (accessory: IAccessoriesItemWithOtherProps, index: number) => (
    <Fragment key={index}>
      <Row>
        <Col span={22}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                { ...formItemLayout }
                label="附件厂商"
                validateStatus={accessory.validateRes?.manufacturer.validateStatus}
                help={accessory.validateRes?.manufacturer.errorMsg}
                required
              >
                <RemoteSelect
                  type="equipment-manufacturer"
                  placeholder="请选择"
                  value={{
                    value: accessory.manufacturerId,
                    label: accessory.manufacturerName,
                    key: `${accessory.manufacturerId}---${accessory.manufacturerName}`
                  }}
                  onChange={(option) => onRemoteSelectChange(option, index, 'equipment-manufacturer')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                { ...formItemLayout }
                label="附件名称"
                validateStatus={accessory.validateRes?.product.validateStatus}
                help={accessory.validateRes?.product.errorMsg}
                required
              >
                <RemoteSelect
                  type="equipment-product"
                  placeholder="请选择"
                  onChange={(option) => onRemoteSelectChange(option, index, 'equipment-product')}
                  value={{
                    value: accessory.productId,
                    label: accessory.productName,
                    key: `${accessory.productId}---${accessory.productName}`
                  }}
                  params={{
                    manufacturerId: accessory.manufacturerId,
                    productId: accessory.productId,
                  }}
                  disabled={accessory.productDisabled}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                { ...formItemLayout }
                label="附件型号"
                validateStatus={accessory.validateRes?.model.validateStatus}
                help={accessory.validateRes?.model.errorMsg}
                required
              >
                <RemoteSelect
                  type="equipment-model"
                  placeholder="请选择"
                  onChange={(option) => onRemoteSelectChange(option, index, 'equipment-model')}
                  value={{
                    value: accessory.modelId,
                    label: accessory.modelName,
                    key: `${accessory.modelId}---${accessory.modelName}`
                  }}
                  params={{
                    manufacturerId: accessory.manufacturerId,
                    productId: accessory.productId,
                  }}
                  disabled={accessory.modelDisabled}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                { ...formItemLayout }
                label="别名"
                validateStatus={accessory.validateRes?.name.validateStatus}
                help={accessory.validateRes?.name.errorMsg}
                required
              >
                <Input placeholder="请输入" value={accessory.name} onChange={(e) => onNameChange(e, index)}/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                { ...formItemLayout }
                label="序列号"
              >
                <Input placeholder="请输入" value={accessory.sn} onChange={(e) => onSnChange(e, index)}/>
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={2}>
          <MinusCircleOutlined
            style={btnStyle as CSSProperties }
            onClick={() => onRemove(index)} 
          />
        </Col>
      </Row>
      <Divider/>
    </Fragment>
  )

  useImperativeHandle(ref, () => ({
    init: async (id: number) => {
      try {
        const { data = [] } = await getParts(id);
        if (readonly) {
          setAccessories(data);
          return;
        }
        setAccessories(data.map(item => ({
          ...item,
          productDisabled: !item.manufacturerId,
          modelDisabled: !item.productId,
          validateRes: {
            manufacturer: validateField(item.manufacturerId, '附件厂商'),
            product: validateField(item.productId, '附件名称'),
            model: validateField(item.modelId, '附件型号'),
            name: validateName(item.name),
          },
        })));
      } catch (error) {
        console.error(error);
      }
    },
    setFieldsValue: (values: any) => {
      form.setFieldsValue({ ...values });
    },
    resetFields: () => {
      setAccessories([]);
      // form.resetFields();
    },
    getFieldsValue: () => {
      return form.getFieldsValue();
    },
    validateFields: async () => {
      // eslint-disable-next-line no-useless-catch
      try {
        const { hasError, validatedAccessories } = validateAccessories();

        if (hasError) {
          throw new Error();
        }

        return {
          accessoriesInfo: validatedAccessories.map(accessorie => ({
            id: accessorie.id,
            manufacturerName: accessorie.manufacturerName,
            manufacturerId: accessorie.manufacturerId,
            modelId: accessorie.modelId,
            modelName: accessorie.modelName,
            name: accessorie.name,
            productName: accessorie.productName,
            productId: accessorie.productId,
            sn: accessorie.sn,
          })),
        };
      } catch (error) {
        (error as any).from = 'accessories';
        throw error;
      }
    },
  }), [accessories]);

  return (
    <div>
      {
        readonly ? (<>
          {
            accessories.length ? accessories.map(a => (
              <Descriptions column={2} bordered style={fieldWrapperStyle} key={a.id}>
                <Descriptions.Item label="附件名称">{ a.productName }</Descriptions.Item>
                <Descriptions.Item label="别名">{ a.name }</Descriptions.Item>
                <Descriptions.Item label="生产商">{ a.manufacturerName }</Descriptions.Item>
                <Descriptions.Item label="规格型号">{ a.modelName }</Descriptions.Item>
                <Descriptions.Item label="序列号">{ a.sn }</Descriptions.Item>
              </Descriptions>
            )) : (
              <Empty
                description="暂无附件信息"
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
              />
            )
          }
        </>) : <Form>
          {
            accessories.map((accessory, index) => renderAccessory(accessory as IAccessoriesItemWithOtherProps, index))
          }
          <div style={{ marginTop: 20 }}>
            <Button type="dashed" onClick={onAdd} block icon={<PlusOutlined />}>
              添加更多附件信息
            </Button>
          </div>
        </Form>
      }
    </div>
  )
});
