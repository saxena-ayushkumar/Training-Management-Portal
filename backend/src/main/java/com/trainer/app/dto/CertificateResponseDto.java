package com.trainer.app.dto;

import java.time.LocalDateTime;

public class CertificateResponseDto {
    private Long id;
    private String traineeEmpId;
    private Long courseId;
    private String trainerEmpId;
    private String fileName;
    private Long fileSize;
    private LocalDateTime uploadedAt;
    
    public CertificateResponseDto() {}
    
    public CertificateResponseDto(Long id, String traineeEmpId, Long courseId, String trainerEmpId, 
                                String fileName, Long fileSize, LocalDateTime uploadedAt) {
        this.id = id;
        this.traineeEmpId = traineeEmpId;
        this.courseId = courseId;
        this.trainerEmpId = trainerEmpId;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.uploadedAt = uploadedAt;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTraineeEmpId() { return traineeEmpId; }
    public void setTraineeEmpId(String traineeEmpId) { this.traineeEmpId = traineeEmpId; }
    
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    
    public String getTrainerEmpId() { return trainerEmpId; }
    public void setTrainerEmpId(String trainerEmpId) { this.trainerEmpId = trainerEmpId; }
    
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}