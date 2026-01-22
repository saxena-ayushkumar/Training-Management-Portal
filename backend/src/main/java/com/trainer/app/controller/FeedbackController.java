package com.trainer.app.controller;

import com.trainer.app.model.CourseFeedback;
import com.trainer.app.repository.CourseFeedbackRepository;
import com.trainer.app.repository.UserRepository;
import com.trainer.app.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:3000")
public class FeedbackController {
    
    @Autowired
    private CourseFeedbackRepository courseFeedbackRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitFeedback(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Long courseId = Long.valueOf(request.get("courseId").toString());
            String traineeEmpId = request.get("traineeEmpId").toString();
            Integer rating = Integer.valueOf(request.get("rating").toString());
            String keyLearnings = request.get("keyLearnings").toString();
            String feedback = request.get("feedback").toString();
            
            // Find trainee
            Optional<User> traineeOpt = userRepository.findByEmpId(traineeEmpId);
            if (!traineeOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "Trainee not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            User trainee = traineeOpt.get();
            
            // Check if feedback already exists
            Optional<CourseFeedback> existingFeedback = courseFeedbackRepository.findByCourseIdAndTraineeEmpId(courseId, traineeEmpId);
            CourseFeedback courseFeedback;
            
            if (existingFeedback.isPresent()) {
                courseFeedback = existingFeedback.get();
            } else {
                courseFeedback = new CourseFeedback();
                courseFeedback.setCourseId(courseId);
                courseFeedback.setTraineeEmpId(traineeEmpId);
                courseFeedback.setTraineeName(trainee.getName());
            }
            
            courseFeedback.setRating(rating);
            courseFeedback.setKeyLearnings(keyLearnings);
            courseFeedback.setFeedback(feedback);
            courseFeedback.setSubmittedAt(LocalDateTime.now());
            
            courseFeedbackRepository.save(courseFeedback);
            
            response.put("success", true);
            response.put("message", "Feedback submitted successfully");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error submitting feedback: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/course/{courseId}")
    public ResponseEntity<Map<String, Object>> getCourseFeedback(@PathVariable Long courseId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<CourseFeedback> feedbackList = courseFeedbackRepository.findByCourseId(courseId);
            
            response.put("success", true);
            response.put("feedback", feedbackList);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching feedback: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}