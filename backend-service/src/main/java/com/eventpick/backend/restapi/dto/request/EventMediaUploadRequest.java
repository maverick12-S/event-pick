package com.eventpick.backend.restapi.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

/** メディアアップロードリクエスト。 */
@Data @NoArgsConstructor @AllArgsConstructor
public class EventMediaUploadRequest {
    private MultipartFile file;
}
