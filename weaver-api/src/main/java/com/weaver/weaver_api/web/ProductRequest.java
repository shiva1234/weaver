package com.weaver.weaver_api.web;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProductRequest(
        @NotBlank @Size(max = 255) String name,
        @Size(max = 1024) String image,
        @Min(0) int quantity,
        @Min(0) int price,
        @Min(0) int weight,
        @Size(max = 2000) String description
) {}