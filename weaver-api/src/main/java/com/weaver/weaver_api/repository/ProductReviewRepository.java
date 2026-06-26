package com.weaver.weaver_api.repository;

import com.weaver.weaver_api.model.ProductReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, UUID> {
    Page<ProductReview> findByProductIdAndApprovedTrueOrderByCreatedAtDesc(UUID productId, Pageable pageable);
    boolean existsByProductIdAndCustomerId(UUID productId, UUID customerId);
}
