import React, { useState, useRef, useEffect } from 'react';
import {
  Descriptions,
  Modal,
  Button,
  Input,
  Tag,
  Table,
  message,
  Select,
  DatePicker,
  Form,
} from 'antd';
import useSubAuthorities from '@/hooks/useSubAuthorities';
import useUserInfo from '@/hooks/useUserInfo';
import { PlusOutlined } from '@ant-design/icons';
import styles from '../index.less';
import type { SbscriptionDetailItem, equipmentItems } from '../type';
import { OrderStatus, OrderStatusEnum } from '../type';
import BasicInfoForm from './BasicInfoForm';
import type { ActionType } from './BasicInfoForm';
import useDepartments from '@/hooks/useDepartments';
import useInitialData from '@/pages/Assets/hooks/useInitialData';
import useGlobalAuthorities from '@/hooks/useGlobalAuthorities';
const { TextArea } = Input;
import { OperationType } from '../type';
import {
  stringToMoment,
  momentToString,
  WithoutTimeFormat,
} from '@/utils/utils';
import { delEquiomentDetail } from '../service';

interface ScarpDetailProps {
  title?: string;
  detail: SbscriptionDetailItem | any;
  visible: boolean;
  type?: string; //查看类型  DETAIL ADD EDIT AUDIT
  onCancel: () => void; // 关闭
  onSubmit: (type: string, detail: any) => void;
}

const SubscriptionModal: React.FC<ScarpDetailProps> = ({
  title = '新增',
  detail = {},
  visible,
  type = OrderStatus.INIT,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const { currentUser } = useUserInfo();
  // const orgId = currentUser?.org.id;
  const globalAuthorities = useGlobalAuthorities();
  const isIncludeGlobalAuthorities = globalAuthorities.includes('ALL');
  const employeeId = currentUser?.employee.id;
  const basicInfoFormRef = useRef<ActionType>();
  const subAuthorities = useSubAuthorities();
  const [loading, setLoading] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>();
  const [dataSource, setDataSource] = useState<equipmentItems[]>([]);
  const [isAddEquipment, setIsAddEquipment] = useState<boolean>(false);
  const [selectEquipmentVisible, setSelectEquipmentVisible] = useState(false);
  const { equipmentTypes } = useInitialData();
  const { departmentOptions } = useDepartments(
    {
      employeeId: employeeId,
    },
    true,
    true,
  );
  const primaryDepartment = currentUser?.primaryDepartment;
  const currentUserDepartment = primaryDepartment
    ? [
        {
          label: primaryDepartment?.name,
          value: primaryDepartment?.id,
          key: primaryDepartment?.id,
        },
      ]
    : []; // 自己所在部门
  const deptOptions = isIncludeGlobalAuthorities
    ? [...departmentOptions]
    : [...currentUserDepartment, ...departmentOptions];

  const onselectDeptChange = (value: any, options: any) => {
    detail.deptName = options.label;
  };

  // 清空表单数据
  const resetForm = () => {
    form.resetFields();
  };

  // 采购状态
  const itemConfig = OrderStatusEnum.get(detail.orderStatus);

  // 草稿/保存/通过/驳回/启用
  const onConfirm = async (status: string) => {
    const formValue = await form.validateFields();
    if (!dataSource || dataSource.length == 0) {
      message.error('请添加设备');
      return;
    }
    setLoading(true);
    detail.detailList = dataSource;
    detail.orderStatus = status;
    detail.deptId = formValue.deptId;
    detail.purchaseReason = formValue.purchaseReason;
    detail.approvalAdvice = formValue.approvalAdvice;
    detail.purchaseTime =
      formValue.purchaseTime &&
      momentToString(formValue.purchaseTime, WithoutTimeFormat);
    try {
      await onSubmit(status, detail);
      resetForm();
    } catch (err: any) {
      console.log(err.message);
    }
    setLoading(false);
  };

  const onModalCancel = () => {
    resetForm();
    onCancel();
  };

  // 添加设备
  const addEquipment = () => {
    setIsAddEquipment(true);
    setSelectEquipmentVisible(true);
  };

  // 添加设备弹框 - 取消
  const selectEquipmentCancel = () => {
    setSelectEquipmentVisible(false);
  };

  // 添加设备弹框 - 确认
  const selectEquipmentOk = async () => {
    // 获取填写的设备表单信息
    const basicInfo = await basicInfoFormRef.current?.validateFields!();
    // 为每一条数据添加唯一id 取当前时间戳
    // 添加设备确认时，自动计算申购总价
    basicInfo.singlePrice = parseFloat(basicInfo.singlePrice);
    basicInfo.purchaseCount = parseFloat(basicInfo.purchaseCount);
    detail.totalPrice = 0;
    if (!dataSource || dataSource.length == 0) {
      basicInfo.rowId = Date.now();
      detail.totalPrice = basicInfo.totalPrice;
      setDataSource([basicInfo]);
    } else {
      if (isAddEquipment) {
        basicInfo.rowId = Date.now();
        setDataSource([basicInfo, ...dataSource]);
        for (let i = 0; i < [basicInfo, ...dataSource].length; i++) {
          detail.totalPrice += [basicInfo, ...dataSource][i].totalPrice;
        }
      } else {
        for (let i = 0; i < dataSource.length; i++) {
          const item = dataSource[i];
          if (rowId == item.rowId || rowId == item.id) {
            dataSource[i].alias = basicInfo.alias;
            dataSource[i].brandName = basicInfo.brandName;
            dataSource[i].manufacturerName = basicInfo.manufacturerName;
            dataSource[i].modelId = basicInfo.modelId;
            dataSource[i].modelName = basicInfo.modelName;
            dataSource[i].name = basicInfo.name;
            dataSource[i].purchaseCount = basicInfo.purchaseCount;
            dataSource[i].rowId = Date.now();
            if (item.id) {
              dataSource[i].id = rowId;
            }
            dataSource[i].singlePrice = basicInfo.singlePrice;
            dataSource[i].totalPrice = basicInfo.totalPrice;
            dataSource[i].typeId = basicInfo.typeId;
            dataSource[i].typeName = basicInfo.typeName;
            setDataSource(dataSource);
            for (let j = 0; j < dataSource.length; j++) {
              detail.totalPrice += dataSource[j].totalPrice;
            }
            break;
          }
        }
      }
    }
    setSelectEquipmentVisible(false);
  };

  // 编辑
  const onTableEdit = async (record: any) => {
    setRowId(record.rowId ?? record.id);
    setIsAddEquipment(false);
    setSelectEquipmentVisible(true);
    setTimeout(() => {
      basicInfoFormRef.current?.init!({
        operation: OperationType.EDIT,
        values: record,
      });
    }, 500);
  };

  // 删除 删除分两种情况，第一种，前端添加的数据前端自己删除；第二种，后台返回的数据，调接口删除
  // 通过id（有：后端请求删除；无，前端删除）判断
  const onTableDel = async (record: any) => {
    console.log(dataSource);
    console.log(record);
    if (record.id) {
      try {
        await delEquiomentDetail([record.id]);
      } catch (err: any) {
        message.error(err.message);
      } finally {
        // 删除成功之后将页面显示的数据也删除
        for (let i = 0; i < dataSource.length; i++) {
          if (record.id == dataSource[i].id) {
            const detailsList = dataSource;
            detailsList.splice(i, 1);
            setDataSource([...detailsList]);
            message.success('删除成功');
            break;
          }
        }
      }
    } else {
      for (let i = 0; i < dataSource.length; i++) {
        if (record.rowId == dataSource[i].rowId) {
          const detailsList = dataSource;
          detailsList.splice(i, 1);
          console.log(detailsList);
          setDataSource([...detailsList]);
          message.success('删除成功');
          break;
        }
      }
    }
    detail.totalPrice = 0;
    for (let i = 0; i < dataSource.length; i++) {
      detail.totalPrice += dataSource[i].totalPrice;
    }
  };

  const columns: any = [
    {
      title: '设备名称',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '设备别名',
      key: 'alias',
      dataIndex: 'alias',
    },
    {
      title: '设备型号',
      key: 'modelName',
      dataIndex: 'modelName',
    },
    {
      title: '设备类型',
      key: 'typeName',
      dataIndex: 'typeName',
    },
    {
      title: '品牌',
      key: 'brandName',
      dataIndex: 'brandName',
    },
    {
      title: '单价',
      key: 'singlePrice',
      dataIndex: 'singlePrice',
    },
    {
      title: '购买数量',
      key: 'purchaseCount',
      dataIndex: 'purchaseCount',
    },
    {
      title: '合计金额',
      key: 'totalPrice',
      dataIndex: 'totalPrice',
    },
    {
      title: '厂商',
      key: 'manufacturerName',
      dataIndex: 'manufacturerName',
    },
  ];

  // 弹框底部各个按钮显示的条件
  // 新增/草稿/驳回状态 都可编辑
  const orderStatusInit =
    type == OrderStatus.INIT ||
    type == OrderStatus.ADD ||
    type == OrderStatus.REJECT;
  // 通过
  const orderStatusPass =
    subAuthorities?.includes('AUDIT') && type == OrderStatus.APPROVAL;
  // 驳回
  const orderStatusReject =
    subAuthorities?.includes('AUDIT') && type == OrderStatus.APPROVAL;
  // 撤单
  const orderStatusCancel =
    (type == OrderStatus.INIT || type == OrderStatus.APPROVAL) &&
    detail.id &&
    employeeId == detail.personId;
  // 启用
  const orderStatusEnable = type == OrderStatus.PASS;
  // 审批意见
  const orderStatusApproval =
    type !== OrderStatus.ADD && type !== OrderStatus.INIT;

  // 添加和草稿状态有操作功能
  if (orderStatusInit) {
    const options: any = {
      title: '操作',
      key: 'operation',
      width: 140,
      render: (record: SbscriptionDetailItem) => (
        <>
          <a
            style={{ marginRight: '10px' }}
            onClick={() => onTableEdit(record)}
          >
            编辑
          </a>
          <a style={{ color: 'red' }} onClick={() => onTableDel(record)}>
            删除
          </a>
        </>
      ),
    };
    columns.push(options);
  }

  const init = () => {
    const { purchaseTime, purchaseReason, deptId, approvalAdvice } = detail;
    setDataSource(detail.detailList);
    form.setFieldsValue({
      purchaseTime: stringToMoment(purchaseTime),
      purchaseReason,
      deptId,
      approvalAdvice,
    });
  };

  useEffect(() => {
    if (detail) {
      init();
    }
  }, [detail]);

  return (
    <>
      <Modal
        title={`设备申购单-${title}`}
        visible={visible}
        width="1000px"
        maskClosable={false}
        destroyOnClose={true}
        onCancel={onModalCancel}
        bodyStyle={{ height: 650, overflow: 'auto' }}
        footer={
          <>
            {orderStatusInit && (
              <Button
                type="primary"
                loading={loading}
                onClick={() => onConfirm(OrderStatus.INIT)}
              >
                草稿
              </Button>
            )}
            {orderStatusInit && (
              <Button
                type="primary"
                loading={loading}
                onClick={() => onConfirm(OrderStatus.APPROVAL)}
              >
                保存
              </Button>
            )}
            {/* 有审核权限的用户才显示审核按钮 */}
            {orderStatusPass && (
              <Button
                type="primary"
                loading={loading}
                onClick={() => onConfirm(OrderStatus.PASS)}
              >
                通过
              </Button>
            )}
            {orderStatusReject && (
              <Button
                type="primary"
                danger
                loading={loading}
                onClick={() => onConfirm(OrderStatus.REJECT)}
              >
                驳回
              </Button>
            )}
            {/* 撤销申请按钮，新建设备的时候不显示，只有申请人才有撤销功能,只有在草稿状态和审核状态才能撤销 */}
            {orderStatusCancel && (
              <Button
                type="primary"
                danger
                loading={loading}
                onClick={() => onConfirm(OrderStatus.CANCEL)}
              >
                撤单
              </Button>
            )}
            {/* 审核通过之后才能启用 */}
            {orderStatusEnable && (
              <Button
                type="primary"
                loading={loading}
                onClick={() => onConfirm(OrderStatus.ENABLE)}
              >
                启用
              </Button>
            )}
            <Button onClick={onModalCancel}>关闭</Button>
          </>
        }
      >
        <h1 className={styles.scarpTitle}>设备申购单</h1>
        <Form
          form={form}
          className={styles.subscriptionForm}
          name="subscriptionDetailForm"
        >
          <Descriptions bordered column={2} size="small">
            {type !== 'ADD' && (
              <>
                <Descriptions.Item label="采购单号">
                  {detail.orderNo}
                </Descriptions.Item>
                <Descriptions.Item label="申购状态">
                  <Tag color={itemConfig?.color}>{itemConfig?.label}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="审批人">
                  {detail.approvalPersonName}
                </Descriptions.Item>
                <Descriptions.Item label="审批时间">
                  {detail.approvalTime}
                </Descriptions.Item>
              </>
            )}

            <Descriptions.Item label="申购总价">
              ¥{detail.totalPrice ?? 0}
            </Descriptions.Item>
            <Descriptions.Item label="申购科室">
              <Form.Item label="" name="deptId" rules={[{ required: true }]}>
                {orderStatusInit ? (
                  <Select
                    showSearch
                    value={detail.deptId}
                    optionFilterProp="label"
                    style={{ width: '100%' }}
                    placeholder="请选择科室"
                    options={deptOptions}
                    onSelect={(value: any, options: any) =>
                      onselectDeptChange(value, options)
                    }
                  />
                ) : (
                  detail.deptName
                )}
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label="申购人">
              {detail.personName ?? currentUser?.employee.name}
            </Descriptions.Item>
            <Descriptions.Item label="采购日期">
              {orderStatusInit ? (
                <Form.Item
                  label=""
                  name="purchaseTime"
                  rules={[{ required: true }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              ) : (
                detail.purchaseTime
              )}
            </Descriptions.Item>
            <Descriptions.Item label="申购原因" span={2}>
              {/* 只有在新增和草稿时才可以编辑申购原因 */}
              {orderStatusInit ? (
                <Form.Item
                  label=""
                  name="purchaseReason"
                  rules={[{ required: true }]}
                >
                  <TextArea
                    style={{ width: '100%' }}
                    defaultValue={detail.purchaseReason}
                    rows={4}
                  />
                </Form.Item>
              ) : (
                detail.purchaseReason
              )}
            </Descriptions.Item>

            {/* 单据状态不为草稿时才有审批意见，在审核中显示输入框 */}
            {orderStatusApproval && (
              <Descriptions.Item label="审批意见" span={2}>
                {type == OrderStatus.APPROVAL &&
                subAuthorities?.includes('AUDIT') ? (
                  <Form.Item
                    label=""
                    name="approvalAdvice"
                    rules={[{ required: true }]}
                  >
                    <TextArea
                      style={{ width: '100%' }}
                      defaultValue={detail.approvalAdvice}
                      rows={4}
                    />
                  </Form.Item>
                ) : (
                  detail.approvalAdvice
                )}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Form>

        {orderStatusInit && (
          <Button
            onClick={addEquipment}
            type="primary"
            icon={<PlusOutlined />}
            className={styles.orderAddBtn}
          >
            添加设备
          </Button>
        )}

        <Table
          style={{ marginTop: '20px' }}
          rowKey={(item: any) => item.id || item.rowId}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </Modal>
      <Modal
        title={`添加设备`}
        visible={selectEquipmentVisible}
        width="1000px"
        maskClosable={false}
        destroyOnClose={true}
        onCancel={selectEquipmentCancel}
        onOk={selectEquipmentOk}
        bodyStyle={{ height: 400, overflow: 'auto' }}
      >
        <BasicInfoForm ref={basicInfoFormRef} equipmentTypes={equipmentTypes} />
      </Modal>
    </>
  );
};

export default SubscriptionModal;
