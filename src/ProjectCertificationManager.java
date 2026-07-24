import java.util.ArrayList;
import java.util.List;

/**
 * Manager Class for Projects and Certifications.
 * NexusED – Student Digital Twin & Growth Intelligence Platform
 */
public class ProjectCertificationManager {
    private final List<Project> projects;
    private final List<Certificate> certificates;

    public ProjectCertificationManager() {
        this.projects = new ArrayList<>();
        this.certificates = new ArrayList<>();
    }

    // ==========================================
    // PROJECT CRUD OPERATIONS
    // ==========================================

    /**
     * Registers a new project in the student twin portfolio.
     * @param project Project object.
     */
    public void addProject(Project project) {
        if (project != null && !project.getName().trim().isEmpty()) {
            // Avoid duplicates
            for (Project p : projects) {
                if (p.getName().equalsIgnoreCase(project.getName().trim())) {
                    System.out.println("Project '" + project.getName() + "' already exists.");
                    return;
                }
            }
            projects.add(project);
        }
    }

    /**
     * Updates details of an existing project.
     * @param name Target project name.
     * @param description New description.
     * @param techStack New tech stack.
     * @param githubRepo New Github link.
     * @param demoLink New live demo link.
     * @param status New status (Completed, Ongoing, Planned).
     * @return true if updated, false if project name was not found.
     */
    public boolean updateProject(String name, String description, String techStack, String githubRepo, String demoLink, String status) {
        for (Project p : projects) {
            if (p.getName().equalsIgnoreCase(name.trim())) {
                p.setDescription(description);
                p.setTechStack(techStack);
                p.setGithubRepo(githubRepo);
                p.setDemoLink(demoLink);
                p.setStatus(status);
                return true;
            }
        }
        return false;
    }

    /**
     * Removes a project from the portfolio.
     * @param name Name of project to delete.
     * @return true if deleted, false otherwise.
     */
    public boolean deleteProject(String name) {
        for (int i = 0; i < projects.size(); i++) {
            if (projects.get(i).getName().equalsIgnoreCase(name.trim())) {
                projects.remove(i);
                return true;
            }
        }
        return false;
    }

    // ==========================================
    // CERTIFICATION CRUD OPERATIONS
    // ==========================================

    /**
     * Registers a new certificate.
     * @param certificate Certificate object.
     */
    public void addCertificate(Certificate certificate) {
        if (certificate != null && !certificate.getName().trim().isEmpty()) {
            for (Certificate c : certificates) {
                if (c.getCredentialId().equalsIgnoreCase(certificate.getCredentialId().trim())) {
                    System.out.println("Certificate with Credential ID '" + certificate.getCredentialId() + "' already exists.");
                    return;
                }
            }
            certificates.add(certificate);
        }
    }

    /**
     * Updates an existing certificate details.
     * @param credentialId Target credential ID.
     * @param name New certificate title.
     * @param platform New platform vendor.
     * @param issueDate New issue date.
     * @param link New verification link.
     * @return true if updated, false if credentialId not found.
     */
    public boolean updateCertificate(String credentialId, String name, String platform, String issueDate, String link) {
        for (Certificate c : certificates) {
            if (c.getCredentialId().equalsIgnoreCase(credentialId.trim())) {
                c.setName(name);
                c.setPlatform(platform);
                c.setIssueDate(issueDate);
                c.setCredentialLink(link);
                return true;
            }
        }
        return false;
    }

    /**
     * Deletes a certificate.
     * @param credentialId Credential ID of certificate to delete.
     * @return true if deleted, false otherwise.
     */
    public boolean deleteCertificate(String credentialId) {
        for (int i = 0; i < certificates.size(); i++) {
            if (certificates.get(i).getCredentialId().equalsIgnoreCase(credentialId.trim())) {
                certificates.remove(i);
                return true;
            }
        }
        return false;
    }

    // ==========================================
    // ANALYTICAL COUNTS & METRICS
    // ==========================================

    /**
     * Counts the total number of verified certificates.
     * @return Total count.
     */
    public int countCertificates() {
        return certificates.size();
    }

    /**
     * Counts the total number of projects with status "Completed".
     * @return Total count.
     */
    public int countCompletedProjects() {
        int count = 0;
        for (Project p : projects) {
            if ("Completed".equalsIgnoreCase(p.getStatus())) {
                count++;
            }
        }
        return count;
    }

    public List<Project> getProjects() {
        return projects;
    }

    public List<Certificate> getCertificates() {
        return certificates;
    }

    /**
     * Standalone main test runner for validation.
     */
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("  NexusED - ProjectCertificationManager Runner    ");
        System.out.println("==================================================");

        ProjectCertificationManager manager = new ProjectCertificationManager();

        // Add mock projects
        manager.addProject(new Project("AI Chatbot", "Core NLP chatbot", "Python, PyTorch", "github.com/bot", "demo.com", "Completed", ""));
        manager.addProject(new Project("Enterprise API", "Financial ledger microservice", "Java, SQL", "github.com/ledger", "", "Ongoing", ""));

        // Add mock certificates
        manager.addCertificate(new Certificate("Google Cloud Architect", "Google", "2026-06-12", "GCP-8837", "verify.google/8837", ""));
        manager.addCertificate(new Certificate("AWS Practitioner", "Microsoft", "2026-05-18", "AWS-1122", "verify.aws/1122", ""));

        System.out.println("Total Certificates count: " + manager.countCertificates());
        System.out.println("Completed Projects count: " + manager.countCompletedProjects());

        // Update Project
        manager.updateProject("Enterprise API", "Financial ledger microservice with security", "Java, SQL, JWT", "github.com/ledger", "live-api.com", "Completed");
        System.out.println("\nAfter updating Project status to Completed:");
        System.out.println("Completed Projects count: " + manager.countCompletedProjects());

        // Delete Certificate
        manager.deleteCertificate("AWS-1122");
        System.out.println("\nAfter deleting AWS Certificate:");
        System.out.println("Total Certificates count: " + manager.countCertificates());

        System.out.println("==================================================");
    }
}
