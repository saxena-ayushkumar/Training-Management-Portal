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
        return userRepository.save(user);
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
            return login(email, password);
        } catch (Exception e) {
            return null;
        }
    }
    
    public User createUser(SignupRequest signupRequest) throws Exception {
        User user = new User();
        user.setName(signupRequest.getName());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(signupRequest.getPassword());
        user.setRole(signupRequest.getRole());
        user.setEmpId(signupRequest.getEmpId());
        user.setTrainerEmpId(signupRequest.getTrainerEmpId());
        
        return signup(user);
    }
}