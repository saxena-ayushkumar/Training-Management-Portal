package com.trainer.app.repository;

import com.trainer.app.model.CourseCertificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseCertificateRepository extends JpaRepository<CourseCertificate, Long> {
    
    Optional<CourseCertificate> findByTraineeEmpIdAndCourseId(String traineeEmpId, Long courseId);
    
    List<CourseCertificate> findByCourseIdAndTrainerEmpId(Long courseId, String trainerEmpId);
    
    List<CourseCertificate> findByTrainerEmpId(String trainerEmpId);
    
    boolean existsByTraineeEmpIdAndCourseId(String traineeEmpId, Long courseId);
}