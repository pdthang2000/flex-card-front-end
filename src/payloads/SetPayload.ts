import { Card } from '../models/Card';

export interface SetListPayload {
  page?: string;
}

export interface CreateSetPayload {
  title: string;
  description?: string;
  cards: Card[];
}

export interface UpdateSetPayload extends CreateSetPayload {}
