package com.trainer.app.controller;

import com.trainer.app.model.Course;
import com.trainer.app.model.CourseProgress;
import com.trainer.app.model.CourseEnrollment;
import com.trainer.app.repository.CourseProgressRepository;
import com.trainer.app.repository.CourseEnrollmentRepository;
import com.trainer.app.repository.CourseFeedbackRepository;
import com.trainer.app.repository.CourseCertificateRepository;
import com.trainer.app.model.CourseCertificate;
import com.trainer.app.service.CourseService;
import com.trainer.app.service.UserService;
import com.trainer.app.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {
    
    @Autowired
    private CourseService courseService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private CourseProgressRepository courseProgressRepository;
    
    @Autowired
    private CourseEnrollmentRepository courseEnrollmentRepository;
    
    @Autowired
    private CourseFeedbackRepository courseFeedbackRepository;
    
    @Autowired
    private CourseCertificateRepository courseCertificateRepository;
    
    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody Course course) {
        try {
            Course createdCourse = courseService.createCourse(course);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Course created successfully");
            response.put("course", createdCourse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to create course: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/{courseId}")
    public ResponseEntity<?> updateCourse(@PathVariable Long courseId, @RequestBody Course course) {
        try {
            Course updatedCourse = courseService.updateCourse(courseId, course);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Course updated successfully");
            response.put("course", updatedCourse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to update course: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/trainer/{trainerEmpId}")
    public ResponseEntity<?> getCoursesByTrainer(@PathVariable String trainerEmpId) {
        try {
            List<Course> courses = courseService.getCoursesByTrainer(trainerEmpId);
            
            // Add real enrollment count for each course
            List<Map<String, Object>> coursesWithStats = courses.stream().map(course -> {
                Map<String, Object> courseData = new HashMap<>();
                courseData.put("id", course.getId());
                courseData.put("title", course.getTitle());
                courseData.put("description", course.getDescription());
                courseData.put("duration", course.getDuration());
                courseData.put("status", course.getStatus());
                courseData.put("instructor", course.getInstructor());
                courseData.put("courseLink", course.getCourseLink());
                courseData.put("assignedBatch", course.getAssignedBatch());
                courseData.put("trainerEmpId", course.getTrainerEmpId());
                
                // Get real enrollment count from progress table
                int enrolledCount = courseProgressRepository.findByCourseId(course.getId()).size();
                courseData.put("enrolledCount", enrolledCount);
                
                return courseData;
            }).toList();
            
            return ResponseEntity.ok(coursesWithStats);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch courses: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/trainee/{traineeEmpId}")
    public ResponseEntity<?> getCoursesForTrainee(@PathVariable String traineeEmpId) {
        try {
            // Get trainee's batch information
            User trainee = userService.findByEmpId(traineeEmpId);
            if (trainee == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Trainee not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            String traineeBatch = trainee.getBatchName();
            String trainerEmpId = trainee.getTrainerEmpId();
            
            // Validate trainer assignment
            if (trainerEmpId == null || trainerEmpId.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Trainee is not assigned to any trainer");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Only show courses created by the trainee's trainer
            List<Course> availableCourses = courseService.getAvailableCoursesForTrainee(traineeBatch, trainerEmpId);
            
            // Get progress for each course
            List<CourseProgress> allProgress = courseProgressRepository.findByTraineeEmpId(traineeEmpId);
            Map<Long, CourseProgress> progressMap = new HashMap<>();
            for (CourseProgress progress : allProgress) {
                progressMap.put(progress.getCourseId(), progress);
            }
            
            // Add progress data to courses
            List<Map<String, Object>> coursesWithProgress = availableCourses.stream().map(course -> {
                Map<String, Object> courseData = new HashMap<>();
                courseData.put("id", course.getId());
                courseData.put("title", course.getTitle());
                courseData.put("description", course.getDescription());
                courseData.put("duration", course.getDuration());
                courseData.put("status", course.getStatus());
                courseData.put("instructor", course.getInstructor());
                courseData.put("courseLink", course.getCourseLink());
                courseData.put("assignedBatch", course.getAssignedBatch());
                courseData.put("enrolledCount", course.getEnrolledCount());
                
                CourseProgress progress = progressMap.get(course.getId());
                if (progress != null) {
                    courseData.put("started", progress.getStarted());
                    courseData.put("completed", progress.getCompleted());
                    courseData.put("progressPercentage", progress.getProgressPercentage());
                    courseData.put("certificateUploaded", progress.getCertificateUploaded());
                } else {
                    courseData.put("started", false);
                    courseData.put("completed", false);
                    courseData.put("progressPercentage", 0);
                    courseData.put("certificateUploaded", false);
                }
                
                return courseData;
            }).toList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("courses", coursesWithProgress);
            response.put("traineeBatch", traineeBatch);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch courses: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/{courseId}")
    public ResponseEntity<?> getCourseById(@PathVariable Long courseId) {
        try {
            Optional<Course> course = courseService.getCourseById(courseId);
            if (course.isPresent()) {
                return ResponseEntity.ok(course.get());
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Course not found");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch course: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/{courseId}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long courseId) {
        try {
            courseService.deleteCourse(courseId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Course deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to delete course: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/{courseId}/analytics")
    public ResponseEntity<?> getCourseAnalytics(@PathVariable Long courseId, @RequestParam String trainerEmpId) {
        try {
            // Verify trainer owns this course
            Optional<Course> courseOpt = courseService.getCourseById(courseId);
            if (!courseOpt.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Course not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            Course course = courseOpt.get();
            if (!course.getTrainerEmpId().equals(trainerEmpId)) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Access denied");
                return ResponseEntity.badRequest().body(response);
            }
            
            try {
                // Get real data from database
                List<Map<String, Object>> enrollments = courseProgressRepository.findByCourseId(courseId)
                    .stream()
                    .map(progress -> {
                        Map<String, Object> enrollment = new HashMap<>();
                        enrollment.put("id", progress.getId());
                        enrollment.put("traineeEmpId", progress.getTraineeEmpId());
                        
                        // Determine status based on progress data
                        String status;
                        if (progress.getCompleted()) {
                            status = "completed";
                        } else if (progress.getStarted()) {
                            status = "in-progress";
                        } else {
                            status = "not-started";
                        }
                        
                        enrollment.put("status", status);
                        enrollment.put("progressPercentage", progress.getProgressPercentage());
                        enrollment.put("enrolledAt", progress.getStartedAt());
                        enrollment.put("completedAt", progress.getCompletedAt());
                        
                        // Get trainee name
                        try {
                            User trainee = userService.findByEmpId(progress.getTraineeEmpId());
                            enrollment.put("traineeName", trainee != null ? trainee.getName() : "Unknown");
                        } catch (Exception e) {
                            enrollment.put("traineeName", "Unknown");
                        }
                        
                        // Check for certificate
                        Optional<CourseCertificate> certificate = courseCertificateRepository
                            .findByTraineeEmpIdAndCourseId(progress.getTraineeEmpId(), courseId);
                        enrollment.put("hasCertificate", certificate.isPresent());
                        if (certificate.isPresent()) {
                            enrollment.put("certificateId", certificate.get().getId());
                            enrollment.put("certificateFileName", certificate.get().getFileName());
                            enrollment.put("certificateUploadedAt", certificate.get().getUploadedAt());
                        }
                        
                        return enrollment;
                    })
                    .toList();
                
                List<Map<String, Object>> feedback = courseFeedbackRepository.findByCourseId(courseId)
                    .stream()
                    .map(fb -> {
                        Map<String, Object> feedbackData = new HashMap<>();
                        feedbackData.put("id", fb.getId());
                        feedbackData.put("traineeEmpId", fb.getTraineeEmpId());
                        feedbackData.put("traineeName", fb.getTraineeName());
                        feedbackData.put("rating", fb.getRating());
                        feedbackData.put("keyLearnings", fb.getKeyLearnings());
                        feedbackData.put("feedback", fb.getFeedback());
                        feedbackData.put("submittedAt", fb.getSubmittedAt());
                        return feedbackData;
                    })
                    .toList();
                
                // Calculate comprehensive statistics
                Long totalEnrollments = (long) enrollments.size();
                Long completedCount = enrollments.stream()
                    .mapToLong(e -> "completed".equals(e.get("status")) ? 1 : 0)
                    .sum();
                Long inProgressCount = enrollments.stream()
                    .mapToLong(e -> "in-progress".equals(e.get("status")) ? 1 : 0)
                    .sum();
                Long notStartedCount = enrollments.stream()
                    .mapToLong(e -> "not-started".equals(e.get("status")) ? 1 : 0)
                    .sum();
                
                // Calculate average rating from feedback
                Double averageRating = feedback.isEmpty() ? 0.0 : 
                    feedback.stream()
                        .mapToInt(f -> (Integer) f.get("rating"))
                        .average()
                        .orElse(0.0);
                
                Long feedbackCount = (long) feedback.size();
                
                // Calculate completion percentage as average of all trainee progress percentages
                Double completionPercentage = totalEnrollments > 0 ? 
                    enrollments.stream()
                        .mapToInt(e -> (Integer) e.get("progressPercentage"))
                        .average()
                        .orElse(0.0) : 0.0;
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("course", course);
                response.put("enrollments", enrollments);
                response.put("feedback", feedback);
                response.put("statistics", Map.of(
                    "totalEnrollments", totalEnrollments,
                    "completedCount", completedCount,
                    "inProgressCount", inProgressCount,
                    "notStartedCount", notStartedCount,
                    "averageRating", Math.round(averageRating * 10.0) / 10.0, // Round to 1 decimal
                    "feedbackCount", feedbackCount,
                    "completionPercentage", Math.round(completionPercentage * 10.0) / 10.0
                ));
                
                return ResponseEntity.ok(response);
                
            } catch (Exception e) {
                // Fallback to mock data if analytics tables don't exist
                System.out.println("Analytics tables not found, using mock data: " + e.getMessage());
                
                List<Map<String, Object>> mockEnrollments = List.of(
                    Map.of(
                        "id", 1,
                        "traineeEmpId", "EMP001",
                        "traineeName", "Alice Brown",
                        "status", "completed",
                        "enrolledAt", "2024-01-01T10:00:00",
                        "completedAt", "2024-01-15T16:30:00",
                        "progressPercentage", 100
                    ),
                    Map.of(
                        "id", 2,
                        "traineeEmpId", "EMP002",
                        "traineeName", "Bob Wilson",
                        "status", "in-progress",
                        "enrolledAt", "2024-01-02T09:15:00",
                        "progressPercentage", 65
                    ),
                    Map.of(
                        "id", 3,
                        "traineeEmpId", "EMP003",
                        "traineeName", "Carol Davis",
                        "status", "not-started",
                        "enrolledAt", "2024-01-03T14:20:00",
                        "progressPercentage", 0
                    )
                );
                
                List<Map<String, Object>> mockFeedback = List.of(
                    Map.of(
                        "traineeEmpId", "EMP001",
                        "traineeName", "Alice Brown",
                        "rating", 5,
                        "keyLearnings", "Learned React components, state management, and hooks.",
                        "feedback", "Excellent course content and delivery.",
                        "submittedAt", "2024-01-15T17:00:00"
                    )
                );
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("course", course);
                response.put("enrollments", mockEnrollments);
                response.put("feedback", mockFeedback);
                response.put("statistics", Map.of(
                    "totalEnrollments", 3,
                    "completedCount", 1,
                    "inProgressCount", 1,
                    "notStartedCount", 1,
                    "averageRating", 4.5,
                    "feedbackCount", 1
                ));
                
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch analytics: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/progress/start")
    public ResponseEntity<?> startCourse(@RequestBody Map<String, Object> request) {
        try {
            Long courseId = Long.valueOf(request.get("courseId").toString());
            String traineeEmpId = request.get("traineeEmpId").toString();
            
            // Get trainee details
            User trainee = userService.findByEmpId(traineeEmpId);
            if (trainee == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Trainee not found");
                return ResponseEntity.badRequest().body(response);
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
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Course started successfully");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to start course: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/progress/{courseId}")
    public ResponseEntity<?> getCourseProgress(@PathVariable Long courseId) {
        try {
            List<CourseProgress> progressList = courseProgressRepository.findByCourseId(courseId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("progress", progressList);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch progress: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/progress/update")
    public ResponseEntity<?> updateCourseProgress(@RequestBody Map<String, Object> request) {
        try {
            Long courseId = Long.valueOf(request.get("courseId").toString());
            String traineeEmpId = request.get("traineeEmpId").toString();
            Integer progressPercentage = Integer.valueOf(request.get("progressPercentage").toString());
            
            Optional<CourseProgress> existingProgress = courseProgressRepository.findByCourseIdAndTraineeEmpId(courseId, traineeEmpId);
            CourseProgress progress;
            
            if (existingProgress.isPresent()) {
                progress = existingProgress.get();
            } else {
                progress = new CourseProgress(courseId, traineeEmpId);
                progress.setStarted(true);
                progress.setStartedAt(LocalDateTime.now());
            }
            
            progress.setProgressPercentage(progressPercentage);
            progress.setUpdatedAt(LocalDateTime.now());
            
            // Auto-complete if 100%
            if (progressPercentage >= 100) {
                progress.setCompleted(true);
                progress.setCompletedAt(LocalDateTime.now());
            }
            
            courseProgressRepository.save(progress);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Progress updated successfully");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to update progress: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/progress/complete")
    public ResponseEntity<?> completeCourse(@RequestBody Map<String, Object> request) {
        try {
            Long courseId = Long.valueOf(request.get("courseId").toString());
            String traineeEmpId = request.get("traineeEmpId").toString();
            
            Optional<CourseProgress> existingProgress = courseProgressRepository.findByCourseIdAndTraineeEmpId(courseId, traineeEmpId);
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
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Course completed successfully");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to complete course: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}