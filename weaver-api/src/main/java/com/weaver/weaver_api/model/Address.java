// src/main/java/com/weaver/weaver_api/model/Address.java
package com.weaver.weaver_api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "address")
public class Address extends Audited {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // tie to a valid customer
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name="address_line1", nullable = false, length = 255)
    private String addressLine1;

    @Column(name="address_line2", length = 255)
    private String addressLine2;

    @Column(name="city", nullable = false, length = 120)
    private String city;

    @Column(name="state", nullable = false, length = 120)
    private String state;

    @Column(name="postal_code", nullable = false, length = 32)
    private String postalCode;

    @Column(name="country", nullable = false, length = 120)
    private String country;

    // getters/setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }
    public String getAddressLine1() { return addressLine1; }
    public void setAddressLine1(String addressLine1) { this.addressLine1 = addressLine1; }
    public String getLine2() { return addressLine2; }
    public void setAddressLine2(String addressLine1) { this.addressLine2 = addressLine2; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
}