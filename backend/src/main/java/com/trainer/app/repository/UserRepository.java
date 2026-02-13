package com.trainer.app.repository;

import com.trainer.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmpId(String empId);
    boolean existsByEmail(String email);
    boolean existsByEmpId(String empId);
    
    @Query("SELECT u FROM User u WHERE u.role = 'trainee' AND u.status = 'pending'")
    List<User> findPendingTrainees();
    
    @Query("SELECT u FROM User u WHERE u.role = 'trainee' AND u.status = 'pending' AND u.trainerEmpId = ?1")
    List<User> findPendingTraineesByTrainer(String trainerEmpId);
    
    @Query("SELECT u FROM User u WHERE u.role = 'trainee' AND u.status = 'approved' AND u.trainerEmpId = ?1")
    List<User> findApprovedTraineesByTrainer(String trainerEmpId);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.batchName = ?1 AND u.status = ?2 AND u.trainerEmpId = ?3")
    int countByBatchNameAndStatusAndTrainer(String batchName, String status, String trainerEmpId);
    
    @Query("SELECT u FROM User u WHERE u.batchName = ?1 AND u.status = ?2 AND u.trainerEmpId = ?3")
    List<User> findByBatchNameAndStatusAndTrainer(String batchName, String status, String trainerEmpId);
    
    @Query("SELECT u FROM User u WHERE u.role = 'trainer' AND u.empId = ?1")
    Optional<User> findTrainerByEmpId(String empId);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.batchName = ?1 AND u.role = ?2 AND u.status = ?3")
    int countByBatchNameAndRoleAndStatus(String batchName, String role, String status);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.batchName = ?1 AND u.role = ?2 AND u.status = ?3 AND u.trainerEmpId = ?4")
    int countByBatchNameAndRoleAndStatusAndTrainer(String batchName, String role, String status, String trainerEmpId);
}