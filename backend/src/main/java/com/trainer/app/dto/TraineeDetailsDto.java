package com.trainer.app.dto;

public class TraineeDetailsDto {
    private Long id;
    private String name;
    private String email;
    private String empId;
    private String batchName;
    private String status;
    private int attendance = 85; // Default values for demo
    private int participation = 90;
    private int enrolledCourses = 2;
    private String courseCompletion = "1/2";
    
    public TraineeDetailsDto() {}
    
    public TraineeDetailsDto(Long id, String name, String email, String empId, String batchName, String status) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.empId = empId;
        this.batchName = batchName;
        this.status = status;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getEmpId() { return empId; }
    public void setEmpId(String empId) { this.empId = empId; }
    
    public String getBatchName() { return batchName; }
    public void setBatchName(String batchName) { this.batchName = batchName; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public int getAttendance() { return attendance; }
    public void setAttendance(int attendance) { this.attendance = attendance; }
    
    public int getParticipation() { return participation; }
    public void setParticipation(int participation) { this.participation = participation; }
    
    public int getEnrolledCourses() { return enrolledCourses; }
    public void setEnrolledCourses(int enrolledCourses) { this.enrolledCourses = enrolledCourses; }
    
    public String getCourseCompletion() { return courseCompletion; }
    public void setCourseCompletion(String courseCompletion) { this.courseCompletion = courseCompletion; }
}