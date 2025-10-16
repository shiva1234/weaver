package com.weaver.weaver_api.service;

import com.weaver.weaver_api.dao.ProductDao;
import com.weaver.weaver_api.model.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductDao productDao;

    public List<Product> getProducts() {
        return productDao.getProducts();
    }

    @Transactional
    public Product addProduct(Product product) {
        return productDao.addProduct(product);
    }

    public Product getProduct(Long id) {
        return productDao.getProduct(id);
    }

    @Transactional
    public boolean deleteProduct(Long id) {
        return productDao.deleteProduct(id);
    }
}