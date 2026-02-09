package com.trainer.app.controller;

import com.trainer.app.dto.BatchWithTraineesDto;
import com.trainer.app.dto.TraineeDetailsDto;
import com.trainer.app.repository.CourseRepository;
import com.trainer.app.model.User;
import com.trainer.app.repository.CourseEnrollmentRepository;
import com.trainer.app.service.BatchService;
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
    
    @Autowired
    private BatchService batchService;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private CourseEnrollmentRepository courseEnrollmentRepository;

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
    
    @GetMapping("/batches")
    public ResponseEntity<?> getBatches(@RequestParam String trainerEmpId) {
        try {
            List<BatchWithTraineesDto> batches = batchService.getBatchesByTrainer(trainerEmpId);
            return ResponseEntity.ok(batches);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch batches: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/trainees")
    public ResponseEntity<?> getTrainees(@RequestParam String trainerEmpId) {
        try {
            List<TraineeDetailsDto> trainees = batchService.getTraineesByTrainer(trainerEmpId);
            
            // Add course enrollment data for each trainee
            List<Map<String, Object>> traineesWithCourseData = trainees.stream().map(trainee -> {
                Map<String, Object> traineeData = new HashMap<>();
                traineeData.put("id", trainee.getId());
                traineeData.put("name", trainee.getName());
                traineeData.put("email", trainee.getEmail());
                traineeData.put("empId", trainee.getEmpId());
                traineeData.put("batch", trainee.getBatchName());
                traineeData.put("status", trainee.getStatus());
                
                // Get course enrollments and filter by active courses only
                List<com.trainer.app.model.CourseEnrollment> allEnrollments = courseEnrollmentRepository.findByTraineeEmpId(trainee.getEmpId());
                List<com.trainer.app.model.CourseEnrollment> activeEnrollments = allEnrollments.stream()
                    .filter(enrollment -> {
                        com.trainer.app.model.Course course = courseRepository.findById(enrollment.getCourseId()).orElse(null);
                        return course != null && "active".equals(course.getStatus());
                    })
                    .toList();
                
                Long enrolledCount = (long) activeEnrollments.size();
                Long completedCount = activeEnrollments.stream()
                    .mapToLong(enrollment -> "completed".equals(enrollment.getStatus()) ? 1 : 0)
                    .sum();
                
                traineeData.put("enrolledCoursesCount", enrolledCount.intValue());
                traineeData.put("completedCoursesCount", completedCount.intValue());
                
                return traineeData;
            }).toList();
            
            return ResponseEntity.ok(traineesWithCourseData);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch trainees: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/batches")
    public ResponseEntity<?> createBatch(@RequestParam String name, @RequestParam String description, @RequestParam String trainerEmpId) {
        try {
            batchService.createBatch(name, description, trainerEmpId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Batch created successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to create batch: " + e.getMessage());
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
    
    @GetMapping("/{empId}")
    public ResponseEntity<Map<String, Object>> getTrainerProfile(@PathVariable String empId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            User trainer = userService.findByEmpId(empId);
            
            if (trainer != null && "trainer".equals(trainer.getRole())) {
                Map<String, Object> trainerData = new HashMap<>();
                trainerData.put("name", trainer.getName());
                trainerData.put("email", trainer.getEmail());
                trainerData.put("empId", trainer.getEmpId());
                trainerData.put("phoneNumber", trainer.getPhoneNumber());
                trainerData.put("yearsOfExperience", trainer.getYearsOfExperience());
                trainerData.put("address", trainer.getAddress());
                
                response.put("success", true);
                response.put("trainer", trainerData);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Trainer not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching trainer profile: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @PutMapping("/{empId}")
    public ResponseEntity<Map<String, Object>> updateTrainer(@PathVariable String empId, @RequestBody Map<String, Object> updates) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            User trainer = userService.findByEmpId(empId);
            
            if (trainer != null && "trainer".equals(trainer.getRole())) {
                if (updates.containsKey("name")) {
                    String name = (String) updates.get("name");
                    if (!name.matches("^[a-zA-Z\\s]*$")) {
                        response.put("success", false);
                        response.put("message", "Full name can only contain letters and spaces");
                        return ResponseEntity.badRequest().body(response);
                    }
                    if (name.length() > 20) {
                        response.put("success", false);
                        response.put("message", "Full name cannot exceed 20 characters");
                        return ResponseEntity.badRequest().body(response);
                    }
                    trainer.setName(name);
                }
                
                if (updates.containsKey("phoneNumber")) {
                    String phoneNumber = (String) updates.get("phoneNumber");
                    if (!phoneNumber.matches("^\\d{10}$")) {
                        response.put("success", false);
                        response.put("message", "Phone number must be exactly 10 digits");
                        return ResponseEntity.badRequest().body(response);
                    }
                    trainer.setPhoneNumber(phoneNumber);
                }
                
                if (updates.containsKey("yearsOfExperience")) {
                    try {
                        Object exp = updates.get("yearsOfExperience");
                        Integer experience = exp != null ? Integer.valueOf(exp.toString()) : null;
                        if (experience != null && experience < 2) {
                            response.put("success", false);
                            response.put("message", "Years of experience must be 2 or greater");
                            return ResponseEntity.badRequest().body(response);
                        }
                        trainer.setYearsOfExperience(experience);
                    } catch (NumberFormatException e) {
                        response.put("success", false);
                        response.put("message", "Invalid years of experience format");
                        return ResponseEntity.badRequest().body(response);
                    }
                }
                
                if (updates.containsKey("address")) {
                    String address = (String) updates.get("address");
                    trainer.setAddress(address);
                }
                
                userService.saveUser(trainer);
                
                response.put("success", true);
                response.put("message", "Trainer profile updated successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Trainer not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error updating trainer profile: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
