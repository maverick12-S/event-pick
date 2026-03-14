/**
 * 承諾ログ API サービス
 * ─────────────────────────────────────────────
 * 画面: TemplateLicenseAgreementModal
 * DTO: agreement.dto.ts — Zod: agreement.schema.ts
 */
import { apiClient } from '../http';
import endpoints from '../endpoints';
import { agreementLogCreateRequestSchema } from '../../types/schemas';
import type {
  AgreementLogCreateRequest,
  AgreementLogCreateResponse,
  ApiResponse,
} from '../../types/dto';

const unwrap = <T>(res: { data: ApiResponse<T> }): T => {
  const body = res.data;
  if (!body.success || !body.data) {
    throw new Error(body.error?.message || 'API error');
  }
  return body.data;
};

export const agreementApi = {
  /** 承諾ログ保存 POST /agreement-logs */
  createLog: async (req: AgreementLogCreateRequest): Promise<AgreementLogCreateResponse> => {
    const validated = agreementLogCreateRequestSchema.parse(req);
    const res = await apiClient.post<ApiResponse<AgreementLogCreateResponse>>(
      endpoints.agreementLogs,
      validated,
    );
    return unwrap(res);
  },
};
