package src;

import java.util.ArrayList;
import java.util.List;

public class FeedbackGenerator {
    
    public List<String> generateFeedback(InterviewEvaluator.EvaluationResult res, String interviewType) {
        List<String> feedback = new ArrayList<>();

        if (res.completionPercentage < 100) {
            feedback.add("Complete all interview questions to prevent score penalties.");
        }

        if (res.technicalScore < 60) {
            feedback.add("Revise fundamental technical concepts and mention core terminology (keywords).");
            if (interviewType.equalsIgnoreCase("Technical")) {
                feedback.add("Revise Java, SQL, and database transaction keywords before your next attempt.");
            }
        } else if (res.technicalScore < 80) {
            feedback.add("Integrate more precise technical keywords to strengthen domain authority.");
        } else {
            feedback.add("Maintain excellent usage of technical terminologies in future screenings.");
        }

        if (res.communicationScore < 70) {
            feedback.add("Write longer, structured answers. Aim for the 30–80 words target range.");
            feedback.add("Improve sentence structures to raise overall readability.");
        } else {
            feedback.add("Good descriptive flow. Keep answers rich with real project examples.");
        }

        if (res.confidenceScore < 65) {
            feedback.add("Practice timed mock exercises. Avoid submitting too quickly (< 15s) or taking excessive time.");
        } else {
            feedback.add("Optimal time management and pacing demonstrated during the session.");
        }

        if (res.facialScore < 70) {
            feedback.add("Keep steady eye contact with the camera and minimize shifting/tilting movements.");
            feedback.add("Smile occasionally to project enthusiasm and confidence.");
        } else {
            feedback.add("Maintained engaging body language and stable posture during recording.");
        }

        return feedback;
    }
}
