import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Tabs, Spin, Space, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import PrintContainer from '@/components/PrintContainer';
import usePrint from '@/hooks/usePrint';
import type { ActionType } from './BasicInfoForm';
import CertInfoForm from './CertInfoForm';
import AccessoriesInfoForm from './AccessoriesInfoForm';
import PurchaseInfoForm from './PurchaseInfoForm';
import EquipmentInfo from './EquipmentInfo';
import EquipmentTag from './EquipmentTag';
import EquipmentTimeline from './TimelineDrawer';
import EquipmentLending from './EquipmentLending';
import type { EquipmentDetailEx, ICertCategoryItem, ITimelineItem } from '../type';
import { OperationType } from '../type';
import ContractInfoForm from './ContractInfoForm';
import useUserInfo from '@/hooks/useUserInfo';
import { labelSelect } from '@/pages/Account/Settings/type'
import { labelPrintSelectAPI, selectRecordByEquipmentId } from '../service';

interface IComponentProps {
  loading: boolean;
  visible: boolean;
  operation: OperationType;
  initialDetail: EquipmentDetailEx | undefined;
  timelineData: ITimelineItem[];
  attachmentCategorys: ICertCategoryItem[];
  hispitalLogo?: string;
  onCancel: () => void;
}

type TabKey = 'basic' | 'cert' | 'lifeCycle' | 'purchase' | 'accessories';

const { TabPane } = Tabs;

const Detail: React.FC<IComponentProps> = ({
  loading,
  visible,
  operation,
  initialDetail,
  timelineData,
  attachmentCategorys,
  hispitalLogo,
  onCancel,
}) => {
  const [tagPrinting, setTagPrinting] = useState<boolean>();
  const [infoPrinting, setInfoPrinting] = useState<boolean>();
  const [activeKey, setActiveKey] = useState<TabKey>('basic');
  const {
    componentRef: infoComponentRef,
    onPrint: onPrintEquipmentInfo,
  } = usePrint({
    onBeforeGetContent: () => {
      setInfoPrinting(true);
    },
    onAfterPrint: () => {
      setInfoPrinting(false);
    },
    onPrintError: () => {
      setInfoPrinting(false);
    },
  });
  const certInfoFormRef = useRef<ActionType>();
  const accessoriesInfoFormRef = useRef<ActionType>();
  const purchaseInfoFormRef = useRef<ActionType>();
  const contractInfoFormRef = useRef<ActionType>();
  const { currentUser } = useUserInfo();
  const isHospital = !!currentUser?.isHospital;
  const [initLabelOption, setInitLabelOption] = useState<any>();
  const [usingValue, setUsingValue] = useState<string>('maintenance');
  const [lendingData, setLendingData] = useState<any>();

  const init = () => {
    certInfoFormRef.current?.init!({attachments: initialDetail!.attachments, operation: OperationType.DETAIL, attachmentCategorys});
    purchaseInfoFormRef.current?.init!({ values: initialDetail, operation: OperationType.DETAIL });
    accessoriesInfoFormRef.current?.init!(initialDetail!.equipment.id);
    contractInfoFormRef.current?.init!({ operation, contract: initialDetail?.contract });
  }

  // 获取设备标签列表
  const getLabelData = async () => {
    try {
      const { data } = await labelPrintSelectAPI(currentUser?.org.id);
      const labelTextArr = data.id == null ? labelSelect : data.contentText;
      setInitLabelOption(labelTextArr);
    } catch(err: any) {
      console.log(err);;
    }
  }

  const {
    componentRef: tagComponentRef,
    onPrint: onPrintEquipmentTag,
  } = usePrint({
    onBeforeGetContent: () => {
      setTagPrinting(true);
    },
    onAfterPrint: () => {
      setTagPrinting(false);
    },
    onPrintError: () => {
      setTagPrinting(false);
    },
  });

  const onTabChange = (key: string) => {
    setActiveKey(key as TabKey);
  }

  const onModalCancel = () => {
    certInfoFormRef.current?.resetFields!();
    setActiveKey('basic');
    setUsingValue('maintenance');
    onCancel();
  }

  const usingChange = (e: RadioChangeEvent) => {
    setUsingValue(e.target.value)
  }

  const getLendingData = async () => {
    try {
      let lendingDataArr = [];
      const { data } = await selectRecordByEquipmentId(initialDetail?.equipment.id);
      lendingDataArr = data;
      setLendingData(lendingDataArr);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (initialDetail?.equipment.id && operation === OperationType.DETAIL) {
      init();
      getLabelData();
      getLendingData();
    }
  }, [initialDetail, operation, attachmentCategorys]);

  return (
    <>
      <Modal
        centered
        title="设备详情"
        visible={visible}
        width={800}
        bodyStyle={{ height: 800, overflow: 'auto' }}
        onCancel={onModalCancel}
        footer={[
          <Space key="space">
            <Button
              key="tag"
              type="primary"
              onClick={onPrintEquipmentTag}
              loading={tagPrinting}
            >
              打印标签
            </Button>
            <Button
              key="info"
              type="primary"
              onClick={onPrintEquipmentInfo}
              loading={infoPrinting}
            >
              打印设备信息
            </Button>
            <Button key="close" onClick={onModalCancel}>
              关闭
            </Button>
          </Space>,
        ]}
        forceRender
      >
        <Spin spinning={loading}>
          <Tabs 
            activeKey={activeKey}
            onChange={onTabChange}
            type="card"
          >
            <TabPane tab="设备详细信息" key="basic" forceRender>
              <EquipmentInfo detail={initialDetail} ref={infoComponentRef} />
            </TabPane>
            <TabPane tab="资证信息" key="cert" forceRender>
              <CertInfoForm
                ref={certInfoFormRef}
                readonly
              />
            </TabPane>
            <TabPane tab="购置信息" key="purchase" forceRender>
              <PurchaseInfoForm 
                ref={purchaseInfoFormRef}
                readonly
              />
            </TabPane>
            <TabPane tab="附件信息" key="accessories" forceRender>
              <AccessoriesInfoForm
                ref={accessoriesInfoFormRef}
                readonly
              />
            </TabPane>
            {
              isHospital && 
              <TabPane tab="合同信息" key="contract" forceRender>
                <ContractInfoForm 
                  ref={contractInfoFormRef} 
                  readonly />
              </TabPane>
            }
            
            <TabPane tab="使用情况" key="lifeCycle" forceRender>
              <Radio.Group onChange={usingChange} value={usingValue}>
                <Radio value="maintenance">维保历史</Radio>
                <Radio value="lending">转借历史</Radio>
              </Radio.Group>
              <div style={{ marginTop: 40 }}>
                {
                  usingValue == 'maintenance'
                  ? <EquipmentTimeline 
                    visible={true}
                    onClose={() => {}}
                    openMode="normal"
                    initialData={timelineData}
                    loading={loading}
                    params={{
                      currentEquipment: undefined
                    }}
                  />
                  : <EquipmentLending
                  initialData={lendingData}
                />
                }
              </div>
            </TabPane>
          </Tabs>
        </Spin>
        <PrintContainer>
          <EquipmentTag initialDetail={initialDetail} logo={hispitalLogo} initLabelOption={initLabelOption} ref={tagComponentRef} />
        </PrintContainer>
        <PrintContainer>
          <EquipmentInfo
            isPrint
            detail={initialDetail}
            ref={infoComponentRef}
          />
        </PrintContainer>
      </Modal>
    </>
  );
};

export default Detail;
