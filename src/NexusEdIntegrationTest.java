package src;

import java.util.List;
import java.util.Map;

public class NexusEdIntegrationTest {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("NEXUSED - BACKEND SERVICES & DB INTEGRATION TEST ");
        System.out.println("==================================================");

        // Enable fallback mock mode to allow standalone test execution without active MySQL instance
        DatabaseManager.setFallbackActive(true);

        // 1. Database Manager fetch validation
        System.out.println("[*] Validating DatabaseManager fetches (Fallback Mock Mode)...");
        Map<String, Object> profile = DatabaseManager.getStudentProfile(1);
        System.out.println("  Student Name: " + profile.get("name"));
        System.out.println("  Student Selected Career: " + profile.get("selected_career"));
        System.out.println("  Student CGPA: " + profile.get("cgpa"));

        List<Map<String, Object>> skills = DatabaseManager.getSkills(1);
        System.out.println("  Skills count fetched: " + skills.size());

        List<Map<String, Object>> marks = DatabaseManager.getSemesterSGPA(1);
        System.out.println("  Semester SGPA count fetched: " + marks.size());

        // 2. Goal Manager calculations validation
        System.out.println("\n[*] Validating DailyGoalManager Calculations...");
        DailyGoalManager goalManager = new DailyGoalManager();
        
        // Generate goals for student with low coding progress and low resume score
        List<Map<String, Object>> generatedGoals = goalManager.generateGoalsForStudent(45.0, 75.0, 85.0, 1);
        System.out.println("  Generated Daily Goals count: " + generatedGoals.size());
        for (Map<String, Object> g : generatedGoals) {
            System.out.println("    - Goal: " + g.get("text") + " (Completed: " + g.get("completed") + ")");
        }

        // Simulate completing a task and recalculating completion progress
        generatedGoals.get(0).put("completed", true);
        double progress = goalManager.calculateCompletionProgress(generatedGoals);
        System.out.println("  Goal Completion Progress: " + progress + "%");

        // 3. Analytics Service calculations validation
        System.out.println("\n[*] Validating AnalyticsService calculations...");
        AnalyticsService analyticsService = new AnalyticsService();
        Map<String, Object> analytics = analyticsService.getStudentAnalytics(1);
        
        System.out.println("  Skills Completion Progress: " + analytics.get("skillsCompletion") + "%");
        System.out.println("  Overall Career Readiness Index Score: " + analytics.get("readinessScore") + "%");
        System.out.println("  Overall Readiness Level: " + analytics.get("readinessLevel"));
        
        Map<String, Double> breakdown = (Map<String, Double>) analytics.get("readinessBreakdown");
        System.out.println("  Readiness Breakdown contributions:");
        for (Map.Entry<String, Double> entry : breakdown.entrySet()) {
            System.out.println("    - " + entry.getKey() + ": " + entry.getValue() + "%");
        }

        System.out.println("\n==================================================");
        System.out.println("ALL INTEGRATION SERVICES EXECUTED SUCCESSFULLY     ");
        System.out.println("==================================================");
    }
}
