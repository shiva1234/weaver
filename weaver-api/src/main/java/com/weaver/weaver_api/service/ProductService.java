package com.weaver.weaver_api.service;

import com.weaver.weaver_api.model.Product;
import com.weaver.weaver_api.repository.ProductRepository;
import com.weaver.weaver_api.repository.specs.ProductSpecs;
import com.weaver.weaver_api.web.NotFoundException;
import com.weaver.weaver_api.web.ProductRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.data.jpa.domain.Specification.allOf;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {
    private final ProductRepository repository;

    public Page<Product> searchProducts(
            int page, int size, String sort, String dir,
            String query, Integer minPrice, Integer maxPrice) {
        int pageIndex = Math.max(0, page - 1 );
        Sort.Direction direction = "asc".equalsIgnoreCase(dir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(pageIndex, size, Sort.by(direction, (sort == null || sort.isBlank()) ? "price" : sort));
        Specification<Product> spec = Specification
                .allOf(ProductSpecs.nameContains(query))
                .and(ProductSpecs.minPrice(minPrice))
                .and(ProductSpecs.maxPrice(maxPrice));
        return repository.findAll(spec, pageable);
    }


    public Product getProduct(Long id) {
        return repository.findById(id).orElseThrow(() ->
                new NotFoundException("Product id %d not found".formatted(id)));
    }

    @Transactional
    public Product create(ProductRequest req) {
        Product p = new Product();
        apply(p, req);
        return repository.save(p);
    }

    @Transactional
    public Product update(Long id, ProductRequest req) {
        Product p = repository.findById(id).orElseThrow(() ->
                new NotFoundException("Product id %d not found".formatted(id)));
        apply(p, req);
        return repository.save(p);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Product id %d not found".formatted(id));
        }
        repository.deleteById(id);
    }

    private static void apply(Product p, ProductRequest r) {
        p.setName(r.name());
        p.setImage(r.image());
        p.setQuantity(r.quantity());
        p.setPrice(r.price());
        p.setWeight(r.weight());
        p.setDescription(r.description());
    }
}