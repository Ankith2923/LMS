package com.example.demo.service;

import com.example.demo.entity.Course;
import com.example.demo.entity.Enrollment;
import com.example.demo.entity.User;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @PostConstruct
    public void init() {
        if (courseRepository.count() == 0) {
            courseRepository.save(Course.builder().title("Advanced React Patterns").description("Learn advanced React").instructorName("Sarah Drasner").build());
            courseRepository.save(Course.builder().title("Spring Boot Microservices").description("Master Spring Boot").instructorName("Josh Long").build());
            courseRepository.save(Course.builder().title("UI/UX for Developers").description("Design for devs").instructorName("Gary Simon").build());
        }
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public void enrollUserInCourse(String email, String courseId) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));
        
        boolean alreadyEnrolled = user.getEnrollments().stream()
                .anyMatch(e -> e.getCourseId().equals(courseId));
                
        if (!alreadyEnrolled) {
            user.getEnrollments().add(new Enrollment(courseId, 0)); // Start at 0% progress
            userRepository.save(user);
        }
    }

    public List<Course> getMyCourses(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        List<String> enrolledCourseIds = user.getEnrollments().stream()
                .map(Enrollment::getCourseId)
                .collect(Collectors.toList());
                
        return (List<Course>) courseRepository.findAllById(enrolledCourseIds);
    }
}
