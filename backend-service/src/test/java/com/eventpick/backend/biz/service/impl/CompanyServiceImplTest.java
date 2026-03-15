package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.exception.ResourceNotFoundException;
import com.eventpick.backend.domain.entity.Company;
import com.eventpick.backend.domain.repository.CompanyNotificationRepository;
import com.eventpick.backend.domain.repository.CompanyRepository;
import com.eventpick.backend.domain.repository.CompanyReviewRepository;
import com.eventpick.backend.restapi.dto.CompanyDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * CompanyServiceImpl単体テスト。
 */
@ExtendWith(MockitoExtension.class)
class CompanyServiceImplTest {

    @InjectMocks
    private CompanyServiceImpl companyService;

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private CompanyNotificationRepository notificationRepository;

    @Mock
    private CompanyReviewRepository reviewRepository;

    @Test
    @DisplayName("企業詳細取得: 存在する場合はDTOを返すこと")
    void getCompany_existingId_shouldReturnDto() {
        Company company = Company.builder()
                .companyId("01ABC")
                .companyName("テスト株式会社")
                .displayName("テスト社")
                .companyType("1")
                .accountStatus("1")
                .isDeleted(false)
                .build();

        when(companyRepository.findByCompanyIdAndIsDeletedFalse("01ABC"))
                .thenReturn(Optional.of(company));

        CompanyDto result = companyService.getCompany("01ABC");

        assertNotNull(result);
        assertEquals("01ABC", result.getCompanyId());
        assertEquals("テスト株式会社", result.getCompanyName());
        assertEquals("テスト社", result.getDisplayName());
    }

    @Test
    @DisplayName("企業詳細取得: 存在しない場合はResourceNotFoundExceptionをスローすること")
    void getCompany_nonExistingId_shouldThrowException() {
        when(companyRepository.findByCompanyIdAndIsDeletedFalse("NONEXIST"))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> companyService.getCompany("NONEXIST"));
    }

    @Test
    @DisplayName("企業一覧取得: ページネーション結果をDTOリストで返すこと")
    void getCompanies_shouldReturnPaginatedList() {
        Company c1 = Company.builder().companyId("C1").companyName("会社A").accountStatus("1").isDeleted(false).build();
        Company c2 = Company.builder().companyId("C2").companyName("会社B").accountStatus("1").isDeleted(false).build();

        when(companyRepository.findByIsDeletedFalse(any(PageRequest.class)))
                .thenReturn(new PageImpl<>(List.of(c1, c2)));

        List<CompanyDto> result = companyService.getCompanies(40, 1);

        assertEquals(2, result.size());
        assertEquals("C1", result.get(0).getCompanyId());
        assertEquals("C2", result.get(1).getCompanyId());
    }

    @Test
    @DisplayName("企業作成: 正常にエンティティが保存されること")
    void createCompany_shouldSaveEntity() {
        CompanyDto dto = CompanyDto.builder()
                .companyName("新規会社")
                .companyType("1")
                .adminEmail("admin@test.com")
                .build();

        companyService.createCompany(dto);

        verify(companyRepository, times(1)).save(any(Company.class));
    }

    @Test
    @DisplayName("企業削除: ソフトデリートが行われること")
    void deleteCompany_shouldSoftDelete() {
        Company company = Company.builder()
                .companyId("DEL01")
                .companyName("削除対象")
                .accountStatus("1")
                .isDeleted(false)
                .build();

        when(companyRepository.findByCompanyIdAndIsDeletedFalse("DEL01"))
                .thenReturn(Optional.of(company));

        companyService.deleteCompany("DEL01");

        assertTrue(company.getIsDeleted());
        verify(companyRepository).save(company);
    }
}
