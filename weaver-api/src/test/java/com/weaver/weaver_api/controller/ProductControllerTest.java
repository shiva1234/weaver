package com.weaver.weaver_api.controller;

import com.weaver.weaver_api.model.Product;
import com.weaver.weaver_api.web.PageResponse;
import com.weaver.weaver_api.web.ProductRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ProductControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void shouldReturnPagedProducts() {
        // When
        ResponseEntity<PageResponse<Product>> response = restTemplate.exchange(
                "/api/products?page=1&size=10",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().content()).isNotEmpty();
        
        // Verify data from V2__insert_product_data.sql
        Product firstProduct = response.getBody().content().stream()
                .filter(p -> p.getSku().equals("SAR-BAN-001"))
                .findFirst()
                .orElseThrow();
        
        assertThat(firstProduct.getName()).isEqualTo("Banarasi Silk Saree");
        assertThat(firstProduct.getSellPrice()).isEqualByComparingTo(BigDecimal.valueOf(180.00));
    }

    @Test
    void shouldFilterByPrice() {
        // When filtering for items >= 100.00
        ResponseEntity<PageResponse<Product>> response = restTemplate.exchange(
                "/api/products?minPrice=100",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        
        // Should include Banarasi (180), Kanjivaram (210), Pashmina (120)
        // Should NOT include Cotton Ikat (25), Chanderi (50), Cushion (18)
        assertThat(response.getBody().content())
                .extracting(Product::getSku)
                .contains("SAR-BAN-001", "SAR-KAN-002", "STO-PAS-001")
                .doesNotContain("FAB-IKA-001", "DUP-CHA-001", "HOM-CUS-001");
    }

    @Test
    void shouldCreateAndUpdateProduct() {
        // Given
        ProductRequest request = new ProductRequest(
                "Test Product",
                "Description",
                1L,
                BigDecimal.valueOf(50.00),
                BigDecimal.valueOf(100.00),
                10,
                "TEST-SKU-001",
                true,
                List.of("img1.jpg"),
                "img1.jpg"
        );

        // When Create
        ResponseEntity<Product> createResponse = restTemplate.postForEntity(
                "/api/products",
                request,
                Product.class
        );

        // Then Create
        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        Product created = createResponse.getBody();
        assertThat(created).isNotNull();
        assertThat(created.getId()).isNotNull();
        assertThat(created.getName()).isEqualTo("Test Product");

        // When Update
        ProductRequest updateRequest = new ProductRequest(
                "Updated Product",
                "Updated Description",
                1L,
                BigDecimal.valueOf(60.00),
                BigDecimal.valueOf(120.00),
                5,
                "TEST-SKU-001",
                true,
                List.of("img1.jpg"),
                "img1.jpg"
        );

        ResponseEntity<Product> updateResponse = restTemplate.exchange(
                "/api/products/" + created.getId(),
                HttpMethod.PUT,
                new HttpEntity<>(updateRequest),
                Product.class
        );

        // Then Update
        assertThat(updateResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(updateResponse.getBody().getName()).isEqualTo("Updated Product");
        assertThat(updateResponse.getBody().getSellPrice()).isEqualByComparingTo(BigDecimal.valueOf(120.00));
    }

    @Test
    void shouldDeleteProduct() {
        // Given
        ProductRequest request = new ProductRequest(
                "Delete Me",
                "Description",
                1L,
                BigDecimal.TEN,
                BigDecimal.TEN,
                1,
                "DEL-SKU-001",
                true,
                List.of(),
                null
        );
        Product created = restTemplate.postForObject("/api/products", request, Product.class);

        // When Delete
        restTemplate.delete("/api/products/" + created.getId());

        // Then Verify Gone
        ResponseEntity<Product> getResponse = restTemplate.getForEntity(
                "/api/products/" + created.getId(),
                Product.class
        );
        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}