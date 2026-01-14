// src/main/java/com/weaver/weaver_api/repository/AddressRepository.java
package com.weaver.weaver_api.repository;

import com.weaver.weaver_api.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AddressRepository extends JpaRepository<Address, UUID> {
    List<Address> findByCustomerId(UUID customerId);
}