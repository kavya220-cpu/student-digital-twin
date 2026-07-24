package src;

public class ResumeGenerator {
    private Resume resume;

    public ResumeGenerator(Resume resume) {
        this.resume = resume;
    }

    public String generateJSON() {
        StringBuilder sb = new StringBuilder();
        sb.append("{\n");
        sb.append("  \"name\": \"").append(escape(resume.name)).append("\",\n");
        sb.append("  \"title\": \"").append(escape(resume.title)).append("\",\n");
        sb.append("  \"email\": \"").append(escape(resume.email)).append("\",\n");
        sb.append("  \"phone\": \"").append(escape(resume.phone)).append("\",\n");
        sb.append("  \"linkedinUrl\": \"").append(escape(resume.linkedinUrl)).append("\",\n");
        sb.append("  \"githubUrl\": \"").append(escape(resume.githubUrl)).append("\",\n");
        sb.append("  \"portfolioUrl\": \"").append(escape(resume.portfolioUrl)).append("\",\n");
        sb.append("  \"summary\": \"").append(escape(resume.summary)).append("\",\n");
        
        // Technical Skills
        sb.append("  \"technicalSkills\": [");
        for (int i = 0; i < resume.technicalSkills.size(); i++) {
            sb.append("\"").append(escape(resume.technicalSkills.get(i))).append("\"");
            if (i < resume.technicalSkills.size() - 1) sb.append(", ");
        }
        sb.append("],\n");

        // Soft Skills
        sb.append("  \"softSkills\": [");
        for (int i = 0; i < resume.softSkills.size(); i++) {
            sb.append("\"").append(escape(resume.softSkills.get(i))).append("\"");
            if (i < resume.softSkills.size() - 1) sb.append(", ");
        }
        sb.append("],\n");

        // Languages
        sb.append("  \"languages\": [");
        for (int i = 0; i < resume.languages.size(); i++) {
            sb.append("\"").append(escape(resume.languages.get(i))).append("\"");
            if (i < resume.languages.size() - 1) sb.append(", ");
        }
        sb.append("],\n");

        // Education
        sb.append("  \"education\": [\n");
        for (int i = 0; i < resume.educationList.size(); i++) {
            Resume.Education edu = resume.educationList.get(i);
            sb.append("    {\n");
            sb.append("      \"school\": \"").append(escape(edu.school)).append("\",\n");
            sb.append("      \"degree\": \"").append(escape(edu.degree)).append("\",\n");
            sb.append("      \"semester\": \"").append(escape(edu.semester)).append("\",\n");
            sb.append("      \"year\": \"").append(escape(edu.year)).append("\",\n");
            sb.append("      \"cgpa\": \"").append(escape(edu.cgpa)).append("\"\n");
            sb.append("    }");
            if (i < resume.educationList.size() - 1) sb.append(",");
            sb.append("\n");
        }
        sb.append("  ],\n");

        // Projects
        sb.append("  \"projects\": [\n");
        for (int i = 0; i < resume.projectList.size(); i++) {
            Resume.ProjectNode proj = resume.projectList.get(i);
            sb.append("    {\n");
            sb.append("      \"name\": \"").append(escape(proj.name)).append("\",\n");
            sb.append("      \"description\": \"").append(escape(proj.description)).append("\",\n");
            sb.append("      \"techStack\": \"").append(escape(proj.techStack)).append("\",\n");
            sb.append("      \"github\": \"").append(escape(proj.github)).append("\",\n");
            sb.append("      \"demo\": \"").append(escape(proj.demo)).append("\"\n");
            sb.append("    }");
            if (i < resume.projectList.size() - 1) sb.append(",");
            sb.append("\n");
        }
        sb.append("  ],\n");

        // Certifications
        sb.append("  \"certifications\": [\n");
        for (int i = 0; i < resume.certificationList.size(); i++) {
            Resume.CertNode cert = resume.certificationList.get(i);
            sb.append("    {\n");
            sb.append("      \"name\": \"").append(escape(cert.name)).append("\",\n");
            sb.append("      \"course\": \"").append(escape(cert.course)).append("\",\n");
            sb.append("      \"platform\": \"").append(escape(cert.platform)).append("\",\n");
            sb.append("      \"credits\": \"").append(escape(cert.credits)).append("\",\n");
            sb.append("      \"credentialId\": \"").append(escape(cert.credentialId)).append("\"\n");
            sb.append("    }");
            if (i < resume.certificationList.size() - 1) sb.append(",");
            sb.append("\n");
        }
        sb.append("  ],\n");

        // Experience
        sb.append("  \"experience\": [\n");
        for (int i = 0; i < resume.experienceList.size(); i++) {
            Resume.Experience exp = resume.experienceList.get(i);
            sb.append("    {\n");
            sb.append("      \"company\": \"").append(escape(exp.company)).append("\",\n");
            sb.append("      \"role\": \"").append(escape(exp.role)).append("\",\n");
            sb.append("      \"duration\": \"").append(escape(exp.duration)).append("\",\n");
            sb.append("      \"description\": \"").append(escape(exp.description)).append("\"\n");
            sb.append("    }");
            if (i < resume.experienceList.size() - 1) sb.append(",");
            sb.append("\n");
        }
        sb.append("  ],\n");

        // Achievements
        sb.append("  \"achievements\": [");
        for (int i = 0; i < resume.achievements.size(); i++) {
            sb.append("\"").append(escape(resume.achievements.get(i))).append("\"");
            if (i < resume.achievements.size() - 1) sb.append(", ");
        }
        sb.append("]\n");

        sb.append("}");
        return sb.toString();
    }

    public String generateHTMLTemplate(String templateType) {
        StringBuilder sb = new StringBuilder();
        sb.append("<!DOCTYPE html>\n<html>\n<head>\n");
        sb.append("  <style>\n");
        sb.append("    body { font-family: 'Poppins', sans-serif; padding: 20px; color: #333; }\n");
        sb.append("    .header { text-align: center; border-bottom: 2px solid #6C63FF; padding-bottom: 10px; }\n");
        sb.append("    .name { font-size: 24px; font-weight: bold; margin: 0; }\n");
        sb.append("    .title { font-size: 16px; color: #666; margin: 5px 0 10px 0; }\n");
        sb.append("    .contact { font-size: 12px; color: #555; }\n");
        sb.append("    .section-title { font-size: 16px; font-weight: bold; color: #6C63FF; margin-top: 20px; border-bottom: 1px solid #ddd; padding-bottom: 3px; }\n");
        sb.append("    .item { margin-top: 10px; }\n");
        sb.append("    .item-title { font-size: 13px; font-weight: bold; display: flex; justify-content: space-between; }\n");
        sb.append("    .item-desc { font-size: 12px; color: #555; margin-top: 4px; }\n");
        sb.append("  </style>\n</head>\n<body>\n");

        sb.append("  <div class=\"header\">\n");
        sb.append("    <div class=\"name\">").append(resume.name).append("</div>\n");
        sb.append("    <div class=\"title\">").append(resume.title).append("</div>\n");
        sb.append("    <div class=\"contact\">Email: ").append(resume.email).append(" | Phone: ").append(resume.phone).append("</div>\n");
        if (resume.linkedinUrl != null && !resume.linkedinUrl.isEmpty()) {
            sb.append("    <div class=\"contact\">LinkedIn: ").append(resume.linkedinUrl).append(" | GitHub: ").append(resume.githubUrl).append("</div>\n");
        }
        sb.append("  </div>\n");

        if (resume.summary != null && !resume.summary.isEmpty()) {
            sb.append("  <div class=\"section-title\">Professional Summary</div>\n");
            sb.append("  <div class=\"item-desc\">").append(resume.summary).append("</div>\n");
        }

        if (!resume.educationList.isEmpty()) {
            sb.append("  <div class=\"section-title\">Education</div>\n");
            for (Resume.Education edu : resume.educationList) {
                sb.append("  <div class=\"item\">\n");
                sb.append("    <div class=\"item-title\"><span>").append(edu.degree).append("</span><span>").append(edu.year).append("</span></div>\n");
                sb.append("    <div class=\"item-desc\">").append(edu.school).append(" (CGPA: ").append(edu.cgpa).append(")</div>\n");
                sb.append("  </div>\n");
            }
        }

        if (!resume.projectList.isEmpty()) {
            sb.append("  <div class=\"section-title\">Projects</div>\n");
            for (Resume.ProjectNode proj : resume.projectList) {
                sb.append("  <div class=\"item\">\n");
                sb.append("    <div class=\"item-title\"><span>").append(proj.name).append("</span><span>Stack: ").append(proj.techStack).append("</span></div>\n");
                sb.append("    <div class=\"item-desc\">").append(proj.description).append("</div>\n");
                sb.append("  </div>\n");
            }
        }

        if (!resume.certificationList.isEmpty()) {
            sb.append("  <div class=\"section-title\">Certifications</div>\n");
            for (Resume.CertNode cert : resume.certificationList) {
                sb.append("  <div class=\"item\">\n");
                sb.append("    <div class=\"item-title\"><span>").append(cert.name).append("</span><span>").append(cert.platform).append("</span></div>\n");
                sb.append("    <div class=\"item-desc\">Course: ").append(cert.course).append(" (ID: ").append(cert.credentialId).append(")</div>\n");
                sb.append("  </div>\n");
            }
        }

        sb.append("</body>\n</html>");
        return sb.toString();
    }

    private String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
    }
}
