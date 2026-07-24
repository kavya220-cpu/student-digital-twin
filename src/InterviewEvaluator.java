package src;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class InterviewEvaluator {
    
    public static class EvaluationResult {
        public double overallScore;
        public double technicalScore;
        public double communicationScore;
        public double confidenceScore;
        public double facialScore;
        
        // Expression subsets
        public double eyeContactPercent;
        public double focusStabilityPercent;
        public double smileFrequencyPercent;

        public double completionPercentage;
        public List<String> strengths = new ArrayList<>();
        public List<String> weaknesses = new ArrayList<>();
        public int starRating; // 1 to 5 stars
        public String ratingText; // "Excellent", "Good", "Average", "Fair", "Poor"
    }

    // Additional fields mapped to capture facial parameters passed from frontend session
    private double sessionEyeContact = 85.0; 
    private double sessionStability = 80.0;
    private double sessionSmile = 65.0;

    public void setFacialMetrics(double eyeContact, double stability, double smile) {
        this.sessionEyeContact = eyeContact;
        this.sessionStability = stability;
        this.sessionSmile = smile;
    }

    public EvaluationResult evaluate(InterviewEngine session) {
        EvaluationResult res = new EvaluationResult();
        List<Question> questions = session.getQuestions();
        Map<String, String> answers = session.getStudentAnswers();
        Map<String, Integer> times = session.getTimeSpentPerQuestion();

        int totalQuestions = questions.size();
        int answeredCount = 0;
        
        double totalTechPoints = 0;
        double totalCommPoints = 0;
        double totalConfPoints = 0;

        for (Question q : questions) {
            String answer = answers.getOrDefault(q.id, "").trim();
            int timeSpent = times.getOrDefault(q.id, 0);

            if (answer.isEmpty()) {
                // Rule 3: Incomplete answers do not accumulate points
                continue;
            }
            answeredCount++;

            // Word Count splits
            String[] words = answer.split("\\s+");
            int wordCount = words.length;

            // Sentence splits
            String[] sentences = answer.split("[.!?]+");
            int sentenceCount = Math.max(sentences.length, 1);
            double avgSentenceLength = (double) wordCount / sentenceCount;

            // Rule 1: Word Count Evaluation
            double wordLengthScore = 0;
            if (wordCount < 30) {
                wordLengthScore = 40;
            } else if (wordCount <= 80) {
                wordLengthScore = 75;
            } else {
                wordLengthScore = 100;
            }

            // Rule 2: Keyword Matching
            // Expect keywords separated by comma in q.answerText
            String[] keywords = q.answerText.split(",\\s*");
            int matchCount = 0;
            String answerLower = answer.toLowerCase();
            for (String kw : keywords) {
                if (answerLower.contains(kw.toLowerCase().trim())) {
                    matchCount++;
                }
            }
            double keywordScore = keywords.length > 0 ? ((double) matchCount / keywords.length) * 100 : 100;

            // Rule 5: Readability checks
            double readabilityScore = 100;
            if (avgSentenceLength > 25) {
                readabilityScore -= 20; // overly wordy sentences
            } else if (avgSentenceLength < 5) {
                readabilityScore -= 15; // choppy/broken sentences
            }

            // Rule 4: Pacing/Confidence Evaluator
            int targetSeconds = q.estTimeMinutes * 60;
            double timeScore = 100;
            if (timeSpent < 15) {
                timeScore = 30; // rushed answer indicates lack of depth/confidence
            } else if (timeSpent > targetSeconds * 1.5) {
                timeScore = 60; // hesitant delivery
            } else {
                timeScore = 95; // solid pacing
            }

            // Calculations weights
            double qTechScore = (keywordScore * 0.7) + (readabilityScore * 0.3);
            double qCommScore = (wordLengthScore * 0.6) + (readabilityScore * 0.4);
            double qConfScore = (timeScore * 0.7) + (wordLengthScore * 0.3);

            totalTechPoints += qTechScore;
            totalCommPoints += qCommScore;
            totalConfPoints += qConfScore;
        }

        // Rule 3: Completion metrics
        res.completionPercentage = totalQuestions > 0 ? ((double) answeredCount / totalQuestions) * 100 : 0;

        if (answeredCount > 0) {
            res.technicalScore = totalTechPoints / answeredCount;
            res.communicationScore = totalCommPoints / answeredCount;
            res.confidenceScore = totalConfPoints / answeredCount;
        } else {
            res.technicalScore = 0;
            res.communicationScore = 0;
            res.confidenceScore = 0;
        }

        // Facial Score math
        res.eyeContactPercent = sessionEyeContact;
        res.focusStabilityPercent = sessionStability;
        res.smileFrequencyPercent = sessionSmile;
        res.facialScore = (sessionEyeContact * 0.4) + (sessionStability * 0.4) + (sessionSmile * 0.2);

        // Overall Score incorporating Facial Metrics: Tech(35%), Comm(25%), Conf(20%), Facial(20%)
        double completionFactor = res.completionPercentage / 100.0;
        res.overallScore = ((res.technicalScore * 0.35) + 
                            (res.communicationScore * 0.25) + 
                            (res.confidenceScore * 0.20) + 
                            (res.facialScore * 0.20)) * completionFactor;

        // Feedback logs
        if (res.technicalScore >= 80) {
            res.strengths.add("Strong technical vocabulary with relevant subject keywords.");
        } else {
            res.weaknesses.add("Technical answers lack critical domain terminology.");
        }

        if (res.communicationScore >= 75) {
            res.strengths.add("Well-structured sentence phrasing with sufficient content depth.");
        } else {
            res.weaknesses.add("Answers are either too brief or have poor structural flow.");
        }

        if (res.confidenceScore >= 75) {
            res.strengths.add("Paced answer delivery within optimal time limits.");
        } else {
            res.weaknesses.add("Unbalanced timing - either rushed submission or hesitant pacing.");
        }

        // Expression feedback
        if (res.facialScore >= 75) {
            res.strengths.add("Engaging body language with solid eye contact and steady focus.");
        } else {
            res.weaknesses.add("Fluctuating eye contact or posture movements noted.");
        }

        if (res.completionPercentage < 100) {
            res.weaknesses.add("Incomplete interview. Some questions were left blank.");
        } else {
            res.strengths.add("Completed all interview question nodes successfully.");
        }

        // Star rating
        if (res.overallScore >= 85) {
            res.starRating = 5;
            res.ratingText = "Excellent";
        } else if (res.overallScore >= 70) {
            res.starRating = 4;
            res.ratingText = "Good";
        } else if (res.overallScore >= 50) {
            res.starRating = 3;
            res.ratingText = "Average";
        } else if (res.overallScore >= 30) {
            res.starRating = 2;
            res.ratingText = "Fair";
        } else {
            res.starRating = 1;
            res.ratingText = "Poor";
        }

        return res;
    }
}
