package com.ai.interviewassistant.repository;

import com.ai.interviewassistant.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}