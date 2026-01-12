// com/weaver/weaver_api/controller/ProductController.java
package com.weaver.weaver_api.controller;

import com.weaver.weaver_api.model.Product;
import com.weaver.weaver_api.service.ProductService;
import com.weaver.weaver_api.web.PageResponse;
import com.weaver.weaver_api.web.ProductRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService service;

    @GetMapping
    public PageResponse<Product> search(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "sellPrice") String sort,
            @RequestParam(defaultValue = "desc") String dir,

            @RequestParam(required = false) String query,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Long categoryId,
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
    public Product getOne(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product create(@Valid @RequestBody ProductRequest body) {
        return service.create(body);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @Valid @RequestBody ProductRequest body) {
        return service.update(id, body);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}