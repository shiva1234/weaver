// com.weaver.weaver_api.repository.spec.ProductSpecs
package com.weaver.weaver_api.repository.specs;

import com.weaver.weaver_api.model.Product;
import org.springframework.data.jpa.domain.Specification;

public final class ProductSpecs {

    private ProductSpecs() {}

    public static Specification<Product> nameContains(String q) {
        return (root, cq, cb) ->
                (q == null || q.isBlank())
                        ? cb.conjunction()
                        : cb.like(cb.lower(root.get("name")), "%" + q.trim().toLowerCase() + "%");
    }

    public static Specification<Product> minPrice(Integer min) {
        return (root, cq, cb) ->
                (min == null) ? cb.conjunction() : cb.greaterThanOrEqualTo(root.get("price"), min);
    }

    public static Specification<Product> maxPrice(Integer max) {
        return (root, cq, cb) ->
                (max == null) ? cb.conjunction() : cb.lessThanOrEqualTo(root.get("price"), max);
    }

    // If later you add categoryId on Product:
    // public static Specification<Product> categoryId(Long id) {
    //     return (root, cq, cb) -> (id == null) ? cb.conjunction() :
    //             cb.equal(root.get("category").get("id"), id);
    // }
}