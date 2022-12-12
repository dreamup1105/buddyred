import type { 
  EquipmentDistributionItem, 
  TreeMapDataItem, 
  EquipmentDistributionTableItem,
  EquipmentTypeStatItem,
  PIEDataItem
} from './type';

export const DataTransformers = {
  /**
   * 将设备分布图原数据转换成echarts treemap支持的格式，具体格式参考 TreeMapDataItem
   * @param rawData 
   * @returns 
   */
  transformEquipmentDistuibutions(rawData: EquipmentDistributionItem[]): TreeMapDataItem[] {
    return rawData?.map(item => ({
      value: item.count,
      name: item.departmentName,
      path: item.departmentName,
      children: item.types?.map(typeItem => ({
        value: typeItem.count,
        name: typeItem.name,
        path: `${item.departmentName}/${typeItem.name}`,
        children: typeItem.subTypes?.map(subTypeItem => ({
          value: subTypeItem.count,
          name: subTypeItem.name,
          path: `${item.departmentName}/${typeItem.name}/${subTypeItem.name}`,
        })),
      }))
    })) ?? [];
  },

  /**
   * 将分布图数据以subTypes这一级为基本单元进行拍平，方便科室列(departmentName/departmentEquipmentCount)及类型列(typeName/typeCount)进行单元格的合并计算和展示
   * 拍平之前数据为类树形结构，拍平之后为一纬数组
   * 单元格合并用法参考 https://ant.design/components/table-cn/#components-table-demo-colspan-rowspan
   * @param rawData 
   * @returns 
   */
  flatEquipmentDistributionsForTable(rawData: EquipmentDistributionItem[]): EquipmentDistributionTableItem[] {
    const tableDataSource: EquipmentDistributionTableItem[] = [];
    const departmentRowMap = new Map<string, boolean>();
    const typeRowMap = new Map<string, boolean>();

    rawData?.forEach(item => {
      const departmentRowKey = item.departmentName;
      item.types.forEach(typeItem => {
        const typeRowKey = `${item.departmentName}/${typeItem.name}`;
        typeItem.subTypes.forEach(subTypeItem => {
          let departmentRowSpan: number;
          let typeRowSpan: number;
          if (departmentRowMap.has(departmentRowKey)) {
            departmentRowSpan = 0;
          } else {
            departmentRowSpan = item.types.reduce((acc: number, cur) => acc + cur.subTypes.length, 0);
            departmentRowMap.set(departmentRowKey, true);
          }

          if (typeRowMap.has(typeRowKey)) {
            typeRowSpan = 0;
          } else {
            typeRowSpan = typeItem.subTypes.length;
            typeRowMap.set(typeRowKey, true);
          }

          tableDataSource.push({
            departmentName: item.departmentName,
            departmentEquipmentCount: item.count,
            typeName: typeItem.name,
            typeCount: typeItem.count,
            subTypeName: subTypeItem.name,
            subTypeCount: subTypeItem.count,
            departmentRowSpan,
            typeRowSpan,
          });
        });
      });
    });

    return tableDataSource;
  },

  transformDataToPIEChart(rawData: EquipmentTypeStatItem[]) {
    const innerPIEData: PIEDataItem[] = [];
    const outerPIEData: PIEDataItem[] = [];

    rawData.forEach(typeItem => {
      innerPIEData.push({
        value: typeItem.count,
        name: typeItem.name,
      });
      typeItem.subTypes.forEach(subTypeItem => {
        outerPIEData.push({
          value: subTypeItem.count,
          name: `${typeItem.name}-${subTypeItem.name}`,
        });
      });
    });

    return [
      innerPIEData,
      outerPIEData,
    ];
  }
}

/**
 * 计算（某几个部门的）设备总数
 * @param data 
 * @returns 
 */
export const calculateEquipmentTotal = (data: EquipmentTypeStatItem[]) => {
  return data.reduce((acc: number, cur) => {
    return acc + cur.subTypes.reduce((subAcc: number, subCur) => {
      return subAcc + subCur.count;
    }, 0);
  }, 0);
}