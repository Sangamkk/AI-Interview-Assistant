package com.ai.interviewassistant.service;

import com.ai.interviewassistant.dto.InterviewRequest;
import com.ai.interviewassistant.dto.InterviewResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.ai.interviewassistant.dto.AnswerResponse;
import com.ai.interviewassistant.dto.AnswerRequest;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final AIService aiService;

    public InterviewResponse startInterview(InterviewRequest request) {

        String question = aiService.generateQuestion(
                request.getTopic(),
                request.getDifficulty());

        return new InterviewResponse(question);
    }

    public AnswerResponse evaluateAnswer(AnswerRequest request) {

        Map<String, Object> result = aiService.evaluateAnswer( request.getQuestion(), request.getAnswer());
        String feedback = (String) result.get("feedback");
        return new AnswerResponse(feedback);
    }

    public InterviewResponse nextQuestion(InterviewRequest request) {

        String question = aiService.generateQuestion(
                request.getTopic(),
                request.getDifficulty());

        return new InterviewResponse(question);
    }

}