// com/weaver/weaver_api/service/ProductService.java
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

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {
    private final ProductRepository repository;

    public Page<Product> search(
            int page, int size, String sort, String dir,
            String query, BigDecimal minPrice, BigDecimal maxPrice,
            UUID categoryId, Boolean active, String sku
    ) {
        int pageIndex = Math.max(0, page - 1);
        String sortProp = (sort == null || sort.isBlank()) ? "sellPrice" : sort;
        Sort.Direction direction = "asc".equalsIgnoreCase(dir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(pageIndex, size, Sort.by(direction, sortProp));

        Specification<Product> spec = Specification.allOf(
                ProductSpecs.nameContains(query),
                ProductSpecs.minSellPrice(minPrice),
                ProductSpecs.maxSellPrice(maxPrice),
                ProductSpecs.categoryIdEq(categoryId),
                ProductSpecs.activeEq(active),
                ProductSpecs.skuEquals(sku)
        );
        return repository.findAll(spec, pageable);
    }

    public Product get(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product id %s not found".formatted(id)));
    }

    @Transactional
    public Product create(UUID productId, ProductRequest r, List<String> imageUrls) {
        if (repository.existsBySku(r.sku())) {
            throw new IllegalArgumentException("SKU already exists: " + r.sku());
        }
        Product p = new Product();
        p.setId(productId);
        apply(p, r);
        p.setImages(imageUrls);
        if (!imageUrls.isEmpty()) {
            p.setPrimaryImage(imageUrls.get(0));
        }
        return repository.save(p);
    }

    @Transactional
    public Product addImages(UUID id, List<String> newImageUrls) {
        Product p = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product id %s not found".formatted(id)));
        List<String> existing = p.getImages() != null ? new java.util.ArrayList<>(p.getImages()) : new java.util.ArrayList<>();
        existing.addAll(newImageUrls);
        p.setImages(existing);
        if (p.getPrimaryImage() == null && !existing.isEmpty()) {
            p.setPrimaryImage(existing.get(0));
        }
        return repository.save(p);
    }

    @Transactional
    public Product update(UUID id, ProductRequest r) {
        Product p = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product id %s not found".formatted(id)));
        // Optional: if sku changed, validate uniqueness
        if (!p.getSku().equals(r.sku()) && repository.existsBySku(r.sku())) {
            throw new IllegalArgumentException("SKU already exists: " + r.sku());
        }
        apply(p, r);
        return repository.save(p);
    }

    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Product id %s not found".formatted(id));
        }
        repository.deleteById(id);
    }

    private static void apply(Product p, ProductRequest r) {
        p.setName(r.name());
        p.setDescription(r.description());
        p.setCategoryId(r.categoryId());
        p.setVendorPrice(r.vendorPrice());
        p.setSellPrice(r.sellPrice());
        p.setStockQty(r.stockQty());
        p.setSku(r.sku());
        p.setActive(r.active());
        p.setImages(r.images());
        p.setPrimaryImage(r.primaryImage());
    }
}