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

    private final OpenAIService openAIService;

    public InterviewResponse startInterview(InterviewRequest request) {

        String question = openAIService.generateQuestion(
        request.getTopic(),
        request.getDifficulty()
);

        return new InterviewResponse(question);
    }

}