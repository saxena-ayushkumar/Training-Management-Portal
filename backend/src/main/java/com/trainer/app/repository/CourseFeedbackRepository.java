package com.trainer.app.repository;

import com.trainer.app.model.CourseFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseFeedbackRepository extends JpaRepository<CourseFeedback, Long> {
    
    List<CourseFeedback> findByCourseId(Long courseId);
    
    List<CourseFeedback> findByTraineeEmpId(String traineeEmpId);
    
    Optional<CourseFeedback> findByCourseIdAndTraineeEmpId(Long courseId, String traineeEmpId);
    
    @Query("SELECT AVG(f.rating) FROM CourseFeedback f WHERE f.courseId = :courseId")
    Double getAverageRatingByCourseId(@Param("courseId") Long courseId);
    
    @Query("SELECT COUNT(f) FROM CourseFeedback f WHERE f.courseId = :courseId")
    Long countFeedbackByCourseId(@Param("courseId") Long courseId);
}