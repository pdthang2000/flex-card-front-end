// import {PaginationMeta} from './pagination-meta';

export enum ApiStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface IResponse<T> {
  status: ApiStatus;
  message?: string;
  data: T | T[] | any;
  // meta: PaginationMeta;
}
