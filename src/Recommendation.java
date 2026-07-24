package src;

public class Recommendation {
    private String id;
    private String text;
    private String priority; // High, Medium, Low
    private String status; // Pending, In Progress, Completed
    private String category;

    public Recommendation(String id, String text, String priority, String status, String category) {
        this.id = id;
        this.text = text;
        this.priority = priority;
        this.status = status;
        this.category = category;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
