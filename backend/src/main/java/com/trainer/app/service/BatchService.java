package com.trainer.app.service;

import com.trainer.app.dto.BatchWithTraineesDto;
import com.trainer.app.dto.TraineeDetailsDto;
import com.trainer.app.model.Batch;
import com.trainer.app.model.User;
import com.trainer.app.repository.BatchRepository;
import com.trainer.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BatchService {
    
    @Autowired
    private BatchRepository batchRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<BatchWithTraineesDto> getBatchesByTrainer(String trainerEmpId) {
        List<Batch> batches = batchRepository.findByTrainerEmpId(trainerEmpId);
        
        return batches.stream().map(batch -> {
            int traineeCount = userRepository.countByBatchNameAndStatus(batch.getName(), "approved");
            return new BatchWithTraineesDto(batch.getId(), batch.getName(), batch.getDescription(), traineeCount);
        }).collect(Collectors.toList());
    }
    
    public List<TraineeDetailsDto> getTraineesByTrainer(String trainerEmpId) {
        List<User> trainees = userRepository.findApprovedTraineesByTrainer(trainerEmpId);
        
        return trainees.stream().map(trainee -> 
            new TraineeDetailsDto(
                trainee.getId(),
                trainee.getName(),
                trainee.getEmail(),
                trainee.getEmpId(),
                trainee.getBatchName(),
                trainee.getStatus()
            )
        ).collect(Collectors.toList());
    }
    
    public Batch createBatch(String name, String description, String trainerEmpId) {
        Batch batch = new Batch(name, description, trainerEmpId);
        return batchRepository.save(batch);
    }
}