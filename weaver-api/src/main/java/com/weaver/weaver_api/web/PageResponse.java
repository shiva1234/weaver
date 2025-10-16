package com.weaver.weaver_api.web;

import java.util.List;

public record PageResponse<T>(
        List<T> items,
        int page,           // 1-based for client
        int pageSize,
        long totalItems,
        int totalPages,
        boolean hasNext,
        boolean hasPrev
) {}