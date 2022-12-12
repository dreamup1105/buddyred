import React from 'react';
import { Row, Col, Timeline } from 'antd';
import { LendingTypeEnum, LendingType } from '../type';
import type { ProTableColumn } from '@/components/ProTable';
import type { LendingTable } from '../type';
import { SelectEquipmentColumn } from '../type';
import styles from '@/pages/Repair/Management/index.less';
import style from '../index.less';
import Logo from '@/assets/yxklogo.png';


interface IModalProps {
    detail: any;
}

const LendingInfoPrint: React.FC<IModalProps> = ({
    detail,
}) => {
    const columns: ProTableColumn<LendingTable>[] = [
        ...SelectEquipmentColumn,
    ]

    // 审核类型
    const orderTypeMap = (value: string) => {
        const itemConfig = LendingTypeEnum.get(value);
        return itemConfig?.label
    }
    
    return (
        <>
            <div className={`${styles.repairReport} repairReport page-break`}>
                <header className={`${styles.header} report-node`}>
                    <div className={styles.title}>
                    <h5>
                        {detail?.orgName}设备转借详情
                    </h5>
                    <span>MEDICAL EQUIPMENT LENDING REPORT</span>
                    </div>
                    <img src={Logo} className={styles.logo} />
                </header>
                <div className={styles.inner}>
                    <div className={`${styles.base} report-node`}>
                        <Row>
                            <Col span={12} className={styles.cell}>
                            转借单号：{detail?.orderNo}
                            </Col>
                            <Col span={12} className={styles.cell}>
                            类型：{orderTypeMap(detail?.orderType)}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12} className={styles.cell}>
                            转出科室：{detail?.sourceDeptName}
                            </Col>
                            <Col span={12} className={styles.cell}>
                            转入科室：{detail?.targetDeptName}
                            </Col>
                        </Row>
                        {
                            detail?.orderType == LendingType.SECONDED &&
                            <Row>
                                <Col span={12} className={styles.cell}>
                                预计归还时间：{detail?.returnTime}
                                </Col>
                                {
                                    detail?.isReturn == 1
                                    ?   <Col span={12} className={styles.cell}>
                                            实际归还时间：{detail?.confirmReturnTime}
                                        </Col>
                                    :   <Col span={8} className={styles.cell}>
                                            是否归还：未归还
                                        </Col>
                                }
                                
                            </Row>
                        }
                        <Row>
                            <Col span={24} className={styles.cell}>
                            转借原因：{detail?.reason}
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col span={24}>
                            <table className={style.wrapTable}>
                                <thead>
                                    <tr>
                                        {
                                            columns.map((item: any) => <th key={item.key}>{item.title}</th>)
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        detail?.detailList.map((item: any) =>
                                            <tr key={item.eqId}>
                                                <td>{item.name}</td>
                                                <td>{item.modelName}</td>
                                                <td>{item.manufacturerName}</td>
                                                <td>{item.equipmentNo}</td>
                                                <td>{item.sn}</td>
                                                <td>{item.typeName}</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                    <div className={`${styles.desc} report-node`}
                        style={{marginTop: '20px'}}>
                        <div className={styles.descTitle}>审核流程</div>
                        <Row>
                            <Col span={24} className={`${styles.cell} ${styles.cellLabel}`}>
                                <Timeline mode={`left`} style={{paddingTop: '20px'}}>
                                    {
                                        detail?.auditFlowList.map((item: any) => 
                                            <Timeline.Item key={item.id} label={`${item.auditTime == null ?  '' : item.auditTime}`}>
                                                <p>{item.advice == null ? '' : item.auditPersonName}</p>
                                                <p>{item.result == null ? '' : item.result == 'REJECT' ? '不同意' : '同意'}</p> 
                                                <p>{item.advice == null ? '' : item.advice}</p>
                                            </Timeline.Item>
                                        )
                                    }
                                </Timeline>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LendingInfoPrint