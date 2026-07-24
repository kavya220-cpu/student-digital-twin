package src;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CareerReadinessCalculator {

    public CareerReadiness calculateReadiness(double cgpa, int skillsCount, int projectsCount, int certsCount,
                                             double codingProgress, double resumeScore, double interviewScore) {
        
        // Compute parameter contribution percentages (0-100 scales)
        double cgpaContrib = (cgpa / 10.0) * 100.0;
        double skillsContrib = Math.min((skillsCount / 8.0) * 100.0, 100.0);
        double projectsContrib = Math.min((projectsCount / 3.0) * 100.0, 100.0);
        double certsContrib = Math.min((certsCount / 2.0) * 100.0, 100.0);
        
        // Weighted contributions
        // Weights: CGPA (15%), Skills (15%), Projects (15%), Certificates (10%), Coding (15%), Resume (15%), Interview (15%)
        double overallPercentage = (cgpaContrib * 0.15) +
                                   (skillsContrib * 0.15) +
                                   (projectsContrib * 0.15) +
                                   (certsContrib * 0.10) +
                                   (codingProgress * 0.15) +
                                   (resumeScore * 0.15) +
                                   (interviewScore * 0.15);

        overallPercentage = Math.max(0.0, Math.min(overallPercentage, 100.0));

        // Determine Level, Description, and Suggestions
        String level;
        String description;
        List<String> suggestions = new ArrayList<>();

        if (overallPercentage <= 40) {
            level = "Foundation Stage";
            description = "The student is beginning their learning journey and needs to strengthen fundamental skills.";
            suggestions.add("Improve academics and core conceptual targets");
            suggestions.add("Complete basic programming courses");
            suggestions.add("Build first real-world project node");
            suggestions.add("Earn first professional certification");
        } else if (overallPercentage <= 60) {
            level = "Developing";
            description = "The student has basic knowledge but should improve practical experience and consistency.";
            suggestions.add("Complete intermediate difficulty projects");
            suggestions.add("Improve daily coding tracker consistency");
            suggestions.add("Strengthen database SQL query structures and DSA concepts");
            suggestions.add("Practice camera-based mock interviews");
        } else if (overallPercentage <= 80) {
            level = "Placement Ready";
            description = "The student is prepared for internships and placement drives but still has room for improvement.";
            suggestions.add("Complete advanced full-stack software projects");
            suggestions.add("Optimize and refine resume score above 85");
            suggestions.add("Practice mock interviews regularly to boost expression scores");
            suggestions.add("Add a clean GitHub repository profile portfolio");
        } else {
            level = "Industry Ready";
            description = "The student demonstrates strong technical skills, practical experience, and career readiness.";
            suggestions.add("Apply actively for enterprise-grade internships");
            suggestions.add("Contribute to global open-source code repositories");
            suggestions.add("Build and host a premium portfolio website");
            suggestions.add("Prepare for advanced architecture design screenings");
        }

        // Build breakdown maps
        Map<String, Double> contributionBreakdown = new HashMap<>();
        contributionBreakdown.put("Academic Performance", cgpaContrib);
        contributionBreakdown.put("Skills Tracker", skillsContrib);
        contributionBreakdown.put("Projects", projectsContrib);
        contributionBreakdown.put("Certifications", certsContrib);
        contributionBreakdown.put("Coding Practice", codingProgress);
        contributionBreakdown.put("Resume Score", resumeScore);
        contributionBreakdown.put("Mock Interview", interviewScore);

        return new CareerReadiness(
            Math.round(overallPercentage * 10.0) / 10.0,
            level,
            description,
            contributionBreakdown,
            suggestions
        );
    }
}
