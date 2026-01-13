package com.trainer.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "batch_trainees")
public class BatchTrainee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = false)
    private Batch batch;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainee_id", nullable = false)
    private User trainee;
    
    @Column(name = "assigned_at", nullable = false)
    private LocalDateTime assignedAt;
    
    // Constructors
    public BatchTrainee() {
        this.assignedAt = LocalDateTime.now();
    }
    
    public BatchTrainee(Batch batch, User trainee) {
        this.batch = batch;
        this.trainee = trainee;
        this.assignedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Batch getBatch() { return batch; }
    public void setBatch(Batch batch) { this.batch = batch; }
    
    public User getTrainee() { return trainee; }
    public void setTrainee(User trainee) { this.trainee = trainee; }
    
    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }
}