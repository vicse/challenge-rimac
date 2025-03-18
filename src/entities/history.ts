import { Film } from './film';

export interface HistoryItem {
  id: string;
  request: Film[];
  request_date: number;
}
