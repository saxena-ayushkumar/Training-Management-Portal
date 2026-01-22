package com.trainer.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "course_feedback")
public class CourseFeedback {
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
    private Integer rating; // 1-5 stars
    
    @Column(name = "key_learnings", length = 1000)
    private String keyLearnings;
    
    @Column(length = 1000)
    private String feedback;
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt = LocalDateTime.now();
    
    // Constructors
    public CourseFeedback() {}
    
    public CourseFeedback(Long courseId, String traineeEmpId, String traineeName, Integer rating, String keyLearnings, String feedback) {
        this.courseId = courseId;
        this.traineeEmpId = traineeEmpId;
        this.traineeName = traineeName;
        this.rating = rating;
        this.keyLearnings = keyLearnings;
        this.feedback = feedback;
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
    
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    
    public String getKeyLearnings() { return keyLearnings; }
    public void setKeyLearnings(String keyLearnings) { this.keyLearnings = keyLearnings; }
    
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}