package com.trainer.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessment_submissions")
public class AssessmentSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "assessment_id", nullable = false)
    private Long assessmentId;
    
    @Column(name = "trainee_emp_id", nullable = false)
    private String traineeEmpId;
    
    @Column(name = "trainee_name", nullable = false)
    private String traineeName;
    
    @Column(name = "submission_text", length = 2000)
    private String submissionText;
    
    @Column(name = "file_path")
    private String filePath;
    
    @Column(name = "file_name")
    private String fileName;
    
    @Column(name = "google_form_response")
    private String googleFormResponse; // For quiz responses
    
    @Column(nullable = false)
    private String status = "submitted"; // submitted, graded
    
    @Column
    private Integer grade;
    
    @Column(length = 1000)
    private String feedback;
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt = LocalDateTime.now();
    
    @Column(name = "graded_at")
    private LocalDateTime gradedAt;
    
    // Constructors
    public AssessmentSubmission() {}
    
    public AssessmentSubmission(Long assessmentId, String traineeEmpId, String traineeName) {
        this.assessmentId = assessmentId;
        this.traineeEmpId = traineeEmpId;
        this.traineeName = traineeName;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getAssessmentId() { return assessmentId; }
    public void setAssessmentId(Long assessmentId) { this.assessmentId = assessmentId; }
    
    public String getTraineeEmpId() { return traineeEmpId; }
    public void setTraineeEmpId(String traineeEmpId) { this.traineeEmpId = traineeEmpId; }
    
    public String getTraineeName() { return traineeName; }
    public void setTraineeName(String traineeName) { this.traineeName = traineeName; }
    
    public String getSubmissionText() { return submissionText; }
    public void setSubmissionText(String submissionText) { this.submissionText = submissionText; }
    
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    
    public String getGoogleFormResponse() { return googleFormResponse; }
    public void setGoogleFormResponse(String googleFormResponse) { this.googleFormResponse = googleFormResponse; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Integer getGrade() { return grade; }
    public void setGrade(Integer grade) { this.grade = grade; }
    
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    
    public LocalDateTime getGradedAt() { return gradedAt; }
    public void setGradedAt(LocalDateTime gradedAt) { this.gradedAt = gradedAt; }
}