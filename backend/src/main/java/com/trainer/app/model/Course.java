package com.trainer.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 1000)
    private String description;
    
    @Column(nullable = false)
    private String duration;
    
    @Column(nullable = false)
    private String status = "draft"; // draft, active, inactive
    
    @Column(nullable = false)
    private String instructor;
    
    @Column(name = "course_link")
    private String courseLink;
    
    @Column(name = "assigned_batch")
    private String assignedBatch; // null means available to all
    
    @Column(name = "trainer_emp_id", nullable = false)
    private String trainerEmpId;
    
    @Column(name = "enrolled_count")
    private Integer enrolledCount = 0;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Constructors
    public Course() {}
    
    public Course(String title, String description, String duration, String instructor, String trainerEmpId) {
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.instructor = instructor;
        this.trainerEmpId = trainerEmpId;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getInstructor() { return instructor; }
    public void setInstructor(String instructor) { this.instructor = instructor; }
    
    public String getCourseLink() { return courseLink; }
    public void setCourseLink(String courseLink) { this.courseLink = courseLink; }
    
    public String getAssignedBatch() { return assignedBatch; }
    public void setAssignedBatch(String assignedBatch) { this.assignedBatch = assignedBatch; }
    
    public String getTrainerEmpId() { return trainerEmpId; }
    public void setTrainerEmpId(String trainerEmpId) { this.trainerEmpId = trainerEmpId; }
    
    public Integer getEnrolledCount() { return enrolledCount; }
    public void setEnrolledCount(Integer enrolledCount) { this.enrolledCount = enrolledCount; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}