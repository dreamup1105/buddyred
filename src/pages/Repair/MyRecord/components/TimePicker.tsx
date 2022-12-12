import React from 'react';
import { Row, Col, DatePicker, TimePicker } from 'antd';
import moment from 'moment';

const DefaultDateFormat = 'YYYY-MM-DD';
const DefaultTimeFormat = 'HH:mm:ss';
interface CustomTimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  dateFormat?: string;
  timeFormat?: string;
}
const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  value,
  onChange,
  dateFormat = DefaultDateFormat,
  timeFormat = DefaultTimeFormat,
}) => {
  let time: string;
  let date: string;
  if (value) {
    const arr = value.split(' ');
    if (arr.length < 2) {
      throw new Error('日期或时间格式错误');
    }
    [date, time] = arr;
  } else {
    date = '2020-01-01';
    time = '00:00:00';
  }
  const handleChangeDate = (_: any, d: string) => {
    if (onChange) {
      onChange(`${d} ${time}`);
    }
  };
  const handleChangeTime = (_: any, t: string) => {
    if (onChange) {
      onChange(`${date} ${t}`);
    }
  };
  return (
    <Row gutter={12}>
      <Col span={12}>
        <DatePicker
          style={{ width: '100%' }}
          format={dateFormat}
          value={moment(date, dateFormat)}
          onChange={handleChangeDate}
        />
      </Col>
      <Col span={12}>
        <TimePicker
          style={{ width: '100%' }}
          format={timeFormat}
          value={moment(time, timeFormat)}
          onChange={handleChangeTime}
        />
      </Col>
    </Row>
  );
};

export default CustomTimePicker;
