package com.trainer.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "course_enrollments")
public class CourseEnrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "course_id", nullable = false)
    private Long courseId;
    
    @Column(name = "trainee_emp_id", nullable = false)
    private String traineeEmpId;
    
    @Column(name = "trainee_name", nullable = false)
    private String traineeName;
    
    @Column(nullable = false)
    private String status = "not-started"; // not-started, in-progress, completed
    
    @Column(name = "enrolled_at")
    private LocalDateTime enrolledAt = LocalDateTime.now();
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "progress_percentage")
    private Integer progressPercentage = 0;
    
    // Constructors
    public CourseEnrollment() {}
    
    public CourseEnrollment(Long courseId, String traineeEmpId, String traineeName) {
        this.courseId = courseId;
        this.traineeEmpId = traineeEmpId;
        this.traineeName = traineeName;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    
    public String getTraineeEmpId() { return traineeEmpId; }
    public void setTraineeEmpId(String traineeEmpId) { this.traineeEmpId = traineeEmpId; }
    
    public String getTraineeName() { return traineeName; }
    public void setTraineeName(String traineeName) { this.traineeName = traineeName; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getEnrolledAt() { return enrolledAt; }
    public void setEnrolledAt(LocalDateTime enrolledAt) { this.enrolledAt = enrolledAt; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    public Integer getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(Integer progressPercentage) { this.progressPercentage = progressPercentage; }
}