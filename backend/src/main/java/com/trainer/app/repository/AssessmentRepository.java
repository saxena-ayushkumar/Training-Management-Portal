package com.trainer.app.repository;

import com.trainer.app.model.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByTrainerEmpId(String trainerEmpId);
    List<Assessment> findByBatchName(String batchName);
    List<Assessment> findByBatchNameAndStatus(String batchName, String status);
}