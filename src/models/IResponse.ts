import { PaginationObject } from './PaginationObject';

export enum ApiStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface IResponse<T> {
  status: ApiStatus;
  message?: string;
  data: T | any;
}

export interface DefaultIResponse<T> {
  data: IResponse<T>;
  headers: any;
  request: any;
  config: any;
  status: any;
  statusText: any;
}

export interface IListData<T> {
  list: T | any;
  pagination: PaginationObject;
}

export interface IListResponse<T> {
  status: ApiStatus;
  message?: string;
  data: IListData<T>;
}
export interface DefaultIListResponse<T> {
  data: IListResponse<T>;
  headers: any;
  request: any;
  config: any;
  status: any;
  statusText: any;
}
