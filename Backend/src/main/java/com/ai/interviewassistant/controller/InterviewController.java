package com.ai.interviewassistant.controller;

import com.ai.interviewassistant.dto.InterviewRequest;
import com.ai.interviewassistant.dto.InterviewResponse;
import com.ai.interviewassistant.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interview")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping("/start")
    public ResponseEntity<InterviewResponse> startInterview(@RequestBody InterviewRequest request) {
        return ResponseEntity.ok(
                interviewService.startInterview(request)
        );
    }
}