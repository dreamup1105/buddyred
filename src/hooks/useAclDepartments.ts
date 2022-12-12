import useUserInfo from './useUserInfo';
import useGlobalAuthorities from './useGlobalAuthorities';
import useDepartments from './useDepartments';

export default function useAclDepartments() {
  const { currentUser } = useUserInfo();
  const globalAuthorities = useGlobalAuthorities();
  const isIncludeGlobalAuthorities = globalAuthorities.includes('ALL');
  const { departmentOptions } = useDepartments(
    { employeeId: currentUser?.employee.id },
    true,
    true,
  ); // 跨科授权部门
  const primaryDepartment = currentUser?.primaryDepartment;
  const currentUserDepartment = primaryDepartment
    ? [
        {
          label: primaryDepartment?.name,
          value: primaryDepartment?.id,
          key: primaryDepartment?.id,
        },
      ]
    : []; // 自己所在部门
  const departmentSelectOptions = (
    isIncludeGlobalAuthorities
      ? [...departmentOptions]
      : [...currentUserDepartment, ...departmentOptions]
  ).map((item) => ({ ...item, value: item.label }));

  return departmentSelectOptions;
}
