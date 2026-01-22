package com.trainer.app.controller;

import com.trainer.app.model.LeaveRequest;
import com.trainer.app.repository.LeaveRequestRepository;
import com.trainer.app.repository.UserRepository;
import com.trainer.app.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/leave")
@CrossOrigin(origins = "http://localhost:3000")
public class LeaveRequestController {
    
    @Autowired
    private LeaveRequestRepository leaveRequestRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitLeaveRequest(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String traineeEmpId = request.get("traineeEmpId");
            String leaveType = request.get("leaveType");
            String startDate = request.get("startDate");
            String endDate = request.get("endDate");
            String reason = request.get("reason");
            
            // Find trainee
            Optional<User> traineeOpt = userRepository.findByEmpId(traineeEmpId);
            if (!traineeOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "Trainee not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            User trainee = traineeOpt.get();
            
            LeaveRequest leaveRequest = new LeaveRequest();
            leaveRequest.setTraineeEmpId(traineeEmpId);
            leaveRequest.setTraineeName(trainee.getName());
            leaveRequest.setTrainerEmpId(trainee.getTrainerEmpId());
            leaveRequest.setLeaveType(leaveType);
            leaveRequest.setStartDate(LocalDate.parse(startDate));
            leaveRequest.setEndDate(LocalDate.parse(endDate));
            leaveRequest.setReason(reason);
            leaveRequest.setStatus("pending");
            
            leaveRequestRepository.save(leaveRequest);
            
            response.put("success", true);
            response.put("message", "Leave request submitted successfully");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error submitting leave request: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/trainer/{trainerEmpId}")
    public ResponseEntity<Map<String, Object>> getLeaveRequestsForTrainer(@PathVariable String trainerEmpId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<LeaveRequest> leaveRequests = leaveRequestRepository.findByTrainerEmpId(trainerEmpId);
            
            response.put("success", true);
            response.put("leaveRequests", leaveRequests);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching leave requests: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/trainee/{traineeEmpId}")
    public ResponseEntity<Map<String, Object>> getLeaveRequestsForTrainee(@PathVariable String traineeEmpId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<LeaveRequest> leaveRequests = leaveRequestRepository.findByTraineeEmpId(traineeEmpId);
            
            response.put("success", true);
            response.put("leaveRequests", leaveRequests);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching leave requests: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/approve/{leaveId}")
    public ResponseEntity<Map<String, Object>> approveLeaveRequest(@PathVariable Long leaveId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<LeaveRequest> leaveOpt = leaveRequestRepository.findById(leaveId);
            if (!leaveOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "Leave request not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            LeaveRequest leaveRequest = leaveOpt.get();
            leaveRequest.setStatus("approved");
            leaveRequest.setReviewedAt(LocalDateTime.now());
            leaveRequestRepository.save(leaveRequest);
            
            response.put("success", true);
            response.put("message", "Leave request approved");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error approving leave request: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/reject/{leaveId}")
    public ResponseEntity<Map<String, Object>> rejectLeaveRequest(@PathVariable Long leaveId, @RequestBody(required = false) Map<String, String> requestBody) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<LeaveRequest> leaveOpt = leaveRequestRepository.findById(leaveId);
            if (!leaveOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "Leave request not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            LeaveRequest leaveRequest = leaveOpt.get();
            leaveRequest.setStatus("rejected");
            leaveRequest.setReviewedAt(LocalDateTime.now());
            
            // Set rejection feedback if provided
            if (requestBody != null && requestBody.containsKey("feedback")) {
                leaveRequest.setRejectionFeedback(requestBody.get("feedback"));
            }
            
            leaveRequestRepository.save(leaveRequest);
            
            response.put("success", true);
            response.put("message", "Leave request rejected");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error rejecting leave request: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}