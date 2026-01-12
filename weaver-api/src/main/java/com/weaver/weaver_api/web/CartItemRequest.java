package com.weaver.weaver_api.web;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CartItemRequest(
        @NotNull Long productId,
        @NotNull @Min(1) Integer quantity
) {}