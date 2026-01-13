package com.trainer.app.dto;

import java.time.LocalDateTime;

public class TraineeDto {
    private Long id;
    private String name;
    private String email;
    private String empId;
    private LocalDateTime assignedAt;
    
    public TraineeDto() {}
    
    public TraineeDto(Long id, String name, String email, String empId, LocalDateTime assignedAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.empId = empId;
        this.assignedAt = assignedAt;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getEmpId() { return empId; }
    public void setEmpId(String empId) { this.empId = empId; }
    
    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }
}