// src/main/java/com/weaver/weaver_api/service/AddressService.java
package com.weaver.weaver_api.service;

import com.weaver.weaver_api.model.Address;
import com.weaver.weaver_api.model.Customer;
import com.weaver.weaver_api.repository.AddressRepository;
import com.weaver.weaver_api.repository.CustomerRepository;
import com.weaver.weaver_api.web.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressService {

    private final AddressRepository addresses;
    private final CustomerRepository customers;

    @Transactional(readOnly = true)
    public List<Address> listByCustomer(Long customerId) {
        if (!customers.existsById(customerId)) {
            throw new NotFoundException("Customer id " + customerId + " not found");
        }
        return addresses.findByCustomerId(customerId);
    }

    @Transactional(readOnly = true)
    public Address getOne(Long id) {
        return addresses.findById(id)
                .orElseThrow(() -> new NotFoundException("Address id " + id + " not found"));
    }

    public Address create(Address a) {
        Long cid = a.getCustomer() != null ? a.getCustomer().getId() : null;
        if (cid == null) {
            throw new NotFoundException("Address must include customer id");
        }
        Customer c = customers.findById(cid)
                .orElseThrow(() -> new NotFoundException("Customer id " + cid + " not found"));

        a.setId(null);       // ensure INSERT
        a.setCustomer(c);    // attach managed Customer
        return addresses.save(a);
    }

    public Address update(Address a) {
        Long id = a.getId();
        if (id == null || !addresses.existsById(id)) {
            throw new NotFoundException("Address id " + id + " not found");
        }

        // If client attempts to change customer, validate it
        if (a.getCustomer() != null && a.getCustomer().getId() != null) {
            Long newCid = a.getCustomer().getId();
            Customer c = customers.findById(newCid)
                    .orElseThrow(() -> new NotFoundException("Customer id " + newCid + " not found"));
            a.setCustomer(c);
        }

        return addresses.save(a);
    }

    public void delete(Long id) {
        if (!addresses.existsById(id)) {
            throw new NotFoundException("Address id " + id + " not found");
        }
        addresses.deleteById(id);
    }
}