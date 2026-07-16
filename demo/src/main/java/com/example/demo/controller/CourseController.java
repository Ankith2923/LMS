package com.example.demo.controller;

import com.example.demo.entity.Course;
import com.example.demo.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/my-courses")
    public ResponseEntity<List<Course>> getMyCourses(Authentication authentication) {
        return ResponseEntity.ok(courseService.getMyCourses(authentication.getName()));
    }

    @PostMapping("/{courseId}/enroll")
    public ResponseEntity<Void> enrollInCourse(@PathVariable String courseId, Authentication authentication) {
        courseService.enrollUserInCourse(authentication.getName(), courseId);
        return ResponseEntity.ok().build();
    }
}
