import { reportDetailDb, type ReportDetailItem } from '../db/reportDetail.screen';

export const reportDetailMockApi = {
  getById: async (id: string): Promise<ReportDetailItem | null> => {
    const found = reportDetailDb.find((item) => item.id === id);
    return Promise.resolve(found ? { ...found } : null);
  },
};

export default reportDetailMockApi;
