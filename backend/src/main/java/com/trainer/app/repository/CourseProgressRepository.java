package com.trainer.app.repository;

import com.trainer.app.model.CourseProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseProgressRepository extends JpaRepository<CourseProgress, Long> {
    Optional<CourseProgress> findByCourseIdAndTraineeEmpId(Long courseId, String traineeEmpId);
    List<CourseProgress> findByTraineeEmpId(String traineeEmpId);
    List<CourseProgress> findByCourseId(Long courseId);
}