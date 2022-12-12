import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Select,
  Input,
  Row,
  Col,
  message,
  Button,
  Spin,
} from 'antd';
import moment from 'moment';
import type { ExtendedUploadFile } from '@/pages/Signature/type';
import { saveAttachments } from '@/services/global';
import PictureUpload from '@/pages/Signature/components/PictureUpload';
import { ResourcePath, AttachmentCategory } from '@/utils/constants';
import type { RepairRecord, Part } from '../../type';
import {
  InitChannel,
  InitChannelText,
  PostSuggest,
  PostSuggestText,
  RepairResult,
  RepairResultText,
} from '../../type';
import { postParts, postRecord, postRecordSubmit } from '../../service';
import TimePicker from './TimePicker';
import { EditableChartsTable } from './EditableChartsTable';
import useRecordExtraInfo from '../../hooks/useRecordExtraInfo';

const initialTime = ((date) => {
  return `${moment(date).format('YYYY-MM-DD')} ${moment(date).format(
    'HH:mm:ss',
  )}`;
})(new Date());

interface ModalCreateRecordProps {
  visible?: boolean;
  target?: RepairRecord;
  onCancel: () => void;
  afterSubmit: (close?: boolean) => void;
}
const ModalCreateRecord: React.FC<ModalCreateRecordProps> = ({
  visible = false,
  target,
  onCancel,
  afterSubmit,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const {
    equipment,
    parts: partList,
    recordPhotos,
    errorPhotos,
    loading: infoLoading,
    load: loadExtraInfo,
  } = useRecordExtraInfo(target);

  const handleSave = async (fromSubmit = false) => {
    if (!target || !target.id) return;
    try {
      setLoading(true);
      const {
        equipmentName,
        orgName,
        departmentName,
        initPersonName,
        engineerName,
        initTime,
        initChannel,
        initReason,
        opBeginTime,
        opEndTime,
        repairResult,
        postSuggest,
        parts,
        recordP,
        errorP,
      } = await form.validateFields();
      const attachments: Attachment[] = [];
      if (errorP && errorP.length > 0) {
        errorP.forEach(
          ({ res, name, status, type, size = 0 }: ExtendedUploadFile) => {
            if (status !== 'done') {
              throw new Error(`请移除未成功上传的故障描述图片后再提交！`);
            }
            attachments.push({
              res: res as string,
              fileName: name,
              contentType: type,
              contentLength: size,
              category: AttachmentCategory.MP_REPAIR_FAILURE,
            });
          },
        );
      }
      if (recordP && recordP.length > 0) {
        recordP.forEach(
          ({ res, name, status, type, size = 0 }: ExtendedUploadFile) => {
            if (status !== 'done') {
              throw new Error(`请移除未成功上传的工单图片后再提交！`);
            }
            attachments.push({
              res: res as string,
              fileName: name,
              contentType: type,
              contentLength: size,
              category: AttachmentCategory.MP_TICKET_PHOTO,
            });
          },
        );
      }
      if (attachments.length > 0) {
        await saveAttachments(target.id, attachments);
      }
      if (parts && parts.length > 0) {
        const partsPost: Part[] = parts.map((_: Part) => {
          const newPart = { ..._ };
          if (typeof newPart.id === 'string' && newPart.id.match('custom')) {
            delete newPart.id;
          }
          return newPart;
        });
        await postParts(target.id, partsPost);
      }
      await postRecord({
        ...target,
        equipmentName,
        orgName,
        departmentName,
        initPersonName,
        engineerName,
        initTime,
        initChannel,
        initReason,
        opBeginTime,
        opEndTime,
        repairResult,
        postSuggest,
      });
      if (!fromSubmit) {
        message.success('保存成功');
        afterSubmit(false);
      }
    } catch (err) {
      if (fromSubmit) {
        throw err;
      }
      if (err.errorFields) {
        message.error(
          err.errorFields.map((_: any) => _.errors.join(',')).join(','),
        );
      } else {
        message.error(err.message || err.msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!target || !target.id) return;
    try {
      setLoading(true);
      await handleSave(true);
      await postRecordSubmit(target.id);
      if (afterSubmit) {
        afterSubmit(true);
      }
      message.success('提交成功');
    } catch (err) {
      message.error(err.message || err.msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!visible) return;
    const fields: any = {
      initChannel: InitChannel.ONLINE,
      requirResult: RepairResult.FIXED,
      postSuggest: PostSuggest.NORMAL,
      initTime: initialTime,
      opBeginTime: initialTime,
      opEndTime: initialTime,
      parts: [],
      ...target,
    };
    form.setFieldsValue(fields);
  }, [target, visible, form]);

  useEffect(() => {
    if (!visible) return;
    loadExtraInfo();
  }, [visible, loadExtraInfo]);

  useEffect(() => {
    if (!equipment) return;
    form.setFieldsValue({
      manufacturerName: equipment.manufacturerName,
      modelName: equipment.modelName,
      equipmentNo: equipment.equipmentNo,
      sn: equipment.sn,
    });
  }, [equipment, form]);

  useEffect(() => {
    if (!partList) return;
    form.setFieldsValue({ parts: partList });
  }, [partList, form]);

  useEffect(() => {
    if (!recordPhotos) return;
    form.setFieldsValue({
      recordP: recordPhotos.map(
        ({ res, fileName, contentLength, contentType }, index) => ({
          res,
          uid: index,
          name: fileName,
          url: `${ResourcePath}${res}`,
          src: `${ResourcePath}${res}`,
          status: 'done',
          type: contentType,
          size: contentLength,
        }),
      ),
    });
  }, [recordPhotos, form]);

  useEffect(() => {
    if (!errorPhotos) return;
    form.setFieldsValue({
      errorP: errorPhotos.map(
        ({ res, fileName, contentLength, contentType }, index) => ({
          res,
          uid: index,
          name: fileName,
          url: `${ResourcePath}${res}`,
          src: `${ResourcePath}${res}`,
          status: 'done',
          type: contentType,
          size: contentLength,
        }),
      ),
    });
  }, [errorPhotos, form]);

  return (
    <Modal
      title="维修工单（补单）"
      visible={visible}
      width={1000}
      maskClosable={false}
      onCancel={onCancel}
      footer={[
        <Button key="c" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="su"
          onClick={handleSubmit}
          type="primary"
          disabled={loading}
        >
          提交
        </Button>,
        <Button
          key="sa"
          onClick={() => handleSave()}
          type="primary"
          disabled={loading}
        >
          保存
        </Button>,
      ]}
    >
      <Spin spinning={infoLoading}>
        <Form labelCol={{ span: 6 }} labelAlign="left" form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="设备名称" name="equipmentName">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备厂商" name="manufacturerName">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备型号" name="modelName">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备编号" name="equipmentNo">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备序列号" name="sn">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="归属医院" labelCol={{ span: 3 }} name="orgName">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="所在位置"
                labelCol={{ span: 3 }}
                name="departmentName"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="报修人" name="initPersonName">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="工程师" name="engineerName">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="报修时间" name="initTime">
                <TimePicker />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="报修途径"
                name="initChannel"
                rules={[{ required: true, message: '请选择报修途径' }]}
              >
                <Select
                  placeholder="请选择"
                  style={{ width: '100%' }}
                  filterOption={false}
                  options={Object.keys(InitChannel)
                    .filter((k) => k !== InitChannel.ONLINE)
                    .map((_) => ({
                      label: InitChannelText[_],
                      value: _,
                    }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="维修开始时间"
                name="opBeginTime"
                rules={[{ required: true, message: '请选择维修开始时间' }]}
              >
                <TimePicker />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="维修结束时间"
                name="opEndTime"
                rules={[{ required: true, message: '请选择维修结束时间' }]}
              >
                <TimePicker />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="维修结果"
                name="repairResult"
                rules={[{ required: true, message: '请选择维修结果' }]}
              >
                <Select
                  showSearch
                  placeholder="请选择"
                  style={{ width: '100%' }}
                  options={Object.keys(RepairResult).map((_) => ({
                    label: RepairResultText[_],
                    value: _,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="修复后建议"
                name="postSuggest"
                rules={[{ required: true, message: '请选择维修结果' }]}
              >
                <Select
                  showSearch
                  placeholder="请选择"
                  style={{ width: '100%' }}
                  options={Object.keys(PostSuggest).map((_) => ({
                    label: PostSuggestText[_],
                    value: _,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="更换配件信息"
                labelCol={{ span: 23 }}
                name="parts"
              >
                <EditableChartsTable />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="故障描述"
                labelCol={{ span: 24 }}
                name="initReason"
              >
                <Input.TextArea autoSize={{ minRows: 3 }} />
              </Form.Item>
              <Form.Item name="errorP">
                <PictureUpload />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="工单上传（图片）"
                labelCol={{ span: 24 }}
                name="recordP"
                rules={[{ required: true, message: '请上传工单' }]}
              >
                <PictureUpload />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ModalCreateRecord;
