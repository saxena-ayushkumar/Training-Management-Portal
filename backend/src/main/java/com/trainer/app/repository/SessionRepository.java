package com.trainer.app.repository;

import com.trainer.app.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByTrainerEmpId(String trainerEmpId);
    List<Session> findByBatchName(String batchName);
    List<Session> findByBatchNameAndStatus(String batchName, String status);
    List<Session> findByTrainerEmpIdOrderBySessionDateAsc(String trainerEmpId);
}