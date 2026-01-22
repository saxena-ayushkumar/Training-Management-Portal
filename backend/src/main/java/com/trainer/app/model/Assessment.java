package com.trainer.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessments")
public class Assessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 1000)
    private String description;
    
    @Column(nullable = false)
    private String type; // quiz, assignment, exam
    
    @Column(name = "trainer_emp_id", nullable = false)
    private String trainerEmpId;
    
    @Column(name = "batch_name", nullable = false)
    private String batchName;
    
    @Column(name = "due_date", nullable = false)
    private String dueDate;
    
    @Column(name = "total_marks")
    private Integer totalMarks = 100;
    
    @Column(name = "google_form_link")
    private String googleFormLink; // For quizzes
    
    @Column(nullable = false)
    private String status = "active"; // active, inactive, completed
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Constructors
    public Assessment() {}
    
    public Assessment(String title, String description, String type, String trainerEmpId, 
                     String batchName, String dueDate, Integer totalMarks) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.trainerEmpId = trainerEmpId;
        this.batchName = batchName;
        this.dueDate = dueDate;
        this.totalMarks = totalMarks;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getTrainerEmpId() { return trainerEmpId; }
    public void setTrainerEmpId(String trainerEmpId) { this.trainerEmpId = trainerEmpId; }
    
    public String getBatchName() { return batchName; }
    public void setBatchName(String batchName) { this.batchName = batchName; }
    
    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }
    
    public Integer getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Integer totalMarks) { this.totalMarks = totalMarks; }
    
    public String getGoogleFormLink() { return googleFormLink; }
    public void setGoogleFormLink(String googleFormLink) { this.googleFormLink = googleFormLink; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}