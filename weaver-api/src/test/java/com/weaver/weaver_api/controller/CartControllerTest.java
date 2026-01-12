package com.weaver.weaver_api.controller;

import com.weaver.weaver_api.model.Cart;
import com.weaver.weaver_api.model.CartItem;
import com.weaver.weaver_api.model.Customer;
import com.weaver.weaver_api.model.Product;
import com.weaver.weaver_api.web.ProductRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CartControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void shouldManageCustomerCart() {
        // 1. Create Customer
        Customer customer = new Customer();
        customer.setEmail("cart.user@example.com");
        customer.setPassword("pass");
        customer.setGuest(false);
        Customer createdCustomer = restTemplate.postForObject("/api/customers", customer, Customer.class);

        // 2. Create Product
        ProductRequest productReq = new ProductRequest(
                "Cart Product", "Desc", 1L, BigDecimal.TEN, BigDecimal.valueOf(20.00), 100, "CART-SKU-001", true, List.of(), null
        );
        Product createdProduct = restTemplate.postForObject("/api/products", productReq, Product.class);

        // 3. Ensure Cart
        ResponseEntity<Cart> cartResponse = restTemplate.postForEntity(
                "/api/carts/ensure/" + createdCustomer.getId(),
                null,
                Cart.class
        );
        assertThat(cartResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        Long cartId = cartResponse.getBody().getId();

        // 4. Add Item
        ResponseEntity<CartItem> addItemResponse = restTemplate.postForEntity(
                "/api/carts/" + cartId + "/items?productId=" + createdProduct.getId() + "&quantity=2",
                null,
                CartItem.class
        );
        assertThat(addItemResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(addItemResponse.getBody().getQuantity()).isEqualTo(2);

        // 5. List Items
        ResponseEntity<List<CartItem>> listResponse = restTemplate.exchange(
                "/api/carts/" + cartId + "/items",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );
        assertThat(listResponse.getBody()).hasSize(1);
        assertThat(listResponse.getBody().get(0).getProductName()).isEqualTo("Cart Product");

        // 6. Update Quantity
        restTemplate.put("/api/carts/" + cartId + "/items/" + addItemResponse.getBody().getId() + "?quantity=5", null);
        
        // Verify Update
        ResponseEntity<List<CartItem>> updatedList = restTemplate.exchange(
                "/api/carts/" + cartId + "/items",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );
        assertThat(updatedList.getBody().get(0).getQuantity()).isEqualTo(5);

        // 7. Remove Item
        restTemplate.delete("/api/carts/" + cartId + "/items/" + addItemResponse.getBody().getId());
        
        // Verify Empty
        ResponseEntity<List<CartItem>> emptyList = restTemplate.exchange(
                "/api/carts/" + cartId + "/items",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );
        assertThat(emptyList.getBody()).isEmpty();
    }

    @Test
    void shouldManageGuestCart() {
        // 1. Ensure Guest Cart
        ResponseEntity<Cart> cartResponse = restTemplate.postForEntity(
                "/api/carts/ensure-guest?email=guest.cart@example.com",
                null,
                Cart.class
        );
        assertThat(cartResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        Cart cart = cartResponse.getBody();
        assertThat(cart.getGuestToken()).isNotNull();

        // 2. Get by Token
        ResponseEntity<Cart> getResponse = restTemplate.getForEntity(
                "/api/carts/guest/" + cart.getGuestToken(),
                Cart.class
        );
        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(getResponse.getBody().getId()).isEqualTo(cart.getId());
    }
}