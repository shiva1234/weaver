// src/main/java/com/weaver/weaver_api/dao/CartDao.java
package com.weaver.weaver_api.dao;

import com.weaver.weaver_api.model.Cart;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Repository
public class CartDao {
    @PersistenceContext
    private EntityManager em;

    public Optional<Cart> findById(UUID id){
        return Optional.ofNullable(em.find(Cart.class, id));
    }

    public Optional<Cart> findByCustomerId(Long customerId){
        var list = em.createQuery("select c from Cart c where c.customerId = :cid", Cart.class)
                .setParameter("cid", customerId)
                .setMaxResults(1)
                .getResultList();
        return list.isEmpty()? Optional.empty(): Optional.of(list.get(0));
    }

    @Transactional
    public Cart create(Cart c){
        em.persist(c);
        return c;
    }

    @Transactional
    public Cart save(Cart c){ // merge-or-persist
        if (c.getId() == null) {
            em.persist(c);
            return c;
        }
        return em.merge(c);
    }

    @Transactional
    public void delete(UUID id){
        findById(id).ifPresent(em::remove);
    }
}