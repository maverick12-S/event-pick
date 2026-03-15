package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.UserService;
import com.eventpick.backend.restapi.common.CommonResponse;
import com.eventpick.backend.restapi.dto.UserAccountDto;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ユーザーコントローラー。
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserService userService;

    @GetMapping
    public CommonResponse<List<UserAccountDto>> getUsers(
            @RequestParam(required = false, defaultValue = "40") Integer limit,
            @RequestParam(required = false, defaultValue = "1") Integer page) {
        return CommonResponse.ok(userService.getUsers(limit, page));
    }

    @GetMapping("/{userId}")
    public CommonResponse<UserAccountDto> getUser(@PathVariable String userId) {
        return CommonResponse.ok(userService.getUser(userId));
    }

    @PostMapping("/{userId}/suspend")
    public CommonResponse<Void> suspendUser(@PathVariable String userId) {
        userService.suspendUser(userId);
        return CommonResponse.ok();
    }
}
