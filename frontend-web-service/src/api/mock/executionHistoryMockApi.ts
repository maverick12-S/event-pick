import { getExecutionHistories } from '../db/executionHistory.db';
import type { ExecutionHistoryItem } from '../../types/models/executionHistory';

const executionHistoryMockApi = {
  getHistories: (): Promise<ExecutionHistoryItem[]> =>
    new Promise((resolve) => setTimeout(() => resolve(getExecutionHistories()), 120)),
};

export default executionHistoryMockApi;
