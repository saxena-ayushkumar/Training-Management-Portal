package com.trainer.app.repository;

import com.trainer.app.model.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByTrainerEmpId(String trainerEmpId);
    List<LeaveRequest> findByTraineeEmpId(String traineeEmpId);
    List<LeaveRequest> findByTrainerEmpIdAndStatus(String trainerEmpId, String status);
}