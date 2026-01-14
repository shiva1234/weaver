package com.weaver.weaver_api.model;

import java.math.BigDecimal;
import java.util.UUID;
import jakarta.persistence.*;

@Entity
@Table(
        name = "cart",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_cart_customer", columnNames = {"customer_id"}),
                @UniqueConstraint(name = "uk_cart_guest_token", columnNames = {"guest_token"})
        },
        indexes = {
                @Index(name = "idx_cart_customer", columnList = "customer_id"),
                @Index(name = "idx_cart_guest_token", columnList = "guest_token")
        }
)
public class Cart extends Audited {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name="customer_id")
    private UUID customerId;  // nullable for guests

    @Column(name="guest_token")
    private String guestToken; // nullable for customers

    @Column(name="total_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalPrice = BigDecimal.ZERO;

    // getters/setters
    public UUID getId() { return id; }
    public UUID getCustomerId() { return customerId; }
    public String getGuestToken() { return guestToken; }
    public BigDecimal getTotalPrice() { return totalPrice; }

    public void setCustomerId(UUID customerId) { this.customerId = customerId; }
    public void setGuestToken(String guestToken) { this.guestToken = guestToken; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
}