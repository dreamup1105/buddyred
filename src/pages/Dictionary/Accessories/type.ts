export interface ISaveManufacturerData {
  name: string;
  description?: string;
  id?: number;
  keywords?: string;
}

export interface ISaveProductData {
  name: string;
  manufacturerId: number;
  description?: string;
  id?: number;
  keywords?: string;
}

export interface IFetchProductsData {
  manufacturerId?: number;
  q?: string;
}

export interface ISaveModelData {
  name: string;
  productId: number;
  description?: string;
  id?: number;
  keywords?: string;
}

export interface IFetchModelsData {
  q?: string;
  productId?: number;
}

export interface IManufacturerItem {
  name: string;
  description?: string | null;
  id?: number;
  keywords?: string | null;
}

export interface IProductItem {
  name: string;
  manufacturerId: number;
  description?: string;
  id?: number;
  keywords?: string;
}

export interface IModelItem {
  name: string;
  productId: number;
  description?: string;
  id?: number;
  keywords?: string;
}

export enum OperationType {
  CREATE_MANUFACTURER = 'CREATE_MANUFACTURER', // 新增厂商
  CREATE_PRODUCT = 'CREATE_PRODUCT', // 新增产品
  CREATE_MODEL = 'CREATE_MODEL', // 新增型号
  EDIT_MANUFACTURER = 'EDIT_MANUFACTURER', // 编辑厂商
  EDIT_PRODUCT = 'EDIT_PRODUCT', // 编辑产品
  EDIT_MODEL = 'EDIT_MODEL', // 编辑型号
  REPLACE_MANUFACTURER = 'REPLACE_MANUFACTURER', // 替换厂商
  REPLACE_PRODUCT = 'REPLACE_PRODUCT', // 替换产品
  REPLACE_MODEL = 'REPLACE_MODEL', // 替换型号
  DELETE_MANUFACTURER = 'DELETE_MANUFACTURER', // 删除厂商
  DELETE_PRODUCT = 'DELETE_PRODUCT', // 删除产品
  DELETE_MODEL = 'DELETE_MODEL', // 删除型号
  NOOP = 'NOOP', // 空操作
}

export enum OperationTextType {
  CREATE_MANUFACTURER = '新增厂商',
  CREATE_PRODUCT = '新增产品',
  CREATE_MODEL = '新增型号',
  EDIT_MANUFACTURER = '编辑厂商',
  EDIT_PRODUCT = '编辑产品',
  EDIT_MODEL = '编辑型号',
  REPLACE_MANUFACTURER = '替换厂商',
  REPLACE_PRODUCT = '替换产品',
  REPLACE_MODEL = '替换型号',
  DELETE_MANUFACTURER = '删除厂商',
  DELETE_PRODUCT = '删除产品',
  DELETE_MODEL = '删除型号',
  NOOP = '空',
}

// 设备 ｜ 配件
export type BizType = 'equipment' | 'part';

export type TableType = 'manufacturer' | 'product' | 'model';
