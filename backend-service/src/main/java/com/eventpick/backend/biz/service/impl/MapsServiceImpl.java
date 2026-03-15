package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.service.MapsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Slf4j
@Service
@RequiredArgsConstructor
public class MapsServiceImpl implements MapsService {

    @Override
    public Object searchGoogle(String q) {
        log.info("Google Maps search: {}", q);
        // TODO: Google Maps Places API呼び出し
        return Collections.emptyList();
    }
}
