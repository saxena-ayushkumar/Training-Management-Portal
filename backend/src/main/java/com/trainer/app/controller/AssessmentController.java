package com.trainer.app.controller;

import com.trainer.app.model.Assessment;
import com.trainer.app.model.AssessmentSubmission;
import com.trainer.app.repository.AssessmentRepository;
import com.trainer.app.repository.AssessmentSubmissionRepository;
import com.trainer.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/assessments")
@CrossOrigin(origins = "http://localhost:3000")
public class AssessmentController {
    
    @Autowired
    private AssessmentRepository assessmentRepository;
    
    @Autowired
    private AssessmentSubmissionRepository submissionRepository;
    
    @Autowired
    private UserService userService;
    
    private final String UPLOAD_DIR = "uploads/assignments/";
    
    @PostMapping
    public ResponseEntity<?> createAssessment(@RequestBody Assessment assessment) {
        try {
            Assessment createdAssessment = assessmentRepository.save(assessment);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Assessment created successfully");
            response.put("assessment", createdAssessment);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to create assessment: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/trainer/{trainerEmpId}")
    public ResponseEntity<?> getAssessmentsByTrainer(@PathVariable String trainerEmpId) {
        try {
            List<Assessment> assessments = assessmentRepository.findByTrainerEmpId(trainerEmpId);
            
            List<Map<String, Object>> assessmentsWithStats = assessments.stream().map(assessment -> {
                Map<String, Object> assessmentData = new HashMap<>();
                assessmentData.put("id", assessment.getId());
                assessmentData.put("title", assessment.getTitle());
                assessmentData.put("description", assessment.getDescription());
                assessmentData.put("type", assessment.getType());
                assessmentData.put("batchName", assessment.getBatchName());
                assessmentData.put("dueDate", assessment.getDueDate());
                assessmentData.put("totalMarks", assessment.getTotalMarks());
                assessmentData.put("googleFormLink", assessment.getGoogleFormLink());
                assessmentData.put("status", assessment.getStatus());
                assessmentData.put("createdAt", assessment.getCreatedAt());
                
                // Get submission count
                List<AssessmentSubmission> submissions = submissionRepository.findByAssessmentId(assessment.getId());
                assessmentData.put("submissionCount", submissions.size());
                
                return assessmentData;
            }).toList();
            
            return ResponseEntity.ok(assessmentsWithStats);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch assessments: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/batch/{batchName}")
    public ResponseEntity<?> getAssessmentsByBatch(@PathVariable String batchName) {
        try {
            List<Assessment> assessments = assessmentRepository.findByBatchNameAndStatus(batchName, "active");
            return ResponseEntity.ok(assessments);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch assessments: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/submit")
    public ResponseEntity<?> submitAssessment(
            @RequestParam("assessmentId") Long assessmentId,
            @RequestParam("traineeEmpId") String traineeEmpId,
            @RequestParam("traineeName") String traineeName,
            @RequestParam(value = "submissionText", required = false) String submissionText,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        
        try {
            // Check if already submitted
            Optional<AssessmentSubmission> existingSubmission = 
                submissionRepository.findByAssessmentIdAndTraineeEmpId(assessmentId, traineeEmpId);
            
            if (existingSubmission.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Assessment already submitted");
                return ResponseEntity.badRequest().body(response);
            }
            
            AssessmentSubmission submission = new AssessmentSubmission(assessmentId, traineeEmpId, traineeName);
            submission.setSubmissionText(submissionText);
            
            // Handle file upload
            if (file != null && !file.isEmpty()) {
                String fileName = traineeEmpId + "_" + assessmentId + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path uploadPath = Paths.get(UPLOAD_DIR);
                
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(file.getInputStream(), filePath);
                
                submission.setFileName(file.getOriginalFilename());
                submission.setFilePath(filePath.toString());
            }
            
            submissionRepository.save(submission);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Assessment submitted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to submit assessment: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/{assessmentId}/submissions")
    public ResponseEntity<?> getAssessmentSubmissions(@PathVariable Long assessmentId) {
        try {
            List<AssessmentSubmission> submissions = submissionRepository.findByAssessmentId(assessmentId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("submissions", submissions);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch submissions: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/submissions/{submissionId}/download")
    public ResponseEntity<?> downloadSubmission(@PathVariable Long submissionId) {
        try {
            Optional<AssessmentSubmission> submission = submissionRepository.findById(submissionId);
            if (submission.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Submission not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            AssessmentSubmission sub = submission.get();
            if (sub.getFilePath() == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "No file attached to this submission");
                return ResponseEntity.badRequest().body(response);
            }
            
            Path filePath = Paths.get(sub.getFilePath());
            if (!Files.exists(filePath)) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "File not found on server");
                return ResponseEntity.badRequest().body(response);
            }
            
            byte[] fileContent = Files.readAllBytes(filePath);
            return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + sub.getFileName() + "\"")
                .body(fileContent);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to download file: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/{assessmentId}")
    public ResponseEntity<?> updateAssessment(@PathVariable Long assessmentId, @RequestBody Assessment assessment) {
        try {
            Optional<Assessment> existingAssessment = assessmentRepository.findById(assessmentId);
            if (existingAssessment.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Assessment not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            Assessment updatedAssessment = existingAssessment.get();
            updatedAssessment.setTitle(assessment.getTitle());
            updatedAssessment.setDescription(assessment.getDescription());
            updatedAssessment.setType(assessment.getType());
            updatedAssessment.setBatchName(assessment.getBatchName());
            updatedAssessment.setDueDate(assessment.getDueDate());
            updatedAssessment.setTotalMarks(assessment.getTotalMarks());
            updatedAssessment.setGoogleFormLink(assessment.getGoogleFormLink());
            
            assessmentRepository.save(updatedAssessment);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Assessment updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to update assessment: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/{assessmentId}")
    public ResponseEntity<?> deleteAssessment(@PathVariable Long assessmentId) {
        try {
            Optional<Assessment> assessment = assessmentRepository.findById(assessmentId);
            if (assessment.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Assessment not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Delete all submissions for this assessment
            List<AssessmentSubmission> submissions = submissionRepository.findByAssessmentId(assessmentId);
            submissionRepository.deleteAll(submissions);
            
            // Delete the assessment
            assessmentRepository.deleteById(assessmentId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Assessment and all submissions deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to delete assessment: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/submissions/{submissionId}")
    public ResponseEntity<?> deleteSubmission(@PathVariable Long submissionId) {
        try {
            submissionRepository.deleteById(submissionId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Submission deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to delete submission: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/trainee/{traineeEmpId}")
    public ResponseEntity<?> getTraineeAssessments(@PathVariable String traineeEmpId) {
        try {
            // Get trainee's batch
            var trainee = userService.findByEmpId(traineeEmpId);
            if (trainee == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Trainee not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            List<Assessment> assessments = assessmentRepository.findByBatchNameAndStatus(trainee.getBatchName(), "active");
            List<AssessmentSubmission> submissions = submissionRepository.findByTraineeEmpId(traineeEmpId);
            
            List<Map<String, Object>> assessmentsWithStatus = assessments.stream().map(assessment -> {
                Map<String, Object> assessmentData = new HashMap<>();
                assessmentData.put("id", assessment.getId());
                assessmentData.put("title", assessment.getTitle());
                assessmentData.put("description", assessment.getDescription());
                assessmentData.put("type", assessment.getType());
                assessmentData.put("batchName", assessment.getBatchName());
                assessmentData.put("dueDate", assessment.getDueDate());
                assessmentData.put("totalMarks", assessment.getTotalMarks());
                assessmentData.put("googleFormLink", assessment.getGoogleFormLink());
                assessmentData.put("status", assessment.getStatus());
                assessmentData.put("createdAt", assessment.getCreatedAt());
                
                // Check submission status
                Optional<AssessmentSubmission> submission = submissions.stream()
                    .filter(s -> s.getAssessmentId().equals(assessment.getId()))
                    .findFirst();
                
                if (submission.isPresent()) {
                    assessmentData.put("submitted", true);
                    assessmentData.put("submissionStatus", submission.get().getStatus());
                    assessmentData.put("grade", submission.get().getGrade());
                    assessmentData.put("feedback", submission.get().getFeedback());
                } else {
                    assessmentData.put("submitted", false);
                    assessmentData.put("submissionStatus", "pending");
                }
                
                return assessmentData;
            }).toList();
            
            return ResponseEntity.ok(assessmentsWithStatus);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch assessments: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}