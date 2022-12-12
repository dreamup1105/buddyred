import { useState, useCallback, useRef, useEffect } from 'react';
import { buildTree, walkDepartmentsToTrees } from '@/utils/utils';
import { fetchDepartments } from '@/pages/Department/service';
import { fetchAuthorizedDepartments } from '@/pages/Internal-Authority/service';
import useGlobalAuthorities from '@/hooks/useGlobalAuthorities';
import type { DepartmentTreeNode } from '@/pages/Employee/type';
import type { EquipmentTagItem, DepartmentItem } from '@/pages/Assets/type';
import useUserInfo from './useUserInfo';

/**
 * 获取部门选项
 * @param params
 * @param immediate 是否立即调用一次请求
 * @param isAuthorized 想要获取的是否是跨科授权的部门
 * @param rootOnly
 * @returns
 */
export default function useDepartments(
  params: {
    orgId?: number;
    employeeId?: number;
  },
  immediate?: boolean,
  isAuthorized?: boolean,
  rootOnly?: boolean,
) {
  const { currentUser } = useUserInfo();
  const globalAuthorities = useGlobalAuthorities();
  const isIncludeGlobalAuthorities = globalAuthorities.includes('ALL'); // 是否包含全局权限
  const hasImmediateRequested = useRef(false); // 是否已经立即执行过一次请求
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<
    { label: string; value: number; key: any }[]
  >([]);
  const [departmentsTreeData, setDepartmentsTreeData] = useState<
    DepartmentTreeNode[]
  >([]);
  const [departmentsMap, setDepartmentsMap] = useState<
    Map<number, DepartmentItem>
  >();

  // 获取部门
  const loadDepartments = useCallback(async () => {
    try {
      let data = [];

      if (params.orgId || isIncludeGlobalAuthorities) {
        const res = await fetchDepartments(
          {
            orgId: isIncludeGlobalAuthorities
              ? currentUser?.currentCustomer
                ? currentUser?.currentCustomer?.siteOrgId
                : currentUser?.org.id
              : params.orgId,
          },
          !!rootOnly,
        );
        if (res.code === 0) {
          data = res.data;
        }
      } else if (params.employeeId) {
        if (isAuthorized) {
          const res = await fetchAuthorizedDepartments(params.employeeId);
          if (res.code === 0) {
            data = res.data;
          }
        }
      }

      const formatData: any = [];
      const options: any = [];
      const newDepartmentsMap = new Map();
      data.forEach((d: EquipmentTagItem | { value: string; key: number }) => {
        if (isAuthorized && !isIncludeGlobalAuthorities) {
          const item = d as { value: string; key: number };
          formatData.push({
            ...item,
            value: item.key,
            title: item.value,
          });
          options.push({
            label: item.value,
            value: item.key,
            key: item.key,
          });
          newDepartmentsMap.set(item.key, item);
        } else {
          const item = d as EquipmentTagItem;
          formatData.push({
            ...item,
            value: item.id,
            title: item.name,
          });
          options.push({
            label: item.name,
            value: item.id,
            key: item.id,
          });
          newDepartmentsMap.set(item.id, item);
        }
      });

      setDepartmentOptions(options);
      setDepartmentsMap(newDepartmentsMap);
      setDepartments(buildTree(formatData, null, 'parentDepartmentId'));
      setDepartmentsTreeData(
        walkDepartmentsToTrees(buildTree(data, null, 'parentDepartmentId')),
      );
    } catch (error) {
      console.error(error);
    }
  }, [params, isAuthorized]);

  useEffect(() => {
    if (immediate && !hasImmediateRequested.current) {
      loadDepartments();
      hasImmediateRequested.current = true;
    }
  }, [params, immediate]);

  return {
    loadDepartments,
    departments,
    departmentsMap,
    departmentsTreeData,
    departmentOptions,
  };
}
