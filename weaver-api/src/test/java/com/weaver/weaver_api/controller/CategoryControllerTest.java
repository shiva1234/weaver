package com.weaver.weaver_api.controller;

import com.weaver.weaver_api.model.Category;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CategoryControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void shouldManageCategories() {
        // 1. Create
        Category cat = new Category();
        cat.setName("Test Category");
        
        ResponseEntity<Category> createResponse = restTemplate.postForEntity(
                "/api/categories",
                cat,
                Category.class
        );
        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        Category created = createResponse.getBody();
        assertThat(created.getId()).isNotNull();

        // 2. List
        ResponseEntity<List<Category>> listResponse = restTemplate.exchange(
                "/api/categories",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );
        assertThat(listResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(listResponse.getBody()).extracting(Category::getName).contains("Test Category");

        // 3. Update
        Category updatePayload = new Category();
        updatePayload.setName("Updated Category");
        
        ResponseEntity<Category> updateResponse = restTemplate.exchange(
                "/api/categories/" + created.getId(),
                HttpMethod.PUT,
                new HttpEntity<>(updatePayload),
                Category.class
        );
        assertThat(updateResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(updateResponse.getBody().getName()).isEqualTo("Updated Category");

        // 4. Delete
        restTemplate.delete("/api/categories/" + created.getId());
        
        // 5. Verify Gone (Get One)
        ResponseEntity<Category> getResponse = restTemplate.getForEntity(
                "/api/categories/" + created.getId(),
                Category.class
        );
        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}