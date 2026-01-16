package com.trainer.app.controller;

import com.trainer.app.model.User;
import com.trainer.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trainer")
@CrossOrigin(origins = "http://localhost:3000")
public class TrainerController {

    @Autowired
    private UserService userService;

    @GetMapping("/pending-trainees")
    public ResponseEntity<?> getPendingTrainees(@RequestParam String trainerEmpId) {
        try {
            List<User> pendingTrainees = userService.getPendingTraineesByTrainer(trainerEmpId);
            return ResponseEntity.ok(pendingTrainees);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch pending trainees: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/approve-trainee/{traineeId}")
    public ResponseEntity<?> approveTrainee(@PathVariable Long traineeId, @RequestParam String batchName) {
        try {
            User approvedTrainee = userService.approveTrainee(traineeId, batchName);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Trainee approved successfully");
            response.put("trainee", approvedTrainee);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to approve trainee: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/reject-trainee/{traineeId}")
    public ResponseEntity<?> rejectTrainee(@PathVariable Long traineeId) {
        try {
            userService.rejectTrainee(traineeId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Trainee rejected successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to reject trainee: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
