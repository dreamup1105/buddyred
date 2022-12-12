import React, { useEffect, useState } from 'react';
import { Modal, Table, Input, Spin } from 'antd';
import type { ProTableColumn } from '@/components/ProTable';
import type { SelectedEquipmentItem } from '../type';
import { equipmentListAPI } from '../service';
import { SelectEquipmentColumn } from '../type';
import useUserInfo from '@/hooks/useUserInfo';
const { Search } = Input;

interface IModalProps {
  selectRow: number[];
  deptId: number;
  visible: boolean;
  onCancel: () => void;
  onConfirm: (data: SelectedEquipmentItem[]) => void;
}

const SelectEquipmentModal: React.FC<IModalProps> = ({
  selectRow,
  deptId,
  visible = false,
  onCancel,
  onConfirm,
}) => {
  const { currentUser } = useUserInfo();
  const orgId = currentUser?.org.id;
  const [equipmentData, setEquipmentData] = useState<SelectedEquipmentItem[]>(
    [],
  );
  const [equipmentAllData, setEquipmentAllData] = useState<
    SelectedEquipmentItem[]
  >([]);
  const [selectEquipment, setSelectEquipment] = useState<
    SelectedEquipmentItem[]
  >([]);
  const [spinning, setSpining] = useState<boolean>(false);

  // 获取源科室设备列表
  const getListLendEqData = async () => {
    try {
      setSpining(true);
      const { data } = await equipmentListAPI({
        current: 1,
        departmentId: [deptId],
        orgId: orgId,
        pageSize: 99999,
      });
      setEquipmentData(data);
      setEquipmentAllData(data);
      setSpining(false);
    } catch (err) {
      console.log(err);
      setSpining(false);
    }
  };

  // 查询
  const onSearch = (value: string) => {
    // 在前端做查询，每次查询的时候将已经选中的项放到列表最前面选中
    const selectEquipmentStr = selectEquipment
      .map((item: any) => item.id)
      .join();
    const tableData = equipmentAllData.filter(
      (item: any) =>
        item.name.indexOf(value) != -1 &&
        selectEquipmentStr.indexOf(item.id.toString()) == -1,
    );
    setEquipmentData([...selectEquipment, ...tableData]);
  };

  // 多选选中
  const rowCheckboxChange = (selectedRows: SelectedEquipmentItem[]) => {
    setSelectEquipment(selectedRows);
  };

  //弹框取消
  const onModalCancel = () => {
    onCancel();
  };

  // 弹框确认
  const onModalConfirm = () => {
    onConfirm([...selectEquipment]);
    setSelectEquipment([]);
  };

  useEffect(() => {
    if (visible) {
      getListLendEqData();
    }
  }, [visible]);

  const columns: ProTableColumn<SelectedEquipmentItem>[] = [
    ...SelectEquipmentColumn,
  ];

  return (
    <>
      <Modal
        title={`新增源科室设备`}
        visible={visible}
        width="1000px"
        maskClosable={false}
        destroyOnClose={true}
        onCancel={onModalCancel}
        onOk={onModalConfirm}
      >
        <Search
          placeholder="请输入设备名称进行查询"
          onSearch={onSearch}
          enterButton="搜索"
          style={{ width: '300px' }}
        />
        <Spin size="large" spinning={spinning}>
          <Table
            sticky
            rowSelection={{
              type: 'checkbox',
              onChange: (
                selectedRowKeys: React.Key[],
                selectedRows: SelectedEquipmentItem[],
              ) => {
                rowCheckboxChange(selectedRows);
              },
              defaultSelectedRowKeys: selectRow,
            }}
            style={{ marginTop: '10px', height: '400px', overflow: 'auto' }}
            rowKey="id"
            columns={columns}
            dataSource={equipmentData}
            pagination={false}
          />
        </Spin>
      </Modal>
    </>
  );
};

export default SelectEquipmentModal;
