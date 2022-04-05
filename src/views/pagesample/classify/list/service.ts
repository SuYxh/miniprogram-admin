import request from '@/utils/request';
import { TableListQueryParams, TableListItem } from './data.d';

export async function getClassify(params?: any): Promise<any> {
  return request({
    url: '/v1/classify/getAllClassify',
    method: 'get',
    params,
  });
}

export async function createClassify(params?: any): Promise<any> {
  return request({
    url: '/v1/classify/create',
    method: 'post',
    data: params,
  });
}

export async function updateClassify(params?: any): Promise<any> {
  return request({
    url: '/v1/classify/update',
    method: 'post',
    data: params,
  });
}

export async function removeClassify(id: number): Promise<any> {
  return request({
    url: `/v1/classify/delClassify`,
    method: 'delete',
    params: { id },
  });
}

export async function getClassifyById(id: number): Promise<any> {
  return request({
    url: `/v1/classify/getClassifyById`,
    method: 'get',
    params: { id },
  });
}

export async function queryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/pages/list',
    method: 'get',
    params,
  });
}

export async function createData(params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: '/pages/list',
    method: 'POST',
    data: params,
  });
}

export async function updateData(id: number, params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: `/pages/list/${id}`,
    method: 'PUT',
    data: params,
  });
}

export async function removeData(id: number): Promise<any> {
  return request({
    url: `/pages/list/${id}`,
    method: 'delete',
  });
}

export async function detailData(id: number): Promise<any> {
  return request({ url: `/pages/list/${id}` });
}
