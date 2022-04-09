import request from '@/utils/request';
import { FormDataType } from './data';

export async function createData(params?: FormDataType): Promise<any> {
  return request({
    url: '/v1/topic/create',
    method: 'POST',
    data: params,
  });
}

export async function createTopic(params?: FormDataType): Promise<any> {
  return request({
    url: '/v1/topic/create',
    method: 'POST',
    data: params,
  });
}

export async function updateTopic(params?: FormDataType): Promise<any> {
  return request({
    url: '/v1/topic/updateTopic',
    method: 'POST',
    data: params,
  });
}

export async function getAllClassify(params?: FormDataType): Promise<any> {
  return request({
    url: '/v1/classify/getAllClassify',
    method: 'get',
    params,
  });
}

export async function getTopicDetailById(id?: number | string): Promise<any> {
  return request({
    url: '/v1/topic/getTopicDetailById',
    method: 'get',
    params: {
      id,
    },
  });
}
