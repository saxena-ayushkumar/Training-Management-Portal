package com.trainer.app.repository;

import com.trainer.app.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    List<Course> findByTrainerEmpId(String trainerEmpId);
    
    @Query("SELECT c FROM Course c WHERE c.assignedBatch IS NULL OR c.assignedBatch = :batchName")
    List<Course> findAvailableCoursesForBatch(@Param("batchName") String batchName);
    
    @Query("SELECT c FROM Course c WHERE c.status = 'active' AND (c.assignedBatch IS NULL OR c.assignedBatch = :batchName)")
    List<Course> findActiveCoursesForBatch(@Param("batchName") String batchName);
    
    List<Course> findByStatus(String status);
}