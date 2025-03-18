import { getHistory } from '../repositories/history-repository';
import { HistoryResponse } from '../interfaces/history-response';

export const getHistoryService = async (
  limit?: number,
  lastKey?: string,
): Promise<HistoryResponse> => {
  return getHistory(limit, lastKey);
};
