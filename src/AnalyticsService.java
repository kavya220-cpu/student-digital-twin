package src;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AnalyticsService {

    public Map<String, Object> getStudentAnalytics(int userId) {
        Map<String, Object> analytics = new HashMap<>();

        // 1. Fetch data from DB
        Map<String, Object> profile = DatabaseManager.getStudentProfile(userId);
        List<Map<String, Object>> marks = DatabaseManager.getSemesterSGPA(userId);
        List<Map<String, Object>> skills = DatabaseManager.getSkills(userId);
        List<Map<String, Object>> projects = DatabaseManager.getProjects(userId);
        List<Map<String, Object>> certs = DatabaseManager.getCertifications(userId);
        Map<String, Object> resume = DatabaseManager.getResumes(userId);
        Map<String, Object> interview = DatabaseManager.getInterviewResults(userId);
        Map<String, Object> coding = DatabaseManager.getCodingProgress(userId);

        // 2. Calculations
        // Project Stats
        int completedProjects = 0;
        int ongoingProjects = 0;
        for (Map<String, Object> p : projects) {
            String status = (String) p.get("status");
            if ("Completed".equalsIgnoreCase(status)) {
                completedProjects++;
            } else if ("Ongoing".equalsIgnoreCase(status)) {
                ongoingProjects++;
            }
        }

        // Skills progress percentage (Expert=100%, Intermediate=70%, Beginner=40%)
        double totalSkillScore = 0;
        for (Map<String, Object> s : skills) {
            String level = (String) s.get("level");
            if ("Expert".equalsIgnoreCase(level)) totalSkillScore += 100;
            else if ("Intermediate".equalsIgnoreCase(level)) totalSkillScore += 70;
            else totalSkillScore += 40;
        }
        double skillProgressPercent = skills.isEmpty() ? 0.0 : (totalSkillScore / (skills.size() * 100.0)) * 100.0;

        // Career Readiness calculation (reusing calculator rules)
        double codingProgress = coding.containsKey("total") ? Math.min(((Integer) coding.get("total") / 100.0) * 100.0, 100.0) : 0.0;
        double resumeScore = resume.containsKey("score") ? (Integer) resume.get("score") : 70.0;
        double interviewScore = interview.containsKey("overall") ? (Integer) interview.get("overall") : 65.0;
        double cgpaVal = profile.containsKey("cgpa") ? (Double) profile.get("cgpa") : 0.0;

        CareerReadinessCalculator calculator = new CareerReadinessCalculator();
        CareerReadiness readiness = calculator.calculateReadiness(
            cgpaVal,
            skills.size(),
            projects.size(),
            certs.size(),
            codingProgress,
            resumeScore,
            interviewScore
        );

        // 3. Assemble JSON-friendly Map structure
        analytics.put("cgpaTrend", marks);
        analytics.put("skillsCompletion", Math.round(skillProgressPercent));
        analytics.put("totalSkills", skills.size());
        
        Map<String, Integer> projStats = new HashMap<>();
        projStats.put("total", projects.size());
        projStats.put("completed", completedProjects);
        projStats.put("ongoing", ongoingProjects);
        analytics.put("projectStats", projStats);

        analytics.put("totalCertificates", certs.size());
        analytics.put("resumeScore", resumeScore);
        analytics.put("interviewScore", interviewScore);
        
        analytics.put("readinessScore", readiness.getOverallPercentage());
        analytics.put("readinessLevel", readiness.getLevel());
        analytics.put("readinessBreakdown", readiness.getContributionBreakdown());

        return analytics;
    }
}
