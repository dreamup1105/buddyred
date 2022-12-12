import React, { useState, useEffect } from 'react';
import { Col, Row, Form, Table, Typography, Spin } from 'antd';
import { ResourcePath } from '@/utils/constants';
import type { DataType } from '@/components/Preview';
import PictureView from '@/pages/Signature/components/PictureView';
import type { RepairRecord, Part } from '../type';
import { InitChannelText, RepairResultText, PostSuggestText } from '../type';
import useRecordExtraInfo from '../hooks/useRecordExtraInfo';

const { Text } = Typography;

interface RecordDetailProps {
  record?: RepairRecord;
}

const RecordDetail: React.FC<RecordDetailProps> = ({ record }) => {
  const [recordImages, setRecordImages] = useState<DataType[]>();
  const [errorImages, setErrorImages] = useState<DataType[]>();
  const {
    equipment,
    parts,
    recordPhotos,
    errorPhotos,
    loading: infoLoading,
    load: loadExtraInfo,
  } = useRecordExtraInfo(record);
  const {
    createdByName,
    createdTime,
    departmentName,
    engineerName,
    equipmentName,
    initChannel,
    initPersonName,
    initReason,
    initTime,
    opBeginTime,
    opEndTime,
    orgName,
    postSuggest,
    repairResult,
  } = record || {};

  const columns = [
    {
      title: '序号',
      key: 'index',
      width: 65,
      render: (t: any, r: any, index: number) => index + 1,
    },
    {
      title: '配件名称',
      dataIndex: 'productName',
    },
    {
      title: '厂商',
      dataIndex: 'manufacturerName',
    },
    {
      title: '型号',
      dataIndex: 'modelName',
    },
    {
      title: '序列号',
      dataIndex: 'sn',
    },
    {
      title: '价格',
      dataIndex: 'amount',
    },
    {
      title: '数量',
      dataIndex: 'quantity',
    },
  ];

  useEffect(() => {
    loadExtraInfo();
  }, [record, loadExtraInfo]);

  useEffect(() => {
    if (recordPhotos) {
      setRecordImages(
        recordPhotos.map((_) => ({
          src: `${ResourcePath}${_.res}`,
          key: _.res,
        })),
      );
    }
  }, [recordPhotos]);

  useEffect(() => {
    if (errorPhotos) {
      setErrorImages(
        errorPhotos.map((_) => ({
          src: `${ResourcePath}${_.res}`,
          key: _.res,
        })),
      );
    }
  }, [errorPhotos]);

  return (
    <Form labelCol={{ span: 6 }} labelAlign="left">
      <Spin spinning={infoLoading}>
        <Row>
          <Col span={12}>
            <Form.Item label="创建人">
              <Text strong>{createdByName}</Text>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="发起时间">
              <Text strong>{createdTime}</Text>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="设备名称">
              <Text strong>{equipmentName}</Text>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="设备厂商">
              <Text strong>{equipment && equipment.manufacturerName}</Text>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="设备型号">
              <Text strong>{equipment && equipment.modelName}</Text>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="设备编号">
              <Text strong>{equipment && equipment.equipmentNo}</Text>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="设备序列号" labelCol={{ span: 3 }}>
              <Text strong>{equipment && equipment.sn}</Text>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="归属医院">
              <Text strong>{orgName}</Text>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="所在科室">
              <Text strong>{departmentName}</Text>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="报修人">
              <Text strong>{initPersonName}</Text>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="工程师">
              <Text strong>{engineerName}</Text>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="报修时间">
              <Text strong>{initTime}</Text>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="报修途径">
              <Text strong>{initChannel && InitChannelText[initChannel]}</Text>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="维修开始时间">
              <Text strong>{opBeginTime}</Text>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="维修结束时间">
              <Text strong>{opEndTime}</Text>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="维修结果">
              <Text strong>
                {repairResult && RepairResultText[repairResult]}
              </Text>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="修复后建议">
              <Text strong>{postSuggest && PostSuggestText[postSuggest]}</Text>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="更换配件信息" labelCol={{ span: 24 }}>
              <Table<Part>
                pagination={false}
                dataSource={parts}
                rowKey="id"
                columns={columns}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="故障描述" labelCol={{ span: 24 }}>
              <p style={{ marginBottom: 0 }}>{initReason}</p>
            </Form.Item>
          </Col>
          <Col span={24}>
            {/* <Form.Item label="故障描述图片" labelCol={{ span: 24 }}> */}
            <Form.Item>
              <PictureView images={errorImages || []} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="工单图片" labelCol={{ span: 24 }}>
              <PictureView images={recordImages || []} />
            </Form.Item>
          </Col>
        </Row>
      </Spin>
    </Form>
  );
};

export default RecordDetail;
