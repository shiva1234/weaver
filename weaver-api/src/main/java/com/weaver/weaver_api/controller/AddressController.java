// src/main/java/com/weaver/weaver_api/controller/AddressController.java
package com.weaver.weaver_api.controller;

import com.weaver.weaver_api.model.Address;
import com.weaver.weaver_api.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping("/by-customer/{customerId}")
    public List<Address> listByCustomer(@PathVariable UUID customerId) {
        return addressService.listByCustomer(customerId);
    }

    @GetMapping("/{id}")
    public Address get(@PathVariable UUID id) {
        return addressService.getOne(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Address create(@Valid @RequestBody Address body) {
        return addressService.create(body);
    }

    @PutMapping("/{id}")
    public Address update(@PathVariable UUID id, @Valid @RequestBody Address body) {
        body.setId(id);
        return addressService.update(body);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        addressService.delete(id);
    }
}