package com.trainer.app.controller;

import com.trainer.app.dto.SignupRequest;
import com.trainer.app.dto.LoginRequest;
import com.trainer.app.dto.AuthResponse;
import com.trainer.app.dto.UserDto;
import com.trainer.app.model.User;
import com.trainer.app.service.UserService;
import com.trainer.app.service.BatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private BatchService batchService;
    
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        try {
            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword());
            user.setRole(request.getRole());
            user.setEmpId(request.getEmpId());
            user.setTrainerEmpId(request.getTrainerEmpId());
            
            User savedUser = userService.signup(user);
            
            UserDto userDto = new UserDto(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getEmpId(),
                savedUser.getStatus()
            );
            
            String message = savedUser.getRole().equals("trainer") 
                ? "Trainer account created successfully" 
                : "Trainee registration submitted. Waiting for trainer approval.";
                
            return ResponseEntity.ok(new AuthResponse(true, message, userDto));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse(false, e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            User user = userService.login(request.getEmail(), request.getPassword());
            
            // Create default batches for trainer if they don't have any
            if ("trainer".equals(user.getRole())) {
                if (batchService.getBatchesByTrainer(user.getId()).isEmpty()) {
                    batchService.createBatch(user.getId(), "Batch A");
                    batchService.createBatch(user.getId(), "Batch B");
                }
            }
            
            UserDto userDto = new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getEmpId(),
                user.getStatus()
            );
            
            return ResponseEntity.ok(new AuthResponse(true, "Login successful", userDto));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/pending-trainees")
    public ResponseEntity<List<UserDto>> getPendingTrainees() {
        List<User> pendingTrainees = userService.getPendingTrainees();
        List<UserDto> userDtos = pendingTrainees.stream()
            .map(user -> new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getEmpId(),
                user.getStatus()
            ))
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(userDtos);
    }
    
    @PostMapping("/approve-trainee")
    public ResponseEntity<AuthResponse> approveTrainee(@RequestBody Map<String, Object> request) {
        try {
            Long traineeId = Long.valueOf(request.get("traineeId").toString());
            Long batchId = Long.valueOf(request.get("batchId").toString());
            Long trainerId = Long.valueOf(request.get("trainerId").toString());
            
            // Approve the trainee
            userService.approveTrainee(traineeId);
            
            // Assign to batch
            batchService.assignTraineeToBatch(traineeId, batchId, trainerId);
            
            return ResponseEntity.ok(new AuthResponse(true, "Trainee approved and assigned to batch successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse(false, e.getMessage()));
        }
    }
    
    @DeleteMapping("/reject-trainee/{id}")
    public ResponseEntity<AuthResponse> rejectTrainee(@PathVariable Long id) {
        try {
            userService.rejectTrainee(id);
            return ResponseEntity.ok(new AuthResponse(true, "Trainee rejected successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse(false, e.getMessage()));
        }
    }
}