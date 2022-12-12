import React, { useMemo } from 'react';
import { Row, Col, Divider } from 'antd';
import Logo from '@/assets/yxklogo.png';
import useUserInfo from '@/hooks/useUserInfo';
import { RepairResultText, PostSuggestText } from '@/pages/Repair/type';
import PictureView from '@/pages/Signature/components/PictureView';
import moment from 'moment';
import { accAdd } from '@/utils/utils';
import Parts from './Parts';
import type { ITaskItem, IRepairReport } from '../type';
import styles from '../index.less';

interface IComponentProps {
  task: ITaskItem | undefined; // 工单信息
  detail: IRepairReport | undefined; // 维修报告
  rawImages: string[];
}

type DateTime = string | undefined | null;

// 获取维修时长
const getRepairDuration = (opBeginTime: DateTime, opEndTime: DateTime) => {
  if (!opBeginTime || !opEndTime) {
    return null;
  }
  const opBeginTimeMoment = moment(opBeginTime, 'YYYY-MM-DD HH:mm:ss');
  const opEndTimeMoment = moment(opEndTime, 'YYYY-MM-DD HH:mm:ss');
  const repairDuration = opEndTimeMoment.diff(opBeginTimeMoment, 'minutes');

  return `${Math.floor(repairDuration / 60)}小时 ${repairDuration % 60}分钟`;
};

// 维修报告
const RepairReport: React.FC<IComponentProps> = ({
  task,
  detail = {},
  rawImages = [],
}) => {
  const repairDuration = getRepairDuration(task?.opBeginTime, task?.opEndTime);
  const {
    equipmentInfo = {},
    repairPartList: parts = [],
    repairReport,
  } = detail as IRepairReport;
  const { currentUser } = useUserInfo();
  const partTotalFee = useMemo(() => {
    if (!parts) {
      return 0;
    }
    return parts.reduce((acc, cur) => accAdd(acc, cur.amount), 0);
  }, [parts]);
  const { equipment } = equipmentInfo as IRepairReport['equipmentInfo'];

  // const loadRawImageUrls = async () => {
  //   try {
  //     const { code, data } = await batchFetchRawImageUrl(
  //       errorPhotos
  //         .filter((e) => e.category === AttachmentCategory.MP_REPAIR_FAILURE)
  //         .map((item) => item.res),
  //     );
  //     if (code === 0) {
  //       setRawImageUrls(data);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   if ((detail as IRepairReport)?.simpleAttachmentInfoList?.length) {
  //     loadRawImageUrls();
  //   } else {
  //     setRawImageUrls([]);
  //   }
  // }, [(detail as IRepairReport)?.simpleAttachmentInfoList]);

  return (
    <div className={`${styles.repairReport} repairReport`}>
      <header className={`${styles.header} report-node`}>
        <div className={styles.title}>
          <h5>
            {task?.orgName}
            {task?.equipNameNew}维修报告
          </h5>
          <span>MEDICAL EQUIPMENT MAINTENANCE REPORT</span>
        </div>
        <img src={Logo} className={styles.logo} />
      </header>
      <div className={styles.inner}>
        <div className={`${styles.base} report-node`}>
          <Row>
            <Col span={12} className={styles.cell}>
              维修编号：{task?.taskNo}
            </Col>
            <Col span={12} className={styles.cell}>
              报修人：{task?.initPersonName}
            </Col>
          </Row>
          <Row>
            <Col span={12} className={styles.cell}>
              所属诊室：{task?.departmentName}
            </Col>
            <Col span={12} className={styles.cell}>
              维修工程师：{task?.engineerName}
            </Col>
          </Row>
        </div>
        <div className={`${styles.params} report-node`}>
          <Row>
            <Col span={5} className={`${styles.cell} ${styles.cellLabel}`}>
              设备名称
            </Col>
            <Col span={7} className={`${styles.cell}`}>
              {task?.equipNameNew}
            </Col>
            <Col span={5} className={`${styles.cell} ${styles.cellLabel}`}>
              设备厂家
            </Col>
            <Col span={7} className={styles.cell}>
              {equipment?.manufacturerName}
            </Col>
          </Row>
          <Row>
            <Col span={5} className={`${styles.cell} ${styles.cellLabel}`}>
              设备型号
            </Col>
            <Col span={7} className={styles.cell}>
              {equipment?.modelName}
            </Col>
            <Col span={5} className={`${styles.cell} ${styles.cellLabel}`}>
              设备序列号
            </Col>
            <Col
              span={7}
              className={styles.cell}
              style={{ wordBreak: 'break-all' }}
            >
              {equipment?.sn}
            </Col>
          </Row>
          <Row>
            <Col span={5} className={`${styles.cell} ${styles.cellLabel}`}>
              维修开始时间
            </Col>
            <Col span={7} className={styles.cell}>
              {task?.opBeginTime}
            </Col>
            <Col span={5} className={`${styles.cell} ${styles.cellLabel}`}>
              维修结束时间
            </Col>
            <Col span={7} className={styles.cell}>
              {task?.opEndTime}
            </Col>
          </Row>
          <Row>
            <Col span={5} className={`${styles.cell} ${styles.cellLabel}`}>
              维修时长
            </Col>
            <Col span={7} className={styles.cell}>
              {repairDuration}
            </Col>
            <Col span={5} className={`${styles.cell} ${styles.cellLabel}`}>
              维修结果
            </Col>
            <Col span={7} className={styles.cell}>
              {task?.repairResult ? RepairResultText[task.repairResult] : null}
            </Col>
          </Row>
          <Row>
            <Col span={5} className={`${styles.cell} ${styles.cellLabel}`}>
              维修后建议
            </Col>
            <Col span={7} className={styles.cell}>
              {task?.postSuggest ? PostSuggestText[task.postSuggest] : null}
            </Col>
            <Col span={5} className={`${styles.cell} ${styles.cellLabel}`}>
              配件总价
            </Col>
            <Col span={7} className={styles.cell}>
              ¥{partTotalFee}
            </Col>
          </Row>
        </div>
        <div className={`${styles.desc} report-node`}>
          <div className={styles.descTitle}>报修信息</div>
          <div className={styles.descContent}>
            <p>{task?.initReason}</p>
            <Divider>故障图片</Divider>
            <PictureView
              images={
                rawImages
                  ? rawImages.map((e) => ({
                      src: e,
                    }))
                  : []
              }
            />
          </div>
        </div>
        {currentUser?.isHospital && task?.reportStatus !== 'NORMAL' ? null : (
          <>
            <div className={`${styles.desc} report-node`}>
              <div className={styles.descTitle}>故障诊断</div>
              <div className={styles.descContent}>{repairReport?.fault}</div>
            </div>
            <div className={`${styles.desc} report-node`}>
              <div className={styles.descTitle}>维修记录</div>
              <div className={styles.descContent}>
                {repairReport?.diagnosis}
              </div>
              <div className={styles.fee}>
                <Row>
                  <Col
                    span={4}
                    className={`${styles.cell} ${styles.cellLabel}`}
                  >
                    维修费用
                  </Col>
                  <Col
                    span={20}
                    className={styles.cell}
                    style={{ textAlign: 'right' }}
                  >
                    {repairReport?.fee}
                  </Col>
                </Row>
              </div>
            </div>
          </>
        )}

        {parts && parts.length ? (
          <div className={`${styles.appendix} report-node`}>
            <h6>附录</h6>
            <Parts parts={parts as IRepairReport['repairPartList']} />
          </div>
        ) : null}

        {task?.reason2 != '' && (
          <div style={{ padding: '0 20px' }}>
            <span className={styles.resonLable}>审核意见：</span>
            <span className={styles.resonValue}>{task?.reason2}</span>
          </div>
        )}
        <div className={styles.checkerName}>
          科室签名：{task?.checkerName ?? '_________'}
        </div>
      </div>
    </div>
  );
};

export default RepairReport;
