package src;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class RecommendationEngine {

    public List<Recommendation> generateRecommendations(double cgpa, int projectsCount, int certsCount,
                                                        int codingQuestionsCount, String javaSkillLevel,
                                                        double resumeScore, double interviewScore) {
        List<Recommendation> recommendations = new ArrayList<>();
        int recId = 1;

        // Rule 1: Academics Audit
        if (cgpa < 7.5) {
            recommendations.add(new Recommendation(
                "rec_" + (recId++),
                "Improve academic CGPA. Focus on target exam concepts to maintain a minimum threshold of 7.5 for corporate placement eligibility.",
                "High",
                "Pending",
                "Academics"
            ));
        }

        // Rule 2: Projects Audit
        if (projectsCount < 2) {
            recommendations.add(new Recommendation(
                "rec_" + (recId++),
                "Build at least two core software projects. Add another Java backend or full-stack project to demonstrate application engineering.",
                "High",
                "Pending",
                "Projects"
            ));
        }

        // Rule 3: Certifications Audit
        if (certsCount == 0) {
            recommendations.add(new Recommendation(
                "rec_" + (recId++),
                "Earn a professional cloud or technology certification (e.g. AWS, Oracle Java, GCP) to validate your profile credentials.",
                "Medium",
                "Pending",
                "Certifications"
            ));
        }

        // Rule 4: Coding Questions Audit
        if (codingQuestionsCount < 100) {
            recommendations.add(new Recommendation(
                "rec_" + (recId++),
                "Boost metrics on your daily Coding Practice Tracker. Target solving 50-100 additional DSA questions across key topics (Arrays, Trees, Hashing).",
                "High",
                "Pending",
                "Coding"
            ));
        }

        // Rule 5: Skills Java Fundamentals
        if ("Beginner".equalsIgnoreCase(javaSkillLevel) || javaSkillLevel == null || javaSkillLevel.isEmpty()) {
            recommendations.add(new Recommendation(
                "rec_" + (recId++),
                "Complete Java Fundamentals. Elevate your backend skills tracker parameters from Beginner to Intermediate.",
                "Medium",
                "Pending",
                "Skills"
            ));
        }

        // Rule 6: Resume Score Audit
        if (resumeScore < 70) {
            recommendations.add(new Recommendation(
                "rec_" + (recId++),
                "Optimize your resume profile score. Enhance your resume summary section and align keywords using the Resume Analyzer dashboard.",
                "Medium",
                "Pending",
                "Resume"
            ));
        }

        // Rule 7: Mock Interview Audit
        if (interviewScore < 60) {
            recommendations.add(new Recommendation(
                "rec_" + (recId++),
                "Improve your Mock Interview parameters. Practice answering industry-level questions, tracking your eye contact and posture stability.",
                "High",
                "Pending",
                "Interviews"
            ));
        }

        // General fallback/portfolio additions if base criteria are met
        if (cgpa >= 7.5 && projectsCount >= 2 && codingQuestionsCount >= 100) {
            recommendations.add(new Recommendation(
                "rec_" + (recId++),
                "Add GitHub repository hyperlinks to your projects listing to demonstrate code validation and public commits history.",
                "Low",
                "In Progress",
                "Portfolio"
            ));
            recommendations.add(new Recommendation(
                "rec_" + (recId++),
                "Host a personal developer portfolio website to showcase project node links, certifications list, and resume access.",
                "Low",
                "Pending",
                "Portfolio"
            ));
        }

        return recommendations;
    }

    public List<Event> recommendEvents(List<Event> allEvents, String careerGoal, List<Map<String, Object>> skills, double careerReadinessScore) {
        List<Event> recommended = new ArrayList<>(allEvents);
        
        // Simple rating scores
        java.util.Map<String, Integer> scores = new java.util.HashMap<>();
        for (Event e : recommended) {
            int score = 0;
            
            // 1. Goal Match (e.g. if careerGoal is "AI Engineer", check if event contains "AI" or "ML")
            if (careerGoal != null) {
                String goalLower = careerGoal.toLowerCase();
                String titleLower = e.getTitle().toLowerCase();
                String descLower = e.getDescription().toLowerCase();
                if (titleLower.contains("ai") || titleLower.contains("ml") || titleLower.contains("machine learning") || titleLower.contains("data science")) {
                    if (goalLower.contains("ai") || goalLower.contains("machine learning") || goalLower.contains("data scientist")) {
                        score += 50;
                    }
                }
                if (titleLower.contains("java") || titleLower.contains("spring") || titleLower.contains("backend")) {
                    if (goalLower.contains("java") || goalLower.contains("backend") || goalLower.contains("full stack")) {
                        score += 50;
                    }
                }
                if (titleLower.contains("web") || titleLower.contains("frontend") || titleLower.contains("design")) {
                    if (goalLower.contains("web") || goalLower.contains("frontend") || goalLower.contains("ui")) {
                        score += 50;
                    }
                }
            }

            // 2. Skill Match
            if (skills != null && e.getRequiredSkills() != null) {
                String reqSkills = e.getRequiredSkills().toLowerCase();
                for (Map<String, Object> s : skills) {
                    String skillName = ((String) s.getOrDefault("name", "")).toLowerCase();
                    if (!skillName.isEmpty() && reqSkills.contains(skillName)) {
                        score += 20;
                    }
                }
            }

            // 3. Difficulty Match based on career readiness
            String difficulty = e.getDifficulty();
            if (careerReadinessScore < 40.0) {
                if ("Beginner".equalsIgnoreCase(difficulty)) score += 30;
            } else if (careerReadinessScore <= 75.0) {
                if ("Intermediate".equalsIgnoreCase(difficulty)) score += 30;
            } else {
                if ("Advanced".equalsIgnoreCase(difficulty)) score += 30;
            }

            scores.put(e.getId(), score);
        }

        // Sort descending by score
        recommended.sort((e1, e2) -> Integer.compare(scores.getOrDefault(e2.getId(), 0), scores.getOrDefault(e1.getId(), 0)));

        // Return top 4
        if (recommended.size() > 4) {
            return recommended.subList(0, 4);
        }
        return recommended;
    }
}
