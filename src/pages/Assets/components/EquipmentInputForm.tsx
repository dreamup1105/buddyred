import React, { useState, useRef, useEffect } from 'react';
import { useModel } from 'umi';
import {
  Tabs,
  Spin,
} from 'antd';
import type { Moment } from 'moment';
import DraggableModal from '@/components/DraggableModal';
import type {
  EquipmentDetailEx,
  IManufacturerItem,
  EquipmentTypeItem,
  DepartmentItem,
  ICertCategoryItem,
  ISaveEquipmentData} from '../type';
import {
  OperationType
} from '../type';
import { saveEquipment, saveParts } from '../service';
import type { ActionType } from './BasicInfoForm';
import BasicInfoForm from './BasicInfoForm';
import CertInfoForm from './CertInfoForm';
import PurchaseInfoForm from './PurchaseInfoForm';
import AccessoriesInfoForm from './AccessoriesInfoForm';
import ContractInfoForm from './ContractInfoForm';

interface IComponentProps {
  loading: boolean;
  visible: boolean;
  operation: OperationType;
  manufacturers: IManufacturerItem[];
  equipmentTypes: EquipmentTypeItem[];
  attachmentCategorys: ICertCategoryItem[];
  departments: DepartmentItem[];
  initialValues: EquipmentDetailEx | undefined;
  onCancel: () => void;
  onSubmit: (operation: OperationType) => void;
}

type TabKey = 'basic' | 'cert' | 'purchase' | 'accessories';

const { TabPane } = Tabs;

export const dateRuleValidator = (fieldLabel: string) => ({
  getFieldValue,
}: any) => ({
  validator(rule: any, value: any) {
    if (
      !value ||
      !getFieldValue('productionDate') ||
      (getFieldValue('productionDate') && (value as Moment).isAfter(getFieldValue('productionDate')))
    ) {
      return Promise.resolve();
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject(`${fieldLabel}不能早于生产日期`);
  },
});

const getModalTitle = (operation: OperationType) => {
  switch (operation) {
    case OperationType.COPY:
      return '设备复制';
    case OperationType.EDIT:
      return '设备编辑';
    default:
      return '设备录入';
  }
};

const EquipmentInputForm: React.FC<IComponentProps> = ({
  loading,
  visible,
  operation,
  equipmentTypes,
  attachmentCategorys,
  departments,
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const { initialState } = useModel('@@initialState');
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<TabKey>('basic');
  const visibleRef = useRef(false);
  const certInfoFormRef = useRef<ActionType>();
  const basicInfoFormRef = useRef<ActionType>();
  const accessoriesInfoFormRef = useRef<ActionType>();
  const purchaseInfoFormRef = useRef<ActionType>();
  const contractInfoFormRef = useRef<ActionType>();
  const orgId = initialState?.currentUser?.org.id;

  visibleRef.current = visible;

  const resetFields = () => {
    basicInfoFormRef.current?.resetFields!();
    purchaseInfoFormRef.current?.resetFields!();
    accessoriesInfoFormRef.current?.resetFields!();
    certInfoFormRef.current?.resetFields!();
    contractInfoFormRef.current?.resetFields!();
    setActiveKey('basic');
  }

  const onModalOk = async () => {
    try {
      const basicInfo = await basicInfoFormRef.current?.validateFields!();
      const { accessoriesInfo = [] } = await accessoriesInfoFormRef.current?.validateFields!() || {};
      const purchaseInfo = await purchaseInfoFormRef.current?.validateFields!() || {};
      const attachments = certInfoFormRef.current?.getFieldsValue!();
      const contract = contractInfoFormRef.current?.getFieldsValue!();
      const {
        tags = [],
        ...otherBasicInfo
      } = basicInfo;
      const { inquiries, ...otherPurchaseInfo } = purchaseInfo;
      const { equipment } = initialValues || {};
      
      const formData: ISaveEquipmentData = {
        attachments,
        contract,
        equipment: {
          ...equipment,
          ...otherBasicInfo,
          ...otherPurchaseInfo,
          orgId,
          isScrap: 'COMMON'
        } as ISaveEquipmentData['equipment'],
        tags,
        inquiries,
      };

      if (operation === OperationType.COPY) {
        delete formData.equipment.id;
      }

      setConfirmLoading(true);
      const { data } = await saveEquipment(formData);
      if (data?.equipment?.id) {
        await saveParts(data.equipment.id, accessoriesInfo);
        onSubmit(operation);
        resetFields();
      }
    } catch (error: any) {
      // 表单校验的错误
      if (error.from) {
        setActiveKey(error.from);
      }
      console.error(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const onModalCancel = () => {
    resetFields();
    onCancel();
  };

  const onTabChange = (key: string) => {
    setActiveKey(key as TabKey);
  }

  // 表单初始化
  const init = async (isEdit?: boolean) => {
    if (isEdit) {
      basicInfoFormRef.current?.init!({ operation, values: initialValues });
      purchaseInfoFormRef.current?.init!({ operation, values: initialValues });
      accessoriesInfoFormRef.current?.init!(initialValues!.equipment.id);
      certInfoFormRef.current?.init!({ operation, attachments: initialValues?.attachments, attachmentCategorys });
      contractInfoFormRef.current?.init!({ operation, contract: initialValues?.contract });
    } else {
      basicInfoFormRef.current?.init!({ operation });
      purchaseInfoFormRef.current?.init!({ operation })
      certInfoFormRef.current?.init!({ operation, attachmentCategorys });
      contractInfoFormRef.current?.init!({ operation });
    }
  };

  useEffect(() => {
    if (visibleRef.current) {
      if (operation === OperationType.INPUT) {
        init(false);
        return;
      }
      if (initialValues?.equipment?.id && (
        operation === OperationType.EDIT ||
        operation === OperationType.COPY
      )) {
        init(true);
      }
    }
  }, [initialValues, operation]);

  return (
    <DraggableModal
      title={getModalTitle(operation)}
      visible={visible}
      width={900}
      confirmLoading={confirmLoading}
      maskClosable={false}
      bodyStyle={{ height: '700px', overflow: 'auto' }}
      onCancel={onModalCancel}
      onOk={onModalOk}
      centered
      forceRender
    >
      <Spin spinning={loading}>
        <Tabs
          activeKey={activeKey} 
          onChange={onTabChange}
          type="card"
        >
          <TabPane tab="设备详细信息" key="basic" forceRender>
            <BasicInfoForm
              ref={basicInfoFormRef}
              equipmentTypes={equipmentTypes}
              departments={departments}
              operationType={operation}
            />
          </TabPane>
          <TabPane tab="资证信息" key="cert" forceRender>
            <CertInfoForm
              ref={certInfoFormRef}
            />
          </TabPane>
          <TabPane tab="购置信息" key="purchase" forceRender>
            <PurchaseInfoForm 
              ref={purchaseInfoFormRef}
            />
          </TabPane>
          <TabPane tab="附件信息" key="accessories" forceRender>
            <AccessoriesInfoForm
              ref={accessoriesInfoFormRef}
            />
          </TabPane>
          <TabPane tab="合同信息" key="contract" forceRender>
            <ContractInfoForm 
              ref={contractInfoFormRef} />
          </TabPane>
        </Tabs>
      </Spin>
    </DraggableModal>
  );
};

export default EquipmentInputForm;
