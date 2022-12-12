import React from 'react';
import { Breadcrumb } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { LeftOutlined } from '@ant-design/icons';
import { useLocation, history, Link } from 'umi';
import InitRepair from '@/pages/Repair/Management/components/InitRepair';
import RepairStatus from '@/pages/Repair/Management/components/Status';
import Home from './components/Home';
import InitMaintenance from './components/InitMaintenance';
import Status from './components/Status';
import {
  MenuType,
  MenuTextType,
  PageType,
  RepairMenuType,
  RepairMenuTextType,
} from './type';

interface IPageProps {
  pageType?: PageType;
}

const BreadcrumbMap = new Map([
  [
    PageType.MAINTENANCE,
    {
      subRootTitle: '保养管理',
      subRootHref: '/maintenance',
      menuTextType: MenuTextType,
    },
  ],
  [
    PageType.REPAIR,
    {
      subRootTitle: '维修管理',
      subRootHref: '/repair/management',
      menuTextType: RepairMenuTextType,
    },
  ],
]);

const MaintenancePage: React.FC<IPageProps> = ({
  pageType = PageType.MAINTENANCE,
}) => {
  const { query } = useLocation() as any;
  const currentConfig = BreadcrumbMap.get(pageType);

  const renderContent = () => {
    switch (pageType) {
      case PageType.MAINTENANCE:
        switch (query.menu as MenuType) {
          case MenuType.Initial_Maintenance: // 发起保养
            return <InitMaintenance />;
          case MenuType.To_Be_Responded: // 待响应
          case MenuType.To_Be_Maintained: // 待保养
          case MenuType.In_The_Maintenance: // 保养中
          case MenuType.Transfer_Order: // 转单中
          case MenuType.Waiting_For_Acceptance: // 待验收
          case MenuType.Acceptance_Completed: // 已验收
            return <Status menuType={query.menu} />;
          default:
            return <Home pageType={pageType} />;
        }
      case PageType.REPAIR:
        switch (query.menu as RepairMenuType) {
          case RepairMenuType.Report_For_Repair: // 报修
            return <InitRepair />;
          case RepairMenuType.To_Be_Responded: // 待响应
          case RepairMenuType.Reported_For_Repair: // 已报修
          case RepairMenuType.Waiting_For_Acceptance: // 待验收
          case RepairMenuType.Acceptance_Completed: // 已验收
          case RepairMenuType.In_The_Repair: // 维修中
          case RepairMenuType.Transfer_Order: // 转单中
          case RepairMenuType.Repair_Report: // 维修报告
            return <RepairStatus menuType={query.menu} />;
          default:
            return <Home pageType={pageType} />;
        }
      default:
        return null;
    }
  };

  const renderBreadcrumb = () => {
    return (
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href="/">首页</a>
        </Breadcrumb.Item>
        {query.menu === 'ALL' || !query.menu ? (
          <Breadcrumb.Item>{currentConfig?.subRootTitle}</Breadcrumb.Item>
        ) : (
          <>
            <Breadcrumb.Item>
              {currentConfig?.subRootHref ? (
                <Link to={currentConfig?.subRootHref ?? '/'}>
                  {currentConfig?.subRootTitle}
                </Link>
              ) : (
                currentConfig?.subRootTitle
              )}
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {currentConfig?.menuTextType[query.menu]}
            </Breadcrumb.Item>
          </>
        )}
      </Breadcrumb>
    );
  };

  const renderTitle = () => {
    if (query.menu === 'ALL' || !query.menu) {
      return currentConfig?.menuTextType[query.menu];
    }
    return (
      <>
        {currentConfig?.menuTextType[query.menu]}
        <div>
          <a
            onClick={() =>
              history.replace(
                pageType === PageType.MAINTENANCE
                  ? '/maintenance'
                  : '/repair/management',
              )
            }
            style={{ fontSize: '14px' }}
          >
            <LeftOutlined />
            返回
          </a>
        </div>
      </>
    );
  };

  return (
    <PageContainer
      header={{
        title: renderTitle(),
        breadcrumbRender: () => renderBreadcrumb(),
      }}
    >
      {renderContent()}
    </PageContainer>
  );
};

export default MaintenancePage;
