import { BACKEND_URL } from '../../config/env-properties';
import { IResponse } from '../../models/IResponse';
import { Card } from '../../models/Card';
import axios from 'axios';

export class MainPageService {
  private readonly NAME_SPACE = `${BACKEND_URL}/card`;

  list = (payload: any) => {
    return axios.get<IResponse<Card>>(`${this.NAME_SPACE}`, {
      params: payload,
    });
  };
}

const mainPageService = new MainPageService();

export default mainPageService;
