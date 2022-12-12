import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Select, Form, Spin, Checkbox } from 'antd';
import useClearFormModal from '@/hooks/useClearFormModal';
import debounce from 'lodash.debounce';
import {
  fetchManufacturers,
  fetchModels,
  fetchProducts,
  replaceManufacturer,
  replaceProduct,
  replaceModel,
} from '../service';
import type {
  IManufacturerItem,
  IProductItem,
  IModelItem,
  BizType,
} from '../type';
import { OperationType } from '../type';

type TableListItem = IManufacturerItem | IProductItem | IModelItem;

interface IComponentProps {
  visible: boolean;
  operation: OperationType;
  currentRecord: TableListItem | undefined;
  bizType: BizType | undefined;
  onCancel: () => void;
  onSubmit: (targetId: number, operation: OperationType) => void;
}

const getBizConfig = (operation: OperationType) => {
  switch (operation) {
    case OperationType.REPLACE_MANUFACTURER:
      return {
        fieldLabel: '厂商',
        service: replaceManufacturer,
      };
    case OperationType.REPLACE_PRODUCT:
      return {
        fieldLabel: '产品',
        service: replaceProduct,
      };
    case OperationType.REPLACE_MODEL:
      return {
        fieldLabel: '型号',
        service: replaceModel,
      };
    default:
      return {};
  }
};

const defaultPageSize = 20;

const ReplaceDict: React.FC<IComponentProps> = ({
  visible,
  operation,
  currentRecord,
  bizType,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const bizConfig = getBizConfig(operation);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<TableListItem[]>([]);

  useClearFormModal(visible, form);

  // 加载选项列表
  const loadOptions = async (q?: string) => {
    const isSearch = typeof q !== 'undefined'; // 初始化/搜索
    let dataOptions: IManufacturerItem[] | IProductItem[] | IModelItem[] = [];
    try {
      switch (operation) {
        case OperationType.REPLACE_MANUFACTURER: // 替换厂商
          if (isSearch) {
            const { data: manufacturerOptions } = await fetchManufacturers(
              bizType!,
              q!,
              1,
              defaultPageSize,
            );
            dataOptions = manufacturerOptions;
          } else {
            const { data: manufacturerOptions } = await fetchManufacturers(
              bizType!,
              '',
            );
            dataOptions = manufacturerOptions;
          }
          break;
        case OperationType.REPLACE_PRODUCT: // 替换产品
          if (isSearch) {
            const { data: productOptions } = await fetchProducts(
              bizType!,
              {
                manufacturerId: (currentRecord as IProductItem).manufacturerId,
                q,
              },
              1,
              defaultPageSize,
            );
            dataOptions = productOptions;
          } else {
            const { data: productOptions } = await fetchProducts(bizType!, {
              manufacturerId: (currentRecord as IProductItem).manufacturerId,
              q: '',
            });
            dataOptions = productOptions;
          }
          break;
        case OperationType.REPLACE_MODEL: // 替换型号
          if (isSearch) {
            const { data: modelOptions } = await fetchModels(
              bizType!,
              {
                productId: (currentRecord as IModelItem).productId,
                q,
              },
              1,
              defaultPageSize,
            );
            dataOptions = modelOptions;
          } else {
            const { data: modelOptions } = await fetchModels(bizType!, {
              productId: (currentRecord as IModelItem).productId,
              q: '',
            });
            dataOptions = modelOptions;
          }
          break;
        default:
          break;
      }
      setOptions(dataOptions.filter((d) => d.id !== currentRecord!.id));
    } catch (error) {
      console.error(error);
    }
  };

  const init = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      await loadOptions();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onModalOk = async () => {
    if (confirmLoading) {
      return;
    }
    try {
      const { targetId, doDelete = false } = await form.validateFields();
      setConfirmLoading(true);
      await bizConfig?.service?.(
        bizType!,
        currentRecord!.id!,
        targetId,
        doDelete,
      );
      onSubmit(targetId, operation);
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const fetchHandler = async (q: string) => {
    setFetching(true);
    setOptions([]);
    try {
      loadOptions(q);
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };
  const onFetch = useCallback(
    debounce(((val: any) => fetchHandler(val)) as never, 500),
    [currentRecord?.id],
  );
  const onFocus = () => {
    fetchHandler('');
  };

  useEffect(() => {
    if (currentRecord && visible) {
      init();
    }
  }, [visible, currentRecord]);

  return (
    <Modal
      title="替换"
      visible={visible}
      onCancel={onCancel}
      onOk={onModalOk}
      maskClosable={false}
      okText="保存"
      confirmLoading={confirmLoading}
    >
      <Spin spinning={loading}>
        <Form form={form}>
          <Form.Item
            name="targetId"
            label={`${currentRecord?.name}替换为`}
            rules={[
              {
                required: true,
                message: `请选择替换${bizConfig.fieldLabel}`,
              },
            ]}
          >
            <Select
              showSearch
              placeholder="请选择"
              filterOption={false}
              onSearch={onFetch as any}
              onFocus={onFocus}
              notFoundContent={fetching ? <Spin size="small" /> : null}
            >
              {options.map((o) => (
                <Select.Option key={o.id} value={o.id!}>
                  {o.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="doDelete" valuePropName="checked">
            <Checkbox>是否删除被替换{bizConfig.fieldLabel}</Checkbox>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ReplaceDict;
