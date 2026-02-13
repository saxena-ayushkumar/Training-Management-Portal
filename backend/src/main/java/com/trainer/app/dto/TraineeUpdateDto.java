package com.trainer.app.dto;

public class TraineeUpdateDto {
    private String name;
    private String email;
    private String phone;
    private String skills;
    private String experience;
    private String address;
    
    public TraineeUpdateDto() {}
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
    
    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}