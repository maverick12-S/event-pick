package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.MasterService;
import com.eventpick.backend.restapi.common.CommonResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * マスタコントローラー (認証不要)。
 */
@RestController
@RequestMapping("/api/v1/master")
@RequiredArgsConstructor
public class MasterController {

    private final MasterService masterService;

    @GetMapping("/prefectures")
    public CommonResponse<Object> getPrefectures() {
        return CommonResponse.ok(masterService.getPrefectures());
    }

    @GetMapping("/cities")
    public CommonResponse<Object> getCities(@RequestParam(required = false) String prefectureCode) {
        return CommonResponse.ok(masterService.getCities(prefectureCode));
    }
}
