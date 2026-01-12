// src/main/java/com/weaver/weaver_api/dao/PageResult.java
package com.weaver.weaver_api.dao;

import java.util.List;

public record PageResult<T>(
        List<T> content,
        int page,        // 1-based
        int size,
        long totalItems,
        int totalPages
) {}