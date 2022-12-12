import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@/components/ProTable';
import { DatePicker, Button, message, Select, TreeSelect } from 'antd';
import { WalletOutlined } from '@ant-design/icons';
import {
  download,
  tableHeight,
  momentToString,
  WithoutTimeFormat,
} from '@/utils/utils';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import omit from 'omit.js';
import type { IFetchMaintenanceRecord } from '../type';
import {
  getMaintenanceRecordAPI,
  maintenanceRecordExportAPI,
  getHospitalClientListAPI,
  getDepartmentListAPI,
  getSummationCostAPI,
} from '../service';
import type { FormInstance } from 'antd/es/form';
import useENG from '@/hooks/useENG';
import useHOST from '@/hooks/useHOST';

interface IComponentProps {
  title?: string;
  column?: ProTableColumn<IFetchMaintenanceRecord>[];
  taskType: string;
}

interface defaultQueryItem {
  current: number;
  pageSize: number;
  startTime?: string;
  endTime?: string;
  hospitalIds?: any;
  hospitalId?: any;
  departmentsId?: any;
  equipmentName?: string;
  employeeName?: string;
  empIds?: any;
}

const defaultQuery: defaultQueryItem = {
  current: 1,
  pageSize: 30,
  startTime: undefined,
  endTime: undefined,
  hospitalId: undefined,
  hospitalIds: undefined,
  departmentsId: undefined,
  equipmentName: '',
  employeeName: '',
  empIds: undefined,
};

const EnergyPowerConsumptionPage: React.FC<IComponentProps> = ({
  title,
  column = [],
  taskType,
}) => {
  const { isEng } = useENG();
  const { isHost } = useHOST();
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [hospitalOptions, setHospitalOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [sumCount, setSumCount] = useState(0);
  const [empId, setEmpId] = useState<number | undefined>();

  // 导出excel
  const onExport = async () => {
    let params: any;
    if (formRef.current?.getFieldsValue()) {
      const {
        departmentsId,
        employeeName,
        equipmentName,
        hospitalId,
        date,
      } = formRef.current?.getFieldsValue();
      params = {
        isEng,
        isHost,
        taskType: taskType,
        departmentsId,
        employeeName,
        equipmentName,
        hospitalIds: hospitalId ? [hospitalId] : undefined,
        empIds: empId ? [empId] : undefined,
        startTime:
          (date?.[0] && momentToString(date[0], WithoutTimeFormat)) ||
          undefined,
        endTime:
          (date?.[1] && momentToString(date[1], WithoutTimeFormat)) ||
          undefined,
      };
    } else if (empId) {
      params = {
        isEng,
        isHost,
        taskType: taskType,
        empIds: [empId],
      };
    } else {
      params = {
        isEng,
        isHost,
        taskType: taskType,
      };
    }
    setExportLoading(true);
    try {
      const { data, response } = await maintenanceRecordExportAPI(params);
      download(data, response);
      message.success('导出成功');
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setExportLoading(false);
    }
  };

  // 获取医院列表
  const getHospitalData = async () => {
    try {
      const { data } = await getHospitalClientListAPI({
        isEng,
        isHost,
      });
      const options = data.map((item: any) => {
        return {
          label: item.orgName,
          value: item.orgId,
        };
      });
      setHospitalOptions(options);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  // 查询医院下的科室
  const getDepartmentList = async (orgId: number) => {
    try {
      const { data } = await getDepartmentListAPI(orgId);
      setDepartmentOptions(
        data.map((item: any) => {
          return {
            label: item.name,
            value: item.id,
          };
        }),
      );
    } catch (err: any) {
      message.error(err.message);
    }
  };

  // 查询总金额
  const getSummationCostData = async (empIds: any) => {
    console.log(formRef.current?.getFieldsValue());
    let params;
    if (formRef.current?.getFieldsValue()) {
      const {
        departmentsId,
        employeeName,
        equipmentName,
        hospitalId,
        date,
      } = formRef.current?.getFieldsValue();
      params = {
        isEng,
        isHost,
        taskType: taskType,
        departmentsId,
        employeeName,
        equipmentName,
        hospitalIds: hospitalId ? [hospitalId] : undefined,
        empIds: empIds ? [empIds] : undefined,
        startTime:
          (date?.[0] && momentToString(date[0], WithoutTimeFormat)) ||
          undefined,
        endTime:
          (date?.[1] && momentToString(date[1], WithoutTimeFormat)) ||
          undefined,
      };
    } else if (empIds) {
      params = {
        isEng,
        isHost,
        taskType: taskType,
        empIds: [empIds],
      };
    } else {
      params = {
        isEng,
        isHost,
        taskType: taskType,
      };
    }
    try {
      const { data } = await getSummationCostAPI(params);
      setSumCount(data.summationCost);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  useEffect(() => {
    if (taskType) {
      getHospitalData();
    }
  }, [taskType]);

  const columns: ProTableColumn<IFetchMaintenanceRecord>[] = [
    ...column,
    {
      title: '工程师姓名',
      dataIndex: 'employeeName',
      key: 'employeeName',
      hideInTable: true,
    },
    {
      title: '设备名称',
      dataIndex: 'equipmentName',
      key: 'equipmentName',
      hideInTable: true,
    },
    {
      title: '医院',
      dataIndex: 'hospitalId',
      key: 'hospitalId',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="请选择签约医院"
            options={hospitalOptions}
          />
        );
      },
    },
    {
      title: '科室',
      dataIndex: 'departmentsId',
      key: 'departmentsId',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <TreeSelect
            allowClear
            placeholder="请选择科室"
            treeData={departmentOptions}
          />
        );
      },
    },
    {
      title: '提交验收时间',
      dataIndex: 'date',
      key: 'date',
      hideInTable: true,
      renderFormItem: () => {
        return <DatePicker.RangePicker style={{ width: '100%' }} />;
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<IFetchMaintenanceRecord, typeof defaultQuery>
        rowKey="bindingId"
        title={`${title} ${sumCount != 0 ? '总金额:' + sumCount + '元' : ''} `}
        defaultQuery={defaultQuery}
        columns={columns}
        actionRef={actionRef}
        formRef={formRef}
        tableProps={{
          scroll: {
            y: tableHeight,
          },
        }}
        toolBarRender={() => [
          <Button
            key="button"
            type="primary"
            icon={<WalletOutlined />}
            loading={exportLoading}
            onClick={onExport}
          >
            导出Excel
          </Button>,
        ]}
        request={async (query) => {
          const {
            current,
            pageSize,
            equipmentName,
            employeeName,
            hospitalId,
            departmentsId,
            startTime,
            endTime,
            empIds,
          } = query;
          setEmpId(empIds);
          getSummationCostData(empIds);
          return getMaintenanceRecordAPI({
            current: Number(current) || 1,
            pageSize: Number(pageSize) || 30,
            equipmentName,
            employeeName,
            hospitalIds: hospitalId ? [hospitalId] : undefined,
            departmentsId,
            startTime,
            endTime,
            isEng,
            isHost,
            taskType,
            empIds: empIds ? [empIds] : undefined,
          });
        }}
        hooks={{
          beforeInit: (query) => {
            const { empIds, hospitalId } = query;
            return {
              ...query,
              empIds: empIds ? [empIds] : undefined,
              collapsed: false,
              hospitalId: hospitalId ? parseInt(hospitalId) : undefined,
            };
          },
          beforeSubmit: (formValues) => {
            const { date, empIds } = formValues;
            return {
              ...omit(formValues, ['date']),
              current: 1,
              empIds: empIds ? [empIds] : undefined,
              startTime:
                (date?.[0] && momentToString(date[0], WithoutTimeFormat)) ||
                undefined,
              endTime:
                (date?.[1] && momentToString(date[1], WithoutTimeFormat)) ||
                undefined,
            };
          },
          onFormValuesChange: (changedValues) => {
            // 通过医院查询医院科室
            if (changedValues.hospitalId) {
              getDepartmentList(changedValues.hospitalId);
              formRef.current?.setFieldsValue({
                empIds: undefined,
                departmentsId: undefined,
              });
            }
          },
        }}
      />
    </PageContainer>
  );
};

export default EnergyPowerConsumptionPage;
