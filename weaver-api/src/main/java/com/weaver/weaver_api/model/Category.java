// Category.java
package com.weaver.weaver_api.model;

import jakarta.persistence.*;
import org.hibernate.annotations.Index;

@Entity
@Table(name = "category",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_category_name", columnNames = {"name"})
        })
public class Category extends Audited {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Index(name = "idx_category_name")
    @Column(name = "name", nullable = false, length = 160)
    private String name;

    // getters/setters
    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}