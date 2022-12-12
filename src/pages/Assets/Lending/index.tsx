import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { FormInstance } from 'antd/es/form';
import ProTable from '@/components/ProTable';
import { momentToString, tableHeight } from '@/utils/utils';
import { LendingTypeEnum, LendingStatusEnum, LendingStatus, LendingType } from './type';
import type { LendingTable , LendingStaticItem } from './type';
import { Select, Button, Badge, message, Input, DatePicker, Divider, Popconfirm, Tag, Tooltip, Row, Col } from 'antd';
import useACL from '@/hooks/useACL';
import {
  lendingListAPI,
  saveOrUpdateAPI,
  deleteByIdAPI,
  saveAuditResultAPI,
  returnEquipmentAPI,
  checkOrderAPI,
  statOrderNumByStatusAPI
} from './service';
import useUserInfo from '@/hooks/useUserInfo';
import DetailModal from './components/detail';
import InfoModal from './components/info';
const { RangePicker } = DatePicker; 
import { lendingTypeOptions, lendingStatusOptions } from './type';
import omit from 'omit.js';
import style from './index.less';

import usePrint from '@/hooks/usePrint';
import PrintContainer from '@/components/PrintContainer';
import type { TableProps } from 'antd/es/table';
import {  PrinterOutlined } from '@ant-design/icons';
import LendingInfoPrint from './components/print'

const DefaultQuery = {
  current: 1,
  pageSize: 30,
  keyword: '', // 关键字-单号/源科室名称/转借科室名称/发起人
  orderStatus: null, //INIT,AUDITING,PASS
  orderType: null, //TRANSFER,SECONDED
  beginTime: undefined, //发起时间段-开始时间
  endTime: undefined, //发起时间段-结束时间
};

const AssetsLendingPage: React.FC = () => {
  const { currentUser } = useUserInfo();
  const { isACL } = useACL();
  const employeeId = currentUser?.employee.id;
  const orgId = currentUser?.org.id;
  const orgName = currentUser?.org.name;
  // const deptId = currentUser?.primaryDepartment.id;
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  
  const [detailModalTitle, setDetailModalTitle] = useState<string>('新增');
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<number | undefined>();
  const [infoVisible, setInfoVisible] = useState<boolean>(false);
  const [infoStatus, setInfoStatus] = useState<string>();

  
  const { componentRef: detailPrintComponentRef, onPrint: onBatchPrintDetails } = usePrint();
  const [selectedEquipKeys, setSelectedEquipKeys] = useState<number[]>([]);
  const [isPrint, setIsPrint] = useState<boolean>(false);
  const [selectRowDetail, setSelectRowDetail] = useState<any[]>([]);
  const [printLoading, setPrintLoading] = useState<boolean>(false);
  
  const [lendingStatic, setLendingStatic] = useState<LendingStaticItem>();

  // 获取转借单各个状态数量
  const getLendingStaticData = async (params: any) => {
    try {
      const { data }  = await statOrderNumByStatusAPI(params);
      setLendingStatic(data);
    } catch (err: any) {
      console.log(err);
    }
  }

  // 点击数量统计 查询对应的单据
  const onStaticClick = async (type: string, value: string) => {
    if (type == 'type') {
      formRef.current?.setFieldsValue({
        orderStatus: undefined,
        orderType: value
      });
    } else {
      formRef.current?.setFieldsValue({
        orderStatus: value,
        orderType: undefined
      });
    }
    actionRef.current?.reload();
  }

  // 撤单
  const orderRevolke = async (id: number) => {
    try {
      await deleteByIdAPI(id);
      message.success('撤单成功');
      actionRef.current?.reload();
    } catch (err: any) {
      console.log(err);
    }
  }

  // 查看详情
  const onTableDetailClick = async (record: LendingTable, status: string) => {
    switch (status) {
      case 'LOOK': //查看
        setInfoStatus(status);
        setOrderId(record.id);
        setInfoVisible(true);
        break;
      case 'EDIT': //编辑
        setOrderId(record.id);
        setDetailModalTitle('编辑');
        setDetailModalVisible(true);
        break;
      case 'REVOLKE': //撤回
        orderRevolke(record.id);
        break;
      case 'AUDIT': //审核 
        setInfoStatus(status);
        setOrderId(record.id);
        setInfoVisible(true);
        break;
      case 'RETURN': //归还
        try {
          await returnEquipmentAPI(record.id);
          message.success('借调的设备已归还');
          actionRef.current?.reload();
        } catch (err: any) {
          console.log(err);
        }
        break;
    }
  };

  // 新建转借单
  const onAddSCarpClick = () => {
      setOrderId(undefined);
      setDetailModalTitle('新增');
      setDetailModalVisible(true);
  }

  // 转借单弹框确认
  const onDetailModalConfirm = async (data: any) => {
    try {
      await saveOrUpdateAPI({
        ...data,
        orgId,
        orgName
      });
      if (data.orderStatus == LendingStatus.INIT) {
        message.success('保存草稿成功');
      } else {
        message.success('申请成功');
      }
      setDetailModalVisible(false);
      actionRef.current?.reload();
    } catch(err: any) {
      console.log(err);
    }
  }

  // 审核 归还弹框确认
  const infoConfirm = async (data: any) => {
    try {
      await saveAuditResultAPI(data);
      setInfoVisible(false);
      actionRef.current?.reload();
      message.success('审核成功');
    } catch (err: any) {
      console.log(err);
    }
  } 

  // 显示表格多选框
  const rowSelection: TableProps<LendingTable>['rowSelection'] = {
    preserveSelectedRowKeys: true,
    selectedRowKeys: selectedEquipKeys,
    onChange: (selectedRowKeys) => {      
      setSelectedEquipKeys(selectedRowKeys as number[]);
    },
  };

  // 打印 点击打印的时候筛选审核过的单据
  const onPrint = async () => {
    setSelectedEquipKeys([]);
    actionRef.current?.reset();
    formRef.current?.setFieldsValue({
      orderStatus: LendingStatus.PASS
    });
    actionRef.current?.reload();
    setIsPrint(true);
  }

  // 取消打印
  const onPrintCancel = async () => {
    actionRef.current?.reset();
    setIsPrint(false);
    setSelectedEquipKeys([])
  }

  // 确认打印
  const onPrintConfirm = async () => {
    const formData = formRef.current?.getFieldsValue();
    if (formData.orderStatus != LendingStatus.PASS) {
      message.warning('只能打印审核结束的转借单');
      return;
    }
    if (selectedEquipKeys.length == 0) {
      message.warning('请选择需要打印的转借单');
      return;
    }
    if (selectedEquipKeys.length > 30) {
      message.warning('单次打印的数量不能超过30个');
      return;
    }
    setPrintLoading(true);
    try {
      const checkorderArr: any = [];
      for(let i = 0; i < selectedEquipKeys.length; i++) {
        const { data } = await checkOrderAPI(selectedEquipKeys[i]);
        checkorderArr.push(data);
      }
      setSelectRowDetail(checkorderArr);
      onBatchPrintDetails!();

      setPrintLoading(false);
      setIsPrint(false);
      actionRef.current?.reset();
      setSelectedEquipKeys([]);
    } catch(err) {
      console.log(err);
    }
  }

  const columns: ProTableColumn<LendingTable>[] = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      key: 'keyword',
      hideInTable: true,
      renderFormItem: () => (
        <Input placeholder="单号/源科室/转借科室/发起人" />
      ),
    },
    {
      title: '发起时间',
      dataIndex: 'date',
      key: 'date',
      hideInTable: true,
      renderFormItem: () => (
        <RangePicker showTime />
      ),
    },
    {
      title: '单据编号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '类型',
      dataIndex: 'orderType',
      key: 'orderType',
      width: 120,
      renderFormItem: () => (
        <Select>
            {
              lendingTypeOptions.map((item: any) => {
                return <Select.Option value={item.value} key={item.value}>{item.label}</Select.Option>
              })
            }
        </Select>
      ),
      render: (val) => {
        const itemConfig = LendingTypeEnum.get(val);
        return <Tag color={itemConfig?.color}>{itemConfig?.label}</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: 120,
      renderFormItem: () => (
        <Select>
            {
              lendingStatusOptions.map((item: any) => {
                return <Select.Option value={item.value} key={item.value}>{item.label}</Select.Option>
              })
            }
        </Select>
      ),
      render: (val) => {
        const itemConfig = LendingStatusEnum.get(val);
        return <Badge status={itemConfig?.color} text={itemConfig?.label} />;
      },
    },
    {
      title: '转出科室',
      dataIndex: 'sourceDeptName',
      key: 'sourceDeptName',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '转入科室',
      dataIndex: 'targetDeptName',
      key: 'targetDeptName',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '发起人',
      dataIndex: 'createPersonName',
      key: 'createPersonName',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '发起时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '最后操作人',
      dataIndex: 'lastModifyPersonName',
      key: 'lastModifyPersonName',
      width: 160,
      hideInSearch: true,
    },
    
    {
      title: '最后操作时间',
      dataIndex: 'lastModifyTime',
      key: 'lastModifyTime',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      key: 'operations',
      width: 160,
      hideInSearch: true,
      fixed: 'right',
      render: (_, record) => {
        switch(record.orderStatus) {
          case LendingStatus.INIT:   //草稿
            return (
              <>
                {
                  record.createPerson == employeeId &&
                  <>
                    <a onClick={() => onTableDetailClick(record, 'EDIT')}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm
                      title="确定要撤单吗？"
                      onConfirm={() => onTableDetailClick(record, 'REVOLKE')}
                    >
                      <a >撤回</a>
                    </Popconfirm>
                    <Divider type="vertical" />
                  </>
                }
                <a onClick={() => onTableDetailClick(record, 'LOOK')}>详情</a>
              </>
            )
          case LendingStatus.AUDITING:  //申请中
            return (
              <>
                {
                  record.auditAble == 1 &&
                  <>
                    <a onClick={() => onTableDetailClick(record, 'AUDIT')}>审核</a>
                    <Divider type="vertical" />
                  </>
                }
                <a onClick={() => onTableDetailClick(record, 'LOOK')}>详情</a>
              </>
            )
          case LendingStatus.PASS:  //审核
            return (
              <>
                  {
                    record.createPerson == employeeId && 
                    record.orderType == LendingType.SECONDED &&
                    record.isReturn == 0 &&
                    <>
                      <Popconfirm
                        title="确定设备已归还了吗？"
                        onConfirm={() => onTableDetailClick(record, 'RETURN')}
                      >
                        <a >归还</a>
                      </Popconfirm>
                      <Divider type="vertical" />
                    </>
                  }
                
                <a onClick={() => onTableDetailClick(record, 'LOOK')}>详情</a>
              </>
            )
        }
      },
    },
  ];

  return (
    <>
    <PageContainer>
      <Row className={style.static}>
        <Col span={4} onClick={() => onStaticClick('type', LendingType.TRANSFER)}>
          <div className={style.staticTitle}>{lendingStatic?.transferNum}</div>
          <div>{LendingTypeEnum.get(LendingType.TRANSFER).label}</div>
        </Col>
        <Col span={4} onClick={() => onStaticClick('type', LendingType.SECONDED)}>
          <div className={style.staticTitle}>{lendingStatic?.secondedNum}</div>
          <div>{LendingTypeEnum.get(LendingType.SECONDED).label}</div>
        </Col>
        <Col span={4} onClick={() => onStaticClick('status', LendingStatus.PASS)}>
          <div className={style.staticTitle}>{lendingStatic?.passNum}</div>
          <div>{LendingStatusEnum.get(LendingStatus.PASS).label}</div>
        </Col>
        <Col span={4} onClick={() => onStaticClick('status', LendingStatus.AUDITING)}>
          <div className={style.staticTitle}>{lendingStatic?.auditingNum}</div>
          <div>{LendingStatusEnum.get(LendingStatus.AUDITING).label}</div>
        </Col>
        <Col span={4} onClick={() => onStaticClick('status', LendingStatus.INIT)}>
          <div className={style.staticTitle}>{lendingStatic?.initNum}</div>
          <div>{LendingStatusEnum.get(LendingStatus.INIT).label}</div>
        </Col>
      </Row>

      <ProTable<LendingTable, typeof DefaultQuery>
        rowKey="id"
        title="设备转借单列表"
        defaultQuery={DefaultQuery}
        columns={columns}
        actionRef={actionRef}
        formRef={formRef}
        tableProps={{
          scroll: {
            y: tableHeight,
          },
        }}
        toolBarRender={() => [
          isPrint
          ?
            <div key="printContainer">
              <Button 
                style={{marginRight: '10px'}}
                danger 
                onClick={onPrintCancel}>
                取消
              </Button>
              <Button 
                ghost 
                type="primary"
                loading={printLoading}
                onClick={onPrintConfirm}>
                <PrinterOutlined />
                打印
              </Button>
            </div>
          : <Tooltip key="print" title={`只能打印已经审批过的转借单`}>
            <Button 
              ghost 
              type="primary" 
              onClick={onPrint}>
              <PrinterOutlined />
              打印
            </Button>
          </Tooltip>,
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={onAddSCarpClick}
          >
            新建转借单
          </Button>
        ]}
        rowSelection={isPrint ? rowSelection : undefined}
        request={(query) => {
          const { current, pageSize, keyword, orderStatus, orderType, beginTime, endTime } = query;
          const params = {
            orgId,
            isAcl: isACL,
            current: Number(current) || 1,
            pageSize: Number(pageSize) || 30,
            keyword,
            orderStatus: orderStatus || formRef.current?.getFieldsValue().orderStatus,
            orderType: orderType || formRef.current?.getFieldsValue().orderType,
            beginTime,
            endTime
          }
          setSelectedEquipKeys([]);
          getLendingStaticData(params);
          return lendingListAPI(params);
        }}
        
        hooks={{
          beforeSubmit: (query) => {
            const { date } = query;
            return {
              ...omit(query, ['date']),
              beginTime: date?.[0] && momentToString(date[0]) || undefined,
              endTime: date?.[1] && momentToString(date[1]) || undefined
            }
          },
          onReset: () => {
            setIsPrint(false);
            setSelectedEquipKeys([]);
          },
        }}
      />
    </PageContainer>

    {/* 新增编辑弹框 */}
    <DetailModal 
      title={detailModalTitle}
      orderId={orderId}
      visible={detailModalVisible}
      onCancel={() => setDetailModalVisible(false)}
      onConfirm={onDetailModalConfirm}
    />

    {/* 详情审核弹框 */}
    <InfoModal
      status={infoStatus}
      visible={infoVisible}
      orderId={orderId}
      onCancel={() => setInfoVisible(false)}
      onConfirm={infoConfirm}
    />
    <PrintContainer>
       <div ref={detailPrintComponentRef}>
         {selectRowDetail.map((e: any) => (
           <LendingInfoPrint
             key={e.id}
             detail={e}
           />
         ))}
       </div>
     </PrintContainer>
    </>
  );
};

export default AssetsLendingPage;
