package com.weaver.weaver_api.repository;

import com.weaver.weaver_api.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, UUID> {

    // All items in a cart
    List<CartItem> findByCartId(UUID cartId);

    // A specific product in a cart (helpful for upsert-like behavior)
    boolean existsByCartIdAndProductId(UUID cartId, UUID productId);

    // If you often fetch one item for increment/decrement logic:
    Optional<CartItem> findFirstByCartIdAndProductId(UUID cartId, UUID productId);

    // Clean up items of a cart (useful before checkout)
    void deleteByCartId(UUID cartId);
}