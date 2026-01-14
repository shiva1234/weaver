// com/weaver/weaver_api/controller/ProductController.java
package com.weaver.weaver_api.controller;

import com.weaver.weaver_api.model.Product;
import com.weaver.weaver_api.service.ProductService;
import com.weaver.weaver_api.service.StorageService;
import com.weaver.weaver_api.web.PageResponse;
import com.weaver.weaver_api.web.ProductRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService service;
    private final StorageService storageService;

    @GetMapping
    public PageResponse<Product> search(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "sellPrice") String sort,
            @RequestParam(defaultValue = "desc") String dir,

            @RequestParam(required = false) String query,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String sku
    ) {
        Page<Product> p = service.search(page, size, sort, dir, query, minPrice, maxPrice, categoryId, active, sku);
        return new PageResponse<>(
                p.getContent(),
                p.getNumber() + 1,
                p.getSize(),
                p.getTotalElements(),
                p.getTotalPages(),
                p.hasNext(),
                p.hasPrevious()
        );
    }

    @GetMapping("/{id}")
    public Product getOne(@PathVariable UUID id) {
        return service.get(id);
    }

    @PostMapping(consumes = "multipart/form-data")
    @ResponseStatus(HttpStatus.CREATED)
    public Product create(
            @RequestPart("product") @Valid ProductRequest body,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) throws IOException {
        List<String> imageUrls = new ArrayList<>();
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                String url = storageService.uploadFile(file, body.categoryId(), body.sku());
                imageUrls.add(url);
            }
        }
        return service.create(body, imageUrls);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable UUID id, @Valid @RequestBody ProductRequest body) {
        return service.update(id, body);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}