package com.trainer.app.repository;

import com.trainer.app.model.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BatchRepository extends JpaRepository<Batch, Long> {
    
    @Query("SELECT b FROM Batch b WHERE b.trainerEmpId = ?1")
    List<Batch> findByTrainerEmpId(String trainerEmpId);
    
    @Query("SELECT b FROM Batch b WHERE b.name = ?1")
    Batch findByName(String name);
}