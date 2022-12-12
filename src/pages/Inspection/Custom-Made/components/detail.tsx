import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Select,
  Button,
  Table,
  Row,
  Col,
  Input,
  message,
  Checkbox,
  Switch,
  TimePicker,
  Radio,
} from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ProTableColumn } from '@/components/ProTable';
import { SelectEquipmentColumn, weekOptions, enableOptions } from '../type';
import type { CustomTable, SelectedEquipmentItem } from '../type';
const { confirm } = Modal;
const CheckboxGroup = Checkbox.Group;
import { listOrgEmpAPI, customGetObjByIdAPI } from '../service';
import SelectEquipmentModal from './selectEquipment';
import { momentToString, SecondFormat } from '@/utils/utils';
import useUserInfo from '@/hooks/useUserInfo';
import DepartmentSelector from '@/components/DepartmentSelector';
import useDepartments from '@/hooks/useDepartments';
import moment from 'moment';
// import styles from '../index.less';
interface IModalProps {
  title: string;
  orderId?: string;
  visible: boolean;
  onCancel: () => void;
  onConfirm: (data: any) => void;
}

const DetailModal: React.FC<IModalProps> = ({
  title,
  orderId,
  visible = false,
  onCancel,
  onConfirm,
}) => {
  const [form] = Form.useForm();
  const { currentUser } = useUserInfo();
  const orgId = currentUser?.org.id;
  const { departmentsTreeData } = useDepartments({ orgId: orgId! }, true);
  const [orderInfo, setOrderInfo] = useState<any>();
  const [equipmentData, setEquipmentData] = useState<any>([]);
  const [auditOptions, setAuditOptions] = useState([]);
  const [selectEquipmentVisible, setSelectEquipmentVisible] = useState<boolean>(
    false,
  );
  const [selectEquipmentKey, setSelectEquipmentKey] = useState<number[]>([]);
  const [selectDeptId, setSelectDeptId] = useState<number>(0);
  const [deptName, setDeptName] = useState<string>();
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  // 获取主要负责人
  const getAuditData = async () => {
    try {
      const { data } = await listOrgEmpAPI();
      setAuditOptions(
        data.map((item: any) => {
          return {
            label: item.title,
            value: item.value,
          };
        }),
      );
    } catch (err: any) {
      console.log(err);
    }
  };

  //设备所在科室选择
  const sourceDepSelect = (value: any, options: any) => {
    if (equipmentData.length > 0) {
      confirm({
        title: '提示',
        icon: <ExclamationCircleOutlined />,
        content: '选择设备所在科室时将清除已经添加的设备，是否继续？',
        onOk() {
          setEquipmentData([]);
        },
        onCancel() {},
      });
    }
    setDeptName(options[0]);
  };

  // 添加设备
  const onAddSCarpClick = () => {
    const formValues = form.getFieldsValue();
    if (!formValues.deptId) {
      message.warning('请先选择设备所在科室');
      return;
    }
    setSelectDeptId(formValues.deptId);
    setSelectEquipmentVisible(true);
    setSelectEquipmentKey(
      equipmentData.map((item: SelectedEquipmentItem) => {
        return item.id;
      }),
    );
  };

  // 添加设备弹框确认
  const onSelectEquipmentConfirm = (data: SelectedEquipmentItem[]) => {
    if (data.length > 0) {
      setEquipmentData(data);
    }
    setSelectEquipmentVisible(false);
  };

  //删除设备
  const onTableDetail = (record: any) => {
    const equipementArr = equipmentData.filter(
      (item: any) => item.id != record.id,
    );
    setEquipmentData(equipementArr);
  };

  //弹框取消
  const onModalCancel = () => {
    setOrderInfo({});
    onCancel();
  };

  // 弹框确认
  const onModalConfirm = async () => {
    const formValue = await form.validateFields();

    if (!formValue.groupName || !formValue.groupName.trim()) {
      message.warning('自检组名称不能为空或全空格');
      return;
    }
    if (equipmentData.length < 1) {
      message.warning('请添加设备');
      return;
    }
    if (!formValue.timeDayAm && !formValue.timeDayPm) {
      message.warning('至少选择一个超时提醒时间');
      return;
    }

    // 超时时间提醒，下午的时间转为24小时制
    let timeDayPm24 = '';
    const timeDayPm = momentToString(formValue.timeDayPm, SecondFormat) || '';
    timeDayPm24 =
      timeDayPm.length > 0
        ? parseInt(timeDayPm?.substring(0, 2)) + 12 + timeDayPm?.substring(2, 8)
        : '';

    const params = {
      ...orderInfo,
      ...formValue,
      isHoliday: formValue.isHoliday ? 1 : 0,
      deptName: deptName,
      eqIds: equipmentData.map((item: any) => item.id),
      timeDayAm: momentToString(formValue.timeDayAm, SecondFormat) || '',
      timeDayPm: timeDayPm24,
    };

    setBtnLoading(true);
    setOrderInfo({});
    await onConfirm(params);
    setBtnLoading(false);
  };

  // 通过 id  获取详情信息
  const getInfo = async () => {
    try {
      const { data } = await customGetObjByIdAPI(orderId);
      setOrderInfo({
        ...data,
      });
      let timeDayPm12 = '';
      const timeDayPm = data.timeDayPm || '';
      timeDayPm12 =
        parseInt(timeDayPm?.substring(0, 2)) - 12 + timeDayPm?.substring(2, 8);
      form.setFieldsValue({
        groupName: data.groupName,
        deptId: data.deptId,
        isEnable: data.isEnable,
        head: data.head,
        dayWeek: data.dayWeek,
        timeDayAm: data.timeDayAm ? moment(data.timeDayAm, 'HH:mm:ss') : '',
        timeDayPm: data.timeDayPm ? moment(timeDayPm12, 'HH:mm:ss') : '',
        eqIds: data.eqIds,
        isHoliday: data.isHoliday == 1 ? true : false,
      });
      setEquipmentData(data.eqList);
    } catch (err) {
      console.log(err);
    }
  };

  const columns: ProTableColumn<CustomTable>[] = [
    ...SelectEquipmentColumn,
    {
      title: '报废状态',
      dataIndex: 'isScrap',
      key: 'isScrap',
      hideInSearch: true,
      render: (_, record) => {
        return <span>{record.isScrap == 'COMMON' ? '正常' : '报废'}</span>;
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      hideInSearch: true,
      render: (_, record) => {
        return <a onClick={() => onTableDetail(record)}>删除</a>;
      },
    },
  ];

  const initData = () => {
    if (visible) {
      getAuditData();
      if (orderId) {
        getInfo();
      } else {
        form.resetFields();
        setEquipmentData([]);
      }
    }
  };

  useEffect(() => {
    initData();
  }, [visible]);

  return (
    <>
      <Modal
        title={`定制巡检-${title}`}
        visible={visible}
        width="1000px"
        maskClosable={false}
        destroyOnClose={true}
        onCancel={onModalCancel}
        footer={
          <>
            <Button onClick={onModalCancel}>取消</Button>
            <Button
              type="primary"
              loading={btnLoading}
              onClick={() => onModalConfirm()}
            >
              保存
            </Button>
          </>
        }
      >
        <Form form={form} name="basic" autoComplete="off" preserve={false}>
          <Row>
            <Col span={8}>
              <Form.Item
                label="自检组名称"
                name="groupName"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="设备所在科室"
                name="deptId"
                rules={[{ required: true }]}
              >
                <DepartmentSelector
                  onChange={sourceDepSelect}
                  treeSelectProps={{
                    treeData: departmentsTreeData,
                    virtual: false,
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="启用状态"
                name="isEnable"
                rules={[{ required: true }]}
              >
                <Radio.Group>
                  {enableOptions.map((item: any) => (
                    <Radio key={item.value} value={item.value}>
                      {item.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="主要负责人"
                name="head"
                rules={[{ required: true }]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  autoClearSearchValue={false}
                  style={{ width: '100%', marginRight: '20px' }}
                  options={auditOptions}
                  optionFilterProp="label"
                  placeholder="请选择主要负责人"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="自检时间"
                name="dayWeek"
                rules={[{ required: true }]}
              >
                <CheckboxGroup options={weekOptions} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="超时提醒时间(上午)" name="timeDayAm">
                <TimePicker
                  use12Hours
                  format="h:mm:ss"
                  popupClassName="timeUse12Hours"
                  showNow={false}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="超时提醒时间(下午)" name="timeDayPm">
                <TimePicker
                  use12Hours
                  format="h:mm:ss"
                  popupClassName="timeUse12Hours"
                  showNow={false}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="国家法定节假日自动排休"
                name="isHoliday"
                valuePropName="checked"
              >
                <Switch size="small" />
              </Form.Item>
            </Col>
            <Col span={24} style={{ marginBottom: '20px' }}>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={onAddSCarpClick}
              >
                添加设备
              </Button>
              <Table
                sticky
                style={{
                  marginTop: '10px',
                  maxHeight: '300px',
                  overflow: 'auto',
                }}
                rowKey="id"
                columns={columns}
                dataSource={equipmentData}
                pagination={false}
              />
            </Col>
          </Row>
        </Form>
      </Modal>

      <SelectEquipmentModal
        selectRow={selectEquipmentKey}
        visible={selectEquipmentVisible}
        deptId={selectDeptId}
        onCancel={() => setSelectEquipmentVisible(false)}
        onConfirm={onSelectEquipmentConfirm}
      />
    </>
  );
};

export default DetailModal;
