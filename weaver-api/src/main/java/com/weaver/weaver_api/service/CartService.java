package com.weaver.weaver_api.service;

import com.weaver.weaver_api.model.Cart;
import com.weaver.weaver_api.model.CartItem;
import com.weaver.weaver_api.model.Product;
import com.weaver.weaver_api.repository.CartItemRepository;
import com.weaver.weaver_api.repository.CartRepository;
import com.weaver.weaver_api.repository.CustomerRepository;
import com.weaver.weaver_api.repository.ProductRepository;
import com.weaver.weaver_api.web.NotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartRepository carts;
    private final CartItemRepository cartItems;
    private final ProductRepository products;
    private final CustomerRepository customers;

    /** Ensure a single active cart for a customer (create if missing). */
    public Cart ensureCustomerCart(UUID customerId) {
        if (!customers.existsById(customerId)) {
            throw new NotFoundException("Customer id " + customerId + " not found");
        }
        return carts.findByCustomerId(customerId).orElseGet(() -> {
            Cart c = new Cart();
            c.setCustomerId(customerId);
            c.setTotalPrice(BigDecimal.ZERO);
            return carts.save(c);
        });
    }

    /** Ensure a guest cart exists for the given email (or create a new one with a token). */
    public Cart ensureGuestCart(String email, CustomerService customerService) {
        var customer = customerService.getOrCreateGuestByEmail(email);
        
        return carts.findByCustomerId(customer.getId()).orElseGet(() -> {
            Cart c = new Cart();
            c.setCustomerId(customer.getId());
            c.setGuestToken(UUID.randomUUID().toString());
            c.setTotalPrice(BigDecimal.ZERO);
            return carts.save(c);
        });
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public Cart findByCustomer(UUID customerId) {
        return carts.findByCustomerId(customerId)
                .orElseThrow(() -> new NotFoundException("No active cart for customer " + customerId));
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public Cart findByGuestToken(String guestToken) {
        return carts.findByGuestToken(guestToken)
                .orElseThrow(() -> new NotFoundException("No active cart for guest token " + guestToken));
    }

    /** Merge a guest cart into a logged-in customer's cart. */
    public Cart attachGuestCartToCustomer(String guestToken, UUID customerId) {
        Cart guestCart = carts.findByGuestToken(guestToken).orElse(null);
        Cart customerCart = ensureCustomerCart(customerId);

        if (guestCart != null && !guestCart.getId().equals(customerCart.getId())) {
            List<CartItem> guestItems = cartItems.findByCartId(guestCart.getId());
            for (CartItem gi : guestItems) {
                CartItem existing = cartItems.findFirstByCartIdAndProductId(customerCart.getId(), gi.getProductId()).orElse(null);
                if (existing != null) {
                    existing.setQuantity(existing.getQuantity() + gi.getQuantity());
                    cartItems.save(existing);
                } else {
                    gi.setCartId(customerCart.getId());
                    cartItems.save(gi);
                }
            }
            carts.delete(guestCart);
            
            recalcCartTotal(customerCart);
        }
        
        return customerCart;
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public List<CartItem> listItems(UUID cartId) {
        if (!carts.existsById(cartId)) {
            throw new NotFoundException("Cart " + cartId + " not found");
        }
        return cartItems.findByCartId(cartId);
    }

    /** Add an item (or increase qty if already present). */
    public CartItem addItem(UUID cartId, UUID productId, int qty) {
        if (qty < 1) throw new IllegalArgumentException("qty >= 1 required");

        Cart cart = carts.findById(cartId)
                .orElseThrow(() -> new NotFoundException("Cart not found"));

        Product product = products.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product " + productId + " not found"));

        CartItem item = cartItems.findFirstByCartIdAndProductId(cartId, productId).orElse(null);
        if (item == null) {
            item = new CartItem();
            item.setCartId(cart.getId());
            item.setProductId(product.getId());
            item.setProductName(product.getName());
            item.setPrice(product.getSellPrice());
            item.setQuantity(qty);
        } else {
            item.setQuantity(item.getQuantity() + qty);
        }

        cartItems.save(item);
        recalcCartTotal(cart);
        return item;
    }

    /** Update quantity of a specific cart item. */
    public CartItem updateQuantity(UUID cartId, UUID itemId, int qty) {
        if (qty < 1) throw new IllegalArgumentException("qty >= 1 required");

        Cart cart = carts.findById(cartId)
                .orElseThrow(() -> new NotFoundException("Cart not found"));

        CartItem item = cartItems.findById(itemId)
                .orElseThrow(() -> new NotFoundException("Cart item not found"));

        if (!item.getCartId().equals(cartId)) {
            throw new NotFoundException("Item doesn't belong to cart");
        }

        item.setQuantity(qty);
        cartItems.save(item);

        recalcCartTotal(cart);
        return item;
    }

    /** Remove one item from the cart. */
    public void removeItem(UUID cartId, UUID itemId) {
        Cart cart = carts.findById(cartId)
                .orElseThrow(() -> new NotFoundException("Cart not found"));

        CartItem item = cartItems.findById(itemId)
                .orElseThrow(() -> new NotFoundException("Cart item not found"));

        if (!item.getCartId().equals(cartId)) {
            throw new NotFoundException("Item doesn't belong to cart");
        }

        cartItems.delete(item);
        recalcCartTotal(cart);
    }

    /** Clear the cart entirely. */
    public void clear(UUID cartId) {
        Cart cart = carts.findById(cartId)
                .orElseThrow(() -> new NotFoundException("Cart not found"));

        cartItems.deleteByCartId(cartId);
        cart.setTotalPrice(BigDecimal.ZERO);
        carts.save(cart);
    }

    /** Recalculate cart total with BigDecimal precision. */
    private void recalcCartTotal(Cart cart) {
        BigDecimal total = cartItems.findByCartId(cart.getId()).stream()
                .map(ci -> ci.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotalPrice(total);
        carts.save(cart);
    }
}