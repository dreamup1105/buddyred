import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Button, Table, Row, Col, Input, DatePicker, message, Badge } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ProTableColumn } from '@/components/ProTable';
import { lendingTypeOptions, SelectEquipmentColumn, LendingStatus, LendingType } from '../type';
import type { LendingTable, SelectedEquipmentItem } from '../type';
const { TextArea } = Input;
const { confirm } = Modal;
import { listOrgEmpAPI, checkOrderAPI, principalDeptAPI } from '../service';
import SelectEquipmentModal from './selectEquipment';
import useDepartments from '@/hooks/useDepartments';
import useUserInfo from '@/hooks/useUserInfo';
import DepartmentSelector from '@/components/DepartmentSelector';
import { momentToString, WithoutTimeFormat, stringToMoment } from '@/utils/utils';
import moment from 'moment';
interface IModalProps {
    title: string;
    orderId?: number;
    visible: boolean;
    onCancel: () => void;
    onConfirm: (data: any) => void
}

const DetailModal: React.FC<IModalProps> = ({
    title,
    orderId,
    visible = false,
    onCancel,
    onConfirm
}) => {
    const { currentUser } = useUserInfo();
    const orgId = currentUser?.org.id;
    const { departmentsTreeData } = useDepartments({ orgId: orgId! }, true);
    const [form] = Form.useForm();
    const [sourceDepartmentOptions, setSourceDepartmentOptions] = useState([]);
    const [orderInfo, setOrderInfo] = useState<any>();
    const [equipmentData, setEquipmentData] = useState<any>([]);
    const [auditOptions, setAuditOptions] = useState([]);
    const [selectEquipmentVisible, setSelectEquipmentVisible] = useState<boolean>(false);
    const [selectEquipmentKey, setSelectEquipmentKey] = useState<number[]>([]);
    const [selectDeptId, setSelectDeptId] = useState<number>(0);
    const [selectParams, setSelectParams] = useState<any>();
    const [orderType, setOrderType] = useState<string>();
    const [btnInitLoading, setBtnInitLoading] = useState<boolean>(false);
    const [btnAuditLoading, setBtnAuditLoading] = useState<boolean>(false);

    // 获取源科室列表
    const getSourceDepartmentData = async () => {
        try {
            const { data } = await principalDeptAPI();
            setSourceDepartmentOptions(data.map((item: any) => {
                return {
                    label: item.name,
                    value: item.id
                }
            }));
        } catch (err: any) {
            console.log(err);
        }

    }

    // 获取审批人
    const getAuditData = async () => {
        try {
            const { data } = await listOrgEmpAPI();
            setAuditOptions(data.map((item: any) => {
                return {
                    label: item.title,
                    value: item.value
                }
            }));
        } catch (err: any) {
            console.log(err);
        }
    }

    //转出科室选择
    const sourceDepSelect = (value: any, options: any) => {
        if (equipmentData.length > 0) {
            confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                content: '选择转出科室时将清除已经添加的设备，是否继续？',
                onOk() {
                    setEquipmentData([]);
                },
                onCancel() {},
              });
        }
        setSelectParams({
            ...selectParams,
            sourceDeptId: options.value,
            sourceDeptName: options.label
        })
    }

    // 转入科室选择
    const targetDepChange = (value: any, options: any) => {
        setSelectParams({
            ...selectParams,
            targetDeptId: value,
            targetDeptName: options[0]
        })
    }

    // 添加设备
    const onAddSCarpClick = () => {
        const formValues = form.getFieldsValue();
        if (!formValues.sourceDeptId) {
            message.warning('请先选择转出科室');
            return;
        }
        setSelectDeptId(formValues.sourceDeptId);
        setSelectEquipmentVisible(true);
        setSelectEquipmentKey(equipmentData.map((item: SelectedEquipmentItem) => {
            return item.eqId
        }));
    }

    // 添加设备弹框确认
    const onSelectEquipmentConfirm = (data: SelectedEquipmentItem[]) => {
        setEquipmentData(data);
        setSelectEquipmentVisible(false);
    }

    //删除设备
    const onTableDetail = (record: any) => {
        const equipementArr = equipmentData.filter((item: any) => item.eqId != record.eqId);
        setEquipmentData(equipementArr);
    }

    //弹框取消
    const onModalCancel = () => {
        setOrderInfo({});
				setOrderType('');
        onCancel();
    }

    // 弹框确认
    const onModalConfirm = async (status: string) => {
        const formValue = await form.validateFields();
        const auditList: any = [];
        if (equipmentData.length < 1) {
            message.warning('请添加设备');
            return;
        }
        
        // 遍历审批人，组装成后台所需要的数据格式
        formValue.auditFlowList.forEach((item: any) => {
            auditOptions.forEach((audit: any) => {
                if (item == audit.value) {
                    auditList.push({
                        auditPerson: audit.value,
                        auditPersonName: audit.label
                    })
                }
            })
        })
        const params = {
            ...orderInfo,
            ...formValue,
            ...selectParams,
            auditFlowList: auditList,
            detailList: equipmentData,
            orderStatus: status,
            returnTime: momentToString(formValue.returnTime, WithoutTimeFormat)
        }
        if (status == LendingStatus.INIT) {
            setBtnInitLoading(true);
        } else if (status == LendingStatus.AUDITING) {
            setBtnAuditLoading(true);
        }
        setOrderInfo({});
        await onConfirm(params);
        setBtnInitLoading(false);
        setBtnAuditLoading(false);
				setOrderType('');
    }

    // 通过 orderId  获取详情信息
    const getInfo = async () => {
        try {
            const { data } = await checkOrderAPI(orderId);
            const auditPersonArr = data.auditFlowList.map((item: any) => item.auditPerson)
            setOrderInfo({
                ...data,
            });
            form.setFieldsValue({
                sourceDeptId: data.sourceDeptId,
                targetDeptId: data.targetDeptId,
                orderType: data.orderType,
                returnTime: stringToMoment(data.returnTime),
                reason: data.reason,
                auditFlowList: auditPersonArr
            }); 
            setOrderType(data.orderType);
            setEquipmentData(data.detailList);
        } catch (err) {
            console.log(err);
        }
    }
    
    const orderTypeChange = (value: string) => {
        setOrderType(value);
    }

    const disabledDate = (current: any) => {
        return current && current < moment().endOf('day');
    };
    
    const columns: ProTableColumn<LendingTable>[] = [
        ...SelectEquipmentColumn,
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            hideInSearch: true,
            render: (_, record) => {
                return (
                    <a onClick={() => onTableDetail(record)}>删除</a>
                );
            }
        }
    ]
    
    const initData = () => {
        if (visible) {
            getSourceDepartmentData();
            getAuditData();
            if (orderId) {
                getInfo();
            } else {
                form.resetFields();
                setEquipmentData([]);
            }
        }
    }

    useEffect(() => {
        initData();
    }, [visible])


    return (
        <>
            <Modal
                title={`设备转借-${title}`}
                visible={visible}
                width="1000px"
                maskClosable={false}
                destroyOnClose={true}
                onCancel={onModalCancel}
                footer={
                    <>
                    {/* 新增和草稿状态 */}
                    {
                        (orderInfo?.orderStatus == undefined || orderInfo?.orderStatus == LendingStatus.INIT) &&
                        <>
                        <Button
                            type="primary"
                            loading={btnInitLoading}
                            onClick={() => onModalConfirm(LendingStatus.INIT)}
                            >
                                草稿
                        </Button>
                        <Button
                            type="primary"
                            loading={btnAuditLoading}
                            onClick={() => onModalConfirm(LendingStatus.AUDITING)}
                            >
                                申请
                        </Button>
                        </>
                    }
                    
                    <Button
                        onClick={onModalCancel}
                    >
                        取消
                    </Button>
                    </>
                }
            >
                <Form
                    form={form}
                    name="basic"
                    autoComplete="off"
                    preserve={false}
                    >
                    <Row>
                    
                        <Col span={8}>
                            <Form.Item
                                label="转出科室"
                                name="sourceDeptId"
                                rules={[{ required: true }]}
                            >
                                <Select 
                                    options={sourceDepartmentOptions} 
                                    placeholder="请选择转出科室"
                                    onSelect={sourceDepSelect}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="转入科室"
                                name="targetDeptId"
                                rules={[{ required: true }]}
                            >
                                <DepartmentSelector
                                    onChange={targetDepChange}
                                    treeSelectProps={{
                                        treeData: departmentsTreeData,
                                        virtual: false,
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="转借类型"
                                name="orderType"
                                rules={[{ required: true }]}
                            >
                                <Select options={lendingTypeOptions} onChange={orderTypeChange} placeholder="请选择转借类型" />
                            </Form.Item>
                        </Col>
                        {/* 借调单才有归还时间 */}
                        {
                            orderType == LendingType.SECONDED &&
                            <Col span={8}>
                                <Form.Item
                                    label="归还时间"
                                    name="returnTime"
                                    rules={[{ required: true}]}
                                >
                                    <DatePicker 
                                        disabledDate={disabledDate}
                                        format="YYYY-MM-DD" style={{width: '100%'}} />
                                </Form.Item>
                            </Col>
                        }
                        <Col span={24} style={{marginBottom: '20px'}}>
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                onClick={onAddSCarpClick}
                            >
                                添加设备
                            </Button>
                            <Table
                                sticky
                                style={{ marginTop: '10px', maxHeight: '300px', overflow: 'auto' }}
                                rowKey='eqId'
                                columns={columns}
                                dataSource={equipmentData}
                                pagination={false}
                            />
                        </Col>
                        <Col span={18}>
                            <Form.Item
                                label="审批人"
                                name="auditFlowList"
                                rules={[{ required: true}]}
                            >
                                <Select
                                    mode="multiple"
                                    allowClear
                                    autoClearSearchValue={false}
                                    style={{ width: '100%', marginRight: '20px' }}
                                    options={auditOptions}
                                    optionFilterProp="label"
                                    placeholder="请选择审批人"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Badge status="warning" text="审批顺序为选择审批人的顺序" />
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="转借原因"
                                name="reason"
                            >
                                <TextArea rows={4} placeholder="请输入借调原因" />
                            </Form.Item>
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
    )
}

export default DetailModal