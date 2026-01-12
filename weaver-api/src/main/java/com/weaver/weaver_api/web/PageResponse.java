// com/weaver/weaver_api/web/PageResponse.java
package com.weaver.weaver_api.web;

import java.util.List;

public record PageResponse<T>(
        List<T> content,
        int page,         // 1-based
        int pageSize,
        long totalItems,
        int totalPages,
        boolean hasNext,
        boolean hasPrev
) {}