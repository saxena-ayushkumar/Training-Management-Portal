package com.trainer.app.service;

import com.trainer.app.model.CourseEnrollment;
import com.trainer.app.repository.CourseEnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CourseEnrollmentService {
    
    @Autowired
    private CourseEnrollmentRepository enrollmentRepository;
    
    public CourseEnrollment enrollTrainee(Long courseId, String traineeEmpId, String traineeName) {
        // Check if already enrolled
        Optional<CourseEnrollment> existing = enrollmentRepository.findByCourseIdAndTraineeEmpId(courseId, traineeEmpId);
        if (existing.isPresent()) {
            throw new RuntimeException("Trainee already enrolled in this course");
        }
        
        CourseEnrollment enrollment = new CourseEnrollment(courseId, traineeEmpId, traineeName);
        return enrollmentRepository.save(enrollment);
    }
    
    public List<CourseEnrollment> getEnrollmentsByCourse(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }
    
    public List<CourseEnrollment> getEnrollmentsByTrainee(String traineeEmpId) {
        return enrollmentRepository.findByTraineeEmpId(traineeEmpId);
    }
    
    public CourseEnrollment updateProgress(Long courseId, String traineeEmpId, String status, Integer progressPercentage) {
        Optional<CourseEnrollment> enrollmentOpt = enrollmentRepository.findByCourseIdAndTraineeEmpId(courseId, traineeEmpId);
        if (!enrollmentOpt.isPresent()) {
            throw new RuntimeException("Enrollment not found");
        }
        
        CourseEnrollment enrollment = enrollmentOpt.get();
        enrollment.setStatus(status);
        enrollment.setProgressPercentage(progressPercentage);
        
        if ("completed".equals(status)) {
            enrollment.setCompletedAt(LocalDateTime.now());
        }
        
        return enrollmentRepository.save(enrollment);
    }
    
    public Long getEnrollmentCount(Long courseId) {
        return enrollmentRepository.countEnrollmentsByCourseId(courseId);
    }
    
    public Long getEnrollmentCountByStatus(Long courseId, String status) {
        return enrollmentRepository.countEnrollmentsByCourseIdAndStatus(courseId, status);
    }
}