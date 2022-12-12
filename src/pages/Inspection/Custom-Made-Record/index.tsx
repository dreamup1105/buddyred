import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import useUserInfo from '@/hooks/useUserInfo';
import useMount from '@/hooks/useMount';
import useACL from '@/hooks/useACL';
import { List, Form, Input, DatePicker, Button } from 'antd';
import CardItem from './components/CardItem';
import type { ICardItem } from './type';
import { momentToString, WithoutTimeFormat } from '@/utils/utils';
import { selectEveryGroupStatAPI } from './service';
import CustomMadeRecordListPgae from './components/index';
const RangePicker: any = DatePicker.RangePicker;
import styles from './index.less';

// 定制巡检记录页面
const CustomModeRecordPage: React.FC = () => {
  const { isACL } = useACL();
  const { currentUser } = useUserInfo();
  const [form] = Form.useForm();
  const isHospital = !!currentUser?.isHospital;
  const crId = currentUser!.currentCustomer?.id;
  const [dataSource, setDataSource] = useState<ICardItem[]>([]);
  const [listVisible, setListVisible] = useState<boolean>(false);
  const [recordItem, setRecordItem] = useState<any>();
  const [selectDate, setSelectDate] = useState<any>();

  const searchForm = async () => {
    const formValue = await form.validateFields();
    setSelectDate(formValue.time);
    const params = {
      startTime: formValue?.time?.[0]
        ? momentToString(formValue.time[0], WithoutTimeFormat) + ' 00:00:00'
        : undefined,
      endTime: formValue?.time?.[1]
        ? momentToString(formValue.time[1], WithoutTimeFormat) + ' 23:59:59'
        : undefined,
      keyword: formValue.keyword,
      isAcl: isHospital ? isACL : undefined,
      crId: !isHospital ? crId : undefined,
    };
    return params;
  };

  const loadDataSource = async () => {
    try {
      const { data, code } = await selectEveryGroupStatAPI(await searchForm());
      if (code === 0) {
        setDataSource(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 搜索
  const onSearch = async () => {
    loadDataSource();
  };

  // 重置
  const onReset = async () => {
    form.resetFields();
    loadDataSource();
  };

  // 列表点击
  const onCardChange = (item: any) => {
    setListVisible(true);
    setRecordItem(item);
  };

  // 列表返回事件
  const onListBack = () => {
    setListVisible(false);
  };

  // 自检组统计
  const cardContainer = () => {
    return (
      <>
        <Form className={styles.customForm} form={form} layout="inline">
          <Form.Item label="关键字" name="keyword">
            <Input
              placeholder="巡检组名称/主要负责人/所在科室"
              style={{ width: '260px' }}
            />
          </Form.Item>
          <Form.Item label="自检时间" name="time">
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: '20px' }}
              onClick={onSearch}
            >
              搜索
            </Button>
            <Button type="default" htmlType="submit" onClick={onReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
        <List
          rowKey="groupId"
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 5,
            xxl: 5,
          }}
          dataSource={dataSource}
          renderItem={(item) => (
            <div onClick={() => onCardChange(item)}>
              <List.Item>
                <CardItem data={item} />
              </List.Item>
            </div>
          )}
        />
      </>
    );
  };

  // 自检列表
  const listContainer = () => {
    return (
      <CustomMadeRecordListPgae
        cardItem={recordItem}
        onBack={() => onListBack()}
        selectDate={selectDate}
      />
    );
  };

  useMount(loadDataSource);

  return listVisible ? (
    listContainer()
  ) : (
    <PageContainer>
      <div className={styles.customModeRecord}>{cardContainer()}</div>
    </PageContainer>
  );
};

export default CustomModeRecordPage;
