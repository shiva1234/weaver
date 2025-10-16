package com.weaver.weaver_api.dao;

import com.weaver.weaver_api.model.Product;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class ProductDao {

    @PersistenceContext
    private EntityManager em;

    @Transactional(readOnly = true)
    public List<Product> getProducts() {
        return em.createQuery("SELECT p FROM Product p", Product.class)
                .getResultList();
    }

    @Transactional
    public Product addProduct(Product product) {
        em.persist(product);  // persist instead of save()
        return product;
    }

    @Transactional(readOnly = true)
    public Product getProduct(Long id) {
        return em.find(Product.class, id);  // find instead of get()
    }

    @Transactional
    public boolean deleteProduct(Long id) {
        Product product = em.find(Product.class, id);
        if (product != null) {
            em.remove(product);
            return true;
        }
        return false;
    }
}