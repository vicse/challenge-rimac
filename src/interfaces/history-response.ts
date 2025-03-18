import { HistoryItem } from '../entities/history';

export interface HistoryResponse {
  items: HistoryItem[];
  nextKey: string | null | undefined;
  count: number | undefined;
}
