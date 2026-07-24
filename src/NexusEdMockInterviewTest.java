package src;

import java.util.List;

public class NexusEdMockInterviewTest {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("NEXUSED - MOCK INTERVIEW ENGINE VERIFICATION");
        System.out.println("==================================================");

        // 1. Initialize engine for Technical Interview
        InterviewEngine session = new InterviewEngine("Technical");
        System.out.println("[x] Started session for type: " + session.getInterviewType());
        System.out.println("[x] Loaded questions count: " + session.getQuestions().size());

        // 2. Simulate answering questions
        List<Question> questions = session.getQuestions();
        
        // Question 1: Java abstract class vs interface (Requires: abstract class, concrete, state, extends, implements, interface)
        // High quality answer: length > 30 words, 5 matches, paced in 45 seconds (optimal)
        String ans1 = "An abstract class can declare state variables and concrete methods with default implementations. A class extends it. An interface is a contract that a class implements, containing abstract specifications. Both achieve polymorphism.";
        session.submitAnswer(questions.get(0).id, ans1, 45);
        
        // Question 2: GIL in Python (Requires: GIL, thread, mutex, execution, memory, parallel, CPython)
        // Average answer: length > 30 words, 3 matches, hesitant in 180 seconds (suboptimal)
        String ans2 = "The GIL is a global interpreter lock in Python. It acts as a thread mutex that blocks concurrent execution of bytecode in CPython. This makes memory management simple but limits parallel processing.";
        session.submitAnswer(questions.get(1).id, ans2, 180);

        // Question 3: ACID properties in DBMS (Requires: Atomicity, Consistency, Isolation, Durability)
        // Poor/short answer: length < 30 words, 4 matches, rushed in 8 seconds (suboptimal)
        String ans3 = "ACID properties are Atomicity, Consistency, Isolation, and Durability.";
        session.submitAnswer(questions.get(2).id, ans3, 8);

        // Leave remaining questions unanswered to test Completion penalty (Rule 3)
        System.out.println("[x] Answered " + session.getStudentAnswers().size() + " out of " + questions.size() + " questions.");

        // 3. Evaluate Session
        InterviewEvaluator evaluator = new InterviewEvaluator();
        evaluator.setFacialMetrics(88.0, 82.0, 70.0); // Eye contact, Posture stability, Smile frequency
        InterviewEvaluator.EvaluationResult result = evaluator.evaluate(session);

        System.out.println("\n--- Evaluation Scorecard ---");
        System.out.println("Completion Rate: " + String.format("%.1f", result.completionPercentage) + "%");
        System.out.println("Technical Score: " + String.format("%.1f", result.technicalScore) + "/100");
        System.out.println("Communication Score: " + String.format("%.1f", result.communicationScore) + "/100");
        System.out.println("Confidence Score: " + String.format("%.1f", result.confidenceScore) + "/100");
        System.out.println("Facial Expression Score: " + String.format("%.1f", result.facialScore) + "/100");
        System.out.println("  (Eye Contact: " + result.eyeContactPercent + "%, Posture: " + result.focusStabilityPercent + "%, Smile: " + result.smileFrequencyPercent + "%)");
        System.out.println("Overall Session Score: " + String.format("%.1f", result.overallScore) + "/100");
        System.out.println("Star Rating: " + result.starRating + " Stars (" + result.ratingText + ")");

        System.out.println("\n--- Strengths Identified ---");
        for (String st : result.strengths) {
            System.out.println("  ✔ " + st);
        }

        System.out.println("\n--- Weaknesses/Gaps ---");
        for (String wk : result.weaknesses) {
            System.out.println("  ✘ " + wk);
        }

        // 4. Generate Feedback Suggestions
        FeedbackGenerator feedbackGenerator = new FeedbackGenerator();
        List<String> feedback = feedbackGenerator.generateFeedback(result, session.getInterviewType());

        System.out.println("\n--- Improvement Action Items ---");
        for (String fb : feedback) {
            System.out.println("  ➔ " + fb);
        }

        System.out.println("==================================================");
        System.out.println("MOCK INTERVIEW JAVA COMPONENT CHECKS COMPLETED");
        System.out.println("==================================================");
    }
}
