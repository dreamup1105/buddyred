import { useEffect } from 'react';
import type { FormInstance } from 'antd/es/form';

export default function useClearFormModal(
  visible: boolean,
  form: FormInstance,
): void {
  useEffect(() => {
    if (!visible && form) {
      form.resetFields();
    }
  }, [visible]);
}
