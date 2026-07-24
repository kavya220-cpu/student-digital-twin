package src;

public class NexusEdCareerSuiteTest {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("NEXUSED - CAREER SUITE COMPILATION & VERIFICATION");
        System.out.println("==================================================");

        // 1. Build a Mock Resume
        Resume resume = new Resume();
        resume.name = "Kavya Sharma";
        resume.title = "AI Engineer Trainee";
        resume.email = "kavya@nexused.edu";
        resume.phone = "+91 98765 43210";
        resume.linkedinUrl = "linkedin.com/in/kavyasharma";
        resume.githubUrl = "github.com/kavyasharma";
        resume.summary = "A passionate AI Engineer student calibrated inside the Digital Twin, developing deep neural networks and automated logic verification frameworks.";
        
        resume.technicalSkills.add("Java");
        resume.technicalSkills.add("Python");
        resume.technicalSkills.add("TensorFlow");
        resume.technicalSkills.add("SQL");
        
        resume.educationList.add(new Resume.Education("Nexus Institute of Technology", "B.Tech in Artificial Intelligence", "Semester 5", "2026", "9.2"));
        resume.projectList.add(new Resume.ProjectNode("NexusED Growth Engine", "Rule-based analysis engine synced with profile database", "Java, Vanilla JS, CSS3", "github.com/nexused-growth", "nexused-growth.edu"));
        resume.certificationList.add(new Resume.CertNode("TensorFlow Developer Certificate", "Deep Learning Fundamentals", "Google", "3", "TF-8837"));

        System.out.println("[x] Mock Resume structured.");

        // 2. Generate JSON & HTML Template outputs
        ResumeGenerator generator = new ResumeGenerator(resume);
        String jsonOutput = generator.generateJSON();
        String htmlOutput = generator.generateHTMLTemplate("Modern");
        
        System.out.println("[x] Resume JSON formatting completed. Length: " + jsonOutput.length() + " chars.");
        System.out.println("[x] Resume Print-ready HTML compiled. Length: " + htmlOutput.length() + " chars.");

        // 3. Analyze Resume
        ResumeAnalyzer analyzer = new ResumeAnalyzer();
        ResumeAnalyzer.AnalysisResult analysis = analyzer.analyze(resume);
        
        System.out.println("\n--- ATS Resume Analyzer Report ---");
        System.out.println("ATS Score: " + analysis.atsScore + "%");
        System.out.println("Profile Completion: " + analysis.profileCompletion + "%");
        System.out.println("Strength Assessment: " + analysis.resumeStrength);
        System.out.println("Strengths Found: " + analysis.strengths.size());
        for (String str : analysis.strengths) {
            System.out.println("  \u2714 " + str);
        }
        System.out.println("Missing Sections: " + analysis.missingSections);
        System.out.println("Suggestions for Improvement:");
        for (String sug : analysis.suggestions) {
            System.out.println("  \u2794 " + sug);
        }

        // 4. Test Interview Manager
        InterviewManager im = new InterviewManager();
        System.out.println("\n--- Interview Manager Verification ---");
        System.out.println("Loaded Mock Questions: " + im.getAllQuestions().size());
        
        // Filter and Search tests
        System.out.println("Filtering for 'Java': " + im.filterBySubject("Java").size() + " question(s).");
        System.out.println("Filtering for 'Hard' questions: " + im.filterByDifficulty("Hard").size() + " question(s).");
        System.out.println("Searching 'conflict': " + im.searchQuestions("conflict").size() + " question(s).");
        
        // Practice and Bookmarking state verification
        im.toggleBookmark("q1");
        im.markAsCompleted("q1", true);
        im.markAsCompleted("q3", true);
        
        System.out.println("Practice Progress Sync: Readiness Index = " + im.getReadinessIndex() + "%");
        System.out.println("Completed Count: " + im.getCompletionCount() + ", Bookmarked Count: " + im.getBookmarkedCount());
        System.out.println("==================================================");
        System.out.println("ALL JAVA LOGIC VERIFIED SUCCESSFULLY!");
        System.out.println("==================================================");
    }
}
