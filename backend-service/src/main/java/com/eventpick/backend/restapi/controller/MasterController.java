package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.MasterService;
import com.eventpick.backend.restapi.common.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * マスタコントローラー (認証不要)。
 */
@RestController
@RequestMapping("/api/v1/master")
@RequiredArgsConstructor
@Tag(name = "マスタ (Master)", description = "都道府県, 市区町村マスタ (認証不要)")
public class MasterController {

    private final MasterService masterService;

    @Operation(summary = "都道府県一覧", description = "都道府県マスタ一覧を取得する。Redisキャッシュ対象。認証不要。")
    @GetMapping("/prefectures")
    public CommonResponse<Object> getPrefectures() {
        return CommonResponse.ok(masterService.getPrefectures());
    }

    @Operation(summary = "市区町村一覧", description = "都道府県コード指定で市区町村一覧。Redisキャッシュ対象。認証不要。")
    @GetMapping("/cities")
    public CommonResponse<Object> getCities(@RequestParam(required = false) String prefectureCode) {
        return CommonResponse.ok(masterService.getCities(prefectureCode));
    }
}
