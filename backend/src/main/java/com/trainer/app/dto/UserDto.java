package com.trainer.app.dto;

public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String empId;
    private String status;
    
    public UserDto(Long id, String name, String email, String role, String empId, String status) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.empId = empId;
        this.status = status;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getEmpId() { return empId; }
    public void setEmpId(String empId) { this.empId = empId; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}