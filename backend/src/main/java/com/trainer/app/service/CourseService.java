package com.trainer.app.service;

import com.trainer.app.dto.CourseCreateDto;
import com.trainer.app.dto.CourseResponseDto;
import com.trainer.app.dto.CourseProgressDto;
import com.trainer.app.model.Course;
import com.trainer.app.model.CourseProgress;
import com.trainer.app.model.CourseEnrollment;
import com.trainer.app.model.CourseCertificate;
import com.trainer.app.model.User;
import com.trainer.app.repository.CourseRepository;
import com.trainer.app.repository.CourseProgressRepository;
import com.trainer.app.repository.CourseEnrollmentRepository;
import com.trainer.app.repository.CourseCertificateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@Service
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private CourseProgressRepository courseProgressRepository;
    
    @Autowired
    private CourseEnrollmentRepository courseEnrollmentRepository;
    
    @Autowired
    private CourseCertificateRepository courseCertificateRepository;
    
    @Autowired
    private UserService userService;
    
    public CourseResponseDto createCourse(CourseCreateDto courseDto) {
        Course course = new Course();
        course.setTitle(courseDto.getTitle());
        course.setDescription(courseDto.getDescription());
        course.setDuration(courseDto.getDuration());
        course.setInstructor(courseDto.getInstructor());
        course.setCourseLink(courseDto.getCourseLink());
        course.setAssignedBatch(courseDto.getAssignedBatch());
        course.setTrainerEmpId(courseDto.getTrainerEmpId());
        course.setStatus("active");
        
        Course savedCourse = courseRepository.save(course);
        return convertToResponseDto(savedCourse, null);
    }
    
    public CourseResponseDto updateCourse(Long courseId, CourseCreateDto courseDto) {
        Optional<Course> optionalCourse = courseRepository.findById(courseId);
        if (optionalCourse.isPresent()) {
            Course course = optionalCourse.get();
            course.setTitle(courseDto.getTitle());
            course.setDescription(courseDto.getDescription());
            course.setDuration(courseDto.getDuration());
            course.setInstructor(courseDto.getInstructor());
            course.setCourseLink(courseDto.getCourseLink());
            course.setAssignedBatch(courseDto.getAssignedBatch());
            Course savedCourse = courseRepository.save(course);
            return convertToResponseDto(savedCourse, null);
        }
        throw new RuntimeException("Course not found with id: " + courseId);
    }
    
    public List<Course> getCoursesByTrainer(String trainerEmpId) {
        return courseRepository.findByTrainerEmpId(trainerEmpId);
    }
    
    public List<Course> getAvailableCoursesForTrainee(String traineeBatch, String trainerEmpId) {
        if (traineeBatch == null || traineeBatch.isEmpty()) {
            // If trainee has no batch, show only courses from their trainer with no batch restriction
            return courseRepository.findAvailableCoursesForBatchAndTrainer(null, trainerEmpId);
        }
        return courseRepository.findActiveCoursesForBatchAndTrainer(traineeBatch, trainerEmpId);
    }
    
    public Optional<Course> getCourseById(Long courseId) {
        return courseRepository.findById(courseId);
    }
    
    public void deleteCourse(Long courseId) {
        courseRepository.deleteById(courseId);
    }
    
    public List<Course> getAllActiveCourses() {
        return courseRepository.findByStatus("active");
    }
    
    public List<CourseProgress> getCourseProgress(Long courseId) {
        return courseProgressRepository.findByCourseId(courseId);
    }
    
    public List<CourseResponseDto> getCoursesByTrainerDto(String trainerEmpId) {
        List<Course> courses = courseRepository.findByTrainerEmpId(trainerEmpId);
        return courses.stream().map(course -> {
            int enrolledCount = courseProgressRepository.findByCourseId(course.getId()).size();
            CourseResponseDto dto = convertToResponseDto(course, null);
            dto.setEnrolledCount(enrolledCount);
            return dto;
        }).collect(Collectors.toList());
    }
    
    public List<CourseResponseDto> getAvailableCoursesForTraineeDto(String traineeEmpId, String traineeBatch) {
        List<Course> availableCourses;
        if (traineeBatch == null || traineeBatch.isEmpty()) {
            availableCourses = courseRepository.findAvailableCoursesForBatch(null);
        } else {
            availableCourses = courseRepository.findActiveCoursesForBatch(traineeBatch);
        }
        
        // Get progress for each course
        List<CourseProgress> allProgress = courseProgressRepository.findByTraineeEmpId(traineeEmpId);
        Map<Long, CourseProgress> progressMap = new HashMap<>();
        for (CourseProgress progress : allProgress) {
            progressMap.put(progress.getCourseId(), progress);
        }
        
        return availableCourses.stream().map(course -> {
            CourseProgress progress = progressMap.get(course.getId());
            return convertToResponseDto(course, progress);
        }).collect(Collectors.toList());
    }
    
    public CourseResponseDto getCourseByIdDto(Long courseId) {
        Optional<Course> course = courseRepository.findById(courseId);
        if (course.isPresent()) {
            return convertToResponseDto(course.get(), null);
        }
        throw new RuntimeException("Course not found");
    }
    
    public void startCourse(Long courseId, String traineeEmpId) {
        // Get trainee details
        User trainee = userService.findByEmpId(traineeEmpId);
        if (trainee == null) {
            throw new RuntimeException("Trainee not found");
        }
        
        // Create or update course enrollment
        Optional<CourseEnrollment> existingEnrollment = courseEnrollmentRepository.findByCourseIdAndTraineeEmpId(courseId, traineeEmpId);
        CourseEnrollment enrollment;
        
        if (existingEnrollment.isPresent()) {
            enrollment = existingEnrollment.get();
        } else {
            enrollment = new CourseEnrollment(courseId, traineeEmpId, trainee.getName());
        }
        
        enrollment.setStatus("in-progress");
        courseEnrollmentRepository.save(enrollment);
        
        // Create or update course progress
        Optional<CourseProgress> existingProgress = courseProgressRepository.findByCourseIdAndTraineeEmpId(courseId, traineeEmpId);
        CourseProgress progress;
        
        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
        } else {
            progress = new CourseProgress(courseId, traineeEmpId);
        }
        
        progress.setStarted(true);
        progress.setStartedAt(LocalDateTime.now());
        progress.setUpdatedAt(LocalDateTime.now());
        courseProgressRepository.save(progress);
    }
    
    public void updateCourseProgress(CourseProgressDto progressDto) {
        Optional<CourseProgress> existingProgress = courseProgressRepository
            .findByCourseIdAndTraineeEmpId(progressDto.getCourseId(), progressDto.getTraineeEmpId());
        CourseProgress progress;
        
        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
        } else {
            progress = new CourseProgress(progressDto.getCourseId(), progressDto.getTraineeEmpId());
            progress.setStarted(true);
            progress.setStartedAt(LocalDateTime.now());
        }
        
        progress.setProgressPercentage(progressDto.getProgressPercentage());
        progress.setUpdatedAt(LocalDateTime.now());
        
        // Auto-complete if 100%
        if (progressDto.getProgressPercentage() >= 100) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
        }
        
        courseProgressRepository.save(progress);
    }
    
    public void completeCourse(Long courseId, String traineeEmpId) {
        Optional<CourseProgress> existingProgress = courseProgressRepository
            .findByCourseIdAndTraineeEmpId(courseId, traineeEmpId);
        CourseProgress progress;
        
        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
        } else {
            progress = new CourseProgress(courseId, traineeEmpId);
        }
        
        progress.setCompleted(true);
        progress.setProgressPercentage(100);
        progress.setCompletedAt(LocalDateTime.now());
        progress.setUpdatedAt(LocalDateTime.now());
        courseProgressRepository.save(progress);
    }
    
    private CourseResponseDto convertToResponseDto(Course course, CourseProgress progress) {
        CourseResponseDto dto = new CourseResponseDto();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setDuration(course.getDuration());
        dto.setStatus(course.getStatus());
        dto.setInstructor(course.getInstructor());
        dto.setCourseLink(course.getCourseLink());
        dto.setAssignedBatch(course.getAssignedBatch());
        dto.setTrainerEmpId(course.getTrainerEmpId());
        dto.setEnrolledCount(course.getEnrolledCount());
        
        if (progress != null) {
            dto.setStarted(progress.getStarted());
            dto.setCompleted(progress.getCompleted());
            dto.setProgressPercentage(progress.getProgressPercentage());
            dto.setCertificateUploaded(progress.getCertificateUploaded());
        } else {
            dto.setStarted(false);
            dto.setCompleted(false);
            dto.setProgressPercentage(0);
            dto.setCertificateUploaded(false);
        }
        
        return dto;
    }
}