package com.eventpick.backend.biz.exception;

/**
 * リソース未検出例外。
 * BusinessException 継承に統一し、MessageEnum.RESOURCE_NOT_FOUND を使用。
 */
public class ResourceNotFoundException extends BusinessException {

    public ResourceNotFoundException(String message) {
        super(MessageEnum.RESOURCE_NOT_FOUND, message);
    }

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(MessageEnum.RESOURCE_NOT_FOUND,
                String.format("%s not found with %s: '%s'", resourceName, fieldName, fieldValue));
    }
}
