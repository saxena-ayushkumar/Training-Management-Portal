package com.trainer.app.controller;

import com.trainer.app.dto.AuthResponse;
import com.trainer.app.dto.BatchDto;
import com.trainer.app.service.BatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/batches")
@CrossOrigin(origins = "http://localhost:3000")
public class BatchController {
    
    @Autowired
    private BatchService batchService;
    
    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<AuthResponse> getTrainerBatches(@PathVariable Long trainerId) {
        try {
            List<BatchDto> batches = batchService.getBatchesByTrainer(trainerId);
            return ResponseEntity.ok(new AuthResponse(true, "Batches retrieved successfully", batches));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse(false, "Error retrieving batches: " + e.getMessage(), null));
        }
    }
    
    @PostMapping("/create")
    public ResponseEntity<AuthResponse> createBatch(@RequestBody Map<String, Object> request) {
        try {
            Long trainerId = Long.valueOf(request.get("trainerId").toString());
            String batchName = request.get("name").toString();
            
            BatchDto batch = batchService.createBatch(trainerId, batchName);
            return ResponseEntity.ok(new AuthResponse(true, "Batch created successfully", batch));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse(false, "Error creating batch: " + e.getMessage(), null));
        }
    }
    
    @DeleteMapping("/{batchId}/trainer/{trainerId}")
    public ResponseEntity<AuthResponse> deleteBatch(@PathVariable Long batchId, @PathVariable Long trainerId) {
        try {
            batchService.deleteBatch(batchId, trainerId);
            return ResponseEntity.ok(new AuthResponse(true, "Batch deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse(false, "Error deleting batch: " + e.getMessage(), null));
        }
    }
    
    @PostMapping("/assign-trainee")
    public ResponseEntity<AuthResponse> assignTraineeToBatch(@RequestBody Map<String, Object> request) {
        try {
            Long traineeId = Long.valueOf(request.get("traineeId").toString());
            Long batchId = Long.valueOf(request.get("batchId").toString());
            Long trainerId = Long.valueOf(request.get("trainerId").toString());
            
            batchService.assignTraineeToBatch(traineeId, batchId, trainerId);
            return ResponseEntity.ok(new AuthResponse(true, "Trainee assigned to batch successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse(false, "Error assigning trainee: " + e.getMessage(), null));
        }
    }
    
    @DeleteMapping("/remove-trainee")
    public ResponseEntity<AuthResponse> removeTraineeFromBatch(@RequestBody Map<String, Object> request) {
        try {
            Long traineeId = Long.valueOf(request.get("traineeId").toString());
            Long batchId = Long.valueOf(request.get("batchId").toString());
            Long trainerId = Long.valueOf(request.get("trainerId").toString());
            
            batchService.removeTraineeFromBatch(traineeId, batchId, trainerId);
            return ResponseEntity.ok(new AuthResponse(true, "Trainee removed from batch successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse(false, "Error removing trainee: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/{batchId}/trainer/{trainerId}")
    public ResponseEntity<AuthResponse> getBatchDetails(@PathVariable Long batchId, @PathVariable Long trainerId) {
        try {
            BatchDto batch = batchService.getBatchDetails(batchId, trainerId);
            return ResponseEntity.ok(new AuthResponse(true, "Batch details retrieved successfully", batch));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse(false, "Error retrieving batch details: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/trainee/{traineeId}/batch")
    public ResponseEntity<AuthResponse> getTraineeBatch(@PathVariable Long traineeId) {
        try {
            Map<String, String> batchInfo = batchService.getTraineeBatchInfo(traineeId);
            return ResponseEntity.ok(new AuthResponse(true, "Trainee batch retrieved successfully", batchInfo));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse(false, "Error retrieving trainee batch: " + e.getMessage(), null));
        }
    }
    
    @PutMapping("/{batchId}/trainer/{trainerId}/name")
    public ResponseEntity<AuthResponse> updateBatchName(@PathVariable Long batchId, @PathVariable Long trainerId, @RequestBody Map<String, Object> request) {
        try {
            String newName = request.get("name").toString();
            batchService.updateBatchName(batchId, trainerId, newName);
            return ResponseEntity.ok(new AuthResponse(true, "Batch name updated successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse(false, "Error updating batch name: " + e.getMessage(), null));
        }
    }
}