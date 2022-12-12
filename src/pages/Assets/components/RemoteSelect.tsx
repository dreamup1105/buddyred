import type { ReactElement } from 'react';
import React, { useState, useCallback, useRef } from 'react';
import { Select, Spin, Divider, Input, Form, Button, Empty, Tag, Space } from 'antd';
import { NameDictionarysEnum } from '@/utils/constants';
import debounce from 'lodash.debounce';
import useMount from '@/hooks/useMount';
import useUnmount from '@/hooks/useUnmount';
import { fetchProducts, fetchModels, fetchManufacturers } from '@/pages/Dictionary/Accessories/service';
import { fetchTags } from '../service';
import styles from './RemoteSelect.less';
import useUserInfo from '@/hooks/useUserInfo';
import { TemplateFor } from '@/pages/Dictionary/Maintenance/type';

export interface IRemoteSelectOption {
  value: number | undefined;
  label: string;
  key: string;
}

interface IOptionItem {
  id: number;
  name: string;
  keywords: string;
  description: string;
}

export type ComponentType = 
  | 'equipment-manufacturer' // 设备厂商
  | 'equipment-product'  // 设备名称
  | 'equipment-model' // 设备型号
  | 'equipment-tag' // 设备标签
  | 'part-manufacturer' // 配件厂商
  | 'part-product' // 配件名称
  | 'part-model' // 配件型号
  | 'biz-item-tag'; // 保养项目标签
  
interface IComponentProps {
  params?: any;
  onlySelect?: boolean; // 仅搜索选择，无添加自定义项目功能
  isFocusRequest?: boolean; // 是否在触发focus事件时发送请求
  readonly?: boolean;
  type: ComponentType;
  placeholder: string;
  disabled?: boolean;
  value?: any;
  onChange?: (value: any) => void;
  [key: string]: any;
  templateForString?: string | undefined;
}

const extraDropdownAttrsMap = new Map([
  ['equipment-manufacturer', '设备厂商'],
  ['equipment-product', '设备名称'],
  ['equipment-model', '设备型号'],
  ['equipment-tag', '设备标签'],
  ['part-manufacturer', '配件厂商'],
  ['part-product', '配件名称'],
  ['part-model', '配件型号'],
  ['biz-item-tag', '保养项目标签']
]);

const { Option } = Select;
const getExtraDropdownAttrs = (type: ComponentType) => {
  const label = extraDropdownAttrsMap.get(type);
  return {
    placeholder: `请填写${label}`,
    label: `${label}`,
    message: `${label}不能为空`,
  } 
};

// 选项值value分隔符
export const EmptyOptionSeparator = '---';

// 自定义字段选项所赋予的id值前缀
export const EmptyValuePrefix = `undefined${EmptyOptionSeparator}`;

/**
 * 从`${id}---${name}`提取出id
 * @param value 
 */
export const getRawValue = (value: string) => {
  if (!value) {
    return undefined;
  }

  let rawValue: number | undefined;

  if (!(value as string).startsWith(EmptyValuePrefix)) {
    const sepIndex = value.indexOf(EmptyOptionSeparator);
    rawValue = Number(value.slice(0, sepIndex));
  }

  return rawValue;
}

/**
 * 标签形式select
 * @param label 
 * @param onlySelect 
 */
const getComponentMode = (type: ComponentType, onlySelect: boolean) => {
  if (type === 'equipment-tag' || type === 'biz-item-tag') {
    return onlySelect ? 'multiple' : 'tags';
  }
  return undefined;
}

/**
 * 对组件value进行一层过滤，针对厂商、产品、型号类型，使id适配`${id}${EmptyOptionSeparator}${name}`
 * 标签类型不需转换，直接返回。
 * Select组件不能出现相同value对应不同lable的问题，所以这里采取`${id}${EmptyOptionSeparator}${name}`格式作为
 * Option的value，这样就不会出现相同value对应不同label的问题。当前antd版本4.9.1
 * @param formItemValue 
 * @param isTag 
 */
function transformValue(formItemValue: any, isTag: boolean) {
  // undefined或者设备标签类型
  if (!formItemValue || isTag) {
    return formItemValue;
  }

  // 其他类型
  return {
    ...formItemValue,
    value: `${formItemValue.value}${EmptyOptionSeparator}${formItemValue.label}`
  }
}

const defaultSearchPageSize = 10; // 默认搜索选项条数
const defaultSearchPageNum = 1; // 默认第几页
const defaultDebounceWait = 500; // 搜索间隔

const RemoteSelect: React.FC<IComponentProps> = ({
  params = {},
  onlySelect = false,
  isFocusRequest = true,
  disabled = false,
  readonly = false,
  type,
  value,
  placeholder = '请选择',
  templateForString,
  onChange,
  ...restProps
}) => {
  const { currentUser } = useUserInfo();
  const isAdmin = currentUser?.user.isAdmin;
  const orgId = currentUser?.org.id;
  const [form] = Form.useForm();
  const abortController = useRef<AbortController | null>(null);
  const isUnmounted = useRef(true);
  const [fetching, setFetching] = useState<boolean>(false);
  // const [manualInputAreaVisible, setManualInputAreaVisible] = useState<boolean>(false);
  const [options, setOptions] = useState<any>([]);
  // const [keywords, setKeywords] = useState<string>('');
  const extraDropdownAttrs = getExtraDropdownAttrs(type);
  const isTag = type === 'equipment-tag' || type === 'biz-item-tag';

  const fetchHandler = async (q: string) => {
    let res: any;
    let newOptions: any;
    
    // 如果组件已被卸载，直接返回，不执行任何状态变更操作，以防出现内存溢出（memory leak）等问题。
    if (isUnmounted.current) {
      return;
    }

    setFetching(true);
    // setKeywords(q);
    // setManualInputAreaVisible(false);
    try {
      switch (type) {
        case 'equipment-manufacturer':
        case 'part-manufacturer':
          res = await fetchManufacturers(type === 'equipment-manufacturer' ? 'equipment' : 'part', q, defaultSearchPageNum, defaultSearchPageSize, { signal: abortController.current?.signal });
          newOptions = res.data || [];
          break;
        case 'equipment-product':
        case 'part-product':
          if (params.manufacturerId) {
            res = await fetchProducts(type === 'equipment-product' ? 'equipment' : 'part', { manufacturerId: params.manufacturerId, q }, defaultSearchPageNum, defaultSearchPageSize, { signal: abortController.current?.signal });
            newOptions = res.data || [];
          } else {
            newOptions = [];
          }
          break;
        case 'equipment-model':
        case 'part-model':
          if (params.productId) {
            res = await fetchModels(type === 'equipment-model' ? 'equipment' : 'part', { productId: params.productId, q }, defaultSearchPageNum, defaultSearchPageSize, { signal: abortController.current?.signal });
            newOptions = res.data || [];
          } else {
            newOptions = []
          }
          break;
        case 'equipment-tag':
          res = await fetchTags(
            { 
              name: q, 
              orgId: isAdmin ? null : orgId,
              templateFor:  isAdmin ? TemplateFor.PLATFORM : TemplateFor.OTHER_PLATFORM 
            }, 
            NameDictionarysEnum.EQUIPMENT_TAG,
            { 
              signal: abortController.current?.signal, 
            });
          newOptions = res.data || [];
          break;
        case 'biz-item-tag':
          console.log(templateForString);
          res = await fetchTags(
            { 
              name: q, 
              orgId: isAdmin ? null : orgId,
              templateFor: templateForString 
                ? templateForString 
                : isAdmin 
                  ? TemplateFor.PLATFORM 
                  : TemplateFor.OTHER_PLATFORM 
            }, 
            NameDictionarysEnum.MI_TAG,
            { 
              signal: abortController.current?.signal,
            });
          newOptions = res.data || [];
          break;
        default:
          break;
      }
      if (!isUnmounted.current) {
        setOptions(newOptions);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const onFocus = () => {
    fetchHandler('');
  }

  const onFetch = useCallback(
    debounce(((val: any) => fetchHandler(val)) as never, defaultDebounceWait),
    [params],
  );

  const onOptionChange = (option: ISelectOption) => {
    if (onChange) {
      if (isTag) {
        onChange(option);
      } else {
        onChange({
          ...option,
          value: getRawValue(option.value),
        });
      }
    }
    setFetching(false);
    // setManualInputAreaVisible(false);
  };

  const onAddOption = async () => {
    try {
      const values = await form.validateFields();
      const { name } = values;
      const existOption = options.find((i: IOptionItem) => i.name === name.trim());
      setOptions([
        {
          id: existOption ? existOption.id : undefined, // 新增的项无id只有name
          name: name.trim(),
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  // const showManualInputArea = () => {
  //   setManualInputAreaVisible(true);
  //   form.resetFields();
  // }

  const renderEmptyArea = () => {
    if (isTag) {
      return null;
    }

    return <Empty description={ onlySelect ? '未找到对应标签' : `未找到${extraDropdownAttrsMap.get(type)}` } />
    // return onlySelect 
    //   ? (<Empty description="未找到对应标签" />) 
    //   : (<div className={styles.emptyAreaWrapper}>
    //       {
    //         (
    //           !params.manufacturerId && (type === 'equipment-product' || type === 'part-product') || 
    //           !params.productId && (type === 'equipment-model' || type === 'part-model')
    //         ) ? (
    //           <Button type="primary" size="small" onClick={showManualInputArea}><PlusOutlined />新增{ extraDropdownAttrsMap.get(type) }</Button>
    //         ) : (<>
    //           暂未查到{keywords && <a className={styles.keywords}>{keywords}</a>}
    //           数据，如需新增，请点击<Button type="primary" size="small" className={styles.addOptionBtn} onClick={showManualInputArea}><PlusOutlined />新增</Button>，并在下方文本框中填写
    //         </>)
    //       }
    //     </div>
    //   )
  };

  const renderManualInputArea = (menu: ReactElement): ReactElement => {
    return <div>
      {menu}
      <Divider className={styles.manualInputAreaDivider} />
      <div className={styles.addFormWrapper}>
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 15 }}
          className={styles.addForm}
        >
          <Form.Item
            label={extraDropdownAttrs.label}
            name="name"
            rules={[
              { required: true, message: extraDropdownAttrs.message },
            ]}
          >
            <Input placeholder={extraDropdownAttrs.placeholder} />
          </Form.Item>
        </Form>
        <Button
          type="primary"
          className={styles.addOptionFormBtn}
          onClick={onAddOption}
        >
          新增
        </Button>
      </div>
      {/* {manualInputAreaVisible && options.length === 0 && (
        <>
          <Divider className={styles.manualInputAreaDivider} />
          <div className={styles.addFormWrapper}>
            <Form
              form={form}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              className={styles.addForm}
            >
              <Form.Item
                label={extraDropdownAttrs.label}
                name="name"
                rules={[
                  { required: true, message: extraDropdownAttrs.message },
                ]}
              >
                <Input placeholder={extraDropdownAttrs.placeholder} />
              </Form.Item>
            </Form>
            <Button
              type="primary"
              className={styles.addOptionFormBtn}
              onClick={onAddOption}
            >
              新增
            </Button>
          </div>
        </>
      )} */}
    </div>
  }

  useMount(() => {
    abortController.current = new AbortController();
    isUnmounted.current = false;
  });

  useUnmount(() => {
    // 组件卸载时，取消已经发出的请求
    abortController.current?.abort();
    isUnmounted.current = true;
  });

  if (readonly && isTag) {
    if (!value || !Array.isArray(value)) {
      return null;
    }
    return <Space>
      {
        value.map((i: string) => <Tag key={i}>{ i }</Tag>)
      }
    </Space>
  }

  return (
    <Select
      mode={getComponentMode(type, onlySelect)}
      showSearch
      disabled={disabled}
      labelInValue={!isTag}
      value={transformValue(value, isTag)}
      onSearch={onFetch as any}
      onChange={onOptionChange}
      onFocus={isFocusRequest ? onFocus : undefined}
      filterOption={false}
      placeholder={placeholder}
      notFoundContent={fetching ? <Spin size="small" /> : renderEmptyArea()}
      dropdownRender={onlySelect || isTag ? undefined : (menu) => renderManualInputArea(menu)}
      { ...restProps }
    >
      {
        options.map((o: any) => (
          <Option
            key={isTag ? o.name : `${o.id}${EmptyOptionSeparator}${o.name}`} 
            value={isTag ? o.name : `${o.id}${EmptyOptionSeparator}${o.name}`}
          >
            {/* {`${o.name}${isEquipmentTag ? (`（${o.tagRank}）` || '') : ''}`} */}
            { o.name }
          </Option>
        ))
      }
    </Select>
  );
};

export default RemoteSelect;
