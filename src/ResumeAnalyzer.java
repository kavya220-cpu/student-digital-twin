package src;

import java.util.ArrayList;
import java.util.List;

public class ResumeAnalyzer {

    public static class AnalysisResult {
        public int atsScore;
        public int profileCompletion;
        public String resumeStrength;
        public List<String> missingSections = new ArrayList<>();
        public List<String> suggestions = new ArrayList<>();
        public List<String> strengths = new ArrayList<>();
        public List<String> weaknesses = new ArrayList<>();
        
        public String toJSONString() {
            StringBuilder sb = new StringBuilder();
            sb.append("{\n");
            sb.append("  \"atsScore\": ").append(atsScore).append(",\n");
            sb.append("  \"profileCompletion\": ").append(profileCompletion).append(",\n");
            sb.append("  \"resumeStrength\": \"").append(resumeStrength).append("\",\n");
            
            // Missing Sections
            sb.append("  \"missingSections\": [");
            for (int i = 0; i < missingSections.size(); i++) {
                sb.append("\"").append(escape(missingSections.get(i))).append("\"");
                if (i < missingSections.size() - 1) sb.append(", ");
            }
            sb.append("],\n");

            // Suggestions
            sb.append("  \"suggestions\": [");
            for (int i = 0; i < suggestions.size(); i++) {
                sb.append("\"").append(escape(suggestions.get(i))).append("\"");
                if (i < suggestions.size() - 1) sb.append(", ");
            }
            sb.append("],\n");

            // Strengths
            sb.append("  \"strengths\": [");
            for (int i = 0; i < strengths.size(); i++) {
                sb.append("\"").append(escape(strengths.get(i))).append("\"");
                if (i < strengths.size() - 1) sb.append(", ");
            }
            sb.append("],\n");

            // Weaknesses
            sb.append("  \"weaknesses\": [");
            for (int i = 0; i < weaknesses.size(); i++) {
                sb.append("\"").append(escape(weaknesses.get(i))).append("\"");
                if (i < weaknesses.size() - 1) sb.append(", ");
            }
            sb.append("]\n");

            sb.append("}");
            return sb.toString();
        }

        private String escape(String s) {
            if (s == null) return "";
            return s.replace("\"", "\\\"");
        }
    }

    public AnalysisResult analyze(Resume resume) {
        AnalysisResult result = new AnalysisResult();
        int score = 0;
        int completedSections = 0;
        int totalSections = 8; // Personal, Summary, Skills, Education, Projects, Certifications, Experience, Achievements

        // 1. Personal Information validation
        boolean hasContact = (resume.email != null && !resume.email.trim().isEmpty()) && 
                             (resume.phone != null && !resume.phone.trim().isEmpty());
        if (hasContact) {
            score += 15;
            completedSections++;
            result.strengths.add("Contact details are fully provided.");
        } else {
            result.weaknesses.add("Missing complete contact details (email or phone).");
            result.suggestions.add("Add contact details (email & phone number).");
            result.missingSections.add("Contact Info");
        }

        boolean hasUrls = (resume.linkedinUrl != null && !resume.linkedinUrl.trim().isEmpty()) || 
                          (resume.githubUrl != null && !resume.githubUrl.trim().isEmpty());
        if (hasUrls) {
            score += 10;
            result.strengths.add("Social URLs (GitHub/LinkedIn) are linked.");
        } else {
            result.weaknesses.add("No professional links (LinkedIn or GitHub) identified.");
            result.suggestions.add("Add GitHub Profile & LinkedIn URL.");
        }

        // 2. Summary
        if (resume.summary != null && !resume.summary.trim().isEmpty()) {
            completedSections++;
            if (resume.summary.trim().length() > 100) {
                score += 15;
                result.strengths.add("Summary is comprehensive and well-detailed.");
            } else {
                score += 5;
                result.weaknesses.add("Summary is too short (less than 100 characters).");
                result.suggestions.add("Expand professional summary to highlight core capabilities.");
            }
        } else {
            result.weaknesses.add("Professional summary section is completely missing.");
            result.suggestions.add("Include a professional summary statement.");
            result.missingSections.add("Summary");
        }

        // 3. Skills
        if (!resume.technicalSkills.isEmpty() || !resume.softSkills.isEmpty()) {
            completedSections++;
            if (resume.technicalSkills.size() >= 4) {
                score += 15;
                result.strengths.add("Excellent technical skill vocabulary with at least 4 key skills.");
            } else {
                score += 8;
                result.weaknesses.add("Very few technical skills listed.");
                result.suggestions.add("List more core technical skills matching your career track.");
            }
        } else {
            result.weaknesses.add("Skills section is missing.");
            result.suggestions.add("Add technical and soft skills lists.");
            result.missingSections.add("Skills");
        }

        // 4. Education
        if (!resume.educationList.isEmpty()) {
            completedSections++;
            score += 15;
            result.strengths.add("Academic background history is fully documented.");
        } else {
            result.weaknesses.add("Missing education details.");
            result.suggestions.add("Add your college, specialization, and GPA parameters.");
            result.missingSections.add("Education");
        }

        // 5. Projects
        if (!resume.projectList.isEmpty()) {
            completedSections++;
            if (resume.projectList.size() >= 2) {
                score += 15;
                result.strengths.add("Strong projects portfolio showing multiple technical applications.");
            } else {
                score += 8;
                result.weaknesses.add("Only one project listed in portfolio.");
                result.suggestions.add("Include at least two software or engineering projects.");
            }
        } else {
            result.weaknesses.add("Missing projects portfolio.");
            result.suggestions.add("Add projects showing practical application of technical skills.");
            result.missingSections.add("Projects");
        }

        // 6. Certifications
        if (!resume.certificationList.isEmpty()) {
            completedSections++;
            score += 10;
            result.strengths.add("Verified certifications are linked to your profile.");
        } else {
            result.weaknesses.add("Missing certifications section.");
            result.suggestions.add("Add verified credentials from Google, Coursera, or NPTEL.");
            result.missingSections.add("Certifications");
        }

        // 7. Experience / Internships
        if (!resume.experienceList.isEmpty()) {
            completedSections++;
            score += 5;
            result.strengths.add("Industry experience or internships are listed.");
        } else {
            result.weaknesses.add("No internship experience listed.");
            result.suggestions.add("Seek out or list internship roles to demonstrate field experience.");
            result.missingSections.add("Experience");
        }

        // 8. Achievements
        if (!resume.achievements.isEmpty()) {
            completedSections++;
            result.strengths.add("Achievements and academic awards are showcased.");
        } else {
            result.suggestions.add("Add quantified achievements (hackathon wins, competitive coding).");
            result.missingSections.add("Achievements");
        }

        // Final score calibrations
        result.atsScore = Math.min(score, 100);
        result.profileCompletion = (int) (((double) completedSections / totalSections) * 100);

        if (result.atsScore >= 75) {
            result.resumeStrength = "Strong";
        } else if (result.atsScore >= 50) {
            result.resumeStrength = "Medium";
        } else {
            result.resumeStrength = "Weak";
        }

        return result;
    }
}
