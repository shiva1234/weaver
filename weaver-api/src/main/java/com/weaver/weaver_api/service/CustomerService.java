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
    public Customer getOne(Long id) {
        return customers.findById(id).orElseThrow(() -> new NotFoundException("Customer id " + id + " not found"));
    }

    public Customer create(Customer c) {
        if (c.getPassword() != null && !c.getPassword().isBlank()) {
            c.setPassword(passwordEncoder.encode(c.getPassword()));
        }
        return customers.save(c);
    }

    public Customer getOrCreateGuestByEmail(String email) {
        return customers.findByEmailIgnoreCase(email)
                .orElseGet(() -> {
                    Customer c = new Customer();
                    c.setEmail(email);
                    c.setGuest(true);
                    // Guests might not have a password initially, or we set a dummy one if DB requires it
                    // Assuming DB allows null or we handle it. The entity says nullable=false, so we need a placeholder or handle it.
                    // For now, let's set a random unguessable password for guests if needed, or rely on them setting it later.
                    c.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
                    return customers.save(c);
                });
    }

    public Customer update(Long id, Customer c) {
        Customer existing = customers.findById(id)
                .orElseThrow(() -> new NotFoundException("Customer id " + id + " not found"));
        
        // Update fields
        existing.setFirstName(c.getFirstName());
        existing.setLastName(c.getLastName());
        existing.setPhone(c.getPhone());
        existing.setEmail(c.getEmail());
        existing.setGuest(c.isGuest());
        
        // Only update password if provided and not empty
        if (c.getPassword() != null && !c.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(c.getPassword()));
        }
        
        return customers.save(existing);
    }

    public void delete(Long id) {
        if (!customers.existsById(id)) throw new NotFoundException("Customer id " + id + " not found");
        customers.deleteById(id);
    }

    public String forgotPassword(String email) {
        Customer customer = customers.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new NotFoundException("Customer with email " + email + " not found"));

        String token = UUID.randomUUID().toString();
        customer.setResetToken(token);
        customer.setResetTokenExpiry(LocalDateTime.now().plusHours(1)); // Token valid for 1 hour
        customers.save(customer);

        // In a real application, send this token via email
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