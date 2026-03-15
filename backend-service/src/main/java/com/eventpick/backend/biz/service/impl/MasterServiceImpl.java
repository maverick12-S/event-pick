package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.service.MasterService;
import com.eventpick.backend.domain.repository.CityRepository;
import com.eventpick.backend.domain.repository.PrefectureRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MasterServiceImpl implements MasterService {

    private final PrefectureRepository prefectureRepository;
    private final CityRepository cityRepository;

    @Override
    @Cacheable(value = "master", key = "'prefectures'")
    public Object getPrefectures() {
        return prefectureRepository.findAllByOrderBySortOrder();
    }

    @Override
    @Cacheable(value = "master", key = "'cities-' + #prefectureCode")
    public Object getCities(String prefectureCode) {
        return cityRepository.findByPrefectureCodeOrderByCityName(prefectureCode);
    }
}
