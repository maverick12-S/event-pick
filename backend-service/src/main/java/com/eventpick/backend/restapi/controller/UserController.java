package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.UserService;
import com.eventpick.backend.restapi.common.CommonResponse;
import com.eventpick.backend.restapi.dto.UserAccountDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "ユーザー (User)", description = "ユーザー管理, アカウント停止")
public class UserController {

    private final UserService userService;

    @Operation(summary = "ユーザー一覧", description = "ページネーション付きでユーザー一覧を取得する。")
    @GetMapping
    public CommonResponse<List<UserAccountDto>> getUsers(
            @RequestParam(required = false, defaultValue = "40") Integer limit,
            @RequestParam(required = false, defaultValue = "1") Integer page) {
        return CommonResponse.ok(userService.getUsers(limit, page));
    }

    @Operation(summary = "ユーザー詳細", description = "指定ユーザーIDの詳細情報を取得する。")
    @GetMapping("/{userId}")
    public CommonResponse<UserAccountDto> getUser(@PathVariable String userId) {
        return CommonResponse.ok(userService.getUser(userId));
    }

    @Operation(summary = "ユーザー停止", description = "指定ユーザーアカウントを停止する。Cognito側も無効化。")
    @PostMapping("/{userId}/suspend")
    public CommonResponse<Void> suspendUser(@PathVariable String userId) {
        userService.suspendUser(userId);
        return CommonResponse.ok();
    }
}
