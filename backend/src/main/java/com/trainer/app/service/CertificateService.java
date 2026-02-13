package com.trainer.app.service;

import com.trainer.app.dto.CertificateResponseDto;
import com.trainer.app.model.CourseCertificate;
import com.trainer.app.model.Course;
import com.trainer.app.model.CourseEnrollment;
import com.trainer.app.model.CourseProgress;
import com.trainer.app.repository.CourseCertificateRepository;
import com.trainer.app.repository.CourseRepository;
import com.trainer.app.repository.CourseEnrollmentRepository;
import com.trainer.app.repository.CourseProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CertificateService {
    
    @Autowired
    private CourseCertificateRepository certificateRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private CourseEnrollmentRepository enrollmentRepository;
    
    @Autowired
    private CourseProgressRepository courseProgressRepository;
    
    private final String UPLOAD_DIR = "uploads/certificates/";
    
    public CertificateResponseDto uploadCertificate(MultipartFile file, String traineeEmpId, Long courseId) throws IOException {
        // Validate enrollment
        Optional<CourseEnrollment> enrollment = enrollmentRepository
            .findByCourseIdAndTraineeEmpId(courseId, traineeEmpId);
        if (!enrollment.isPresent()) {
            throw new RuntimeException("Not enrolled in this course");
        }
        
        // Get course and trainer info
        Optional<Course> course = courseRepository.findById(courseId);
        if (!course.isPresent()) {
            throw new RuntimeException("Course not found");
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
        
        certificate = certificateRepository.save(certificate);
        
        // Update course progress to mark certificate as uploaded
        updateCourseProgress(courseId, traineeEmpId);
        
        return convertToDto(certificate);
    }
    
    public List<CertificateResponseDto> getCertificatesByCourse(Long courseId, String trainerEmpId) {
        // Verify trainer owns the course
        Optional<Course> course = courseRepository.findById(courseId);
        if (!course.isPresent() || !course.get().getTrainerEmpId().equals(trainerEmpId)) {
            throw new RuntimeException("Unauthorized access");
        }
        
        List<CourseCertificate> certificates = certificateRepository
            .findByCourseIdAndTrainerEmpId(courseId, trainerEmpId);
        
        return certificates.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    public CourseCertificate getCertificateForDownload(Long certificateId, String trainerEmpId) {
        Optional<CourseCertificate> certificate = certificateRepository.findById(certificateId);
        
        if (!certificate.isPresent()) {
            throw new RuntimeException("Certificate not found");
        }
        
        // Verify trainer has access to this certificate
        if (!certificate.get().getTrainerEmpId().equals(trainerEmpId)) {
            throw new RuntimeException("Unauthorized access");
        }
        
        return certificate.get();
    }
    
    private void updateCourseProgress(Long courseId, String traineeEmpId) {
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
    }
    
    private CertificateResponseDto convertToDto(CourseCertificate certificate) {
        return new CertificateResponseDto(
            certificate.getId(),
            certificate.getTraineeEmpId(),
            certificate.getCourseId(),
            certificate.getTrainerEmpId(),
            certificate.getFileName(),
            certificate.getFileSize(),
            certificate.getUploadedAt()
        );
    }
}