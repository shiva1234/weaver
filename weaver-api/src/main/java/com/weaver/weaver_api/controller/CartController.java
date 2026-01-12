package com.weaver.weaver_api.controller;

import com.weaver.weaver_api.model.Cart;
import com.weaver.weaver_api.model.CartItem;
import com.weaver.weaver_api.service.CartService;
import com.weaver.weaver_api.service.CustomerService;
import com.weaver.weaver_api.web.CartItemRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;
    private final CustomerService customerService;

    // Ensure guest cart (returns cart + you also return the token to set cookie client-side)
    @PostMapping("/ensure-guest")
    public Cart ensureGuest(@RequestParam String email) {
        return cartService.ensureGuestCart(email, customerService);
    }

    // Ensure customer cart
    @PostMapping("/ensure/{customerId}")
    public Cart ensureCustomer(@PathVariable Long customerId) {
        return cartService.ensureCustomerCart(customerId);
    }

    // Merge guest into customer on login
    @PostMapping("/attach-guest")
    public Cart attachGuest(@RequestParam String guestToken,
                            @RequestParam Long customerId) {
        return cartService.attachGuestCartToCustomer(guestToken, customerId);
    }

    // Query by guest token / customer
    @GetMapping("/guest/{guestToken}")
    public Cart getByGuest(@PathVariable String guestToken) {
        return cartService.findByGuestToken(guestToken);
    }

    @GetMapping("/by-customer/{customerId}")
    public Cart getByCustomer(@PathVariable Long customerId) {
        return cartService.findByCustomer(customerId);
    }

    // Items
    @GetMapping("/{cartId}/items")
    public List<CartItem> listItems(@PathVariable Long cartId) {
        return cartService.listItems(cartId);
    }

    @PostMapping("/{cartId}/items")
    @ResponseStatus(HttpStatus.CREATED)
    public CartItem add(@PathVariable Long cartId,
                        @RequestParam Long productId,
                        @RequestParam int quantity) {
        return cartService.addItem(cartId, productId, quantity);
    }

    @PutMapping("/{cartId}/items/{itemId}")
    public CartItem updateQty(@PathVariable Long cartId,
                              @PathVariable Long itemId,
                              @RequestParam int quantity) {
        return cartService.updateQuantity(cartId, itemId, quantity);
    }

    @DeleteMapping("/{cartId}/items/{itemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(@PathVariable Long cartId, @PathVariable Long itemId) {
        cartService.removeItem(cartId, itemId);
    }

    @DeleteMapping("/{cartId}/items")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clear(@PathVariable Long cartId) {
        cartService.clear(cartId);
    }
}