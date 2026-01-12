package com.weaver.weaver_api.controller;

import com.weaver.weaver_api.model.Customer;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final com.weaver.weaver_api.service.CustomerService customerService;

    @GetMapping("/{id}")
    public Customer get(@PathVariable Long id) {
        return customerService.getOne(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Customer create(@Valid @RequestBody Customer body) {
        return customerService.create(body);
    }

    @PutMapping("/{id}")
    public Customer update(@PathVariable Long id, @Valid @RequestBody Customer body) {
        return customerService.update(id, body);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        customerService.delete(id);
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@RequestParam String email) {
        String token = customerService.forgotPassword(email);
        return Map.of("message", "Reset token generated", "token", token);
    }

    @PostMapping("/reset-password")
    public void resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        customerService.resetPassword(token, newPassword);
    }
}