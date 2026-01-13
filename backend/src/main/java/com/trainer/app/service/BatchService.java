package com.trainer.app.service;

import com.trainer.app.dto.BatchDto;
import com.trainer.app.dto.TraineeDto;
import com.trainer.app.model.Batch;
import com.trainer.app.model.BatchTrainee;
import com.trainer.app.model.User;
import com.trainer.app.repository.BatchRepository;
import com.trainer.app.repository.BatchTraineeRepository;
import com.trainer.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BatchService {
    
    @Autowired
    private BatchRepository batchRepository;
    
    @Autowired
    private BatchTraineeRepository batchTraineeRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<BatchDto> getBatchesByTrainer(Long trainerId) {
        List<Batch> batches = batchRepository.findByTrainerId(trainerId);
        return batches.stream().map(this::convertToBatchDto).collect(Collectors.toList());
    }
    
    public BatchDto createBatch(Long trainerId, String batchName) {
        if (batchRepository.existsByTrainerIdAndName(trainerId, batchName)) {
            throw new RuntimeException("Batch with name '" + batchName + "' already exists");
        }
        
        Batch batch = new Batch(batchName, trainerId);
        Batch savedBatch = batchRepository.save(batch);
        return convertToBatchDto(savedBatch);
    }
    
    @Transactional
    public void deleteBatch(Long batchId, Long trainerId) {
        Batch batch = batchRepository.findById(batchId)
            .orElseThrow(() -> new RuntimeException("Batch not found"));
        
        if (!batch.getTrainerId().equals(trainerId)) {
            throw new RuntimeException("Unauthorized to delete this batch");
        }
        
        // Remove all trainee assignments first
        batchTraineeRepository.deleteByBatchId(batchId);
        
        // Delete the batch
        batchRepository.delete(batch);
    }
    
    @Transactional
    public void assignTraineeToBatch(Long traineeId, Long batchId, Long trainerId) {
        // Verify batch belongs to trainer
        Batch batch = batchRepository.findById(batchId)
            .orElseThrow(() -> new RuntimeException("Batch not found"));
        
        if (!batch.getTrainerId().equals(trainerId)) {
            throw new RuntimeException("Unauthorized to assign to this batch");
        }
        
        // Verify trainee exists and is approved
        User trainee = userRepository.findById(traineeId)
            .orElseThrow(() -> new RuntimeException("Trainee not found"));
        
        if (!"trainee".equals(trainee.getRole()) || !"approved".equals(trainee.getStatus())) {
            throw new RuntimeException("Invalid trainee or not approved");
        }
        
        // Remove trainee from any existing batch
        List<BatchTrainee> existingAssignments = batchTraineeRepository.findByTraineeId(traineeId);
        for (BatchTrainee assignment : existingAssignments) {
            batchTraineeRepository.delete(assignment);
        }
        
        // Assign to new batch
        BatchTrainee batchTrainee = new BatchTrainee(batch, trainee);
        batchTraineeRepository.save(batchTrainee);
    }
    
    @Transactional
    public void removeTraineeFromBatch(Long traineeId, Long batchId, Long trainerId) {
        // Verify batch belongs to trainer
        Batch batch = batchRepository.findById(batchId)
            .orElseThrow(() -> new RuntimeException("Batch not found"));
        
        if (!batch.getTrainerId().equals(trainerId)) {
            throw new RuntimeException("Unauthorized to modify this batch");
        }
        
        batchTraineeRepository.deleteByBatchIdAndTraineeId(batchId, traineeId);
    }
    
    public BatchDto getBatchDetails(Long batchId, Long trainerId) {
        Batch batch = batchRepository.findById(batchId)
            .orElseThrow(() -> new RuntimeException("Batch not found"));
        
        if (!batch.getTrainerId().equals(trainerId)) {
            throw new RuntimeException("Unauthorized to view this batch");
        }
        
        return convertToBatchDto(batch);
    }
    
    public Map<String, String> getTraineeBatchInfo(Long traineeId) {
        List<BatchTrainee> assignments = batchTraineeRepository.findByTraineeId(traineeId);
        if (assignments.isEmpty()) {
            return Map.of(
                "batchName", "Not Assigned",
                "trainerName", "Not Assigned"
            );
        }
        
        Batch batch = assignments.get(0).getBatch();
        User trainer = userRepository.findById(batch.getTrainerId())
            .orElse(null);
        
        return Map.of(
            "batchName", batch.getName(),
            "trainerName", trainer != null ? trainer.getName() : "Not Assigned"
        );
    }
    
    public String getTraineeBatch(Long traineeId) {
        List<BatchTrainee> assignments = batchTraineeRepository.findByTraineeId(traineeId);
        if (assignments.isEmpty()) {
            return "Not Assigned";
        }
        return assignments.get(0).getBatch().getName();
    }
    
    public void updateBatchName(Long batchId, Long trainerId, String newName) {
        System.out.println("Updating batch ID: " + batchId + " for trainer: " + trainerId + " to name: " + newName);
        
        Batch batch = batchRepository.findById(batchId)
            .orElseThrow(() -> new RuntimeException("Batch not found"));
        
        System.out.println("Found batch: " + batch.getName() + " owned by trainer: " + batch.getTrainerId());
        
        if (!batch.getTrainerId().equals(trainerId)) {
            throw new RuntimeException("Unauthorized to update this batch");
        }
        
        if (batchRepository.existsByTrainerIdAndName(trainerId, newName)) {
            throw new RuntimeException("Batch with name '" + newName + "' already exists");
        }
        
        batch.setName(newName);
        batchRepository.save(batch);
        System.out.println("Batch name updated successfully to: " + newName);
    }
    
    private BatchDto convertToBatchDto(Batch batch) {
        BatchDto dto = new BatchDto(batch.getId(), batch.getName(), batch.getTrainerId(), batch.getCreatedAt());
        
        // Get trainees in this batch
        List<BatchTrainee> batchTrainees = batchTraineeRepository.findByBatchId(batch.getId());
        List<TraineeDto> traineeDtos = batchTrainees.stream()
            .map(bt -> new TraineeDto(
                bt.getTrainee().getId(),
                bt.getTrainee().getName(),
                bt.getTrainee().getEmail(),
                bt.getTrainee().getEmpId(),
                bt.getAssignedAt()
            ))
            .collect(Collectors.toList());
        
        dto.setTrainees(traineeDtos);
        dto.setTraineeCount(traineeDtos.size());
        
        return dto;
    }
}