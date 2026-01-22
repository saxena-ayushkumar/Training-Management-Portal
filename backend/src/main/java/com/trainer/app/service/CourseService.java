package com.trainer.app.service;

import com.trainer.app.model.Course;
import com.trainer.app.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;
    
    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }
    
    public Course updateCourse(Long courseId, Course courseDetails) {
        Optional<Course> optionalCourse = courseRepository.findById(courseId);
        if (optionalCourse.isPresent()) {
            Course course = optionalCourse.get();
            course.setTitle(courseDetails.getTitle());
            course.setDescription(courseDetails.getDescription());
            course.setDuration(courseDetails.getDuration());
            course.setStatus(courseDetails.getStatus());
            course.setCourseLink(courseDetails.getCourseLink());
            course.setAssignedBatch(courseDetails.getAssignedBatch());
            return courseRepository.save(course);
        }
        throw new RuntimeException("Course not found with id: " + courseId);
    }
    
    public List<Course> getCoursesByTrainer(String trainerEmpId) {
        return courseRepository.findByTrainerEmpId(trainerEmpId);
    }
    
    public List<Course> getAvailableCoursesForTrainee(String traineeBatch) {
        if (traineeBatch == null || traineeBatch.isEmpty()) {
            // If trainee has no batch, show only courses with no batch restriction
            return courseRepository.findAvailableCoursesForBatch(null);
        }
        return courseRepository.findActiveCoursesForBatch(traineeBatch);
    }
    
    public Optional<Course> getCourseById(Long courseId) {
        return courseRepository.findById(courseId);
    }
    
    public void deleteCourse(Long courseId) {
        courseRepository.deleteById(courseId);
    }
    
    public List<Course> getAllActiveCourses() {
        return courseRepository.findByStatus("active");
    }
}