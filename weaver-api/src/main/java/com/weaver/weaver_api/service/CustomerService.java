package com.weaver.weaver_api.service;

import com.weaver.weaver_api.model.Customer;
import com.weaver.weaver_api.repository.CustomerRepository;
import com.weaver.weaver_api.web.NotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService {

    private final CustomerRepository customers;

    @Transactional(Transactional.TxType.SUPPORTS)
    public Customer getOne(Long id) {
        return customers.findById(id).orElseThrow(() -> new NotFoundException("Customer id " + id + " not found"));
    }

    public Customer create(Customer c) {
        // NOTE: hash password in a real app
        return customers.save(c);
    }

    public Customer getOrCreateGuestByEmail(String email) {
        return customers.findByEmailIgnoreCase(email)
                .orElseGet(() -> {
                    Customer c = new Customer();
                    c.setEmail(email);
                    c.setGuest(true);
                    return customers.save(c);
                });
    }

    public Customer update(Customer c) {
        if (c.getId() == null || !customers.existsById(c.getId())) {
            throw new NotFoundException("Customer id " + c.getId() + " not found");
        }
        return customers.save(c);
    }

    public void delete(Long id) {
        if (!customers.existsById(id)) throw new NotFoundException("Customer id " + id + " not found");
        customers.deleteById(id);
    }
}