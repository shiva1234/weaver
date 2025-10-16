package com.weaver.weaver_api.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.weaver.weaver_api.model.Product;
import com.weaver.weaver_api.service.ProductService;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public List<Product> getProduct(){
        return productService.getProducts();
    }
}
