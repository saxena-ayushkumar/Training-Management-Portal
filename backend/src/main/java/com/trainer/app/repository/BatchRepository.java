package com.trainer.app.repository;

import com.trainer.app.model.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BatchRepository extends JpaRepository<Batch, Long> {
    
    List<Batch> findByTrainerId(Long trainerId);
    
    @Query("SELECT b FROM Batch b WHERE b.trainerId = :trainerId AND b.name = :name")
    Batch findByTrainerIdAndName(@Param("trainerId") Long trainerId, @Param("name") String name);
    
    boolean existsByTrainerIdAndName(Long trainerId, String name);
}