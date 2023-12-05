import request from '@/lib/request';

/** 上传接口，通过后端上传 */
export async function uploadFile(body: any) {
  return request('/oss/upload', {
    method: 'POST',
    data: body,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

interface CosSignInfo {
  authorization: string;
  securityToken: string;
  cosKey: string;
  cosHost: string;
  cdnPath: string;
}

/**前端直传 */
export const uploadDirectToOss = async (f: File) => {
  // 获取签名信息
  const data = await request('/oss/cos/upload/sign', {
    method: 'POST',
    data: {
      fileName: f.name,
      fileSize: f.size,
      mimeType: f.type,
    },
  });

  // https://cloud.tencent.com/document/product/436/9067
  const { authorization, securityToken, cosKey, cosHost, cdnPath } =
    data as unknown as CosSignInfo;

  // 直传 cos
  await fetch(cosHost, {
    method: 'PUT',
    body: f,
    headers: {
      Authorization: authorization,
      'x-cos-security-token': securityToken,
    },
  });

  // 返回 cdn 路径
  return cdnPath;
};
