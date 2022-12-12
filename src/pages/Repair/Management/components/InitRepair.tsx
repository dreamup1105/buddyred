import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Space,
  Button,
  Row,
  Col,
  Divider,
  Table,
  Form,
  Input,
  Upload,
  Radio,
  message,
  DatePicker,
  Tabs,
  TreeSelect,
} from 'antd';
import { history } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import IconFont from '@/components/IconFont';
import type { ITableListItem as EquipmentItem } from '@/pages/Assets/type';
import EquipmentSelect, {
  BizType,
} from '@/components/Equipment/EquipmentSelect';
import type { SelectFunc } from '@/components/Equipment/EquipmentSelect';
import Preview from '@/components/Preview';
import Footerbar from '@/components/Footerbar';
import ResultModal from '@/pages/Maintenance/components/Result';
import EquipmentDetailModal from '@/components/Equipment/Detail';
import useUploadHook from '@/hooks/useUploadHook';
import usePreview from '@/hooks/usePreview';
import useUserInfo from '@/hooks/useUserInfo';
import useACL from '@/hooks/useACL';
import useMount from '@/hooks/useMount';
import useAdverseEventParams from '@/pages/Adverse-Event/hooks/useAdverseEventParams';
import { normalFile, getBase64 } from '@/utils/utils';
import { UploadHost } from '@/services/qiniu';
import { ResourcePath, AttachmentCategory } from '@/utils/constants';
import { saveAttachments, fetchAttachments } from '@/services/global';
import EmptyEquipmentImage from '@/assets/empty-equipment.png';
import CreateAdverseEventForm from '@/pages/Adverse-Event/components/CreateEventForm';
import type { UploadFile } from 'antd/es/upload/interface';
import type { ColumnType } from 'antd/es/table';
import { momentToString, WithoutTimeFormat } from '@/utils/utils';
import { initRepair, fetchListCrOrg, fetchSimplaRepairInit } from '../service';
import { PageType } from '@/pages/Maintenance/type';
import styles from '../index.less';
import { equipmentUnfinished } from '@/pages/Maintenance/service';
import useDepartments from '@/hooks/useDepartments';

const { TextArea } = Input;

// 发起维修
const InitRepair: React.FC = () => {
  const [form] = Form.useForm();
  const [createAdverseEventForm] = Form.useForm();
  const [isReportAdverseEventForm] = Form.useForm();
  const [simpleRepairForm] = Form.useForm();
  const { token, loadToken } = useUploadHook();
  const { currentUser } = useUserInfo();
  const { isACL } = useACL();
  const [
    previewImages,
    previewModalVisible,
    defaultPhotoIndex,
    updatePreviewImages,
    showPreviewModal,
    onClosePreview,
  ] = usePreview();
  const userId = currentUser?.user.id;
  const [submitting, setSubmitting] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem>();
  const [equipmentId, setEquipmentId] = useState<number>();
  const [equipmentImage, setEquipmentImage] = useState<string | undefined>();
  const [equipmentSelectVisible, setEquipmentSelectVisible] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [
    equipmentDetailModalVisible,
    setEquipmentDetailModalVisible,
  ] = useState(false);
  const { params, loadAdverseEventParams } = useAdverseEventParams();
  const [isReportAdverseEvent, setIsReportAdverseEvent] = useState(false); // 是否上报不良事件

  const isMaintainer = currentUser?.isMaintainer;
  const orgId = currentUser?.org.id;
  const siteOrgId = currentUser!.currentCustomer?.siteOrgId;
  // 登录用户为医生时直接获取orgId，当登录用户为工程师时，需要获取当前所选择的医院的orgId
  const { departmentsTreeData, loadDepartments } = useDepartments({
    orgId: isMaintainer ? siteOrgId : orgId!,
  });

  const [tabsActive, setTabsActive] = useState<string>('0');
  const [crOrgList, setCrOrgList] = useState([]);
  const [simpleDepartmentName, setSimpleDepartmentName] = useState('');
  const [simpleCrOrgSelect, setSimpleCrOrgSelect] = useState<any>({});

  const beforeUpload = async (file: File): Promise<any> => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能大于5M');
      return Upload.LIST_IGNORE;
    }
    await loadToken();
    return true;
  };

  const getExtraData = useCallback(
    (file: UploadFile) => {
      return {
        token,
        key: `${Date.now()}-${file.uid}-${userId}`,
      };
    },
    [token],
  );

  // 获取设备图片
  const loadEquipmentImage = async () => {
    try {
      const { data } = await fetchAttachments(selectedEquipment!.id);
      if (data?.length) {
        setEquipmentImage(`${ResourcePath}${data[0].res}`);
      } else {
        setEquipmentImage(EmptyEquipmentImage);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSelectEquipment: SelectFunc = async ({ selectedRows = [] }) => {
    if (!selectedRows?.length) {
      return;
    }
    const { data } = await equipmentUnfinished({
      equipmentList: selectedRows.map((r) => r.id),
      taskType: 'REPAIR',
    });
    if (data.length == 1) {
      message.error('该设备有未完成的维修任务，不能继续发起维修');
      return;
    }

    setSelectedEquipment(selectedRows[0]);
    setEquipmentSelectVisible(false);
  };

  const onInitRepair = async () => {
    if (tabsActive == '0') {
      if (!selectedEquipment) {
        message.error('请选择设备');
        return;
      }
      if (!selectedEquipment.isSigned) {
        message.error('设备未签约');
        return;
      }
      if (submitting) {
        return;
      }
      const initReasonForm = await isReportAdverseEventForm.validateFields();
      const { planEndTime } = initReasonForm;
      setSubmitting(true);
      try {
        const formValues = await form.validateFields();
        let createAdverseEventFormValues: any = {};

        if (isReportAdverseEvent) {
          createAdverseEventFormValues = await createAdverseEventForm.validateFields();
        }
        const { initReason, attachments } = formValues;
        const { data } = await initRepair({
          departmentId: selectedEquipment.departmentId,
          departmentName: selectedEquipment.departmentName,
          orgId: selectedEquipment.orgId,
          orgName: currentUser?.org.name,
          initPersonId: currentUser!.employee.id,
          initPersonName: currentUser!.employee.name,
          equipmentId: selectedEquipment.id,
          equipmentName: selectedEquipment.name,
          initReason,
          planEndTime: momentToString(planEndTime, WithoutTimeFormat),
          createAdverseEvent: isReportAdverseEvent,
          adverseEventReq: isReportAdverseEvent
            ? {
                ...createAdverseEventFormValues,
                happenTime: momentToString(
                  createAdverseEventFormValues.happenTime,
                ),
                reportTime: momentToString(
                  createAdverseEventFormValues.reportTime,
                ),
              }
            : undefined,
        });
        if (attachments) {
          await saveAttachments(
            data.id,
            attachments.map((attachment: UploadFile) => ({
              contentLength: attachment.size,
              contentType: attachment.type,
              fileName: attachment.name,
              res: attachment.response.data.key,
              category: AttachmentCategory.MP_REPAIR_FAILURE,
            })),
          );
        }
        setResultModalVisible(true);
      } catch (error: any) {
        console.error(error);
        message.error(error.message);
      } finally {
        setSubmitting(false);
      }
    } else {
      const simpleRepairValues = await simpleRepairForm.validateFields();
      simpleRepairValues.departmentName = simpleDepartmentName;

      setSubmitting(true);
      try {
        const initReasonForm = await isReportAdverseEventForm.validateFields();
        const { planEndTime, engineerId } = initReasonForm;
        const formValues = await form.validateFields();
        const { initReason, attachments } = formValues;
        let createAdverseEventFormValues: any = {};

        if (isReportAdverseEvent) {
          createAdverseEventFormValues = await createAdverseEventForm.validateFields();
        }
        const { data } = await fetchSimplaRepairInit({
          ...simpleRepairValues,
          initReason,
          planEndTime: momentToString(planEndTime, WithoutTimeFormat),
          engineerId,
          engineerName: simpleCrOrgSelect.label,
          crId: simpleCrOrgSelect.crId,
          undertakerId: simpleCrOrgSelect.orgId,
          undertakerName: simpleCrOrgSelect.orgName,
          orgId: currentUser?.org.id,
          orgName: currentUser?.org.name,
          initPersonId: currentUser!.employee.id,
          initPersonName: currentUser!.employee.name,
          createAdverseEvent: isReportAdverseEvent,
          adverseEventReq: isReportAdverseEvent
            ? {
                ...createAdverseEventFormValues,
                happenTime: momentToString(
                  createAdverseEventFormValues.happenTime,
                ),
                reportTime: momentToString(
                  createAdverseEventFormValues.reportTime,
                ),
              }
            : undefined,
        });
        if (attachments) {
          await saveAttachments(
            data.id,
            attachments.map((attachment: UploadFile) => ({
              contentLength: attachment.size,
              contentType: attachment.type,
              fileName: attachment.name,
              res: attachment.response.data.key,
              category: AttachmentCategory.MP_REPAIR_FAILURE,
            })),
          );
        }
        setResultModalVisible(true);
      } catch (err) {
        console.log(err);
        setSubmitting(false);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const onFileChange = ({ file }: any) => {
    if (file.status === 'error') {
      message.error('图片上传失败');
    }
  };

  // 继续发起维修
  const onContinueInit = () => {
    if (tabsActive == '0') {
      form.resetFields();
      createAdverseEventForm.resetFields();
      isReportAdverseEventForm.setFieldsValue({ isReport: 2 });
      setIsReportAdverseEvent(false);
      setSelectedEquipment(undefined);
      setResultModalVisible(false);
    } else {
      history.replace('/assets/assets');
    }
  };

  const onCancelEquipmentDetail = () => {
    setEquipmentId(undefined);
    setEquipmentDetailModalVisible(false);
  };

  const onViewEquipment = (record: EquipmentItem) => {
    setEquipmentId(record.id);
    setEquipmentDetailModalVisible(true);
  };

  const onPreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      // eslint-disable-next-line no-param-reassign
      file.preview = (await getBase64(file.originFileObj as File)) as string;
    }

    const currentFileList = form.getFieldValue('attachments');
    if (currentFileList?.length) {
      updatePreviewImages(currentFileList, file);
    }
    showPreviewModal();
  };

  // 获取维修执行人列表
  const getListCrOrg = async () => {
    try {
      const { data } = await fetchListCrOrg();
      const list = data;
      list.forEach((item: any) => {
        item.label = item.orgName;
        item.value = item.orgId;
        item.children = item.engineers;
        item.children.forEach((eng: any) => {
          eng.label = eng.name;
          eng.value = eng.id;
        });
      });
      setCrOrgList(list);
    } catch (err) {
      console.log(err);
    }
  };

  const departmentsChange = (value: any, label: any) => {
    setSimpleDepartmentName(label[0]);
  };

  // 维修执行人点击
  const crOrgSeect = (value: string, node: any) => {
    setSimpleCrOrgSelect(node);
  };

  const onTabClick = (key: string) => {
    setTabsActive(key);
  };

  const columns: ColumnType<EquipmentItem>[] = [
    {
      title: '设备名称',
      dataIndex: 'equipNameNew',
      key: 'equipNameNew',
    },
    {
      title: '型号',
      dataIndex: 'modelName',
      key: 'modelName',
    },
    {
      title: '生产厂商',
      dataIndex: 'modelName',
      key: 'modelName',
    },
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
    },
    {
      title: '操作',
      key: 'operation',
      render: (_, record) => (
        <>
          <a onClick={() => onViewEquipment(record)}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => setEquipmentSelectVisible(true)}>更换</a>
          <Divider type="vertical" />
          <a onClick={() => setSelectedEquipment(undefined)}>删除</a>
        </>
      ),
    },
  ];

  const init = async () => {
    loadAdverseEventParams();
    loadDepartments();
    getListCrOrg();
  };

  useEffect(() => {
    if (selectedEquipment) {
      loadEquipmentImage();
      setEquipmentId(selectedEquipment.id);
    } else {
      setEquipmentImage(undefined);
      setEquipmentId(undefined);
    }
  }, [selectedEquipment]);

  useMount(init);

  return (
    <div className={styles.initRepairWrapper}>
      <Tabs onChange={onTabClick} activeKey={tabsActive}>
        <Tabs.TabPane tab="正常报修" key="0">
          <Card style={{ marginBottom: '20px' }} title="设备信息">
            {selectedEquipment ? (
              <>
                <Row>
                  <Col span={2}>
                    {equipmentImage && (
                      <span className="ant-upload-picture-card-wrapper">
                        <div className="ant-upload-list ant-upload-list-picture-card">
                          <div className="ant-upload-list-picture-card-container">
                            <div
                              className="ant-upload-list-item ant-upload-list-item-list-type-picture-card"
                              onClick={() => setPreviewVisible(true)}
                            >
                              <div className="ant-upload-list-item-info">
                                <span className="ant-upload-span">
                                  <img
                                    src={equipmentImage}
                                    alt="设备图片"
                                    className={styles.equipmentImage}
                                  />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </span>
                    )}
                  </Col>
                  <Col span={22}>
                    <Table
                      rowKey="id"
                      pagination={false}
                      columns={columns}
                      dataSource={selectedEquipment ? [selectedEquipment] : []}
                    />
                  </Col>
                </Row>
              </>
            ) : (
              <a
                onClick={() => setEquipmentSelectVisible(true)}
                style={{ fontSize: '16px' }}
              >
                <Space>
                  <IconFont type="iconzengjia" style={{ fontSize: '30px' }} />
                  添加设备
                </Space>
              </a>
            )}
          </Card>
        </Tabs.TabPane>
        <Tabs.TabPane tab="简易报修" key="1">
          <Card title="设备信息" style={{ marginBottom: '20px' }}>
            <Form form={simpleRepairForm} layout="inline">
              <Form.Item
                label="设备名称"
                name="equipmentName"
                rules={[
                  {
                    required: true,
                    message: '设备名称不能为空',
                  },
                  { whitespace: true, message: '名称不能只包含空格' },
                ]}
              >
                <Input placeholder="请输入设备名称" />
              </Form.Item>
              <Form.Item
                label="所属科室"
                name="departmentId"
                rules={[
                  {
                    required: true,
                    message: '所属科室不能为空',
                  },
                ]}
              >
                <TreeSelect
                  showSearch
                  style={{ width: '300px' }}
                  placeholder="请选择所属科室"
                  treeData={departmentsTreeData}
                  onChange={departmentsChange}
                  treeNodeFilterProp="title"
                  treeDefaultExpandAll
                  virtual={false}
                />
              </Form.Item>
            </Form>
          </Card>
        </Tabs.TabPane>
      </Tabs>

      <Card title="故障信息" style={{ marginBottom: '20px' }}>
        <Form layout="vertical" form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="设备故障描述:" name="initReason">
                <TextArea style={{ width: '480px', height: '102px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="attachments"
                label="设备故障图片:"
                labelCol={{ span: 9 }}
                valuePropName="fileList"
                getValueFromEvent={normalFile}
              >
                <Upload
                  action={UploadHost}
                  accept=".jpg, .jpeg, .png"
                  beforeUpload={beforeUpload}
                  listType="picture-card"
                  data={getExtraData}
                  onChange={onFileChange}
                  onPreview={onPreview}
                >
                  <PlusOutlined
                    style={{ fontSize: '60px', color: '#d9d9d9' }}
                  />
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card title="其他信息">
        <Form
          style={{ marginBottom: '20px' }}
          form={isReportAdverseEventForm}
          layout="inline"
          // initialValues={{ isReport: 2 }}
          onValuesChange={(changedValues) => {
            if (changedValues.isReport) {
              setIsReportAdverseEvent(changedValues.isReport === 1);
            }
          }}
        >
          <Form.Item label="上报不良事件" name="isReport">
            <Radio.Group>
              <Radio value={1}>上报</Radio>
              <Radio value={2}>不上报</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="计划结束时间"
            name="planEndTime"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
          {tabsActive == '1' && (
            <Form.Item
              label="维修执行人"
              name="engineerId"
              rules={[{ required: true }]}
            >
              <TreeSelect
                showSearch
                style={{ width: '300px' }}
                placeholder="请选择维修执行人"
                allowClear
                treeNodeFilterProp="label"
                treeDefaultExpandAll
                onSelect={crOrgSeect}
                treeData={crOrgList}
              />
            </Form.Item>
          )}
        </Form>
        {isReportAdverseEvent && (
          <CreateAdverseEventForm
            visible={isReportAdverseEvent}
            params={params}
            mode="Form"
            parentForm={createAdverseEventForm}
          />
        )}
      </Card>
      <EquipmentSelect
        isACL={isACL}
        bizType={BizType.REPAIR}
        multiple={false}
        visible={equipmentSelectVisible}
        onSelect={onSelectEquipment}
        onCancel={() => setEquipmentSelectVisible(false)}
      />
      <ResultModal
        pageType={tabsActive == '0' ? PageType.REPAIR : PageType.SIMPLE_REPAIR}
        visible={resultModalVisible}
        onContinue={onContinueInit}
        onCancel={() => setResultModalVisible(false)}
      />
      <EquipmentDetailModal
        id={equipmentId}
        visible={equipmentDetailModalVisible}
        onCancel={onCancelEquipmentDetail}
      />
      <Preview
        defaultIndex={0}
        images={equipmentImage ? [{ src: equipmentImage }] : []}
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
      />
      <Preview
        defaultIndex={defaultPhotoIndex}
        images={previewImages}
        visible={previewModalVisible}
        onClose={onClosePreview}
      />
      <Footerbar
        visible
        style={{
          height: '60px',
          lineHeight: '60px',
          zIndex: 10,
        }}
        rightContent={
          <Space>
            <Button
              className={styles.btnCancel}
              onClick={() => history.goBack()}
            >
              取消
            </Button>
            <Button
              onClick={onInitRepair}
              className={styles.btnSubmit}
              disabled={resultModalVisible}
              loading={submitting}
              type="primary"
            >
              报修
            </Button>
          </Space>
        }
      />
    </div>
  );
};

export default InitRepair;
