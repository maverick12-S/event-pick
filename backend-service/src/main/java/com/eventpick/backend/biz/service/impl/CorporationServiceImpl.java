package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.exception.BadRequestException;
import com.eventpick.backend.biz.exception.MessageEnum;
import com.eventpick.backend.biz.service.CorporationService;
import com.eventpick.backend.biz.util.AuditLogHelper;
import com.eventpick.backend.domain.repository.CompanyRepository;
import com.eventpick.backend.restapi.dto.request.CorporationsValidatePostRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CorporationServiceImpl implements CorporationService {

    private final CompanyRepository companyRepository;
    private final AuditLogHelper auditLogHelper;

    @Override
    @Cacheable(value = "corporations", key = "#request.companyCode")
    public void validateCorporation(CorporationsValidatePostRequest request) {
        String companyCode = request.getCompanyCode();
        log.info("Corporation validation requested: {}", companyCode);

        // 法人番号の形式チェック（13桁数字）
        if (companyCode == null || !companyCode.matches("\\d{13}")) {
            throw new BadRequestException(MessageEnum.VALIDATION_ERROR)
                    .context("companyCode", companyCode, "法人番号は13桁の数字である必要があります");
        }

        // チェックディジット検証（法人番号の1桁目）
        if (!validateCheckDigit(companyCode)) {
            throw new BadRequestException(MessageEnum.VALIDATION_ERROR)
                    .context("companyCode", companyCode, "法人番号のチェックディジットが不正です");
        }

        // 既登録チェック
        companyRepository.findByCompanyCodeAndIsDeletedFalse(companyCode)
                .ifPresent(existing -> {
                    throw new BadRequestException(MessageEnum.CONFLICT)
                            .context("companyCode", companyCode, "この法人番号は既に登録されています");
                });

        // TODO: 国税庁 法人番号公表サイト Web-API呼び出し
        // https://www.houjin-bangou.nta.go.jp/webapi/
        // GET https://api.houjin-bangou.nta.go.jp/4/num?id={API_KEY}&number={companyCode}&type=02
        // → レスポンスから法人名を取得して返却（Redis 24h キャッシュ）

        auditLogHelper.log(null, "system", "CORPORATION_VALIDATE",
                "C", null, "法人番号検証: " + companyCode);
        log.info("Corporation validation passed: {}", companyCode);
    }

    /**
     * 法人番号チェックディジット検証。
     * 国税庁仕様: 9 - ((Σ(Pi × Qi)) mod 9)
     * P: 2桁目～13桁目の各数値
     * Q: 奇数位置=1, 偶数位置=2
     */
    private boolean validateCheckDigit(String companyCode) {
        int sum = 0;
        for (int i = 1; i < 13; i++) {
            int p = Character.getNumericValue(companyCode.charAt(i));
            int q = (i % 2 == 1) ? 1 : 2;
            sum += p * q;
        }
        int expected = 9 - (sum % 9);
        int actual = Character.getNumericValue(companyCode.charAt(0));
        return expected == actual;
    }
}
