// com/weaver/weaver_api/web/ProductRequest.java
package com.weaver.weaver_api.web;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ProductRequest(
        @NotBlank @Size(max = 200) String name,
        @Size(max = 10_000) String description,
        @NotNull UUID categoryId,
        @NotNull @PositiveOrZero BigDecimal vendorPrice,
        @NotNull @PositiveOrZero BigDecimal sellPrice,
        @NotNull @PositiveOrZero Integer stockQty,
        @NotBlank @Size(max = 80) String sku,
        @NotNull Boolean active,
        List<@NotBlank String> images,
        @Size(max = 1024) String primaryImage
) {}