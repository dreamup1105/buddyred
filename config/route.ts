import demoRoutes from './demoRoute';

export default [
  // 登录
  {
    path: '/login',
    name: 'login', 
    component: './User/Login',
    title: '登录',
    layout: false,
    hideInMenu: true,
  },
  // 找回密码
  {
    path: '/login/find-password',
    name: 'find-password',
    component: './User/Login/FindPassword/index.tsx',
    title: '找回密码',
    layout: false,
    hideInMenu: true
  },
  // 数据大屏
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'icondashboard',
    component: './Dashboard/index.tsx',
    layout: false,
    title: '数据大屏',
    // hideInMenu: true,
  },
  // 首页
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'iconhuanying',
    component: './Welcome/index',
    title: '医修库',
  },
  // 机构管理
  {
    path: '/organization',
    name: 'organization',
    icon: 'iconjigouguanli',
    component: './Organization/index',
    title: '机构管理',
  },
  // 组织架构
  {
    path: '/organization-structure',
    name: 'organization-structure',
    icon: 'iconzuzhijiagou',
    component: './Department/index',
    title: '部门管理',
  },
  // 人力资源
  {
    path: '/human-resources',
    name: 'human-resources',
    icon: 'iconrenliziyuan',
    component: './Employee/index',
    title: '人力资源',
  },
  // 设备维保
  {
    path: '/equipment',
    name: 'equipment',
    icon: 'iconshebeiweibao',
    component: './Assets/index',
    title: '设备维保',
  },
  // 会议
  {
    path: '/meeting',
    name: 'meeting',
    icon: 'iconxitongguanli',
    routes: [
      // 所有会议
      {
        name: 'all-meeting',
        path: '/meeting/all-meeting',
        component: './Meetings/All/index',
      },
      // 会议记录
      {
        path: '/meeting/meeting-history',
        name: 'meeting-history',
        icon: 'iconzuzhijiagou',
        component: './Meetings/History/index',
      },
      // Room
      {
        path: '/meeting/meeting-room',
        name: 'meeting-room',
        icon: 'iconzuzhijiagou',
        component: './Meetings/Room/index',
      },
      // Schedule
      {
        path: '/meeting/meeting-schedule',
        name: 'meeting-schedule',
        icon: 'iconzuzhijiagou',
        component: './Meetings/Schedule/index',
      },
    ],
  },
  {
    path: '/assets',
    name: 'assets',
    icon: 'icongudingzichan',
    title: '固定资产管理',
    routes: [
      // 固定资产
      {
        name: 'assets',
        path: '/assets/assets',
        component: './Assets/index',
        exact: true,
        title: '固定资产',
      },
      {
        name: 'assets-detail',
        path: '/assets/assets/detail',
        component: './Assets/Detail',
        hideInMenu: true,
        exact: true,
        title: '设备详情',
      },
      // 人员设置
      {
        name: 'internal-authority',
        path: '/assets/internal-authority',
        component: './Internal-Authority/index',
        title: '内部授权',
      },
      {
        name: 'assets-department',
        path: '/assets/department',
        component: './Assets/Department',
        title: '设备分类',
      },
      // 设备转借
      {
        name: 'lending',
        path: '/assets/lending',
        component: './Assets/Lending/index',
        title: '设备转借',
      },
      // 设备分布图
      {
        name: 'distribution',
        path: '/assets/chart/distribution',
        component: './Assets/Chart/Distribution/index',
        title: '设备分布图',
      },
      // 设备分类统计图
      {
        name: 'type',
        path: '/assets/chart/type',
        component: './Assets/Chart/Type/index',
        title: '设备分类统计图',
      },
      // 维修分析图
      {
        name: 'repair',
        path: '/assets/chart/repair',
        component: './Assets/Chart/Repair/index',
        title: '维修分析图',
      },
      // 保养分析图
      {
        name: 'maintenance',
        path: '/assets/chart/maintenance',
        component: './Assets/Chart/Maintenance/index',
        title: '保养分析图',
      },
      // 设备故障统计
      {
        name: 'falut-statistics',
        path: '/assets/falut-statistics',
        component: './Assets/FalutStatistics/index',
        title: '设备故障统计',
      },
      // 效益分析
      {
        name: 'benefit-analysis',
        path: '/assets/benefit-analysis',
        component: './Assets/BenefitAnalysis/index',
        title: '效益分析',
      },
      // 计量器具台帐
      {
        name: 'measuring-account',
        path: '/assets/measuring-account',
        component: './Assets/MeasuringAccount/index',
        title: '计量器具台帐',
      },
    ],
  },
  // 系统管理
  {
    path: '/system',
    name: 'system',
    icon: 'iconxitongguanli',
    title: '系统管理',
    routes: [
      // 设置
      {
        name: 'setup',
        path: '/system/setup',
        component: './System/Setup',
        title: '设置',
      },
    ],
  },
  // 字典管理
  {
    path: '/dictionary',
    name: 'dictionary',
    icon: 'iconzidianguanli',
    title: '字典管理',
    routes: [
      // 设备类型字典
      {
        name: 'type',
        path: '/dictionary/type',
        component: './Dictionary/Type',
      },
      // 配件字典
      {
        name: 'accessories',
        path: '/dictionary/accessories',
        component: './Dictionary/Accessories',
      },
      // 设备字典
      {
        name: 'equipment',
        path: '/dictionary/equipment',
        component: './Dictionary/Accessories',
      },
      // 保养项目
      {
        name: 'maintenance-item',
        path: '/dictionary/maintenance/item',
        component: './Dictionary/Maintenance/Item/index',
      },
      // 保养模板
      {
        name: 'maintenance-template',
        path: '/dictionary/maintenance/template',
        component: './Dictionary/Maintenance/Template/index',
      },
      // 模板编辑
      {
        path: '/dictionary/maintenance/template/:action',
        name: 'maintenance-template-edit',
        component: './Dictionary/Maintenance/Editor/index',
        layout: false,
        hideInMenu: true
      },
    ],
  },
  // 客户管理（维修公司）
  {
    path: '/customer',
    name: 'customer',
    icon: 'iconqianyueguanli',
    routes: [
      // 申请
      {
        path: '/customer/signature/apply',
        name: 'signature-apply',
        component: './Signature/Apply/index',
      },
      // 工程师分组
      {
        path: '/customer/organization-team',
        name: 'organization-team',
        component: './Team/index',
      },
    ],
  },
  // 合同管理（医院）
  {
    path: '/signature/approve',
    name: 'signature-approve',
    icon: 'iconhetongguanli',
    component: './Signature/Approve/index',
  },
  // 用户管理
  {
    path: '/user',
    name: 'user',
    icon: 'iconyonghuguanli1',
    routes: [
      // 角色
      {
        name: 'role',
        path: '/user/role',
        component: './User/Role/index',
      }
    ],
  },
  // 保养管理
  {
    path: '/maintenance',
    name: 'maintenance',
    icon: 'iconbaoyangguanli',
    component: './Maintenance/index',
  },
  // 巡检管理
  {
    path: '/inspection',
    name: 'inspection',
    icon: 'iconxunjianguanli',
    routes: [
      // 日巡检
      {
        path: '/inspection/daily',
        name: 'inspection-daily',
        component: './Inspection/Daily/index',
      },
      // 待验收
      {
        path: '/inspection/pending',
        name: 'inspection-pending',
        component: './Inspection/Pending/index',
      },
      // 巡检记录
      {
        path: '/inspection/record',
        name: 'inspection-record',
        component: './Inspection/Record/index',
      },
      // 科室巡检统计
      {
        path: '/inspection/departmentStatistics',
        name: 'inspection-department-statistics',
        component: './Inspection/Department-Statistics/index',
      },
      // 定制巡检
      {
        path: '/inspection/customMode',
        name: 'inspection-custom-made',
        component: './Inspection/Custom-Made/index',
      },
      // 定制巡检记录
      {
        path: '/inspection/customModeRecord',
        name: 'inspection-custom-made-record',
        component: './Inspection/Custom-Made-Record/index',
      }
    ]
  },
  // 异常
  {
    name: 'exception',
    path: '/exception',
    hideInMenu: true,
    routes: [
      {
        path: '/',
        redirect: '/exception/403',
      },
      {
        name: '403',
        path: '/exception/403',
        component: './Exception/403/index',
      }
    ],
  },
  // 维修工单补单
  {
    path: '/repair',
    name: 'repair',
    icon: 'iconweixiugongdan',
    routes: [
      // 医院端补单模块
      {
        path: '/repair/record',
        name: 'repair-record',
        component: './Repair/Record/index',
      },
      // 工程师（维修机构端）补单模块
      {
        path: '/repair/myrecord',
        name: 'repair-myrecord',
        component: './Repair/MyRecord/index',
      },
      // 维修管理
      {
        path: '/repair/management',
        name: 'repair-management',
        icon: 'iconweixiuguanli',
        component: './Repair/Management/index'
      }
    ],
  },
  // 系统管理
  {
    path: '/configuration',
    name: 'configuration',
    icon: 'iconxitongguanli',
    routes: [
      // 设置
      {
        name: 'setup',
        path: '/configuration/setup',
        component: './System/Setup',
      },
      // 部门管理
      {
        path: '/configuration/organization-structure',
        name: 'organization-structure',
        icon: 'iconzuzhijiagou',
        component: './Department/index',
      },
      // 人力资源
      {
        path: '/configuration/human-resources',
        name: 'human-resources',
        icon: 'iconrenliziyuan',
        component: './Employee/index',
      },
      // 角色
      {
        name: 'role',
        path: '/configuration/role',
        component: './User/Role/index',
      },
      // 设备类型字典
      {
        name: 'dictionary-type',
        path: '/configuration/dictionary/type',
        component: './Dictionary/Type',
      }
    ],
  },
  // 消息通知
  {
    path: '/message',
    name: 'message',
    icon: 'iconxiaoxitongzhi',
    routes: [
      // 消息通知模板
      {
        path: '/message/template',
        name: 'message-template',
        icon: 'iconxiaoximoban',
        component: './Message/MetaList/index',
      },
      // 已发送消息列表
      {
        path: '/message/sent',
        name: 'message-sent',
        icon: 'iconyifasongxiaoxi',
        component: './Message/SentMessage/index',
      },
      // 消息列表（用户）
      {
        path: '/message/user',
        name: 'message-user',
        icon: 'iconyifasongxiaoxi',
        component: './Message/User/index',
      },
      // 消息详情（用户）
      {
        path: '/message/detail/:id',
        name: 'message-detail',
        component: './Message/User/Detail/index'
      }
    ]
  },
  {
    path: '/account',
    name: 'account',
    icon: 'iconzhanghu',
    routes: [
      {
        path: '/account/settings',
        name: 'settings',
        icon: 'icongerenshezhi',
        component: './Account/Settings/index',
      }
    ]
  },
  // 客户管理
  {
    path: '/crm',
    name: 'crm',
    icon: 'iconkehuguanli',
    routes: [
      // 医院客户
      {
        path: '/crm/customer',
        name: 'crm-customer',
        icon: 'icongerenshezhi',
        component: './Crm/Customer/index',
      },
      // 客户详情
      {
        path: '/crm/customer/detail',
        name: 'crm-customer-detail',
        icon: 'icongerenshezhi',
        component: './Crm/Customer/Detail/index',
      },
      // 签约管理
      {
        path: '/crm/sign',
        name: 'crm-sign',
        icon: 'icongerenshezhi',
        component: './Crm/Sign/index',
      },
      {
        path: '/crm/sign/:action',
        name: 'crm-sign-create',
        icon: 'icongerenshezhi',
        component: './Crm/Sign/CreateSign/index',
      },
      // {
      //   path: '/crm/sign/copy',
      //   name: 'crm-sign-copy',
      //   icon: 'icongerenshezhi',
      //   component: './Crm/Sign/CreateSign/index',
      // },
      // {
      //   path: '/crm/sign/edit',
      //   name: 'crm-sign-edit',
      //   icon: 'icongerenshezhi',
      //   component: './Crm/Sign/CreateSign/index',
      // }
    ]
  },
  // 能耗管理
  {
    path: '/energy',
    name: 'energy',
    icon: 'iconnenghaoguanli',
    routes: [
      {
        // 耗电
        path: '/energy/power-consumption',
        name: 'energy-power-consumption',
        component: './Energy/Power-Consumption/index',
      },
      {
        // 瞬时电压电流
        path: '/energy/instant',
        name: 'energy-instant',
        component: './Energy/Instant/index',
      },
      {
        // 科室耗电统计
        path: '/energy/department',
        name: 'energy-department',
        component: './Energy/Department/index',
      },
      {
         // 单台耗电统计
         path: '/energy/equipment',
         name: 'energy-equipment',
         component: './Energy/Equipment/index',
      }
    ]
  },
  {
    //不良事件
    path: '/adverse-event',
    name: 'adverse-event',
    icon: 'iconbuliangshijian',
    component: './Adverse-Event',
  },
  {
    //报废管理
    path: '/scarp',
    name: 'scarp',
    icon: 'iconnenghaoguanli',
    routes: [
      {
         // 报废单
         path: '/scarp/sheet',
         name: 'scarp-sheet',
         component: './Scarp/Sheet/index',
      },
      {
         // 报废设备
         path: '/scarp/equipment',
         name: 'scarp-equipment',
         component: './Scarp/Equipment/index',
      }
    ]
  },
  {
    //申购管理
    path: '/subscription',
    name: 'subscription',
    icon: 'iconnenghaoguanli',
    routes: [
      {
         // 设备申购
         path: '/subscription/subscription-equipment',
         name: 'subscription-equipment',
         component: './Subscription/Subscription-Equipment/index',
      }
    ]
  },
  {
    //工程师管理
    path: '/engineer',
    name: 'engineer',
    icon: 'iconnenghaoguanli',
    routes: [
      {
         // 工作状态
         path: '/engineer/working-condition',
         name: 'working-condition',
         component: './Engineer/Working-Condition/index',
      },
      {
         // 工作记录
         path: '/engineer/record-working',
         name: 'record-working',
         component: './Engineer/Record-Working/index',
      },
      {
         // 维修记录
         path: '/engineer/record-repair',
         name: 'record-repair',
         component: './Engineer/Record-Repair/index',
      },
      {
         // 保养记录
         path: '/engineer/record-maintain',
         name: 'record-maintain',
         component: './Engineer/Record-Maintain/index',
      },
      {
         // 巡检记录
         path: '/engineer/record-inspection',
         name: 'record-inspection',
         component: './Engineer/Record-Inspection/index',
      },
    ]
  },
  {
    //签约设备统计
    path: '/equipment-statistics',
    name: 'equipment-statistics',
    icon: 'iconnenghaoguanli',
    routes: [
      {
         // 签约统计
         path: '/equipment-statistics/statistics',
         name: 'equipment-statistics-statistics',
         component: './Equipment-Statistics/Statistics/index',
      },
      {
         // 签约设备
         path: '/equipment-statistics/equipment',
         name: 'equipment-statistics-equipment',
         component: './Equipment-Statistics/Equipment/index',
      }
    ]
  },
  {
    //效率统计
    path: '/efficiency-statistics',
    name: 'efficiency-statistics',
    icon: 'iconnenghaoguanli',
    routes: [
      {
         // 开机率统计
         path: '/efficiency-statistics/starting-up',
         name: 'efficiency-statistics-starting-up',
         component: './Efficiency-Statistics/Starting-Up/index',
      },
      {
         // 维修完成率统计
         path: '/efficiency-statistics/repair-finish',
         name: 'efficiency-statistics-repair-finish',
         component: './Efficiency-Statistics/Repair-Finish/index',
      }
    ]
  },
  {
    //设备检测
    path: '/check',
    name: 'check',
    icon: 'iconnenghaoguanli',
    routes: [
      {
         // 设备检测
         path: '/check/equipment-check',
         name: 'check-equipment-check',
         component: './Check/Equipment-Check/index',
      },
      {
         // 防伪信息
         path: '/check/anti-fake',
         name: 'check-anti-fake',
         component: './Check/Anti-Fake/index',
      },
      {
         // 检测工具
         path: '/check/tool',
         name: 'check-tool',
         component: './Check/Tool/index',
      }
    ]
  },
  ...demoRoutes,
  {
    component: './404',
  },
];
