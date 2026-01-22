package com.trainer.app.service;

import com.trainer.app.dto.SignupRequest;
import com.trainer.app.model.User;
import com.trainer.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public User signup(User user) throws Exception {
        // Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new Exception("Email already exists");
        }
        
        // Check if employee ID already exists
        if (userRepository.existsByEmpId(user.getEmpId())) {
            throw new Exception("Employee ID already exists");
        }
        
        if (user.getRole().equals("trainer")) {
            user.setStatus("approved"); // Trainers are auto-approved
        } else if (user.getRole().equals("trainee")) {
            // Validate trainer employee ID exists
            if (user.getTrainerEmpId() == null || user.getTrainerEmpId().isEmpty()) {
                throw new Exception("Trainer Employee ID is required for trainees");
            }
            
            Optional<User> trainer = userRepository.findTrainerByEmpId(user.getTrainerEmpId());
            if (trainer.isEmpty()) {
                throw new Exception("Invalid Trainer Employee ID");
            }
            
            user.setStatus("pending"); // Trainees need approval
        }
        
        return userRepository.save(user);
    }
    
    public User login(String email, String password) throws Exception {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            throw new Exception("Invalid email or password");
        }
        
        User user = userOpt.get();
        
        if (!user.getPassword().equals(password)) {
            throw new Exception("Invalid email or password");
        }
        
        if (user.getRole().equals("trainee") && !user.getStatus().equals("approved")) {
            throw new Exception("Your account is pending approval from trainer");
        }
        
        return user;
    }
    
    public List<User> getPendingTrainees() {
        return userRepository.findPendingTrainees();
    }
    
    public List<User> getPendingTraineesByTrainer(String trainerEmpId) {
        return userRepository.findPendingTraineesByTrainer(trainerEmpId);
    }
    
    public User approveTrainee(Long traineeId, String batchName) throws Exception {
        Optional<User> userOpt = userRepository.findById(traineeId);
        if (userOpt.isEmpty()) {
            throw new Exception("Trainee not found");
        }
        
        User user = userOpt.get();
        user.setStatus("approved");
        user.setBatchName(batchName);
        
        // Save the user
        User savedUser = userRepository.save(user);
        
        return savedUser;
    }
    
    public void rejectTrainee(Long traineeId) throws Exception {
        Optional<User> userOpt = userRepository.findById(traineeId);
        if (userOpt.isEmpty()) {
            throw new Exception("Trainee not found");
        }
        
        userRepository.deleteById(traineeId);
    }
    
    public User authenticate(String email, String password) {
        try {
            System.out.println("Attempting login for email: " + email);
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                System.out.println("User not found for email: " + email);
                return null;
            }
            
            User user = userOpt.get();
            System.out.println("Found user: " + user.getName() + ", stored password: " + user.getPassword());
            System.out.println("Provided password: " + password);
            
            if (!user.getPassword().equals(password)) {
                System.out.println("Password mismatch for user: " + email);
                return null;
            }
            
            if (user.getRole().equals("trainee") && !user.getStatus().equals("approved")) {
                System.out.println("Trainee not approved: " + email + ", status: " + user.getStatus());
                return null;
            }
            
            System.out.println("Login successful for: " + email);
            return user;
        } catch (Exception e) {
            System.out.println("Login error: " + e.getMessage());
            return null;
        }
    }
    
    public User createUser(SignupRequest signupRequest) throws Exception {
        // Validate password strength
        validatePassword(signupRequest.getPassword());
        
        User user = new User();
        user.setName(signupRequest.getName());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(signupRequest.getPassword());
        user.setRole(signupRequest.getRole());
        user.setEmpId(signupRequest.getEmpId());
        user.setTrainerEmpId(signupRequest.getTrainerEmpId());
        
        return signup(user);
    }
    
    private void validatePassword(String password) throws Exception {
        if (password == null || password.length() < 8) {
            throw new Exception("Password must be at least 8 characters long");
        }
        if (!password.matches(".*[A-Z].*")) {
            throw new Exception("Password must contain at least one uppercase letter");
        }
        if (!password.matches(".*[a-z].*")) {
            throw new Exception("Password must contain at least one lowercase letter");
        }
        if (!password.matches(".*\\d.*")) {
            throw new Exception("Password must contain at least one number");
        }
        if (!password.matches(".*[!@#$%^&*(),.?\":{}|<>].*")) {
            throw new Exception("Password must contain at least one special character");
        }
    }
    
    public User transferTrainee(Long traineeId, String newBatchName) throws Exception {
        Optional<User> userOpt = userRepository.findById(traineeId);
        if (userOpt.isEmpty()) {
            throw new Exception("Trainee not found");
        }
        
        User user = userOpt.get();
        if (newBatchName == null || newBatchName.trim().isEmpty()) {
            throw new Exception("Batch name cannot be empty");
        }
        
        user.setBatchName(newBatchName.trim());
        
        return userRepository.save(user);
    }
    
    public User findByEmpId(String empId) {
        Optional<User> userOpt = userRepository.findByEmpId(empId);
        return userOpt.orElse(null);
    }
    
    public User saveUser(User user) {
        return userRepository.save(user);
    }
}