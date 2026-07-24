package src;

import java.util.ArrayList;
import java.util.List;

public class Resume {
    public String name;
    public String title;
    public String email;
    public String phone;
    public String linkedinUrl;
    public String githubUrl;
    public String portfolioUrl;
    public String summary;
    
    public List<String> technicalSkills = new ArrayList<>();
    public List<String> softSkills = new ArrayList<>();
    public List<String> languages = new ArrayList<>();
    
    public List<Education> educationList = new ArrayList<>();
    public List<ProjectNode> projectList = new ArrayList<>();
    public List<CertNode> certificationList = new ArrayList<>();
    public List<Experience> experienceList = new ArrayList<>();
    public List<String> achievements = new ArrayList<>();

    public static class Education {
        public String school;
        public String degree;
        public String semester;
        public String year;
        public String cgpa;
        
        public Education(String school, String degree, String semester, String year, String cgpa) {
            this.school = school;
            this.degree = degree;
            this.semester = semester;
            this.year = year;
            this.cgpa = cgpa;
        }
    }

    public static class ProjectNode {
        public String name;
        public String description;
        public String techStack;
        public String github;
        public String demo;
        
        public ProjectNode(String name, String description, String techStack, String github, String demo) {
            this.name = name;
            this.description = description;
            this.techStack = techStack;
            this.github = github;
            this.demo = demo;
        }
    }

    public static class CertNode {
        public String name;
        public String course;
        public String platform;
        public String credits;
        public String credentialId;
        
        public CertNode(String name, String course, String platform, String credits, String credentialId) {
            this.name = name;
            this.course = course;
            this.platform = platform;
            this.credits = credits;
            this.credentialId = credentialId;
        }
    }

    public static class Experience {
        public String company;
        public String role;
        public String duration;
        public String description;
        
        public Experience(String company, String role, String duration, String description) {
            this.company = company;
            this.role = role;
            this.duration = duration;
            this.description = description;
        }
    }
}
