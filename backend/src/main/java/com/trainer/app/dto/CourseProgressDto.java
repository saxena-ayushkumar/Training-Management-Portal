package com.trainer.app.dto;

public class CourseProgressDto {
    private Long courseId;
    private String traineeEmpId;
    private Integer progressPercentage;
    private Boolean completed;
    
    public CourseProgressDto() {}
    
    public CourseProgressDto(Long courseId, String traineeEmpId, Integer progressPercentage) {
        this.courseId = courseId;
        this.traineeEmpId = traineeEmpId;
        this.progressPercentage = progressPercentage;
    }
    
    // Getters and Setters
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    
    public String getTraineeEmpId() { return traineeEmpId; }
    public void setTraineeEmpId(String traineeEmpId) { this.traineeEmpId = traineeEmpId; }
    
    public Integer getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(Integer progressPercentage) { this.progressPercentage = progressPercentage; }
    
    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }
}