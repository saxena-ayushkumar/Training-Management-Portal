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
    
    @Query("SELECT u FROM User u WHERE u.role = 'trainer' AND u.empId = ?1")
    Optional<User> findTrainerByEmpId(String empId);
}