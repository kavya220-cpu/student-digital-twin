package src;

public class ChatMessage {
    private int id;
    private int userId;
    private String userMessage;
    private String aiResponse;
    private String createdAt;

    public ChatMessage() {}

    public ChatMessage(int id, int userId, String userMessage, String aiResponse, String createdAt) {
        this.id = id;
        this.userId = userId;
        this.userMessage = userMessage;
        this.aiResponse = aiResponse;
        this.createdAt = createdAt;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUserMessage() {
        return userMessage;
    }

    public void setUserMessage(String userMessage) {
        this.userMessage = userMessage;
    }

    public String getAiResponse() {
        return aiResponse;
    }

    public void setAiResponse(String aiResponse) {
        this.aiResponse = aiResponse;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
