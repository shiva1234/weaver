package com.weaver.weaver_api.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.weaver.weaver_api.model.Product;
import com.weaver.weaver_api.service.ProductService;
import org.springframework.data.domain.Page;
import com.weaver.weaver_api.web.PageResponse;
import com.weaver.weaver_api.web.ProductRequest;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public PageResponse<Product> getProduct( @RequestParam(defaultValue = "1")  int page,
                                     @RequestParam(defaultValue = "12") int size,
                                     @RequestParam(defaultValue = "price") String sort,
                                     @RequestParam(defaultValue = "desc") String dir,
                                     @RequestParam(required = false) String query,
                                     @RequestParam(required = false) Integer minPrice,
                                     @RequestParam(required = false) Integer maxPrice
    ){
        Page<Product> p = productService.searchProducts(page, size, sort, dir, query, minPrice, maxPrice);
        return new PageResponse<>(
                p.getContent(),
                p.getNumber() + 1, // 1-based for clients
                p.getSize(),
                p.getTotalElements(),
                p.getTotalPages(),
                p.hasNext(),
                p.hasPrevious()
        );
    }

    /** Get one by id */
    @GetMapping("/{id}")
    public Product getOne(@PathVariable Long id) {
        return productService.getProduct(id);
    }

    /** Create */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product create(@Valid @RequestBody ProductRequest body) {
        return productService.create(body);
    }

    /** Update (full) */
    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @Valid @RequestBody ProductRequest body) {
        return productService.update(id, body);
    }

    /** Delete */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        productService.delete(id);
    }
}
