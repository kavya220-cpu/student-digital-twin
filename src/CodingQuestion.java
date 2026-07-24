package src;

public class CodingQuestion {
    private String id;
    private String title;
    private String topic;
    private String difficulty; // Easy, Medium, Hard
    private String notes;
    private String solvedDate; // YYYY-MM-DD
    private String codeSnippet;

    public CodingQuestion(String id, String title, String topic, String difficulty, String notes, String solvedDate, String codeSnippet) {
        this.id = id;
        this.title = title;
        this.topic = topic;
        this.difficulty = difficulty;
        this.notes = notes;
        this.solvedDate = solvedDate;
        this.codeSnippet = codeSnippet;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getSolvedDate() { return solvedDate; }
    public void setSolvedDate(String solvedDate) { this.solvedDate = solvedDate; }

    public String getCodeSnippet() { return codeSnippet; }
    public void setCodeSnippet(String codeSnippet) { this.codeSnippet = codeSnippet; }
}
