package com.trainer.app.controller;

import com.trainer.app.model.Session;
import com.trainer.app.repository.SessionRepository;
import com.trainer.app.repository.BatchRepository;
import com.trainer.app.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "http://localhost:3000")
public class SessionController {
    
    @Autowired
    private SessionRepository sessionRepository;
    
    @Autowired
    private BatchRepository batchRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @PostMapping
    public ResponseEntity<?> createSession(@RequestBody Session session) {
        try {
            Session createdSession = sessionRepository.save(session);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Session created successfully");
            response.put("session", createdSession);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to create session: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/trainer/{trainerEmpId}")
    public ResponseEntity<?> getSessionsByTrainer(@PathVariable String trainerEmpId) {
        try {
            List<Session> sessions = sessionRepository.findByTrainerEmpIdOrderBySessionDateAsc(trainerEmpId);
            
            // Add course details to sessions
            List<Map<String, Object>> sessionsWithDetails = sessions.stream().map(session -> {
                Map<String, Object> sessionData = new HashMap<>();
                sessionData.put("id", session.getId());
                sessionData.put("title", session.getTitle());
                sessionData.put("description", session.getDescription());
                sessionData.put("courseId", session.getCourseId());
                sessionData.put("batchName", session.getBatchName());
                sessionData.put("sessionDate", session.getSessionDate());
                sessionData.put("sessionTime", session.getSessionTime());
                sessionData.put("duration", session.getDuration());
                sessionData.put("status", session.getStatus());
                sessionData.put("meetingLink", session.getMeetingLink());
                sessionData.put("createdAt", session.getCreatedAt());
                
                // Get course title if courseId exists
                if (session.getCourseId() != null) {
                    courseRepository.findById(session.getCourseId()).ifPresent(course -> {
                        sessionData.put("courseTitle", course.getTitle());
                    });
                }
                
                return sessionData;
            }).toList();
            
            return ResponseEntity.ok(sessionsWithDetails);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch sessions: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/batch/{batchName}")
    public ResponseEntity<?> getSessionsByBatch(@PathVariable String batchName) {
        try {
            List<Session> sessions = sessionRepository.findByBatchNameAndStatus(batchName, "scheduled");
            
            // Add course details to sessions
            List<Map<String, Object>> sessionsWithDetails = sessions.stream().map(session -> {
                Map<String, Object> sessionData = new HashMap<>();
                sessionData.put("id", session.getId());
                sessionData.put("title", session.getTitle());
                sessionData.put("description", session.getDescription());
                sessionData.put("courseId", session.getCourseId());
                sessionData.put("batchName", session.getBatchName());
                sessionData.put("sessionDate", session.getSessionDate());
                sessionData.put("sessionTime", session.getSessionTime());
                sessionData.put("duration", session.getDuration());
                sessionData.put("status", session.getStatus());
                sessionData.put("meetingLink", session.getMeetingLink());
                sessionData.put("createdAt", session.getCreatedAt());
                
                // Get course title if courseId exists
                if (session.getCourseId() != null) {
                    courseRepository.findById(session.getCourseId()).ifPresent(course -> {
                        sessionData.put("courseTitle", course.getTitle());
                    });
                }
                
                return sessionData;
            }).toList();
            
            return ResponseEntity.ok(sessionsWithDetails);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch sessions: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/{sessionId}/status")
    public ResponseEntity<?> updateSessionStatus(@PathVariable Long sessionId, @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            Session session = sessionRepository.findById(sessionId).orElse(null);
            
            if (session == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Session not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            session.setStatus(status);
            sessionRepository.save(session);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Session status updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to update session status: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}