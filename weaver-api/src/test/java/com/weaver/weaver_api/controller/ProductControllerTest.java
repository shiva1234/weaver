package com.weaver.weaver_api.controller;

import com.weaver.weaver_api.TestcontainersConfiguration;
import com.weaver.weaver_api.model.Product;
import com.weaver.weaver_api.web.PageResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.Import;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Import(TestcontainersConfiguration.class)
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
}