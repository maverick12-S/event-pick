package com.eventpick.backend.restapi.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/** [管理] 設定更新リクエスト。 */
@Data @NoArgsConstructor @AllArgsConstructor
public class AdminSettingsPutRequest {
    private Map<String, Object> settings;
}
