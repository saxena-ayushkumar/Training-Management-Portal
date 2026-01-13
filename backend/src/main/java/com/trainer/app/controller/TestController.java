package com.trainer.app.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:3000")
public class TestController {
    
    @GetMapping("/hello")
    public String hello() {
        return "Backend is working!";
    }
    
    @GetMapping("/status")
    public Object status() {
        return new Object() {
            public final String status = "Backend running";
            public final String timestamp = java.time.LocalDateTime.now().toString();
            public final int port = 8080;
        };
    }
}