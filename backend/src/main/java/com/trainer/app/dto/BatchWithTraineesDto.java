package com.trainer.app.dto;

public class BatchWithTraineesDto {
    private Long id;
    private String name;
    private String description;
    private int traineeCount;
    
    public BatchWithTraineesDto() {}
    
    public BatchWithTraineesDto(Long id, String name, String description, int traineeCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.traineeCount = traineeCount;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public int getTraineeCount() { return traineeCount; }
    public void setTraineeCount(int traineeCount) { this.traineeCount = traineeCount; }
}