package com.trainer.app.dto;

public class CourseResponseDto {
    private Long id;
    private String title;
    private String description;
    private String duration;
    private String status;
    private String instructor;
    private String courseLink;
    private String assignedBatch;
    private String trainerEmpId;
    private Integer enrolledCount;
    private Boolean started;
    private Boolean completed;
    private Integer progressPercentage;
    private Boolean certificateUploaded;
    
    public CourseResponseDto() {}
    
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
    
    public Boolean getStarted() { return started; }
    public void setStarted(Boolean started) { this.started = started; }
    
    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }
    
    public Integer getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(Integer progressPercentage) { this.progressPercentage = progressPercentage; }
    
    public Boolean getCertificateUploaded() { return certificateUploaded; }
    public void setCertificateUploaded(Boolean certificateUploaded) { this.certificateUploaded = certificateUploaded; }
}