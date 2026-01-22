package com.trainer.app.repository;

import com.trainer.app.model.AssessmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentSubmissionRepository extends JpaRepository<AssessmentSubmission, Long> {
    List<AssessmentSubmission> findByAssessmentId(Long assessmentId);
    Optional<AssessmentSubmission> findByAssessmentIdAndTraineeEmpId(Long assessmentId, String traineeEmpId);
    List<AssessmentSubmission> findByTraineeEmpId(String traineeEmpId);
}