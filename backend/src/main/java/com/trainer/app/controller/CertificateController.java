package com.trainer.app.controller;

import com.trainer.app.model.CourseCertificate;
import com.trainer.app.model.Course;
import com.trainer.app.model.CourseEnrollment;
import com.trainer.app.model.CourseProgress;
import com.trainer.app.repository.CourseCertificateRepository;
import com.trainer.app.repository.CourseRepository;
import com.trainer.app.repository.CourseEnrollmentRepository;
import com.trainer.app.repository.CourseProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/certificates")
@CrossOrigin(origins = "http://localhost:3000")
public class CertificateController {

    @Autowired
    private CourseCertificateRepository certificateRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private CourseEnrollmentRepository enrollmentRepository;
    
    @Autowired
    private CourseProgressRepository courseProgressRepository;
    
    private final String UPLOAD_DIR = "uploads/certificates/";
    
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Certificate service is running");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadCertificate(
            @RequestParam("file") MultipartFile file,
            @RequestParam("traineeEmpId") String traineeEmpId,
            @RequestParam("courseId") Long courseId) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate enrollment
            Optional<CourseEnrollment> enrollment = enrollmentRepository
                .findByCourseIdAndTraineeEmpId(courseId, traineeEmpId);
            if (!enrollment.isPresent()) {
                response.put("success", false);
                response.put("message", "Not enrolled in this course");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Get course and trainer info
            Optional<Course> course = courseRepository.findById(courseId);
            if (!course.isPresent()) {
                response.put("success", false);
                response.put("message", "Course not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Create upload directory
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Generate secure filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String secureFilename = traineeEmpId + "_" + courseId + "_" + System.currentTimeMillis() + fileExtension;
            
            // Save file
            Path filePath = uploadPath.resolve(secureFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Check if certificate already exists
            Optional<CourseCertificate> existingCert = certificateRepository
                .findByTraineeEmpIdAndCourseId(traineeEmpId, courseId);
            
            CourseCertificate certificate;
            if (existingCert.isPresent()) {
                // Delete old file
                Path oldFilePath = Paths.get(existingCert.get().getFilePath());
                if (Files.exists(oldFilePath)) {
                    Files.delete(oldFilePath);
                }
                // Update existing certificate
                certificate = existingCert.get();
                certificate.setFileName(originalFilename);
                certificate.setFilePath(filePath.toString());
                certificate.setFileSize(file.getSize());
            } else {
                // Create new certificate record
                certificate = new CourseCertificate(
                    traineeEmpId,
                    courseId,
                    course.get().getTrainerEmpId(),
                    originalFilename,
                    filePath.toString(),
                    file.getSize()
                );
            }
            
            certificateRepository.save(certificate);
            
            // Update course progress to mark certificate as uploaded
            Optional<CourseProgress> progressOpt = courseProgressRepository
                .findByCourseIdAndTraineeEmpId(courseId, traineeEmpId);
            
            if (progressOpt.isPresent()) {
                CourseProgress progress = progressOpt.get();
                progress.setCertificateUploaded(true);
                progress.setUpdatedAt(LocalDateTime.now());
                courseProgressRepository.save(progress);
            } else {
                // Create new progress record if it doesn't exist
                CourseProgress progress = new CourseProgress(courseId, traineeEmpId);
                progress.setCertificateUploaded(true);
                progress.setStarted(true);
                progress.setStartedAt(LocalDateTime.now());
                progress.setUpdatedAt(LocalDateTime.now());
                courseProgressRepository.save(progress);
            }
            
            response.put("success", true);
            response.put("message", "Certificate uploaded successfully");
            response.put("certificate", certificate);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            response.put("success", false);
            response.put("message", "Failed to upload certificate: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/course/{courseId}/trainer/{trainerEmpId}")
    public ResponseEntity<?> getCertificatesByCourse(
            @PathVariable Long courseId,
            @PathVariable String trainerEmpId) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Verify trainer owns the course
            Optional<Course> course = courseRepository.findById(courseId);
            if (!course.isPresent() || !course.get().getTrainerEmpId().equals(trainerEmpId)) {
                response.put("success", false);
                response.put("message", "Unauthorized access");
                return ResponseEntity.badRequest().body(response);
            }
            
            List<CourseCertificate> certificates = certificateRepository
                .findByCourseIdAndTrainerEmpId(courseId, trainerEmpId);
            
            response.put("success", true);
            response.put("certificates", certificates);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch certificates: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/download/{certificateId}/trainer/{trainerEmpId}")
    public ResponseEntity<Resource> downloadCertificate(
            @PathVariable Long certificateId,
            @PathVariable String trainerEmpId) {
        
        try {
            Optional<CourseCertificate> certificate = certificateRepository.findById(certificateId);
            
            if (!certificate.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            // Verify trainer has access to this certificate
            if (!certificate.get().getTrainerEmpId().equals(trainerEmpId)) {
                return ResponseEntity.badRequest().build();
            }
            
            Path filePath = Paths.get(certificate.get().getFilePath());
            Resource resource = new UrlResource(filePath.toUri());
            
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }
            
            // Determine content type based on file extension
            String contentType = "application/octet-stream";
            String fileName = certificate.get().getFileName().toLowerCase();
            if (fileName.endsWith(".pdf")) {
                contentType = "application/pdf";
            } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
                contentType = "image/jpeg";
            } else if (fileName.endsWith(".png")) {
                contentType = "image/png";
            }
            
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                    "attachment; filename=\"" + certificate.get().getFileName() + "\"")
                .body(resource);
                
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/view/{certificateId}/trainer/{trainerEmpId}")
    public ResponseEntity<Resource> viewCertificate(
            @PathVariable Long certificateId,
            @PathVariable String trainerEmpId) {
        
        try {
            Optional<CourseCertificate> certificate = certificateRepository.findById(certificateId);
            
            if (!certificate.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            // Verify trainer has access to this certificate
            if (!certificate.get().getTrainerEmpId().equals(trainerEmpId)) {
                return ResponseEntity.badRequest().build();
            }
            
            Path filePath = Paths.get(certificate.get().getFilePath());
            Resource resource = new UrlResource(filePath.toUri());
            
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }
            
            // Determine content type for inline viewing
            String contentType = "application/octet-stream";
            String fileName = certificate.get().getFileName().toLowerCase();
            if (fileName.endsWith(".pdf")) {
                contentType = "application/pdf";
            } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
                contentType = "image/jpeg";
            } else if (fileName.endsWith(".png")) {
                contentType = "image/png";
            }
            
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .body(resource);
                
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/check/{traineeEmpId}/{courseId}")
    public ResponseEntity<?> checkCertificate(
            @PathVariable String traineeEmpId,
            @PathVariable Long courseId) {
        
        Map<String, Object> response = new HashMap<>();
        
        boolean exists = certificateRepository.existsByTraineeEmpIdAndCourseId(traineeEmpId, courseId);
        
        response.put("success", true);
        response.put("hasCertificate", exists);
        
        if (exists) {
            Optional<CourseCertificate> certificate = certificateRepository
                .findByTraineeEmpIdAndCourseId(traineeEmpId, courseId);
            response.put("certificate", certificate.get());
        }
        
        return ResponseEntity.ok(response);
    }
}