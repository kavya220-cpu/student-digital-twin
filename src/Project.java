/**
 * Project Entity Model Class.
 * NexusED – Student Digital Twin & Growth Intelligence Platform
 */
public class Project {
    private String name;
    private String description;
    private String techStack;
    private String githubRepo;
    private String demoLink;
    private String status; // Completed, Ongoing, Planned
    private String imageUrl;

    public Project() {}

    public Project(String name, String description, String techStack, String githubRepo, String demoLink, String status, String imageUrl) {
        this.name = name;
        this.description = description;
        this.techStack = techStack;
        this.githubRepo = githubRepo;
        this.demoLink = demoLink;
        this.status = status;
        this.imageUrl = imageUrl;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTechStack() {
        return techStack;
    }

    public void setTechStack(String techStack) {
        this.techStack = techStack;
    }

    public String getGithubRepo() {
        return githubRepo;
    }

    public void setGithubRepo(String githubRepo) {
        this.githubRepo = githubRepo;
    }

    public String getDemoLink() {
        return demoLink;
    }

    public void setDemoLink(String demoLink) {
        this.demoLink = demoLink;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @Override
    public String toString() {
        return "Project{" +
                "name='" + name + '\'' +
                ", status='" + status + '\'' +
                ", techStack='" + techStack + '\'' +
                '}';
    }
}
