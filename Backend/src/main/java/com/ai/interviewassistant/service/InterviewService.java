package com.ai.interviewassistant.service;

import com.ai.interviewassistant.dto.InterviewRequest;
import com.ai.interviewassistant.dto.InterviewResponse;
import com.ai.interviewassistant.entity.Interview;
import com.ai.interviewassistant.repository.InterviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;

    public InterviewResponse startInterview(InterviewRequest request) {

        Interview interview = new Interview();

        interview.setTopic(request.getTopic());
        interview.setDifficulty(request.getDifficulty());
        interview.setCompleted(false);
        interview.setScore(0);

        interviewRepository.save(interview);

        String question = switch (request.getTopic().toLowerCase()) {

            case "java" ->
                    "Explain the difference between JDK, JRE, and JVM.";

            case "spring boot" ->
                    "What is Dependency Injection in Spring Boot?";

            case "sql" ->
                    "What is the difference between INNER JOIN and LEFT JOIN?";

            default ->
                    "Tell me about yourself.";
        };

        return new InterviewResponse(question);
    }

}