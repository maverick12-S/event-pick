package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.MapsService;
import com.eventpick.backend.restapi.common.CommonResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * Maps検索コントローラー。
 */
@RestController
@RequestMapping("/api/v1/maps")
@RequiredArgsConstructor
public class MapsController {

    private final MapsService mapsService;

    /** GET /api/v1/maps/google - Google Maps 検索 */
    @GetMapping("/google")
    public CommonResponse<Object> searchGoogle(@RequestParam String q) {
        return CommonResponse.ok(mapsService.searchGoogle(q));
    }
}
