package com.trainer.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 1000)
    private String description;
    
    @Column(name = "course_id")
    private Long courseId;
    
    @Column(name = "trainer_emp_id", nullable = false)
    private String trainerEmpId;
    
    @Column(name = "batch_name", nullable = false)
    private String batchName;
    
    @Column(name = "session_date", nullable = false)
    private String sessionDate;
    
    @Column(name = "session_time", nullable = false)
    private String sessionTime;
    
    @Column(nullable = false)
    private String duration;
    
    @Column(nullable = false)
    private String status = "scheduled"; // scheduled, ongoing, completed, cancelled
    
    @Column(name = "meeting_link")
    private String meetingLink;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Constructors
    public Session() {}
    
    public Session(String title, String description, Long courseId, String trainerEmpId, 
                   String batchName, String sessionDate, String sessionTime, String duration) {
        this.title = title;
        this.description = description;
        this.courseId = courseId;
        this.trainerEmpId = trainerEmpId;
        this.batchName = batchName;
        this.sessionDate = sessionDate;
        this.sessionTime = sessionTime;
        this.duration = duration;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    
    public String getTrainerEmpId() { return trainerEmpId; }
    public void setTrainerEmpId(String trainerEmpId) { this.trainerEmpId = trainerEmpId; }
    
    public String getBatchName() { return batchName; }
    public void setBatchName(String batchName) { this.batchName = batchName; }
    
    public String getSessionDate() { return sessionDate; }
    public void setSessionDate(String sessionDate) { this.sessionDate = sessionDate; }
    
    public String getSessionTime() { return sessionTime; }
    public void setSessionTime(String sessionTime) { this.sessionTime = sessionTime; }
    
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}