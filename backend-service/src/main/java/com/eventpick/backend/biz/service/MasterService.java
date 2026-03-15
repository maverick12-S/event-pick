package com.eventpick.backend.biz.service;

/**
 * マスタサービスインタフェース。
 */
public interface MasterService {
    Object getPrefectures();
    Object getCities(String prefectureCode);
}
