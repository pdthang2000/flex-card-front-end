import { BACKEND_URL } from '../../config/env-properties';
import { IResponse } from '../../models/IResponse';
import axios from 'axios';

export class SetService {
  private readonly NAME_SPACE = `${BACKEND_URL}/card/set`;

  getSet = (id: string) => {
    return axios.get<IResponse<any>>(`${this.NAME_SPACE}/${id}`);
  };
}

const setService = new SetService();

export default setService;
