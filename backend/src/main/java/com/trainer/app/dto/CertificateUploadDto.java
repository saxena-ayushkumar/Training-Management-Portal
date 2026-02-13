package com.trainer.app.dto;

public class CertificateUploadDto {
    private String traineeEmpId;
    private Long courseId;
    private String fileName;
    private Long fileSize;
    
    public CertificateUploadDto() {}
    
    public CertificateUploadDto(String traineeEmpId, Long courseId, String fileName, Long fileSize) {
        this.traineeEmpId = traineeEmpId;
        this.courseId = courseId;
        this.fileName = fileName;
        this.fileSize = fileSize;
    }
    
    // Getters and Setters
    public String getTraineeEmpId() { return traineeEmpId; }
    public void setTraineeEmpId(String traineeEmpId) { this.traineeEmpId = traineeEmpId; }
    
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
}