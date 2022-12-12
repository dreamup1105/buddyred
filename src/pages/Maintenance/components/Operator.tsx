import React, { useState } from 'react';
import { Button, Cascader } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import useMount from '@/hooks/useMount';
import useUserInfo from '@/hooks/useUserInfo';
import useDepartments from '@/hooks/useDepartments';
import type { ICustomerMap } from '@/pages/Crm/Customer/type';
import type {
  CascaderOptionType,
  CascaderValueType,
} from 'antd/es/cascader/index';
import StaffSelect from './StaffSelect';
import type { EmployeeItem } from '@/pages/Employee/type';
import styles from '../index.less';

interface IComponentProps {
  options: CascaderOptionType[];
  customerMap: ICustomerMap | undefined;
  value?: any;
  disabled?: boolean;
  onChange?: (value: OperatorValue) => void;
}

export interface OperatorValue {
  type?: OperatorType;
  initPersonId?: number;
  initPersonName?: string;
  initPersonTel?: string;
  engineerId?: number;
  engineerName?: string;
  engineerTel?: string;
  crId?: number;
  customerName?: string;
}

export enum OperatorType {
  self = 'self', // 自己
  maintainer = 'maintainer', // 维修公司
  engineer = 'engineer', // 工程师
  staff = 'staff', // 医务人员
}

const Operator: React.FC<IComponentProps> = ({
  onChange,
  options,
  disabled = false,
  customerMap,
}) => {
  const { currentUser } = useUserInfo();
  const [staffSelectVisible, setStaffSelectVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<any>();
  const orgId = currentUser?.org.id;
  const initPersonId = currentUser?.employee.id;
  const initPersonName = currentUser?.employee?.name;
  const initPersonTel = currentUser?.employee.phone;
  const { loadDepartments, departmentsTreeData } = useDepartments({
    orgId: orgId!,
  });

  const onOptionChange = (value: CascaderValueType) => {
    const isEngineer = value.length === 2;
    const isStaff = value[0] === OperatorType.staff;

    // 医务人员
    if (isStaff) {
      setStaffSelectVisible(true);
      return;
    }

    // 维修工程师
    if (isEngineer) {
      const crId = Number(String(value[0]).replace('engineer-', ''));
      const engineerId = value[1];
      const currentCustomer = customerMap?.get(crId);
      const engineer = currentCustomer?.engineers.find(
        (item) => item.id === engineerId,
      );
      const currentValue = {
        type: OperatorType.engineer,
        engineerId: engineer?.id,
        engineerName: engineer?.name,
        engineerTel: engineer?.phone,
        operatorName: engineer?.name,
        initPersonId,
        initPersonName,
        initPersonTel,
        crId,
        customerName: currentCustomer?.name,
      };
      setSelectedValue(currentValue);
      onChange?.(currentValue);
      return;
    }

    // 维修团队
    if (String(value[0]).startsWith('customer')) {
      const crId = Number(String(value[0]).replace('customer-', ''));
      const currentCustomer = customerMap?.get(crId);
      const currentValue = {
        type: OperatorType.maintainer,
        initPersonId,
        initPersonName,
        initPersonTel,
        operatorName: currentCustomer?.name,
        crId,
        customerName: currentCustomer?.name,
      };
      setSelectedValue(currentValue);
      onChange?.(currentValue);
      return;
    }

    // 自己
    const currentValue = {
      crId: currentUser?.isMaintainer
        ? currentUser?.currentCustomer?.id
        : undefined,
      type: OperatorType.self,
      engineerId: initPersonId,
      engineerName: initPersonName,
      engineerTel: initPersonTel,
      operatorName: initPersonName,
      initPersonId,
      initPersonName,
      initPersonTel,
    };
    setSelectedValue(currentValue);
    onChange?.(currentValue);
  };

  const onSelectEmployee = (employeeItem: EmployeeItem) => {
    const currentValue = {
      type: OperatorType.staff,
      engineerId: employeeItem.id,
      engineerName: employeeItem.name,
      engineerTel: employeeItem.phone,
      operatorName: employeeItem.name,
      initPersonId,
      initPersonName,
      initPersonTel,
    };
    setSelectedValue(currentValue);
    if (onChange) {
      onChange(currentValue);
    }
    setStaffSelectVisible(false);
  };

  useMount(() => {
    loadDepartments();
  });

  return (
    <div>
      <Cascader
        options={options}
        onChange={onOptionChange}
        expandTrigger="hover"
        disabled={disabled}
      >
        {selectedValue ? (
          <span style={{ outline: 'none' }}>
            {selectedValue.operatorName && (
              <div className={styles.initPersonName}>
                {selectedValue.operatorName}
              </div>
            )}
            <a style={{ marginLeft: '10px' }}>更换</a>
          </span>
        ) : (
          <Button>
            选择执行人/团队
            <DownOutlined className={styles.downIcon} />
          </Button>
        )}
      </Cascader>
      <StaffSelect
        visible={staffSelectVisible}
        departmentsTreeData={departmentsTreeData}
        onCancel={() => setStaffSelectVisible(false)}
        onSelect={onSelectEmployee}
      />
    </div>
  );
};

export default Operator;
