import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Reusable backend generator demonstrating professional trajectory roadmaps.
 * NexusED – Student Digital Twin & Growth Intelligence Platform
 */
public class RoadmapGenerator {

    private final Map<String, List<String>> roadmapDatabase;

    public RoadmapGenerator() {
        this.roadmapDatabase = new HashMap<>();
        initializeDatabase();
    }

    /**
     * Initializes highly detailed career curriculum roadmaps (12-14 milestones per track).
     */
    private void initializeDatabase() {
        roadmapDatabase.put("AI Engineer", Arrays.asList(
            "Python Foundations",
            "Object Oriented Programming (OOP)",
            "Data Structures & Algorithms",
            "SQL & Database Queries",
            "Mathematics & Statistics",
            "Machine Learning Models",
            "Deep Learning Foundations",
            "Computer Vision (CV) Architectures",
            "Natural Language Processing (NLP)",
            "Generative AI & LLMs",
            "AI Capstone Projects",
            "Industry Internship Calibration",
            "Final Recruitment & Placement Success"
        ));

        roadmapDatabase.put("Data Scientist", Arrays.asList(
            "Python for Data Science",
            "SQL & Database Architectures",
            "Probability & Descriptive Statistics",
            "Data Cleaning & Feature Engineering",
            "Exploratory Data Analysis (EDA)",
            "Supervised Machine Learning",
            "Unsupervised ML & Clustering",
            "Data Visualization & Storytelling",
            "Big Data Engines (Spark & Hadoop)",
            "Deep Learning & NLP Basics",
            "Analytics Projects",
            "Data Science Internship",
            "Final Interview & Placement"
        ));

        roadmapDatabase.put("Software Engineer", Arrays.asList(
            "Programming Fundamentals (Java/C++)",
            "Object Oriented Programming (OOP)",
            "Data Structures & Algorithms (DSA)",
            "SQL & NoSQL Database Management",
            "Operating Systems & Linux Basics",
            "SOLID Architecture & Clean Coding",
            "Software Design Patterns",
            "System Design & Scale Architectures",
            "Software Testing & QA (JUnit)",
            "CI/CD Build Pipelines",
            "Collaborative Capstone Projects",
            "Software Engineer Internship",
            "Placement Board Success"
        ));

        roadmapDatabase.put("Java Developer", Arrays.asList(
            "Java Basics & Logical Syntax",
            "Object Oriented Programming (OOP)",
            "Java Collections & Generics Framework",
            "Multi-threading & Memory management",
            "SQL & JDBC Database Access",
            "Hibernate & JPA (ORM Frameworks)",
            "Spring Framework Core & Beans",
            "Spring Boot Microservices",
            "Spring Security & JWT Authentication",
            "REST API Development & Testing",
            "Enterprise Java Capstones",
            "Java Developer Internship",
            "Final Recruitment Placements"
        ));

        roadmapDatabase.put("Full Stack Developer", Arrays.asList(
            "HTML5 & CSS3 Responsive Frameworks",
            "JavaScript & DOM Manipulations",
            "Asynchronous JS & API Interfacing",
            "Frontend Libraries (React / Vue)",
            "State Management (Redux / Context)",
            "Node.js Backend & Express Frameworks",
            "SQL & MongoDB NoSQL Schemas",
            "Web Security Protocols & Cookies",
            "Git Workflows & Docker containers",
            "AWS Deployment & Cloud hosting",
            "Full Stack Web App Capstone",
            "Full Stack Internship Calibration",
            "Placement Interviews"
        ));

        roadmapDatabase.put("Cloud Engineer", Arrays.asList(
            "Linux Administration & Scripting",
            "Computer Networking & VPC structures",
            "AWS / Azure Infrastructure Fundamentals",
            "Identity & Access Management (IAM)",
            "Cloud Storage & Database management",
            "Infrastructure as Code (IaC - Terraform)",
            "Container Virtualization (Docker)",
            "Cluster Orchestrations (Kubernetes)",
            "Serverless Architectures & Lambda",
            "Cloud Security Protocols & Audits",
            "Cloud System Capstone Project",
            "Cloud Internship Calibration",
            "Final Placement & Recruitment"
        ));

        roadmapDatabase.put("Cybersecurity Engineer", Arrays.asList(
            "Computer Networks & Packet Inspections",
            "Linux Security & Sysadmin basics",
            "Cryptography (Symmetric/Asymmetric)",
            "VPNs & Intrusion Sensors (IDS/IPS)",
            "Identity Security & Directories (LDAP)",
            "Penetration Testing Tools (Nmap/Metasploit)",
            "OWASP Top 10 Web Application Vulnerabilities",
            "Threat Modeling Strides (STRIDE)",
            "Security Information Logging (SIEM)",
            "Incidence Response & Disaster Recovery",
            "Cybersecurity Capstone Projects",
            "Security Internship Calibration",
            "Final Placement Boards"
        ));

        roadmapDatabase.put("DevOps Engineer", Arrays.asList(
            "Linux Systems & Shell Automations",
            "Git Version Control & Branching Models",
            "CI/CD Build Pipelines (Jenkins/GitHub Actions)",
            "Docker Containers & Bridges",
            "Kubernetes Orchestration & Helm Charts",
            "Terraform Infrastructure Provisioning",
            "Configuration Management (Ansible)",
            "Telemetry Monitoring (Prometheus/Grafana)",
            "Log Aggregations (ELK Stack)",
            "Site Reliability Engineering (SRE) Basics",
            "DevOps Capstone project",
            "DevOps Internship Calibration",
            "Final Placement Boards"
        ));

        roadmapDatabase.put("Mobile App Developer", Arrays.asList(
            "Kotlin / Swift Syntax Fundamentals",
            "Mobile UI Layouts (Compose / SwiftUI)",
            "Local Storage Databases (SQLite/Room)",
            "Asynchronous programming (Coroutines)",
            "Network API calls & JSON files parsing",
            "Clean Mobile Architecture (MVVM)",
            "Push Notifications & Sync channels",
            "Mobile Security & Key encryption",
            "Hybrid frameworks (Flutter basics)",
            "App Store Publishing Protocols",
            "Mobile App Capstone projects",
            "Mobile Developer Internship",
            "Final Recruitment & Placements"
        ));
    }

    /**
     * Returns an ArrayList containing the milestone names for a career goal.
     * @param career Selected career goal.
     * @return List of milestone names.
     */
    public ArrayList<String> generateRoadmap(String career) {
        ArrayList<String> roadmap = new ArrayList<>();
        if (career == null || career.trim().isEmpty()) {
            return roadmap;
        }

        for (String dbKey : roadmapDatabase.keySet()) {
            if (dbKey.equalsIgnoreCase(career.trim())) {
                roadmap.addAll(roadmapDatabase.get(dbKey));
                break;
            }
        }
        return roadmap;
    }

    /**
     * Standalone main test runner.
     */
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("    NexusED - RoadmapGenerator Demonstration     ");
        System.out.println("==================================================");

        RoadmapGenerator generator = new RoadmapGenerator();
        String testCareer = "AI Engineer";

        System.out.println("\nGenerated Roadmap for: " + testCareer);
        ArrayList<String> path = generator.generateRoadmap(testCareer);
        for (int i = 0; i < path.size(); i++) {
            System.out.println("  M" + (i + 1) + ": " + path.get(i));
        }
        System.out.println("==================================================");
    }
}
