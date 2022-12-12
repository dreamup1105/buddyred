import React, { useRef } from 'react';
import { Spin } from 'antd';
import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import useMount from '@/hooks/useMount';
import type { ActionType } from './components/BasicInfoForm';
import CertInfoForm from './components/CertInfoForm';
import AccessoriesInfoForm from './components/AccessoriesInfoForm';
import PurchaseInfoForm from './components/PurchaseInfoForm';
import EquipmentInfo from './components/EquipmentInfo';
import useEquipmentDetail from './hooks/useEquipmentDetail';

const DetailPage: React.FC = () => {
  const {
    loading,
    equipmentDetail,
    loadEquipmentDetail,
  } = useEquipmentDetail();
  const certInfoFormRef = useRef<ActionType>();
  const accessoriesInfoFormRef = useRef<ActionType>();
  const purchaseInfoFormRef = useRef<ActionType>();

  useMount(() => {
    const { id } = history.location.query as any;
    if (id) {
      loadEquipmentDetail(Number(id));
    }
  });

  return (
    <PageContainer>
      <Spin spinning={loading}>
        <EquipmentInfo detail={equipmentDetail} />
        <CertInfoForm
          ref={certInfoFormRef}
          readonly
        />
        <PurchaseInfoForm 
          ref={purchaseInfoFormRef}
          readonly
        />
        <AccessoriesInfoForm
          ref={accessoriesInfoFormRef}
          readonly
        />
      </Spin>
    </PageContainer>
  )
}

export default DetailPage;
