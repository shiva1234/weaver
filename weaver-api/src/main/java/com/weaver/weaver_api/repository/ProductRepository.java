package com.weaver.weaver_api.repository;

import com.weaver.weaver_api.model.Product;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.UUID;

@Repository
public interface ProductRepository extends
        JpaRepository<Product, UUID>,
        JpaSpecificationExecutor<Product> {
    boolean existsBySku(String sku);
    // Simple name search (case-insensitive)
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // Price range (inclusive)
    Page<Product> findBySellPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    // By category id
    Page<Product> findByCategoryId(UUID categoryId, Pageable pageable);

    // Active products only
    Page<Product> findByActiveTrue(Pageable pageable);

    // Optional: Postgres ILIKE using @Query (if you prefer SQL semantics)
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%'))")
    Page<Product> searchByName(@Param("q") String q, Pageable pageable);
}