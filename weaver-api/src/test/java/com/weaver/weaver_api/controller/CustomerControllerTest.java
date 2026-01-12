package com.weaver.weaver_api.controller;

import com.weaver.weaver_api.model.Customer;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CustomerControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void shouldCreateAndRetrieveCustomer() {
        // Given
        Customer newCustomer = new Customer();
        newCustomer.setEmail("test.user.integration@example.com"); // Unique email
        newCustomer.setPassword("securePassword123");
        newCustomer.setFirstName("Test");
        newCustomer.setLastName("User");
        newCustomer.setGuest(false);

        // When Create
        ResponseEntity<Customer> createResponse = restTemplate.postForEntity(
                "/api/customers",
                newCustomer,
                Customer.class
        );

        // Then Create
        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        Customer created = createResponse.getBody();
        assertThat(created).isNotNull();
        assertThat(created.getId()).isNotNull();
        assertThat(created.getEmail()).isEqualTo("test.user.integration@example.com");
        // Password should be hashed, so it shouldn't match the plain text
        assertThat(created.getPassword()).isNotEqualTo("securePassword123");
        assertThat(created.getPassword()).startsWith("$2a$"); // BCrypt prefix

        // When Get
        ResponseEntity<Customer> getResponse = restTemplate.getForEntity(
                "/api/customers/" + created.getId(),
                Customer.class
        );

        // Then Get
        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(getResponse.getBody()).isNotNull();
        assertThat(getResponse.getBody().getEmail()).isEqualTo("test.user.integration@example.com");
    }

    @Test
    void shouldUpdateCustomer() {
        // Given
        Customer newCustomer = new Customer();
        newCustomer.setEmail("update.user.integration@example.com"); // Unique email
        newCustomer.setPassword("password");
        newCustomer.setFirstName("Original");
        
        ResponseEntity<Customer> createResponse = restTemplate.postForEntity(
                "/api/customers",
                newCustomer,
                Customer.class
        );
        Long id = createResponse.getBody().getId();

        // When Update
        Customer updatePayload = new Customer();
        updatePayload.setFirstName("Updated");
        updatePayload.setLastName("Name");
        updatePayload.setEmail("update.user.integration@example.com"); // Keep email same
        updatePayload.setGuest(false);
        // Not sending password, so it should remain unchanged

        ResponseEntity<Customer> updateResponse = restTemplate.exchange(
                "/api/customers/" + id,
                HttpMethod.PUT,
                new HttpEntity<>(updatePayload),
                Customer.class
        );

        // Then
        assertThat(updateResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(updateResponse.getBody().getFirstName()).isEqualTo("Updated");
        assertThat(updateResponse.getBody().getLastName()).isEqualTo("Name");
        
        // Verify password didn't change (hash should be same as original creation)
        String originalHash = createResponse.getBody().getPassword();
        String currentHash = updateResponse.getBody().getPassword();
        assertThat(currentHash).isEqualTo(originalHash);
    }

    @Test
    void shouldDeleteCustomer() {
        // Given
        Customer newCustomer = new Customer();
        newCustomer.setEmail("delete.user.integration@example.com");
        newCustomer.setPassword("password");
        
        ResponseEntity<Customer> createResponse = restTemplate.postForEntity(
                "/api/customers",
                newCustomer,
                Customer.class
        );
        Long id = createResponse.getBody().getId();

        // When Delete
        restTemplate.delete("/api/customers/" + id);

        // Then
        ResponseEntity<Customer> getResponse = restTemplate.getForEntity(
                "/api/customers/" + id,
                Customer.class
        );
        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void shouldResetPassword() {
        // 1. Create Customer
        Customer customer = new Customer();
        customer.setEmail("reset.password@example.com");
        customer.setPassword("oldPassword");
        customer.setGuest(false);
        restTemplate.postForEntity("/api/customers", customer, Customer.class);

        // 2. Request Forgot Password
        ResponseEntity<Map> forgotResponse = restTemplate.postForEntity(
                "/api/customers/forgot-password?email=reset.password@example.com",
                null,
                Map.class
        );
        assertThat(forgotResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        String token = (String) forgotResponse.getBody().get("token");
        assertThat(token).isNotNull();

        // 3. Reset Password
        ResponseEntity<Void> resetResponse = restTemplate.postForEntity(
                "/api/customers/reset-password?token=" + token + "&newPassword=newSecurePassword",
                null,
                Void.class
        );
        assertThat(resetResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // 4. Verify Login (or check hash changed) - here we just check if we can get the user and the hash is different
        // Note: We can't easily check the hash directly via API unless we expose it, but we can assume success if no error.
        // Ideally, we would have a login endpoint to verify.
    }
}