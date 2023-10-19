import { BACKEND_URL } from '../../config/env-properties';
import { DefaultIListResponse } from '../../models/IResponse';
import { Card } from '../../models/Card';
import axios from 'axios';
import { CardListPayload } from '../../payloads/CardListPayload';

export class MainPageService {
  private readonly NAME_SPACE = `${BACKEND_URL}/card`;

  list = (payload: CardListPayload) => {
    return axios.get<DefaultIListResponse<Card[]>>(`${this.NAME_SPACE}`, {
      params: payload,
    });
  };
  update = (id: string, payload: Card) => {
    return axios.post(`${this.NAME_SPACE}/${id}`, payload);
  };
}

const mainPageService = new MainPageService();

export default mainPageService;
