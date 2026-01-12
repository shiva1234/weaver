// src/main/java/com/weaver/weaver_api/dao/CustomerDao.java
package com.weaver.weaver_api.dao;

import com.weaver.weaver_api.model.Customer;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public class CustomerDao {
    @PersistenceContext
    private EntityManager em;

    public Optional<Customer> findById(Long id){
        return Optional.ofNullable(em.find(Customer.class, id));
    }

    public Optional<Customer> findByEmail(String email){
        var list = em.createQuery("select c from Customer c where lower(c.email) = lower(:e)", Customer.class)
                .setParameter("e", email)
                .setMaxResults(1)
                .getResultList();
        return list.isEmpty()? Optional.empty(): Optional.of(list.get(0));
    }

    @Transactional
    public Customer create(Customer c){
        em.persist(c);
        return c;
    }

    @Transactional
    public Customer update(Customer c){
        return em.merge(c);
    }

    @Transactional
    public void delete(Long id){
        findById(id).ifPresent(em::remove);
    }
}