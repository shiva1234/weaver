package com.weaver.weaver_api.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cart_items",
        indexes = {
                @Index(name = "idx_cartitem_cart", columnList = "cart_id"),
                @Index(name = "idx_cartitem_product", columnList = "product_id")
        })
public class CartItem extends Audited {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="cart_id", nullable = false)
    private Long cartId;

    @Column(name="product_id", nullable = false)
    private Long productId;

    @Column(name="product_name", nullable = false, length = 200)
    private String productName;

    @Column(name="price", precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    @Column(name="quantity", nullable = false)
    private Integer quantity;

    // ----- Getters -----
    public Long getId() { return id; }
    public Long getCartId() { return cartId; }
    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public BigDecimal getPrice() { return price; }
    public Integer getQuantity() { return quantity; }

    // ----- Setters -----
    public void setCartId(Long cartId) { this.cartId = cartId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public void setProductName(String productName) { this.productName = productName; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}