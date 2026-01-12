// src/main/java/com/weaver/weaver_api/dao/CategoryDao.java
package com.weaver.weaver_api.dao;

import com.weaver.weaver_api.model.Category;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public class CategoryDao {
    @PersistenceContext
    private EntityManager em;

    public Optional<Category> findById(Long id) {
        return Optional.ofNullable(em.find(Category.class, id));
    }

    public Optional<Category> findBySlug(String slug) {
        var list = em.createQuery("select c from Category c where c.slug = :slug", Category.class)
                .setParameter("slug", slug)
                .setMaxResults(1)
                .getResultList();
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    public List<Category> findAll() {
        return em.createQuery("select c from Category c order by c.name asc", Category.class)
                .getResultList();
    }

    @Transactional
    public Category create(Category c) {
        em.persist(c);
        return c;
    }

    @Transactional
    public Category update(Category c) {
        return em.merge(c);
    }

    @Transactional
    public void delete(Long id) {
        findById(id).ifPresent(em::remove);
    }
}