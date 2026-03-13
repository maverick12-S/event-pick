import { reportDetailDb } from '../db/reportDetail.screen';
import type { ReportDetailItem } from '../../types/models/reportDetail';

export const reportDetailMockApi = {
  getById: async (id: string): Promise<ReportDetailItem | null> => {
    const found = reportDetailDb.find((item) => item.id === id);
    return Promise.resolve(found ? { ...found } : null);
  },
};

export default reportDetailMockApi;
