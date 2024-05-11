import { BACKEND_URL } from '../../configs/env-properties';
import { DefaultIListResponse } from '../../models/IResponse';
import { Card } from '../../models/Card';
import axios from 'axios';
import { CardListPayload } from '../../payloads/CardListPayload';

export class CardService {
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

const cardService = new CardService();

export default cardService;
