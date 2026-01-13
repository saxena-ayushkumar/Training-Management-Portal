package com.trainer.app.dto;

import java.time.LocalDateTime;
import java.util.List;

public class BatchDto {
    private Long id;
    private String name;
    private Long trainerId;
    private LocalDateTime createdAt;
    private List<TraineeDto> trainees;
    private int traineeCount;

    public BatchDto() {}

    public BatchDto(Long id, String name, Long trainerId, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.trainerId = trainerId;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getTrainerId() { return trainerId; }
    public void setTrainerId(Long trainerId) { this.trainerId = trainerId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<TraineeDto> getTrainees() { return trainees; }
    public void setTrainees(List<TraineeDto> trainees) { this.trainees = trainees; }

    public int getTraineeCount() { return traineeCount; }
    public void setTraineeCount(int traineeCount) { this.traineeCount = traineeCount; }
}