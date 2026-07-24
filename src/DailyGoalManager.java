package src;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DailyGoalManager {

    public List<Map<String, Object>> generateGoalsForStudent(double codingQuestions, double resumeScore, double interviewScore, int certsCount) {
        List<Map<String, Object>> goals = new ArrayList<>();
        int idCount = 101;

        // Rule-based daily tasks generator
        if (codingQuestions < 100) {
            goals.add(createGoalMap(idCount++, "Complete 2 DSA Questions on Arrays/Strings", false));
        }
        if (resumeScore < 80) {
            goals.add(createGoalMap(idCount++, "Refine Resume summary segment & review ATS matching keys", false));
        }
        if (interviewScore < 70) {
            goals.add(createGoalMap(idCount++, "Practice a mock interview round to evaluate gaze stability", false));
        }
        if (certsCount == 0) {
            goals.add(createGoalMap(idCount++, "Review Cloud computing or DB roadmap milestones", false));
        }

        // Add a general placeholder goal if all are met
        if (goals.isEmpty()) {
            goals.add(createGoalMap(idCount++, "Review weekly roadmap targets & contribution levels", false));
        }

        return goals;
    }

    public double calculateCompletionProgress(List<Map<String, Object>> goals) {
        if (goals == null || goals.isEmpty()) return 0.0;
        int completed = 0;
        for (Map<String, Object> g : goals) {
            if (Boolean.TRUE.equals(g.get("completed"))) {
                completed++;
            }
        }
        return Math.round(((double) completed / goals.size()) * 100.0);
    }

    public int updateStreak(int currentStreak, double completionRate) {
        // If completed all daily goals today (completionRate = 100), increment streak
        if (completionRate >= 100.0) {
            return currentStreak + 1;
        }
        return currentStreak;
    }

    private Map<String, Object> createGoalMap(int id, String text, boolean comp) {
        Map<String, Object> g = new HashMap<>();
        g.put("id", id);
        g.put("text", text);
        g.put("completed", comp);
        return g;
    }
}
