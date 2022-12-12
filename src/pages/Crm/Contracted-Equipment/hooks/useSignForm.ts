import { createContainer } from 'unstated-next';
import { useState } from 'react';
import type { SignProjects } from '../type';

interface Value {
  current: number;
  id: number | undefined;
  originalId: number | undefined;
  actionType: 'edit' | 'copy' | 'create' | '';
  crId: number | undefined;
  companyName: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  projects: SignProjects[];
  euqipmentCount: number;
  companyOptions: { label: string; value: number }[];
}

export function useSignForm() {
  const [values, updateForm] = useState<Value>({
    current: 0,
    actionType: '',
    id: undefined,
    originalId: undefined,
    companyName: '',
    crId: undefined,
    startDate: '',
    endDate: '',
    projects: [],
    euqipmentCount: 0,
    companyOptions: [],
  });

  return {
    values,
    updateForm,
  };
}

const SignFormContainer = createContainer(useSignForm);

export default SignFormContainer;
