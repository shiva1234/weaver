package com.weaver.weaver_api.controller;

import com.weaver.weaver_api.model.Category;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final com.weaver.weaver_api.service.CategoryService categoryService;

    @GetMapping
    public List<Category> list() {
        return categoryService.listAll();
    }

    @GetMapping("/{id}")
    public Category get(@PathVariable Long id) {
        return categoryService.getOne(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Category create(@Valid @RequestBody Category body) {
        return categoryService.create(body);
    }

    @PutMapping("/{id}")
    public Category update(@PathVariable Long id, @Valid @RequestBody Category body) {
        return categoryService.update(id, body); // <- pass id, don’t set on body
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        categoryService.delete(id);
    }
}