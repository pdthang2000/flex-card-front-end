import { BACKEND_URL } from '../../config/env-properties';
import axios from 'axios';
import {
  CreateSetPayload,
  SetListPayload,
  UpdateSetPayload,
} from '../../payloads/SetPayload';

export class SetService {
  private readonly NAME_SPACE = `${BACKEND_URL}/set`;

  get = (id: string) => {
    return axios.get(`${this.NAME_SPACE}/${id}`);
  };
  list = (payload: SetListPayload) => {
    return axios.get(`${this.NAME_SPACE}`, { params: payload });
  };
  create = (payload: CreateSetPayload) => {
    return axios.post(`${this.NAME_SPACE}`, payload);
  };
  update = (id: string, payload: UpdateSetPayload) => {
    return axios.patch(`${this.NAME_SPACE}/${id}`, payload);
  };
}

const setService = new SetService();

export default setService;
