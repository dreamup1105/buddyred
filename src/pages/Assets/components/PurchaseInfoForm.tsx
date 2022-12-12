import type { CSSProperties } from 'react';
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Row, Col, Form, Select, Input, DatePicker, InputNumber, Button, Descriptions } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { stringToMoment, momentToString } from '@/utils/utils';
import type {
  EquipmentDetail,
  IInquirie,
} from '../type';
import { 
  EquipmentSource, 
  PurchaseMethod, 
  FieldLabelMap, 
  EquipmentSourceEnum,
  EquipmentSourceTextEnum,
  PurchaseMethodEnum,
  PurchaseMethodTextEnum,
  OperationType
} from '../type';

interface IComponentProps {
  readonly?: boolean;
}

interface IInitialValues {
  operation: OperationType;
  values?: EquipmentDetail | undefined; 
}

const fieldWrapperStyle = {
  borderTop: '1px dashed #d9d9d9',
  paddingTop: 25,
}

const delBtnStyle: CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '40%',
  transform: 'translate3d(-50%, -50%, 0)',
}

// 购置信息
export default forwardRef(({ readonly }: IComponentProps, ref) => {
  const [form] = Form.useForm();
  const [equipmentDetail, setEquipmentDetail] = useState<EquipmentDetail | undefined>();
  const [currentEquipSource, setCurrentEquipSource] = useState<
    EquipmentSourceEnum
  >(EquipmentSourceEnum.PURCHASED);
  const [currentPurchaseMethod, setCurrentPurchaseMethod] = useState<
    PurchaseMethodEnum
  >(PurchaseMethodEnum.INQUERY);

  // 设备来源change
  const onEquipSourceChange = (source: EquipmentSourceEnum) => {
    setCurrentEquipSource(source);
  };

  // 购买方式change
  const onPurchaseMethodChange = (method: PurchaseMethodEnum) => {
    setCurrentPurchaseMethod(method);
  }

  useImperativeHandle(ref, () => ({
    init: ({ values, operation }: IInitialValues) => {
      switch (operation) {
        case OperationType.INPUT:
          form.setFieldsValue({
            obtainedBy: EquipmentSourceEnum.PURCHASED,
            purchaseMethod: PurchaseMethodEnum.INQUERY,
          });
          setCurrentEquipSource(EquipmentSourceEnum.PURCHASED);
          setCurrentPurchaseMethod(PurchaseMethodEnum.INQUERY);
          break;
        case OperationType.EDIT:
        case OperationType.COPY:
          // eslint-disable-next-line no-case-declarations
          const { inquiries = [], equipment } = values!;
          // eslint-disable-next-line no-case-declarations
          const { 
            obtainedBy,
            purchaseMethod,
            obtainedFrom,
            originWorth,
            obtainedDate,
            srcContactPerson,
            srcContactTel,
          } = equipment;

          form.setFieldsValue({
            obtainedBy: obtainedBy ?? EquipmentSourceEnum.PURCHASED,
            purchaseMethod: purchaseMethod ?? PurchaseMethodEnum.INQUERY,
            obtainedFrom,
            originWorth,
            obtainedDate: stringToMoment(obtainedDate),
            srcContactPerson,
            srcContactTel,
            inquiries,
          });
          setCurrentEquipSource(obtainedBy ?? EquipmentSourceEnum.PURCHASED);
          setCurrentPurchaseMethod(purchaseMethod ?? PurchaseMethodEnum.INQUERY);
          break;
        case OperationType.DETAIL:
          setEquipmentDetail(values);
          break;
        default: break;
      }
    },
    validateFields: async () => {
      // eslint-disable-next-line no-useless-catch
      try {
        const formValues = await form.validateFields();
        return {
          ...formValues,
          inquiries: formValues.inquiries
            ?.filter(Boolean)
            .filter((item: IInquirie) => item.company || item.contactPerson || item.contactTel),
          obtainedDate: momentToString(formValues.obtainedDate),
        }
      } catch (error) {
        (error as any).from = 'purchase'
        throw error;
      }
    },
    resetFields: () => {
      setCurrentEquipSource(EquipmentSourceEnum.PURCHASED);
      form.resetFields();
    },
  }));

  return (
    <div>
      {
        readonly ? (<>
          <Descriptions column={2} bordered>
            {
              equipmentDetail?.equipment.obtainedBy && (
                <Descriptions.Item label="设备来源">{ EquipmentSourceTextEnum[equipmentDetail.equipment.obtainedBy] }</Descriptions.Item>
              )
            }
            {
              equipmentDetail?.equipment.obtainedBy === EquipmentSourceEnum.PURCHASED && (
                <Descriptions.Item label="购买方式">{ equipmentDetail?.equipment.purchaseMethod && PurchaseMethodTextEnum[equipmentDetail.equipment.purchaseMethod] }</Descriptions.Item>
              )
            }
            <Descriptions.Item label={FieldLabelMap.get(currentEquipSource)?.obtainedFrom}>
              { equipmentDetail?.equipment.obtainedFrom }
            </Descriptions.Item>
            <Descriptions.Item label={FieldLabelMap.get(currentEquipSource)?.originWorth}>
              { equipmentDetail?.equipment.originWorth }
            </Descriptions.Item>
            <Descriptions.Item label={FieldLabelMap.get(currentEquipSource)?.obtainedDate}>
              { equipmentDetail?.equipment.obtainedDate }
            </Descriptions.Item>
            {
              equipmentDetail?.equipment.obtainedBy === EquipmentSourceEnum.PURCHASED && (<>
                <Descriptions.Item label="联系人">
                  { equipmentDetail?.equipment.srcContactPerson }
                </Descriptions.Item>
                <Descriptions.Item label="联系电话">
                  { equipmentDetail?.equipment.srcContactTel }
                </Descriptions.Item>
              </>)
            }
          </Descriptions>
          {
            (
              equipmentDetail?.equipment.obtainedBy === EquipmentSourceEnum.PURCHASED && 
              equipmentDetail?.equipment.purchaseMethod !== PurchaseMethodEnum.SINGLE  
            ) && (<div style={{ marginTop: 20 }}>
              {
                equipmentDetail?.inquiries?.map!((i, index) => (
                  <Descriptions column={2} style={fieldWrapperStyle} key={index}>
                    <Descriptions.Item label="询价单位">{ i.company }</Descriptions.Item>
                    <Descriptions.Item label="联系人">{ i.contactPerson }</Descriptions.Item>
                    <Descriptions.Item label="联系电话">{ i.contactTel }</Descriptions.Item>
                  </Descriptions>
                ))
              }
            </div>)
          }
        </>) : (
          <Form 
            form={form} 
            labelAlign="right" 
            labelCol={{ span: 4 }}
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  name="obtainedBy"
                  label="设备来源"
                  labelCol={{ span: 8 }}
                >
                  <Select placeholder="请选择" onChange={onEquipSourceChange}>
                    {EquipmentSource.map((option) => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                {
                  currentEquipSource === EquipmentSourceEnum.PURCHASED && (
                    <Form.Item
                      name="purchaseMethod" 
                      label="购买方式"
                      labelCol={{ span: 8 }}
                    >
                      <Select placeholder="请选择" onChange={onPurchaseMethodChange}>
                        {
                          PurchaseMethod.map(option => <Select.Option key={option.value} value={option.value}>{ option.label }</Select.Option>)
                        }
                      </Select>
                    </Form.Item>
                  )
                }
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="obtainedFrom"
                  labelCol={{ span: 4 }}
                  label={FieldLabelMap.get(currentEquipSource)?.obtainedFrom}
                >
                  <Input placeholder="请填写" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  name="originWorth"
                  labelCol={{ span: 8 }}
                  label={`${FieldLabelMap.get(currentEquipSource)?.originWorth}(元)`}
                  rules={[{
                    validator(rule: any, value: any) {
                      if (typeof value === 'number') {
                        if (value < 0) {
                          // eslint-disable-next-line prefer-promise-reject-errors
                          return Promise.reject(`${FieldLabelMap.get(currentEquipSource)?.originWorth}不能小于0`);
                        }
                      }
                      // eslint-disable-next-line prefer-promise-reject-errors
                      return Promise.resolve();
                    },
                  }]}
                >
                  <InputNumber
                    placeholder="请填写"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="obtainedDate"
                  labelCol={{ span: 8 }}
                  label={FieldLabelMap.get(currentEquipSource)?.obtainedDate}
                >
                  <DatePicker
                    placeholder="请选择"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            {
              currentEquipSource === EquipmentSourceEnum.PURCHASED && (<>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      name="srcContactPerson"
                      label="联系人"
                      labelCol={{ span: 8 }}
                    >
                      <Input placeholder="请填写" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="srcContactTel"
                      label="联系电话"
                      labelCol={{ span: 8 }}
                    >
                      <Input placeholder="请填写" />
                    </Form.Item>
                  </Col>
                </Row>
                {
                  currentPurchaseMethod !== PurchaseMethodEnum.SINGLE && (
                    <Form.List name="inquiries">
                      {
                        (fields, { add, remove }) => (<>
                          {
                            fields.map(field => (
                              <div style={fieldWrapperStyle} key={field.key}>
                                <Row>
                                  <Col span={23}>
                                    <Form.Item
                                      {...field}
                                      label="询价单位"
                                      labelCol={{ span: 4 }}
                                      name={[field.name, 'company']}
                                      fieldKey={[field.fieldKey, 'company']}
                                    >
                                      <Input placeholder="请输入" />
                                    </Form.Item>
                                    <Row>
                                      <Col span={12}>
                                        <Form.Item
                                          {...field}
                                          label="联系人"
                                          labelCol={{ span: 8 }}
                                          name={[field.name, 'contactPerson']}
                                          fieldKey={[field.fieldKey, 'contactPerson']}
                                        >
                                          <Input placeholder="请输入" />
                                        </Form.Item>
                                      </Col>
                                      <Col span={12}>
                                        <Form.Item
                                          {...field}
                                          label="联系电话"
                                          labelCol={{ span: 8 }}
                                          name={[field.name, 'contactTel']}
                                          fieldKey={[field.fieldKey, 'contactTel']}
                                        >
                                          <Input placeholder="请输入" />
                                        </Form.Item>
                                      </Col>
                                    </Row>
                                  </Col>
                                  <Col span={1} style={{ position: 'relative' }}>
                                    <MinusCircleOutlined 
                                      style={delBtnStyle}
                                      onClick={() => remove(field.name)} 
                                    />
                                  </Col>
                                </Row>
                              </div>
                            ))
                          }
                          <Form.Item style={{ borderTop: '1px dashed #d9d9d9', paddingTop: 25 }}>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                              添加询价单
                            </Button>
                          </Form.Item>
                        </>)
                      }
                    </Form.List>
                  )
                }
              </>)
            }
          </Form>
        )
      }
    </div>
  )
});
