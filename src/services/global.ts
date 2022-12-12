import { request } from 'umi';
import type { AttachmentCategory } from '@/utils/constants';

/**
 * 获取附件
 * @param bizId
 * @returns
 */
export async function fetchAttachments(
  bizId: string | number | undefined,
): ResponseBodyWithPromise<Attachment[]> {
  return request(`/v3/common/attachmentInfo/list/${bizId}`);
}

/**
 * 批量获取附件
 * @param bizIds
 * @returns
 */
export async function batchFetchAttachments(
  bizIds: (string | number)[],
  category?: string[],
): ResponseBodyWithPromise<Attachment[]> {
  return request(`/v3/common/attachmentInfo/list`, {
    method: 'POST',
    data: {
      bizId: bizIds,
      category,
    },
  });
}

/**
 * 保存附件
 * @param bizId （业务id，可能为机构id，也可能为人员id）
 * @param attachments
 * @returns
 */
export function saveAttachments(
  bizId: string | number,
  attachments: Attachment[],
) {
  return request(`/v3/common/attachmentInfo/save/${bizId}`, {
    method: 'POST',
    data: attachments,
  });
}

/**
 * 删除bizId相关的所有附件信息
 * @param bizId
 * @returns
 */
export function deleteAttachments(bizId: string | number) {
  return request(`/v3/common/attachmentInfo/delete/${bizId}`, {
    method: 'DELETE',
  });
}

/**
 * (多bizId) [附件查询多个]
 * @param data
 * @returns
 */
export function batchFetchAttachmentsX(data: {
  bizId: number[];
  category: AttachmentCategory[];
}): ResponseBodyWithPromise<
  Record<
    string,
    {
      category: string;
      contentLength: number;
      contentType: string;
      fileName: string;
      res: string;
    }
  >
> {
  return request('/v3/common/attachmentInfo/list/x', {
    method: 'POST',
    data,
  });
}
