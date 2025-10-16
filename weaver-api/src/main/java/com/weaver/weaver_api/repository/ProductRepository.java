package com.weaver.weaver_api.repository;

import com.weaver.weaver_api.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
