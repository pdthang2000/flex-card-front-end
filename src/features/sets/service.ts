import { BACKEND_URL } from '../../config/env-properties';
import { IResponse } from '../../models/IResponse';
import axios from 'axios';
import { Sett } from '../../models/Sett';
import { SetListPayload } from '../../payloads/SetListPayload';

export class SetService {
  private readonly NAME_SPACE = `${BACKEND_URL}/set`;

  get = (id: string) => {
    return axios.get<IResponse<Sett>>(`${this.NAME_SPACE}/${id}`);
  };
  list = (payload: SetListPayload) => {
    return axios.get<IResponse<any>>(`${this.NAME_SPACE}`, { params: payload });
  };
}

const setService = new SetService();

export default setService;
