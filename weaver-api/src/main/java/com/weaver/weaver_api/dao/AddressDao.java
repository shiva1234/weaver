// src/main/java/com/weaver/weaver_api/dao/AddressDao.java
package com.weaver.weaver_api.dao;

import com.weaver.weaver_api.model.Address;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public class AddressDao {
    @PersistenceContext
    private EntityManager em;

    public Optional<Address> findById(Long id){
        return Optional.ofNullable(em.find(Address.class, id));
    }

    public List<Address> findByCustomer(Long customerId){
        return em.createQuery("select a from Address a where a.customerId = :cid order by a.id desc", Address.class)
                .setParameter("cid", customerId)
                .getResultList();
    }

    @Transactional
    public Address create(Address a){
        em.persist(a);
        return a;
    }

    @Transactional
    public Address update(Address a){
        return em.merge(a);
    }

    @Transactional
    public void delete(Long id){
        findById(id).ifPresent(em::remove);
    }
}