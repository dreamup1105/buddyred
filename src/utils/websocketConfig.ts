import { history } from 'umi';

// 根据metaKey跳转到对应的页面
// 有三种情况
// 第一种：直接跳转页面
// 第二种：不需要跳转页面 默认跳转到首页
// 第三种：需要根据条件判断 taskType/taskStatus
export const websocketLaunch = (extra: any) => {
  const _metaKey = extra.metaKey;
  const customers = localStorage.getItem('customers');
  const customersArr = customers == null ? [] : JSON.parse(customers);
  const selectCustomer = customersArr?.filter(
    (item: any) => item.siteOrgId == extra.hosId,
  );
  if (selectCustomer?.length > 0) {
    localStorage.setItem('currentCustomer', JSON.stringify(selectCustomer[0]));
  }

  if (_metaKey == 'YXK-maintain-deny') {
    //保养中页面
    history.push(`/maintenance?menu=In_The_Maintenance`);
  } else if (_metaKey == 'YXK-repair-start') {
    //维修中页面
    history.push(`/repair/management?menu=In_The_Repair`);
  } else if (_metaKey == 'YXK-repair-accept') {
    //维修已审批页面
    history.push(`/repair/management?menu=Acceptance_Completed`);
  } else if (_metaKey == 'YXK-repair-assign') {
    //待维修页面
    history.push(`/repair/management?menu=To_Be_Responded`);
  } else if (_metaKey == 'YXK-maintain-init') {
    //保养-待响应页面
    if (extra.taskStatus == 'ASSIGNED') {
      // 指定保养人时直接跳转到待保养页面
      history.push(`/maintenance?menu=To_Be_Maintained`);
    } else {
      history.push(`/maintenance?menu=To_Be_Responded`);
    }
  } else if (_metaKey == 'YXK-maintain-accept') {
    //保养已审批页面
    history.push(`/maintenance?menu=Acceptance_Completed`);
  } else if (_metaKey == 'YXK-maintain-submit') {
    //保养待验收页面
    history.push(`/maintenance?menu=Waiting_For_Acceptance`);
  } else if (_metaKey == 'YXK-maintain-assign') {
    //待保养页面
    history.push(`/maintenance?menu=To_Be_Maintained`);
  } else if (_metaKey == 'YXK-repair-init') {
    //维修-待响应页面
    history.push(`/repair/management?menu=To_Be_Responded`);
  } else if (_metaKey == 'YXK-repair-submit') {
    //维修待验收页面
    history.push(`/repair/management?menu=Waiting_For_Acceptance`);
  } else if (_metaKey == 'YXK-repair-deny') {
    //维修中页面
    history.push(`/repair/management?menu=In_The_Repair`);
  } else if (_metaKey == 'YXK-repair-report-save') {
    //维修报告页面
    history.push(`/repair/management?menu=Acceptance_Completed`);
  } else if (
    _metaKey == 'YXK-eq-lent-audit' ||
    _metaKey == 'YXK-eq-lent-out-of-time' ||
    _metaKey == 'YXK-eq-lent-audit-pass' ||
    _metaKey == 'YXK-eq-lent-audit-reject'
  ) {
    //设备转借单页面 - 审批 超时 审批通过 审批不通过
    history.push(`/assets/lending`);
  } else if (
    _metaKey == 'YXK-maintain-revocation-order' ||
    _metaKey == 'YXK-maintain-refuse-order'
  ) {
    //转单撤销-按照taskType/taskStatus跳转到不同的维保页面
    //转单拒绝-按照taskType/taskStatus跳转到不同的维保页面
    if (extra.taskType == 'REPAIR') {
      //维修单
      if (extra.taskStatus == 'ASSIGNED') {
        //待维修
        history.push(`/repair/management?menu=To_Be_Responded`);
      } else if (extra.taskStatus == 'DOING') {
        //维修中
        history.push(`/repair/management?menu=In_The_Repair`);
      }
    } else if (extra.taskType == 'MAINTAIN') {
      //保养单
      if (extra.taskStatus == 'ASSIGNED') {
        //待保养
        history.push(`/maintenance?menu=To_Be_Maintained`);
      } else if (extra.taskStatus == 'DOING') {
        //保养中
        history.push(`/maintenance?menu=In_The_Maintenance`);
      }
    }
  } else if (_metaKey == 'YXK-maintain-transfer-order') {
    //新增转单-根据taskType跳转到维修/保养的转单中页面
    if (extra.taskType == 'REPAIR') {
      // 维修-转单中
      history.push(`/repair/management?menu=Transfer_Order`);
    } else if (extra.taskType == 'MAINTAIN') {
      // 保养-转单中
      history.push(`/maintenance?menu=Transfer_Order`);
    }
  } else if (
    _metaKey == 'YXK-repair-out-time' ||
    _metaKey == 'YXK-maintain-out-time'
  ) {
    //保养超时-根据taskStatus跳转到不同阶段的保养页面
    //维修单超时-根据taskStatus跳转到不同阶段的维修页面
    if (extra.taskType == 'REPAIR') {
      //维修单
      if (extra.taskStatus == 'INIT') {
        //发起维修
        history.push(`/repair/management?menu=Reported_For_Repair`);
      } else if (extra.taskStatus == 'ASSIGNED') {
        //已指派
        history.push(`/repair/management?menu=Reported_For_Repair`);
      } else if (extra.taskStatus == 'DOING') {
        //维修中
        history.push(`/repair/management?menu=In_The_Repair`);
      } else if (extra.taskStatus == 'PENDING') {
        //等待验收
        history.push(`/repair/management?menu=Waiting_For_Acceptance`);
      } else if (extra.taskStatus == 'TRANSFER') {
        //转单中
        history.push(`/repair/management?menu=Transfer_Order`);
      }
    } else if (extra.taskType == 'MAINTAIN') {
      //保养单
      if (extra.taskStatus == 'INIT') {
        //发起保养
        history.push(`/maintenance?menu=To_Be_Responded`);
      } else if (extra.taskStatus == 'ASSIGNED') {
        //已指派
        history.push(`/maintenance?menu=To_Be_Maintained`);
      } else if (extra.taskStatus == 'DOING') {
        //保养中
        history.push(`/maintenance?menu=In_The_Maintenance`);
      } else if (extra.taskStatus == 'PENDING') {
        //等待验收
        history.push(`/maintenance?menu=Waiting_For_Acceptance`);
      } else if (extra.taskStatus == 'TRANSFER') {
        //转单中
        history.push(`/maintenance?menu=Transfer_Order`);
      }
    }
  } else if (
    _metaKey == 'YXK-repair-cancel' ||
    _metaKey == 'YXK-maintain-cancel'
  ) {
    //不需要跳转
  }
  window.location.reload();
};
