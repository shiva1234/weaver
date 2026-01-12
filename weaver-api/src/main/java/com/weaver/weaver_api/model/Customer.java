// Customer.java
package com.weaver.weaver_api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "customer",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_customer_email", columnNames = {"email"})
        })
public class Customer extends Audited {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="email", nullable = false, length = 255)
    private String email;

    @Column(name = "is_guest", nullable = false)
    private boolean guest = true;

    @Column(name="password", nullable = false, length = 255)
    private String password; // store a bcrypt/argon2 hash

    @Column(name="first_name", length = 120)
    private String firstName;

    @Column(name="last_name", length = 120)
    private String lastName;

    @Column(name="phone", length = 40)
    private String phone;

    // getters/setters
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public boolean isGuest() { return guest; }
    public String getPassword() { return password; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getPhone() { return phone; }

    public void setEmail(String email) { this.email = email; }
    public void setGuest(boolean guest) { this.guest = guest; }
    public void setPassword(String password) { this.password = password; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setPhone(String phone) { this.phone = phone; }
}