package com.trainer.app.service;

import com.trainer.app.dto.TraineeUpdateDto;
import com.trainer.app.model.User;
import com.trainer.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TraineeService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserService userService;
    
    public User getTraineeByEmpId(String empId) {
        User trainee = userService.findByEmpId(empId);
        if (trainee == null || !"trainee".equals(trainee.getRole())) {
            throw new RuntimeException("Trainee not found");
        }
        return trainee;
    }
    
    public User updateTrainee(String empId, TraineeUpdateDto updateDto) {
        User trainee = getTraineeByEmpId(empId);
        
        if (updateDto.getName() != null) trainee.setName(updateDto.getName());
        if (updateDto.getEmail() != null) trainee.setEmail(updateDto.getEmail());
        if (updateDto.getPhone() != null) trainee.setPhoneNumber(updateDto.getPhone());
        if (updateDto.getSkills() != null) trainee.setSkills(updateDto.getSkills());
        if (updateDto.getExperience() != null) trainee.setAddress(updateDto.getExperience()); // Using address field for experience
        if (updateDto.getAddress() != null) trainee.setAddress(updateDto.getAddress());
        
        return userService.saveUser(trainee);
    }
}