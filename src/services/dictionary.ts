import { request } from 'umi';
import type { NameDictionarysEnum } from '@/utils/constants';
import { CodeDictionarysEnum } from '@/utils/constants';

/**
 * (code代码类)字典名
 */
export async function fetchCodeDictionarysEnum() {
  return request('/v3/dict/dict/listCodeDicts');
}

/**
 * (name名称类)字典名
 */
export async function fetchNameDictionarysEnum() {
  return request('/v3/dict/dict/listNameDicts');
}

/**
 *
 */
export async function fetchCodeDictionary(
  dictionaryName: string,
  code: string,
) {
  return request(`/v3/dict/code/${dictionaryName}/get/${code}`);
}

/**
 * 查询省市区
 * @param dictionaryName
 * @param params
 */
export async function fetchCodeDictionarys(
  dictionaryName: CodeDictionarysEnum = CodeDictionarysEnum.REGION_CODE,
  params: FetchDictionaryParams = { code: '', name: '', parentId: 0 },
) {
  return request(`/v3/dict/code/${dictionaryName}/list`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 根据区级regionCode，向上查询市级code（cityCode）和省级code（provinceCode）
 * 比如：'110101' => ['110000', '110100', '110101']
 * 由于后端在保存地址信息时，只保存最后一级
 * 前端在有数据回填场景的时候（比如修改），需调用该接口，重构出[provinceCode, cityCode, regionCode]这种形式
 * 才能正确的把Cascader渲染出来。对于其它场景，比如保存，如有地址入参，只传regionCode即可
 * @param dictionaryName
 * @param regionCode
 */
export async function fetchAddressPathByRegionCode(
  dictionaryName: CodeDictionarysEnum = CodeDictionarysEnum.REGION_CODE,
  regionCode: string,
) {
  return request(`/v3/dict/code/${dictionaryName}/path/${regionCode}`);
}

export async function fetchNameDictionarys(
  dictionaryName: NameDictionarysEnum,
  params: {
    name?: string;
    parentId?: number;
  } = {},
  pageNum?: number,
  pageSize?: number,
): ResponseBodyWithPromise<NameDictItem[]> {
  const url = pageNum
    ? `/v3/dict/name/${dictionaryName}/list?pageNum=${pageNum}&pageSize=${pageSize}`
    : `/v3/dict/name/${dictionaryName}/list`;
  return request(url, {
    method: 'POST',
    data: params,
  });
}

export async function fetchNameDictionary(
  dictionaryName: NameDictionarysEnum,
  id: number,
) {
  return request(`/v3/dict/name/${dictionaryName}/get/${id}`);
}

export async function saveDictionary(
  dictionaryName: NameDictionarysEnum,
  params: SaveDictionaryParams,
) {
  return request(`/v3/dict/name/${dictionaryName}/save`, {
    method: 'POST',
    data: params,
  });
}

export async function deleteDictionary(
  dictionaryName: NameDictionarysEnum,
  id: number,
) {
  return request(`/v3/dict/name/${dictionaryName}/delete/${id}`, {
    method: 'DELETE',
  });
}

/**
 *
 * @param dictionaryName
 * @param srcId
 * @param targetId
 * @param doDelete
 * 描述： 替换srcId项 的引用 到targetId项(1.其子节点挂载到目标节点; 2.业务数据引用切换到目标节点). 4.删除源节点(doDelete=true).
 * 替换可能不成功(1. 子节点挂载到目标节下引起名称冲突; 2. 业务数据限制).
 */
export async function replaceDictionary(
  dictionaryName: NameDictionarysEnum,
  srcId: number,
  targetId: number,
  doDelete: boolean,
) {
  return request(
    `/v3/dict/name/${dictionaryName}/replace/${srcId}/${targetId}?doDelete=${doDelete}`,
    {
      method: 'PUT',
    },
  );
}
