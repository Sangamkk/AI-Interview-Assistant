package com.ai.interviewassistant.dto;

import lombok.Data;

@Data
public class FeedbackResponse {

    private Double overallScore;
    private Double technicalScore;
    private Double communicationScore;
    private Double problemSolvingScore;
    private Double confidenceScore;

    private String strengths;
    private String weaknesses;
    private String suggestions;
    private String overallFeedback;
}