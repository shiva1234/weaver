package com.weaver.weaver_api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "recently_viewed")
@Getter
@Setter
public class RecentlyViewed {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "customer_id")
    private UUID customerId;

    @Column(name = "guest_token", length = 255)
    private String guestToken;

    @Column(name = "product_id", nullable = false)
    private UUID productId;

    @Column(name = "viewed_at", nullable = false)
    private OffsetDateTime viewedAt = OffsetDateTime.now();
}
