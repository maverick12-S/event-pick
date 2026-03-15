package com.eventpick.backend.biz.service;

import com.eventpick.backend.restapi.dto.UserAccountDto;

import java.util.List;

/**
 * ユーザーサービスインタフェース。
 */
public interface UserService {
    List<UserAccountDto> getUsers(Integer limit, Integer page);
    UserAccountDto getUser(String userId);
    void suspendUser(String userId);
}
