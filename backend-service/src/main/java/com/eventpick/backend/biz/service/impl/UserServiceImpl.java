package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.exception.ResourceNotFoundException;
import com.eventpick.backend.biz.service.UserService;
import com.eventpick.backend.domain.entity.UserAccount;
import com.eventpick.backend.domain.repository.UserAccountRepository;
import com.eventpick.backend.restapi.dto.UserAccountDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserAccountRepository userAccountRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UserAccountDto> getUsers(Integer limit, Integer page) {
        return userAccountRepository.findByIsDeletedFalse(PageRequest.of(page - 1, limit))
                .stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserAccountDto getUser(String userId) {
        UserAccount user = userAccountRepository.findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new ResourceNotFoundException("UserAccount", "userId", userId));
        return toDto(user);
    }

    @Override
    public void suspendUser(String userId) {
        UserAccount user = userAccountRepository.findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new ResourceNotFoundException("UserAccount", "userId", userId));
        user.setIsActive(false);
        userAccountRepository.save(user);
        log.info("User suspended: {}", userId);
    }

    private UserAccountDto toDto(UserAccount e) {
        return UserAccountDto.builder()
                .userId(e.getUserId())
                .authSub(e.getAuthSub())
                .loginType(e.getLoginType())
                .userName(e.getUserName())
                .userEmail(e.getUserEmail())
                .phoneNumber(e.getPhoneNumber())
                .userGender(e.getUserGender())
                .birthYear(e.getBirthYear())
                .termsAgreed(e.getTermsAgreed())
                .isActive(e.getIsActive())
                .build();
    }
}
