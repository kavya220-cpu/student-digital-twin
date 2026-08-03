package src;

public class GrowthTimeline {
    private int id;
    private int userId;
    private String title;
    private String description;
    private String category;
    private String eventDate;
    private String relatedModule;
    private int completionPercentage;

    public GrowthTimeline() {}

    public GrowthTimeline(int id, int userId, String title, String description, String category, String eventDate, String relatedModule, int completionPercentage) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.category = category;
        this.eventDate = eventDate;
        this.relatedModule = relatedModule;
        this.completionPercentage = completionPercentage;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getEventDate() { return eventDate; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }

    public String getRelatedModule() { return relatedModule; }
    public void setRelatedModule(String relatedModule) { this.relatedModule = relatedModule; }

    public int getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(int completionPercentage) { this.completionPercentage = completionPercentage; }
}
