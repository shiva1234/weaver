// src/main/java/com/weaver/weaver_api/dao/CartItemDao.java
package com.weaver.weaver_api.dao;

import com.weaver.weaver_api.model.CartItem;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class CartItemDao {
    @PersistenceContext
    private EntityManager em;

    public Optional<CartItem> findById(UUID id){
        return Optional.ofNullable(em.find(CartItem.class, id));
    }

    public List<CartItem> findByCartId(UUID cartId){
        return em.createQuery("select ci from CartItem ci where ci.cartId = :cid order by ci.createdAt asc", CartItem.class)
                .setParameter("cid", cartId)
                .getResultList();
    }

    public Optional<CartItem> findByCartAndProduct(UUID cartId, Long productId){
        var list = em.createQuery(
                        "select ci from CartItem ci where ci.cartId = :cid and ci.productId = :pid",
                        CartItem.class)
                .setParameter("cid", cartId)
                .setParameter("pid", productId)
                .setMaxResults(1)
                .getResultList();
        return list.isEmpty()? Optional.empty(): Optional.of(list.get(0));
    }

    @Transactional
    public CartItem create(CartItem ci){
        em.persist(ci);
        return ci;
    }

    @Transactional
    public CartItem update(CartItem ci){
        return em.merge(ci);
    }

    @Transactional
    public void delete(UUID id){
        findById(id).ifPresent(em::remove);
    }

    @Transactional
    public void deleteByCart(UUID cartId){
        em.createQuery("delete from CartItem ci where ci.cartId = :cid")
                .setParameter("cid", cartId)
                .executeUpdate();
    }
}