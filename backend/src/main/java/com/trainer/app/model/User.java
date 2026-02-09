package com.trainer.app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(nullable = false)
    private String name;
    
    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;
    
    @NotBlank
    @Column(nullable = false)
    private String password;
    
    @NotBlank
    @Column(nullable = false)
    private String role; // "trainer" or "trainee"
    
    @Column(name = "emp_id", unique = true)
    private String empId;
    
    @Column(name = "trainer_emp_id")
    private String trainerEmpId; // For trainees only
    
    @Column(name = "batch_name")
    private String batchName; // For trainees - assigned batch
    
    @Column(nullable = false)
    private String status = "pending"; // "pending", "approved", "rejected"
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;
    
    @Column(columnDefinition = "TEXT")
    private String address;
    
    // Constructors
    public User() {}
    
    public User(String name, String email, String password, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getEmpId() { return empId; }
    public void setEmpId(String empId) { this.empId = empId; }
    
    public String getTrainerEmpId() { return trainerEmpId; }
    public void setTrainerEmpId(String trainerEmpId) { this.trainerEmpId = trainerEmpId; }
    
    public String getBatchName() { return batchName; }
    public void setBatchName(String batchName) { this.batchName = batchName; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public Integer getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(Integer yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}