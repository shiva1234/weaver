// com/weaver/weaver_api/repository/specs/ProductSpecs.java
package com.weaver.weaver_api.repository.specs;

import com.weaver.weaver_api.model.Product;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.UUID;

public final class ProductSpecs {
    private ProductSpecs() {}

    public static Specification<Product> nameContains(String q) {
        if (q == null || q.isBlank()) return null;
        final String like = "%" + q.trim().toLowerCase() + "%";
        return (root, cq, cb) -> cb.like(cb.lower(root.get("name")), like);
    }

    public static Specification<Product> activeEq(Boolean active) {
        if (active == null) return null;
        return (root, cq, cb) -> cb.equal(root.get("active"), active);
    }

    public static Specification<Product> categoryIdEq(UUID categoryId) {
        if (categoryId == null) return null;
        return (root, cq, cb) -> cb.equal(root.get("categoryId"), categoryId);
    }

    public static Specification<Product> minSellPrice(BigDecimal min) {
        if (min == null) return null;
        return (root, cq, cb) -> cb.greaterThanOrEqualTo(root.get("sellPrice"), min);
    }

    public static Specification<Product> maxSellPrice(BigDecimal max) {
        if (max == null) return null;
        return (root, cq, cb) -> cb.lessThanOrEqualTo(root.get("sellPrice"), max);
    }

    public static Specification<Product> skuEquals(String sku) {
        if (sku == null || sku.isBlank()) return null;
        return (root, cq, cb) -> cb.equal(root.get("sku"), sku);
    }
}