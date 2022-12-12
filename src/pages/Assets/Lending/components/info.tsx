import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Table, Row, Col, Badge, Steps, Radio, Input, Tag } from 'antd';
import type { ProTableColumn } from '@/components/ProTable';
import { SelectEquipmentColumn, LendingStatusEnum, LendingTypeEnum, LendingType } from '../type';
import type { LendingTable } from '../type';
const { Step } = Steps;
const { TextArea } = Input;
import { checkOrderAPI, auditByIdAPI } from '../service';

interface IModalProps {
    status: string | undefined;
    visible: boolean;
    orderId?: number;
    onCancel: () => void;
    onConfirm: (data: any) => void;
}

const InfoModal: React.FC<IModalProps> = ({
    status = 'LOOK',
    visible = false,
    orderId,
    onCancel,
    onConfirm
}) => {
    const [form] = Form.useForm();
    const [detail, setDetail] = useState<any>();
    const columns: ProTableColumn<LendingTable>[] = [
        ...SelectEquipmentColumn,
    ]
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

    // 审核状态
    const orderStatusMap = (value: string) => {
        const itemConfig = LendingStatusEnum.get(value);
        return <Badge status={itemConfig?.color} text={itemConfig?.label} />;
    } 

    // 审核类型
    const orderTypeMap = (value: string) => {
        const itemConfig = LendingTypeEnum.get(value);
        return <Tag color={itemConfig?.color}>{itemConfig?.label}</Tag>
    }
    
    // 归还状态
    const orderIsReturnMap = (value: number) => {
        if (value == 1) {
            return <Tag color="green">已归还</Tag>;
        }
        return <Tag color="red">未归还</Tag>;
    } 

    // 通过 orderId  获取详情信息
    const getInfo = async () => {
        try {
            if (status == 'AUDIT') {
                const { data } = await auditByIdAPI(orderId);
                setDetail(data);
            } else {
                const { data } = await checkOrderAPI(orderId);
                setDetail(data);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const onModalConfirm = async () => {
        const formValue = await form.validateFields();
        const currentAuditArr = detail?.auditFlowList.filter((item: any) => item.auditOrder == detail.auditStep);
        setConfirmLoading(true);
        onConfirm({
            ...currentAuditArr[0],
            ...formValue,
        });
        setConfirmLoading(false);
    }

    useEffect(() => {
        if (visible) {
            getInfo();
        }
    }, [visible])

    return (
        <>
            <Modal
                title={`设备转借-详情`}
                visible={visible}
                width="1000px"
                maskClosable={false}
                destroyOnClose={true}
                onCancel={onCancel}
                footer={
                    <>
                    {
                        status == 'AUDIT' &&
                        <Button
                            type="primary"
                            loading={confirmLoading}
                            onClick={() => onModalConfirm()}
                            >
                                审核
                        </Button>
                    }
                    <Button onClick={onCancel}>
                        取消
                    </Button>
                    </>
                }
            >
                <Form
                    form={form}
                    name="infoForm"
                    autoComplete="off"
                    preserve={false}
                    >
                    <Row>
                        <Col span={8}>
                            <Form.Item label="转借单号">{detail?.orderNo}</Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="转出科室">{detail?.sourceDeptName}</Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="转入科室">{detail?.targetDeptName}</Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="类型">{orderTypeMap(detail?.orderType) }</Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="状态">{orderStatusMap(detail?.orderStatus)}</Form.Item>
                        </Col>
                        <Col span={8} />
                        {/* 只有借调单才显示是够归还 / 预计归还时间*/}
                        {
                            detail?.orderType == LendingType.SECONDED &&
                            <>
                            <Col span={8}>
                                <Form.Item label="预计归还时间">{detail?.returnTime}</Form.Item>
                            </Col>
                            {
                                detail?.isReturn == 1 &&
                                <Col span={8}>
                                    <Form.Item label="实际归还时间">{detail?.confirmReturnTime}</Form.Item>
                                </Col>  
                            }
                            <Col span={8}>
                                <Form.Item label="是否归还">{orderIsReturnMap(detail?.isReturn)}</Form.Item>
                            </Col>
                            </>
                        }
                        
                        <Col span={24}>
                            <Form.Item label="转借原因" >{detail?.reason}</Form.Item>
                        </Col>
                        
                        {
                            status == 'AUDIT' &&
                            <>
                            <Col span={24}>
                                <Form.Item label="是否通过" name="result" rules={[{ required: true }]}>
                                    <Radio.Group>
                                        <Radio value="PASS">
                                            同意
                                        </Radio>
                                        <Radio value="REJECT">
                                            不同意
                                        </Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="审核意见" name="advice" rules={[{ required: true }]}>
                                    <TextArea rows={4} placeholder="请输入审核意见" />
                                </Form.Item>
                            </Col>
                            </>
                        }

                        <Col span={24} style={{marginBottom: '20px'}}>
                            <Table
                                sticky
                                style={{ marginTop: '10px', maxHeight: '300px', overflow: 'auto' }}
                                rowKey='eqId'
                                columns={columns}
                                dataSource={detail?.detailList}
                                pagination={false}
                            />
                        </Col>
                        <Col span={24}>
                            <Form.Item label="审批人">
                                <Steps current={detail?.auditStep - 1} size="small" direction="vertical">
                                    {
                                        detail?.auditFlowList.map((item: any) => 
                                            <Step 
                                                title={item.auditPersonName} 
                                                key={item.id} 
                                                description={`
                                                    ${item.auditTime == null ?  '' : item.auditTime}   
                                                    ${item.result == null ? '' : item.result == 'REJECT' ? '不同意' : '同意'}   
                                                    ${item.advice == null ? '' : item.advice}`
                                                }/>
                                        )
                                    }
                                </Steps>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}

export default InfoModal