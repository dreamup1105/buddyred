import React, { useEffect, useState } from 'react';
import { Form, Select, Button, message } from 'antd';
import useUserInfo from '@/hooks/useUserInfo';
import styles from '../index.less';
import {
  labelOptions,
  hispitalLogo,
  initialDetail,
  labelSelect,
} from '../type';
import EquipmentTag from '@/pages/Assets/components/EquipmentTag';
import type { labelItem } from '@/pages/Assets/type';
import { labelPrintSaveAPI, labelPrintSelectAPI } from '@/pages/Assets/service';

interface EquipmentLabelProp {
  id?: number;
}

const EquipmentLbaleConfig: React.FC<EquipmentLabelProp> = ({ id }) => {
  const [form] = Form.useForm();
  const { currentUser } = useUserInfo();
  const [selectLabel, setSelectLabel] = useState<labelItem[]>();
  const [detailInfo, setDetailInfo] = useState<any>();

  const labelChange = (value: string, option: any) => {
    setSelectLabel(option);
  };

  // 提交保存
  const onSubmit = async () => {
    try {
      await labelPrintSaveAPI({
        contentText: selectLabel,
        hospitalId: currentUser?.org.id,
        hospitalName: currentUser?.org.name,
        id: detailInfo?.id,
      });
      message.success('保存成功');
    } catch (err: any) {
      console.log(err);
    }
  };

  // 获取标签数据
  const getLableOption = async () => {
    try {
      const { data } = await labelPrintSelectAPI(id);
      const labelTextArr = data.id == null ? labelSelect : data.contentText;
      setSelectLabel(labelTextArr);
      form.setFieldsValue({
        equipmentLabel: labelTextArr.map((item: any) => item.value),
      });
      setDetailInfo(data);
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    getLableOption();
  }, [id]);

  return (
    <>
      <h6 className={styles.configTitle}>设备标签设置</h6>
      <p className={styles.labelTips}>
        标签中显示的数据均为模拟数据，实际数据请到设备管理中打印标签查看
      </p>
      <Form form={form} name="infoForm" autoComplete="off" preserve={false}>
        <Form.Item label="显示字段" name="equipmentLabel">
          <Select
            mode="multiple"
            allowClear
            options={labelOptions}
            onChange={labelChange}
            placeholder="请选择设备标签需要显示的字段"
          />
        </Form.Item>
        <Button type="primary" onClick={onSubmit}>
          保存
        </Button>
      </Form>

      <EquipmentTag
        initialDetail={initialDetail}
        logo={hispitalLogo}
        initLabelOption={selectLabel}
      />
    </>
  );
};

export default EquipmentLbaleConfig;
