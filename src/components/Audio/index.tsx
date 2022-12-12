/**
 * 消息通知语音设置
 * 因为构建工具没有设置处理.mp3 文件，所以文件全部传到七牛云上，通过域名直接链接
 * 通过js构建一个audio标签，同时设置标签的长宽为0，做到隐藏audio的作用
 * @param
 * @returns
 */

export const audioMap = (extraData: any) => {
  const _metaKey = extraData.metaKey;
  let audioSrc = '';
  const audio = new Audio();
  audio.controls = true;
  audio.autoplay = true;
  audio.style.position = 'absolute';
  audio.style.width = '0px';
  audio.style.height = '0px';
  document.body.appendChild(audio);
  if (_metaKey == 'YXK-maintain-deny') {
    //保养中页面
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/maintainDeny.mp3';
  } else if (_metaKey == 'YXK-repair-start') {
    //维修中页面
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/repairStart.mp3';
  } else if (_metaKey == 'YXK-repair-accept') {
    //维修已审批页面
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/repairAccept.mp3';
  } else if (_metaKey == 'YXK-repair-assign') {
    //待维修页面
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/repairAssign.mp3';
  } else if (_metaKey == 'YXK-maintain-init') {
    //保养-待响应页面
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/maintainInit.mp3';
  } else if (_metaKey == 'YXK-maintain-accept') {
    //保养已审批页面
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/maintainAccept.mp3';
  } else if (_metaKey == 'YXK-maintain-submit') {
    //保养待验收页面
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/maintainSubmit.mp3';
  } else if (_metaKey == 'YXK-maintain-assign') {
    //待保养页面
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/maintainAssign.mp3';
  } else if (_metaKey == 'YXK-repair-init') {
    //维修-待响应页面
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/repairNew.mp3';
  } else if (_metaKey == 'YXK-repair-submit') {
    //维修待验收页面
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/repairSubmit.mp3';
  } else if (_metaKey == 'YXK-repair-deny') {
    //维修 不通过
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/repairDeny.mp3';
  } else if (_metaKey == 'YXK-repair-report-save') {
    //维修报告页面
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/repairReportSave.mp3';
  } else if (_metaKey == 'YXK-eq-lent-audit') {
    //设备转借单页面 - 审批
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/eqLentAudit.mp3';
  } else if (_metaKey == 'YXK-eq-lent-out-of-time') {
    //设备转借单页面 - 超时
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/eqLentOutOfTime.mp3';
  } else if (_metaKey == 'YXK-eq-lent-audit-pass') {
    //设备转借单页面 - 审批通过
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/eqLentAuditPass.mp3';
  } else if (_metaKey == 'YXK-eq-lent-audit-reject') {
    //设备转借单页面 - 审批不通过
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/eqLentAuditReject.mp3';
  } else if (_metaKey == 'YXK-maintain-revocation-order') {
    //转单撤销-按照taskType/taskStatus跳转到不同的维保页面
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/maintainRevocationOrder.mp3';
  } else if (_metaKey == 'YXK-maintain-refuse-order') {
    //转单拒绝-按照taskType/taskStatus跳转到不同的维保页面
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/maintainRefuseOrder.mp3';
  } else if (_metaKey == 'YXK-maintain-transfer-order') {
    //新增转单-根据taskType跳转到维修/保养的转单中页面
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/maintainTransferOrder.mp3';
  } else if (_metaKey == 'YXK-repair-out-time') {
    //保养超时-根据taskStatus跳转到不同阶段的保养页面
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/repairOutTime.mp3';
  } else if (_metaKey == 'YXK-maintain-out-time') {
    //维修单超时-根据taskStatus跳转到不同阶段的维修页面
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/maintainOutTime.mp3';
  } else if (_metaKey == 'YXK-repair-cancel') {
    // 发起的维修单已取消
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/repairCancel.mp3';
  } else if (_metaKey == 'YXK-maintain-cancel') {
    // 发起的保养单已取消
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/maintainCancel.mp3';
  } else {
    // 其他单据无语音 只提示叮
    audioSrc = 'https://yxkstudy.bjyixiu.com/audio/default.mp3';
  }
  audio.src = audioSrc;
  return audio;
};
