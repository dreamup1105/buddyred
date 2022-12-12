import { useState } from 'react';
import useMount from '@/hooks/useMount';
import type { ICustomerMap } from '@/pages/Crm/Customer/type';
import type { CascaderOptionType } from 'antd/es/cascader/index';
import { EmployeeType } from '@/pages/Crm/Customer/type';
import { TemplateBizType } from '@/pages/Dictionary/Maintenance/Editor/type';
import useUserInfo from '@/hooks/useUserInfo';
import {
  fetchEmployeesByCrId,
  fetchCustomersWithExtraInfo,
} from '@/pages/Crm/Customer/service';

export default function useOperator() {
  const { currentUser } = useUserInfo();
  const [options, setOptions] = useState<CascaderOptionType[]>([]);
  const [customerMap, setCustomerMap] = useState<ICustomerMap>();

  const loadOperatorOptions = async () => {
    try {
      const map = new Map();
      let res;
      let data;

      // 当前登录人为工程师时，保养执行人只能使自己和当前选中客户关系下的工程师列表
      if (currentUser?.isMaintainer && currentUser.currentCustomer) {
        res = await fetchEmployeesByCrId(currentUser.currentCustomer.id);
        data = [
          {
            customer: {
              id: currentUser.currentCustomer.id,
              name: currentUser.currentCustomer.orgName,
              orgName: currentUser.currentCustomer.orgName,
            },
            engineers: res.data.filter(
              (i) => i.employeeType === EmployeeType.ENGINEER,
            ),
            templates: [],
          },
        ];
      } else {
        res = await fetchCustomersWithExtraInfo({
          orgId: currentUser?.org.id,
          isAgree: true,
          apply: TemplateBizType.MAINTAIN,
        });
        data = res.data.map((item) => ({
          customer: {
            id: item.id,
            name: item.orgName,
            orgName: item.orgName,
          },
          engineers: item.engineers.filter(
            (i) => i.employeeType === EmployeeType.ENGINEER,
          ),
          templates: item.templates,
        }));
      }

      const operOptions = [
        {
          value: currentUser?.employee.id,
          label: `自己（${currentUser?.employee?.name}）`,
        },
        ...data
          .map((item) => {
            map.set(item.customer.id, {
              ...item.customer,
              engineers: item.engineers,
              templates: item.templates,
            });
            return [
              {
                value: `customer-${item.customer.id}`,
                label: item.customer.orgName,
              },
              {
                value: `engineer-${item.customer.id}`,
                label: `维保工程师（${item.customer.name}）`,
                children: item.engineers.map((subItem) => ({
                  value: subItem.id,
                  label: subItem.name,
                })),
              },
            ];
          })
          .flat(),
      ];

      if (currentUser?.isHospital) {
        operOptions.push({
          value: 'staff',
          label: '医务人员',
        });
      }

      setOptions(operOptions);
      setCustomerMap(map);
    } catch (error) {
      console.error(error);
    }
  };

  useMount(loadOperatorOptions);

  return {
    options,
    customerMap,
  };
}
