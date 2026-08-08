package com.ai.interviewassistant.dto;

import lombok.Data;

@Data
public class AnswerRequest {

    private String question;

    private String answer;
}