package com.trainer.app.repository;

import com.trainer.app.model.BatchTrainee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BatchTraineeRepository extends JpaRepository<BatchTrainee, Long> {
    
    List<BatchTrainee> findByBatchId(Long batchId);
    
    List<BatchTrainee> findByTraineeId(Long traineeId);
    
    @Query("SELECT bt FROM BatchTrainee bt WHERE bt.batch.trainerId = :trainerId")
    List<BatchTrainee> findByTrainerId(@Param("trainerId") Long trainerId);
    
    Optional<BatchTrainee> findByBatchIdAndTraineeId(Long batchId, Long traineeId);
    
    void deleteByBatchIdAndTraineeId(Long batchId, Long traineeId);
    
    void deleteByBatchId(Long batchId);
}