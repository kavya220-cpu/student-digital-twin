package src;

import java.util.List;

public class NexusEdFinalModuleTest {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("NEXUSED - FINAL MODULES BACKEND LOGIC VERIFICATION");
        System.out.println("==================================================");

        // 1. Test Coding Tracker
        System.out.println("[*] Testing Coding Practice Tracker...");
        CodingTracker tracker = new CodingTracker();
        tracker.addQuestion(new CodingQuestion("q1", "Two Sum", "Arrays", "Easy", "Completed with hashmap", "2026-07-24", "public int[] twoSum(int[] nums, int target) { ... }"));
        tracker.addQuestion(new CodingQuestion("q2", "Reverse List", "Linked Lists", "Medium", "In place reversal", "2026-07-24", "public ListNode reverseList(ListNode head) { ... }"));
        tracker.addQuestion(new CodingQuestion("q3", "Merge K Sorted", "Heaps", "Hard", "Divide and conquer", "2026-07-24", "public ListNode mergeKLists(ListNode[] lists) { ... }"));
        tracker.addQuestion(new CodingQuestion("q4", "Valid Parentheses", "Stacks", "Easy", "Using stack data structure", "2026-07-24", "public boolean isValid(String s) { ... }"));
        tracker.addQuestion(new CodingQuestion("q5", "Group Anagrams", "Arrays", "Medium", "Hashing sorted keys", "2026-07-24", "public List<List<String>> groupAnagrams(String[] strs) { ... }"));

        System.out.println("  Total Solved: " + tracker.getTotalSolved());
        System.out.println("  Easy Count: " + tracker.getCountEasy() + " (Expected: 2)");
        System.out.println("  Medium Count: " + tracker.getCountMedium() + " (Expected: 2)");
        System.out.println("  Hard Count: " + tracker.getCountHard() + " (Expected: 1)");
        System.out.println("  Favorite Topic: " + tracker.getFavoriteTopic() + " (Expected: Arrays)");
        System.out.println("  Coding Progress: " + tracker.calculateCodingProgress() + "% (Expected: 5.0%)");
        System.out.println();

        // 2. Test Career Readiness Calculator
        System.out.println("[*] Testing Career Readiness Calculator...");
        CareerReadinessCalculator calculator = new CareerReadinessCalculator();
        
        // Student Profile 1: Foundation Stage (cgpa=6.0, skills=2, projects=0, certs=0, coding=10.0, resume=50.0, interview=45.0)
        CareerReadiness readiness1 = calculator.calculateReadiness(6.0, 2, 0, 0, 10.0, 50.0, 45.0);
        System.out.println("  Profile 1 (Foundation Stage) Overall Score: " + readiness1.getOverallPercentage() + "%");
        System.out.println("  Profile 1 Level: " + readiness1.getLevel());
        System.out.println("  Profile 1 Suggestions count: " + readiness1.getSuggestions().size());

        // Student Profile 2: Industry Ready (cgpa=9.2, skills=10, projects=3, certs=2, coding=85.0, resume=90.0, interview=88.0)
        CareerReadiness readiness2 = calculator.calculateReadiness(9.2, 10, 3, 2, 85.0, 90.0, 88.0);
        System.out.println("  Profile 2 (Industry Ready) Overall Score: " + readiness2.getOverallPercentage() + "%");
        System.out.println("  Profile 2 Level: " + readiness2.getLevel());
        System.out.println("  Profile 2 Suggestions: " + String.join(", ", readiness2.getSuggestions()));
        System.out.println();

        // 3. Test Recommendation Engine
        System.out.println("[*] Testing Recommendation Engine...");
        RecommendationEngine engine = new RecommendationEngine();
        
        // Pass a student profile with low parameters
        List<Recommendation> recs = engine.generateRecommendations(7.2, 1, 0, 45, "Beginner", 65.0, 55.0);
        System.out.println("  Generated recommendations count: " + recs.size());
        for (Recommendation r : recs) {
            System.out.println("    - [" + r.getPriority() + " Priority] [" + r.getCategory() + "] " + r.getText() + " (Status: " + r.getStatus() + ")");
        }
        
        System.out.println("==================================================");
        System.out.println("ALL JAVA LOGIC CHECKS EXECUTED SUCCESSFULLY");
        System.out.println("==================================================");
    }
}
