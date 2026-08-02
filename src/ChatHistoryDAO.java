package src;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ChatHistoryDAO {
    // In-memory fallback database cache
    private static final List<ChatMessage> mockHistory = new ArrayList<>();
    private static int mockIdCounter = 1;

    static {
        // Initial welcome prompts or mock chats
        mockHistory.add(new ChatMessage(mockIdCounter++, 1, "Hello", "Hi! I'm NexusAI, your personal AI assistant. How can I help you today?", "Just now"));
    }

    public static void saveMessage(int userId, String userMessage, String aiResponse) {
        if (DatabaseManager.isFallbackActive()) {
            mockHistory.add(new ChatMessage(mockIdCounter++, userId, userMessage, aiResponse, new java.util.Date().toString()));
            return;
        }

        String sql = "INSERT INTO chat_history (user_id, user_message, ai_response) VALUES (?, ?, ?)";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ps.setString(2, userMessage);
            ps.setString(3, aiResponse);
            ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[ChatHistoryDAO] Failed to save chat history: " + e.getMessage());
            // Fallback
            mockHistory.add(new ChatMessage(mockIdCounter++, userId, userMessage, aiResponse, new java.util.Date().toString()));
        }
    }

    public static List<ChatMessage> getHistory(int userId) {
        if (DatabaseManager.isFallbackActive()) {
            List<ChatMessage> userHistory = new ArrayList<>();
            for (ChatMessage msg : mockHistory) {
                if (msg.getUserId() == userId) {
                    userHistory.add(msg);
                }
            }
            return userHistory;
        }

        List<ChatMessage> history = new ArrayList<>();
        String sql = "SELECT id, user_id, user_message, ai_response, created_at FROM chat_history WHERE user_id = ? ORDER BY created_at ASC";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    history.add(new ChatMessage(
                        rs.getInt("id"),
                        rs.getInt("user_id"),
                        rs.getString("user_message"),
                        rs.getString("ai_response"),
                        rs.getTimestamp("created_at").toString()
                    ));
                }
            }
        } catch (SQLException e) {
            System.err.println("[ChatHistoryDAO] Failed to retrieve chat history: " + e.getMessage());
            // Return fallback mockHistory for this user
            List<ChatMessage> userHistory = new ArrayList<>();
            for (ChatMessage msg : mockHistory) {
                if (msg.getUserId() == userId) {
                    userHistory.add(msg);
                }
            }
            return userHistory;
        }
        return history;
    }

    public static void clearHistory(int userId) {
        if (DatabaseManager.isFallbackActive()) {
            mockHistory.removeIf(msg -> msg.getUserId() == userId);
            return;
        }

        String sql = "DELETE FROM chat_history WHERE user_id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[ChatHistoryDAO] Failed to clear chat history: " + e.getMessage());
            mockHistory.removeIf(msg -> msg.getUserId() == userId);
        }
    }
}
