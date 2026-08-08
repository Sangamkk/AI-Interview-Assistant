package com.ai.interviewassistant.dto;

import lombok.Data;

import java.util.List;

@Data
public class GeminiContent {

    private List<GeminiPart> parts;
}