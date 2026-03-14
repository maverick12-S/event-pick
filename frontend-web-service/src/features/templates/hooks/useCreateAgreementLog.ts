/**
 * テンプレートライセンス承諾ログ — useMutation ラッパー (mock)
 *
 * バックエンド未稼働時もダウンロードをブロックしないよう、
 * ローカルで承諾ログを記録して即座に resolve する。
 */
import { useMutation } from '@tanstack/react-query';

import type { AgreementLogCreateRequest, AgreementLogCreateResponse } from '../../../types/dto';

const mockCreateLog = async (
  req: AgreementLogCreateRequest,
): Promise<AgreementLogCreateResponse> => {
  // 開発モック: localStorage に承諾履歴を保存
  const key = 'eventpick_agreement_logs';
  const logs: AgreementLogCreateRequest[] = JSON.parse(localStorage.getItem(key) ?? '[]');
  logs.push(req);
  localStorage.setItem(key, JSON.stringify(logs));

  return {
    created: true,
  };
};

export const useCreateAgreementLog = () => {
  return useMutation({
    mutationFn: (req: AgreementLogCreateRequest) => mockCreateLog(req),
  });
};
