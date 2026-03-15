package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.MapsService;
import com.eventpick.backend.restapi.common.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * Maps検索コントローラー。
 */
@RestController
@RequestMapping("/api/v1/maps")
@RequiredArgsConstructor
@Tag(name = "Maps", description = "Google Maps検索連携")
public class MapsController {

    private final MapsService mapsService;

    /** GET /api/v1/maps/google - Google Maps 検索 */
    @Operation(summary = "Google Maps検索", description = "キーワードでGoogle Mapsの場所検索を行う。CircuitBreaker適用。")
    @GetMapping("/google")
    public CommonResponse<Object> searchGoogle(@RequestParam String q) {
        return CommonResponse.ok(mapsService.searchGoogle(q));
    }
}
