import { useState, useEffect } from 'react';
import { fetchEmployee, saveEmployee } from '@/pages/Employee/service';
import type { EmployeeDetail } from '@/pages/Employee/type';

export default function useEmployee(employeeId?: number) {
  const [employeeDetail, setEmployeeDetail] = useState<EmployeeDetail>();

  const loadEmployeeDetail = async (id: number) => {
    try {
      const { code, data } = await fetchEmployee(id);
      if (code === 0) {
        setEmployeeDetail(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (employeeId) {
      loadEmployeeDetail(employeeId);
    }
  }, [employeeId]);

  return {
    employeeDetail,
    saveEmployee,
  };
}
