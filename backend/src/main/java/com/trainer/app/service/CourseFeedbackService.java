package com.trainer.app.service;

import com.trainer.app.model.CourseFeedback;
import com.trainer.app.repository.CourseFeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseFeedbackService {
    
    @Autowired
    private CourseFeedbackRepository feedbackRepository;
    
    public CourseFeedback saveFeedback(CourseFeedback feedback) {
        // Check if feedback already exists for this trainee and course
        Optional<CourseFeedback> existing = feedbackRepository.findByCourseIdAndTraineeEmpId(
            feedback.getCourseId(), feedback.getTraineeEmpId());
        
        if (existing.isPresent()) {
            // Update existing feedback
            CourseFeedback existingFeedback = existing.get();
            existingFeedback.setRating(feedback.getRating());
            existingFeedback.setKeyLearnings(feedback.getKeyLearnings());
            existingFeedback.setFeedback(feedback.getFeedback());
            return feedbackRepository.save(existingFeedback);
        } else {
            // Create new feedback
            return feedbackRepository.save(feedback);
        }
    }
    
    public List<CourseFeedback> getFeedbackByCourse(Long courseId) {
        return feedbackRepository.findByCourseId(courseId);
    }
    
    public List<CourseFeedback> getFeedbackByTrainee(String traineeEmpId) {
        return feedbackRepository.findByTraineeEmpId(traineeEmpId);
    }
    
    public Optional<CourseFeedback> getFeedback(Long courseId, String traineeEmpId) {
        return feedbackRepository.findByCourseIdAndTraineeEmpId(courseId, traineeEmpId);
    }
    
    public Double getAverageRating(Long courseId) {
        return feedbackRepository.getAverageRatingByCourseId(courseId);
    }
    
    public Long getFeedbackCount(Long courseId) {
        return feedbackRepository.countFeedbackByCourseId(courseId);
    }
}