import React from 'react';
import { Form, DatePicker } from 'antd';
import type { FormInstance } from 'antd/es/form';
// import { WithoutTimeFormat, momentToString } from '@/utils/utils';
import styles from '../index.less';
// import { divide } from 'lodash';

interface IComponentProps {
  onValuesChange: ((changedValues: any, values: any) => void) | undefined;
  onPanelChange: ((current: any) => void) | undefined;
  form: FormInstance<any>;
  defaultDate: any;
}

const SearchForm: React.FC<IComponentProps> = ({
  onValuesChange,
  onPanelChange,
  form,
  defaultDate,
}) => {
  return (
    <Form form={form} layout="inline" onValuesChange={onValuesChange}>
      <Form.Item name="inspectionDate">
        <DatePicker.RangePicker
          style={{ width: 350 }}
          onPanelChange={onPanelChange}
          dateRender={(current) => {
            const currentDate: string = `${current.year()}-${
              current.month() < 10
                ? '0' + (current.month() + 1)
                : current.month() + 1
            }-${current.date() < 10 ? '0' + current.date() : current.date()}`;
            if (defaultDate.normal.indexOf(currentDate) > -1) {
              return (
                <div className={styles['date-picker-green']}>
                  {current.date()}
                </div>
              );
            } else if (defaultDate.abnormal.indexOf(currentDate) > -1) {
              return (
                <div className={styles['date-picker-orange']}>
                  {current.date()}
                </div>
              );
            } else {
              return (
                <div className={styles['date-picker-row']}>
                  {current.date()}
                </div>
              );
            }
          }}
        />
      </Form.Item>
    </Form>
  );
};

export default SearchForm;
