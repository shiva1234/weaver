package com.weaver.weaver_api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "product_review")
@Getter
@Setter
public class ProductReview extends Audited {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "product_id", nullable = false)
    private UUID productId;

    @Column(name = "customer_id", nullable = false)
    private UUID customerId;

    @Column(name = "rating", nullable = false)
    private Integer rating; // 1-5

    @Column(name = "title", length = 200)
    private String title;

    @Column(name = "comment", columnDefinition = "text")
    private String comment;

    @Column(name = "is_verified", nullable = false)
    private Boolean verified = Boolean.FALSE;

    @Column(name = "is_approved", nullable = false)
    private Boolean approved = Boolean.FALSE;

    @Column(name = "helpful_count")
    private Integer helpfulCount = 0;
}
