// Product.java
package com.weaver.weaver_api.model;

import jakarta.persistence.*;
import jakarta.persistence.Index;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "product",
        indexes = {
                @Index(name = "idx_product_category", columnList = "category_id"),
                @Index(name = "idx_product_active", columnList = "is_active"),
                @Index(name = "idx_product_price", columnList = "sell_price"),
                @Index(name = "idx_product_name", columnList = "name")
        },
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_product_sku", columnNames = {"sku"})
        })
public class Product extends Audited {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Setter
    @Column(name="name", nullable = false, length = 200)
    private String name;

    @Setter
    @Column(name="description", columnDefinition = "text")
    private String description;

    @Setter
    @Column(name="category_id", nullable = false)
    private UUID categoryId;

    @Column(name="vendor_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal vendorPrice;

    @Column(name="sell_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal sellPrice;

    @Column(name="stock_qty", nullable = false)
    private Integer stockQty;

    @Column(name="sku", nullable = false, length = 80)
    private String sku;

    @Column(name="is_active", nullable = false)
    private Boolean active = Boolean.TRUE;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name="images", nullable = false)
    private List<String> images; // e.g. ["s3://bucket/products/product_id=1/uuid.jpg", ...]

    @Column(name="primary_image", length = 1024)
    private String primaryImage;

    // getters/setters
    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public UUID getCategoryId() { return categoryId; }
    public BigDecimal getVendorPrice() { return vendorPrice; }
    public BigDecimal getSellPrice() { return sellPrice; }
    public Integer getStockQty() { return stockQty; }
    public String getSku() { return sku; }
    public Boolean getActive() { return active; }
    public List<String> getImages() { return images; }
    public String getPrimaryImage() { return primaryImage; }

    public void setVendorPrice(BigDecimal vendorPrice) { this.vendorPrice = vendorPrice; }
    public void setSellPrice(BigDecimal sellPrice) { this.sellPrice = sellPrice; }
    public void setStockQty(Integer stockQty) { this.stockQty = stockQty; }
    public void setSku(String sku) { this.sku = sku; }
    public void setActive(Boolean active) { this.active = active; }
    public void setImages(List<String> images) { this.images = images; }
    public void setPrimaryImage(String primaryImage) { this.primaryImage = primaryImage; }
}