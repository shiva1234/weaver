package com.weaver.weaver_api.service;

import com.weaver.weaver_api.model.Customer;
import com.weaver.weaver_api.repository.CustomerRepository;
import com.weaver.weaver_api.web.NotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService {

    private final CustomerRepository customers;
    private final PasswordEncoder passwordEncoder;

    @Transactional(Transactional.TxType.SUPPORTS)
    public Customer getOne(UUID id) {
        return customers.findById(id).orElseThrow(() -> new NotFoundException("Customer id " + id + " not found"));
    }

    public Customer create(Customer c) {
        if (c.getPassword() != null && !c.getPassword().isBlank()) {
            c.setPassword(passwordEncoder.encode(c.getPassword()));
        }
        c.setGuest(false);
        return customers.save(c);
    }

    public Customer login(String email, String password) {
        Customer customer = customers.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new NotFoundException("Invalid email or password"));
        if (!passwordEncoder.matches(password, customer.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        return customer;
    }

    public Customer getOrCreateGuestByEmail(String email) {
        return customers.findByEmailIgnoreCase(email)
                .orElseGet(() -> {
                    Customer c = new Customer();
                    c.setEmail(email);
                    c.setGuest(true);
                    c.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
                    return customers.save(c);
                });
    }

    public Customer update(UUID id, Customer c) {
        Customer existing = customers.findById(id)
                .orElseThrow(() -> new NotFoundException("Customer id " + id + " not found"));
        
        existing.setFirstName(c.getFirstName());
        existing.setLastName(c.getLastName());
        existing.setPhone(c.getPhone());
        existing.setEmail(c.getEmail());
        existing.setGuest(c.isGuest());
        
        if (c.getPassword() != null && !c.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(c.getPassword()));
        }
        
        return customers.save(existing);
    }

    public void delete(UUID id) {
        if (!customers.existsById(id)) throw new NotFoundException("Customer id " + id + " not found");
        customers.deleteById(id);
    }

    public String forgotPassword(String email) {
        Customer customer = customers.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new NotFoundException("Customer with email " + email + " not found"));

        String token = UUID.randomUUID().toString();
        customer.setResetToken(token);
        customer.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        customers.save(customer);

        return token;
    }

    public void resetPassword(String token, String newPassword) {
        Customer customer = customers.findByResetToken(token)
                .orElseThrow(() -> new NotFoundException("Invalid reset token"));

        if (customer.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reset token has expired");
        }

        customer.setPassword(passwordEncoder.encode(newPassword));
        customer.setResetToken(null);
        customer.setResetTokenExpiry(null);
        customers.save(customer);
    }
}