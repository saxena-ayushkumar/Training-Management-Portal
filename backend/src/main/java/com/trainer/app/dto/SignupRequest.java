package com.trainer.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class SignupRequest {
    @NotBlank
    private String name;
    
    @Email
    @NotBlank
    private String email;
    
    @NotBlank
    private String password;
    
    @NotBlank
    private String role;
    
    private String trainerEmpId; // For trainees only
    
    private String empId; // Required for all users
    
    // Constructors
    public SignupRequest() {}
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getTrainerEmpId() { return trainerEmpId; }
    public void setTrainerEmpId(String trainerEmpId) { this.trainerEmpId = trainerEmpId; }
    
    public String getEmpId() { return empId; }
    public void setEmpId(String empId) { this.empId = empId; }
}