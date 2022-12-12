import React, { forwardRef } from 'react';
import QRCode from 'qrcode.react';
import { genEquipmentQrCode } from '@/utils/utils';
import { ResourcePath } from '@/utils/constants';
import type { EquipmentDetailEx, labelItem } from '../type';
import { labelSelect } from '@/pages/Account/Settings/type';
import styles from '../index.less';

interface IComponentProps {
  initialDetail: EquipmentDetailEx | undefined;
  logo?: string;
  initLabelOption: labelItem[] | undefined;
}

export default forwardRef(({ initialDetail, logo, initLabelOption = labelSelect }: IComponentProps, ref: any) => {
  const customers = initialDetail?.crs ?? [];
  const line1option = initLabelOption.filter((item: labelItem) => item.line == 1);
  const line2option = initLabelOption.filter((item: labelItem) => item.line == 2);
  const tdDom = (item: labelItem, leftCol: number = 1, rightCol: number = 3) => {
    return (
      <>
        <td colSpan={leftCol} className={styles['table-label']}>{item.label}</td>
        <td colSpan={rightCol}>
          {
            item.value == 'crsAlias' 
            ? customers.length ? customers[0].alias : ''
            : item.value == 'repairPhone'
              ? customers.length ? customers[0].phone : ''
              : initialDetail?.equipment[`${item.value}`]
          }
        </td>
      </>
    )
  }

  return (
    <table ref={ref} className={`${styles.wrapTable} page-break`}>
      <tbody>
        <tr>
          <td colSpan={4} className={styles.tableTitle}>
            {logo && <img
              className={styles['hispital-logo']}
              src={`${ResourcePath}${logo}-100`}
            />}
              {initialDetail?.org.name}
          </td>
        </tr>
        <tr>
          <td colSpan={1} rowSpan={4} className={styles.erweima}>
            {initialDetail?.equipment.id && (
                <div className={styles.qrcodeWrapper}>
                <QRCode size={64} renderAs={'svg'} value={genEquipmentQrCode(initialDetail.equipment.id)} />
              </div>
            )}
          </td>
          <td className={`${styles['table-item1']} table-label`}>设备名称</td>
          <td className={styles['table-item1']} colSpan={2}>{initialDetail?.equipment.equipNameNew}</td>
        </tr>
        <tr>
          <td className={styles['table-label']}>设备型号</td>
          <td colSpan={2}>{initialDetail?.equipment.modelName}</td>
        </tr>
        <tr>
          <td className={styles['table-label']}>所属科室</td>
          <td colSpan={2}>{initialDetail?.equipment.departmentName}</td>
        </tr>
        <tr>
          <td className={styles['table-label']}>设备编号</td>
          <td colSpan={2}>{initialDetail?.equipment.equipmentNo}</td>
        </tr>
        {
          line2option.map((item: labelItem) => {
            return <tr key={item.value}>
              {tdDom(item, 1, 3)}
            </tr>
          })
        }
        {
          line1option.length == 1
          ? <tr> {tdDom(line1option[0], 1, 3)}</tr>
          : line1option.length == 2
            ? <tr>
                {tdDom(line1option[0], 1, 1)}
                {tdDom(line1option[1], 1, 1)}
              </tr>
            : line1option.length == 3
              ? <>
                  <tr>
                    {tdDom(line1option[0], 1, 3)}
                  </tr>
                  <tr>
                    {tdDom(line1option[1], 1, 1)}
                    {tdDom(line1option[2], 1, 1)}
                  </tr>
                </>
              : line1option.length == 4
                ? <>
                    <tr>
                      {tdDom(line1option[0], 1, 1)}
                      {tdDom(line1option[1], 1, 1)}
                    </tr>
                    <tr>
                      {tdDom(line1option[2], 1, 1)}
                      {tdDom(line1option[3], 1, 1)}
                    </tr>
                  </>
                : line1option.length == 5
                  ? <>
                      <tr>
                        {tdDom(line1option[0], 1, 3)}
                      </tr>
                      <tr>
                        {tdDom(line1option[1], 1, 1)}
                        {tdDom(line1option[2], 1, 1)}
                      </tr>
                      <tr>
                        {tdDom(line1option[3], 1, 1)}
                        {tdDom(line1option[4], 1, 1)}
                      </tr>
                    </>
                  : line1option.length == 6
                    ? <>
                      <tr>
                        {tdDom(line1option[0], 1, 1)}
                        {tdDom(line1option[1], 1, 1)}
                      </tr>
                      <tr>
                        {tdDom(line1option[2], 1, 1)}
                        {tdDom(line1option[3], 1, 1)}
                      </tr>
                      <tr>
                        {tdDom(line1option[4], 1, 1)}
                        {tdDom(line1option[5], 1, 1)}
                      </tr>
                    </>
                    :
                    <></>
        }
      </tbody>
    </table>

  )
});
