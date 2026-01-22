package com.trainer.app.repository;

import com.trainer.app.model.CourseEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long> {
    
    List<CourseEnrollment> findByCourseId(Long courseId);
    
    List<CourseEnrollment> findByTraineeEmpId(String traineeEmpId);
    
    Optional<CourseEnrollment> findByCourseIdAndTraineeEmpId(Long courseId, String traineeEmpId);
    
    @Query("SELECT COUNT(e) FROM CourseEnrollment e WHERE e.courseId = :courseId")
    Long countEnrollmentsByCourseId(@Param("courseId") Long courseId);
    
    @Query("SELECT COUNT(e) FROM CourseEnrollment e WHERE e.courseId = :courseId AND e.status = :status")
    Long countEnrollmentsByCourseIdAndStatus(@Param("courseId") Long courseId, @Param("status") String status);
}