// src/main/java/com/weaver/weaver_api/dao/ProductDao.java
package com.weaver.weaver_api.dao;

import com.weaver.weaver_api.model.Product;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Repository
public class ProductDao {
    @PersistenceContext
    private EntityManager em;

    public Optional<Product> findById(Long id) {
        return Optional.ofNullable(em.find(Product.class, id));
    }

    /**
     * Flexible finder with optional filters:
     * @param page 1-based
     * @param size page size
     * @param sort field to sort by (allow-listed)
     * @param dir "asc" or "desc"
     * @param query substring match on name (optional)
     * @param minPrice min sellPrice (optional)
     * @param maxPrice max sellPrice (optional)
     * @param categoryId filter by category (optional)
     * @param active filter by isActive (optional)
     */
    public PageResult<Product> findPaged(
            int page, int size, String sort, String dir,
            String query, Integer minPrice, Integer maxPrice,
            Long categoryId, Boolean active
    ) {
        int p = Math.max(1, page);
        int s = Math.max(1, size);

        // allow-list sort fields to avoid injection; these are entity PROPERTY names
        Set<String> sortable = Set.of("sellPrice","vendorPrice","name","createdAt","updatedAt","stockQty","id");
        String sortField = (sort != null && sortable.contains(sort)) ? sort : "sellPrice";
        String order = "desc".equalsIgnoreCase(dir) ? "desc" : "asc";

        StringBuilder where = new StringBuilder(" where 1=1 ");
        Map<String,Object> params = new HashMap<>();

        if (query != null && !query.isBlank()) {
            where.append(" and lower(p.name) like :q ");
            params.put("q", "%" + query.toLowerCase() + "%");
        }
        if (minPrice != null) {
            where.append(" and p.sellPrice >= :minp ");
            params.put("minp", minPrice);
        }
        if (maxPrice != null) {
            where.append(" and p.sellPrice <= :maxp ");
            params.put("maxp", maxPrice);
        }
        if (categoryId != null) {
            where.append(" and p.categoryId = :cid ");
            params.put("cid", categoryId);
        }
        if (active != null) {
            where.append(" and p.active = :act ");
            params.put("act", active);
        }

        String base = " from Product p ";
        String jpql = "select p " + base + where + " order by p." + sortField + " " + order;
        String countJpql = "select count(p) " + base + where;

        TypedQuery<Product> q = em.createQuery(jpql, Product.class)
                .setFirstResult((p - 1) * s)
                .setMaxResults(s);
        TypedQuery<Long> qc = em.createQuery(countJpql, Long.class);

        params.forEach((k,v) -> { q.setParameter(k, v); qc.setParameter(k, v); });

        List<Product> rows = q.getResultList();
        long total = qc.getSingleResult();
        int pages = (int) Math.ceil(total / (double) s);

        return new PageResult<>(rows, p, s, total, pages);
    }

    public List<Product> findAllActive() {
        return em.createQuery(
                "select p from Product p where p.active = true order by p.id desc",
                Product.class
        ).getResultList();
    }

    @Transactional
    public Product create(Product p) {
        em.persist(p);
        return p;
    }

    @Transactional
    public Product update(Product p) {
        return em.merge(p);
    }

    @Transactional
    public void delete(Long id) {
        findById(id).ifPresent(em::remove);
    }
}