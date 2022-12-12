import React, { useState } from 'react';
import useMount from '@/hooks/useMount';
import useUserInfo from '@/hooks/useUserInfo';
import useACL from '@/hooks/useACL';
import { fetchTaskCountByStatus as fetchRepairTaskCountByStatus } from '@/pages/Repair/Management/service';
import type { CardType } from '../type';
import { MenuType, OrderStatus, PageType, RepairMenuType } from '../type';
import { fetchTaskCountByStatus as fetchMaintainTaskCountByStatus } from '../service';

export default function useMenuCards(orgId: number, pageType: PageType) {
  const { currentUser } = useUserInfo();
  const { isACL } = useACL();
  const isMaintainer = !!currentUser?.isMaintainer; // 是否为工程师
  const [cards, setCards] = useState<CardType[][]>();

  const loadTasksCount = async () => {
    try {
      const service =
        pageType === PageType.MAINTENANCE
          ? fetchMaintainTaskCountByStatus
          : fetchRepairTaskCountByStatus;

      const formData: any = {};

      if (isACL && isMaintainer) {
        formData.crId = currentUser?.currentCustomer?.id
          ? [currentUser.currentCustomer.id]
          : [];
      } else {
        formData.orgId = [orgId];
      }

      const { data = [] } = await service(formData, isACL);
      const statusMap = new Map(data.map((item) => [item.groupValue, item]));

      switch (pageType) {
        case PageType.MAINTENANCE: // 保养管理
          setCards([
            [
              {
                menu: MenuType.Initial_Maintenance,
                title: '发起保养',
                icon: 'iconfaqibaoyang',
                enTitle: (
                  <>
                    <p>Initiate</p>
                    <p>Maintenance</p>
                  </>
                ),
                bgColor: '#60CAEF',
              },
              {
                menu: MenuType.To_Be_Responded,
                title: '待响应',
                icon: 'icondaixiangying',
                count: statusMap.get(OrderStatus.INIT)?.count ?? 0,
                enTitle: (
                  <>
                    <p>To be</p>
                    <p>Responded</p>
                  </>
                ),
                bgColor: '#29ABE2',
                status: OrderStatus.INIT,
              },
              {
                menu: MenuType.To_Be_Maintained,
                title: '待保养',
                icon: 'icondaibaoyang',
                count: statusMap.get(OrderStatus.ASSIGNED)?.count ?? 0,
                enTitle: (
                  <>
                    <p>To be</p>
                    <p>Maintained</p>
                  </>
                ),
                bgColor: '#2892C4',
                status: OrderStatus.ASSIGNED,
              },
              {
                menu: MenuType.In_The_Maintenance,
                title: '保养中',
                icon: 'iconbaoyangzhong',
                count: statusMap.get(OrderStatus.DOING)?.count ?? 0,
                enTitle: (
                  <>
                    <p>In The</p>
                    <p>Maintenance</p>
                  </>
                ),
                bgColor: '#0071BC',
                status: OrderStatus.DOING,
              },
              {
                menu: MenuType.Transfer_Order,
                title: '转单中',
                icon: 'iconbaoyangzhong',
                count: statusMap.get(OrderStatus.TRANSFER)?.count ?? 0,
                enTitle: (
                  <>
                    <p>Transfer</p>
                    <p>Order</p>
                  </>
                ),
                bgColor: '#4398d1',
                status: OrderStatus.TRANSFER,
              },
              {
                menu: MenuType.Waiting_For_Acceptance,
                title: '待验收',
                icon: 'icondaiyanshou',
                count: statusMap.get(OrderStatus.PENDING)?.count ?? 0,
                enTitle: (
                  <>
                    <p>Waiting For</p>
                    <p>Acceptance</p>
                  </>
                ),
                bgColor: '#59B9C7',
                status: OrderStatus.PENDING,
              },
              {
                menu: MenuType.Acceptance_Completed,
                title: '已验收',
                icon: 'iconyiwancheng',
                count: statusMap.get(OrderStatus.FIXED)?.count ?? 0,
                enTitle: (
                  <>
                    <p>Acceptance</p>
                    <p>Completed</p>
                  </>
                ),
                bgColor: '#068E91',
                status: OrderStatus.FIXED,
              },
            ],
            // [
            //   {
            //     menu: MenuType.Maintenance_Add_Order,
            //     title: '保养补单',
            //     icon: 'iconbaoyangbudan',
            //     enTitle: (
            //       <>
            //         <p>Maintenance</p>
            //         <p>Add Order</p>
            //       </>
            //     ),
            //     bgColor: '#967C95',
            //     arrow: false,
            //   },
            //   {
            //     menu: MenuType.Maintenance_Plan,
            //     title: '保养计划',
            //     icon: 'iconbaoyangjihua',
            //     enTitle: (
            //       <>
            //         <p>Maintenance</p>
            //         <p>Plan</p>
            //       </>
            //     ),
            //     bgColor: '#BC9F88',
            //     arrow: false,
            //   },
            //   {
            //     menu: MenuType.Association_Settings,
            //     title: '关联设置',
            //     icon: 'iconguanlianshezhi',
            //     enTitle: (
            //       <>
            //         <p>Association</p>
            //         <p>Settings</p>
            //       </>
            //     ),
            //     bgColor: '#6E95A3',
            //     arrow: false,
            //   },
            // ],
          ]);
          break;
        case PageType.REPAIR: // 维修管理
          if (isMaintainer) {
            setCards([
              [
                {
                  menu: RepairMenuType.To_Be_Responded,
                  title: '待维修',
                  icon: 'icondaixiangying',
                  count:
                    (statusMap.get(OrderStatus.INIT)?.count ?? 0) +
                    (statusMap.get(OrderStatus.ASSIGNED)?.count ?? 0),
                  enTitle: (
                    <>
                      <p>To be</p>
                      <p>Responded</p>
                    </>
                  ),
                  bgColor: '#60CAEF',
                },
                {
                  menu: RepairMenuType.In_The_Repair,
                  title: '维修中',
                  icon: 'iconweixiuzhong',
                  count: statusMap.get(OrderStatus.DOING)?.count ?? 0,
                  enTitle: (
                    <>
                      <p>In The</p>
                      <p>Repair</p>
                    </>
                  ),
                  bgColor: '#0071BC',
                  status: OrderStatus.DOING,
                },
                {
                  menu: RepairMenuType.Transfer_Order,
                  title: '转单中',
                  icon: 'iconbaoyangzhong',
                  count: statusMap.get(OrderStatus.TRANSFER)?.count ?? 0,
                  enTitle: (
                    <>
                      <p>Transfer</p>
                      <p>Order</p>
                    </>
                  ),
                  bgColor: '#4398d1',
                  status: OrderStatus.TRANSFER,
                },
                {
                  menu: RepairMenuType.Waiting_For_Acceptance,
                  title: '待验收',
                  icon: 'icondaiyanshou',
                  count:
                    (statusMap.get(OrderStatus.PENDING)?.count ?? 0) +
                    (statusMap.get(OrderStatus.PENDING_RECORD)?.count ?? 0),
                  enTitle: (
                    <>
                      <p>Waiting For</p>
                      <p>Acceptance</p>
                    </>
                  ),
                  bgColor: '#2892C4',
                  status: OrderStatus.PENDING,
                },
                {
                  menu: RepairMenuType.Acceptance_Completed,
                  title: '已验收',
                  icon: 'iconyiwancheng',
                  count: statusMap.get(OrderStatus.FIXED)?.count ?? 0,
                  enTitle: (
                    <>
                      <p>Acceptance</p>
                      <p>Completed</p>
                    </>
                  ),
                  bgColor: '#068E91',
                  status: OrderStatus.FIXED,
                  arrow: false,
                },
                {
                  menu: RepairMenuType.Repair_Report,
                  title: '维修报告',
                  icon: 'iconweixiubaogao',
                  count:
                    (statusMap.get(OrderStatus.FIXED)?.count ?? 0) +
                    (statusMap.get(OrderStatus.PENDING)?.count ?? 0) +
                    (statusMap.get(OrderStatus.PENDING_RECORD)?.count ?? 0),
                  enTitle: (
                    <>
                      <p>Repair</p>
                      <p>Report</p>
                    </>
                  ),
                  bgColor: '#068E91',
                  status: OrderStatus.FIXED,
                  arrow: false,
                },
              ],
            ]);
          } else {
            setCards([
              [
                {
                  menu: RepairMenuType.Report_For_Repair,
                  title: '报修',
                  icon: 'iconbaoxiu',
                  enTitle: (
                    <>
                      <p>Report</p>
                      <p>For Repair</p>
                    </>
                  ),
                  bgColor: '#60CAEF',
                },
                {
                  menu: RepairMenuType.Reported_For_Repair,
                  title: '已报修',
                  icon: 'iconyibaoxiu',
                  count:
                    (statusMap.get(OrderStatus.ASSIGNED)?.count ?? 0) +
                    (statusMap.get(OrderStatus.INIT)?.count ?? 0),
                  enTitle: (
                    <>
                      <p>Reported</p>
                      <p>For Repair</p>
                    </>
                  ),
                  bgColor: '#29ABE2',
                  status: OrderStatus.INIT,
                },
                {
                  menu: RepairMenuType.In_The_Repair,
                  title: '维修中',
                  icon: 'iconweixiuzhong',
                  count: statusMap.get(OrderStatus.DOING)?.count ?? 0,
                  enTitle: (
                    <>
                      <p>In The</p>
                      <p>Repair</p>
                    </>
                  ),
                  bgColor: '#29ABE2',
                  status: OrderStatus.DOING,
                },
                {
                  menu: RepairMenuType.Transfer_Order,
                  title: '转单中',
                  icon: 'iconbaoyangzhong',
                  count: statusMap.get(OrderStatus.TRANSFER)?.count ?? 0,
                  enTitle: (
                    <>
                      <p>Transfer</p>
                      <p>Order</p>
                    </>
                  ),
                  bgColor: '#4398d1',
                  status: OrderStatus.TRANSFER,
                },
                {
                  menu: RepairMenuType.Waiting_For_Acceptance,
                  title: '待验收',
                  icon: 'icondaiyanshou',
                  count:
                    (statusMap.get(OrderStatus.PENDING)?.count ?? 0) +
                    (statusMap.get(OrderStatus.PENDING_RECORD)?.count ?? 0),
                  enTitle: (
                    <>
                      <p>Waiting For</p>
                      <p>Acceptance</p>
                    </>
                  ),
                  bgColor: '#2892C4',
                  status: OrderStatus.PENDING,
                },
                {
                  menu: RepairMenuType.Acceptance_Completed,
                  title: '已验收',
                  icon: 'iconyiwancheng',
                  count: statusMap.get(OrderStatus.FIXED)?.count ?? 0,
                  enTitle: (
                    <>
                      <p>Acceptance</p>
                      <p>Completed</p>
                    </>
                  ),
                  bgColor: '#068E91',
                  status: OrderStatus.FIXED,
                },
              ],
              // [
              //   {
              //     menu: RepairMenuType.Repair_Supplement,
              //     title: '补单',
              //     icon: 'iconweixiubudan',
              //     enTitle: (
              //       <>
              //         <p>Repair</p>
              //         <p>Supplement</p>
              //       </>
              //     ),
              //     bgColor: '#967C95',
              //     arrow: false,
              //   },
              // ],
            ]);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useMount(() => {
    loadTasksCount();
  });

  return {
    cards,
  };
}
