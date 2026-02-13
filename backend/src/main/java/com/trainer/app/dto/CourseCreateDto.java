package com.trainer.app.dto;

public class CourseCreateDto {
    private String title;
    private String description;
    private String duration;
    private String instructor;
    private String courseLink;
    private String assignedBatch;
    private String trainerEmpId;
    
    public CourseCreateDto() {}
    
    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    
    public String getInstructor() { return instructor; }
    public void setInstructor(String instructor) { this.instructor = instructor; }
    
    public String getCourseLink() { return courseLink; }
    public void setCourseLink(String courseLink) { this.courseLink = courseLink; }
    
    public String getAssignedBatch() { return assignedBatch; }
    public void setAssignedBatch(String assignedBatch) { this.assignedBatch = assignedBatch; }
    
    public String getTrainerEmpId() { return trainerEmpId; }
    public void setTrainerEmpId(String trainerEmpId) { this.trainerEmpId = trainerEmpId; }
}