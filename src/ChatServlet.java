package src;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/api/chat")
public class ChatServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        int userId = 1; // Default
        String userIdParam = request.getParameter("userId");
        if (userIdParam != null) {
            try {
                userId = Integer.parseInt(userIdParam);
            } catch (NumberFormatException e) {
                // Ignore, keep default
            }
        }
        
        List<ChatMessage> history = ChatHistoryDAO.getHistory(userId);
        
        // Build JSON manually to avoid dependencies
        StringBuilder json = new StringBuilder();
        json.append("[");
        for (int i = 0; i < history.size(); i++) {
            ChatMessage msg = history.get(i);
            json.append("{");
            json.append("\"id\":").append(msg.getId()).append(",");
            json.append("\"user_message\":\"").append(escapeJson(msg.getUserMessage())).append("\",");
            json.append("\"ai_response\":\"").append(escapeJson(msg.getAiResponse())).append("\",");
            json.append("\"created_at\":\"").append(escapeJson(msg.getCreatedAt())).append("\"");
            json.append("}");
            if (i < history.size() - 1) {
                json.append(",");
            }
        }
        json.append("]");
        
        try (PrintWriter out = response.getWriter()) {
            out.print(json.toString());
            out.flush();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Read raw JSON request body
        StringBuilder bodyBuilder = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                bodyBuilder.append(line);
            }
        }
        
        String requestBody = bodyBuilder.toString();
        String message = getJsonField(requestBody, "message");
        String history = getJsonField(requestBody, "history"); // returns the raw array string
        
        int userId = 1;
        String userIdParam = request.getParameter("userId");
        if (userIdParam != null) {
            try {
                userId = Integer.parseInt(userIdParam);
            } catch (NumberFormatException e) {
                // Ignore
            }
        }
        
        // Call Groq API with smart document mode routing
        String systemPrompt = "You are NexusAI,\nthe AI assistant for NexusED.\n\n"
                + "You are an intelligent AI assistant capable of answering\n"
                + "• Study Questions\n"
                + "• Programming\n"
                + "• Mathematics\n"
                + "• Artificial Intelligence\n"
                + "• Machine Learning\n"
                + "• Cloud Computing\n"
                + "• DBMS\n"
                + "• Java\n"
                + "• Python\n"
                + "• SQL\n"
                + "• Resume\n"
                + "• Career Guidance\n"
                + "• Interview Preparation\n"
                + "• General Knowledge\n"
                + "• Writing Assistance\n"
                + "• Productivity\n\n"
                + "If an uploaded document exists,\n"
                + "use it ONLY when the user's question refers to that document.\n"
                + "If the question is unrelated,\n"
                + "ignore the document and answer using your own knowledge.\n\n"
                + "Never reply with\n"
                + "\"Based on your uploaded document\"\n"
                + "unless the question is actually about the uploaded file.\n\n"
                + "Always answer naturally like ChatGPT.";

        boolean isDocMode = false;
        String finalSystemPrompt = systemPrompt;

        try {
            List<java.util.Map<String, Object>> recentDocs = DocumentRepository.getRecentDocuments(userId);
            if (recentDocs != null && !recentDocs.isEmpty()) {
                java.util.Map<String, Object> lastDoc = recentDocs.get(0);
                String filename = (String) lastDoc.get("filename");
                String docId = (String) lastDoc.get("id");
                
                java.util.Map<String, Object> analysis = DocumentRepository.getDocumentAnalysis(docId);
                String summary = (String) analysis.getOrDefault("summary", "");
                String notes = (String) analysis.getOrDefault("notes", "");
                String topics = (String) analysis.getOrDefault("topics", "");
                String keywords = (String) analysis.getOrDefault("keywords", "");
                
                if (GroqService.referencesDocument(message, filename, topics, keywords)) {
                    isDocMode = true;
                    finalSystemPrompt += "\n\n=== Document Study Context ===\n"
                            + "Filename: " + filename + "\n"
                            + "Topics Covered: " + topics + "\n"
                            + "Summary:\n" + summary + "\n"
                            + "Detailed Notes Outline:\n" + notes + "\n"
                            + "==============================\n\n"
                            + "Remember: The user's question is about this document. Answer it using the context provided above.";
                }
            }
        } catch (Exception e) {
            System.err.println("[ChatServlet] Error resolving document routing context: " + e.getMessage());
        }
        
        String aiResponse = GroqService.generateChatResponse(finalSystemPrompt, message, history);
        
        // Save to database
        ChatHistoryDAO.saveMessage(userId, message, aiResponse);
        
        // Build JSON response with mode indicator
        StringBuilder jsonResponse = new StringBuilder();
        jsonResponse.append("{");
        jsonResponse.append("\"response\":\"").append(escapeJson(aiResponse)).append("\",");
        jsonResponse.append("\"isDocMode\":").append(isDocMode);
        jsonResponse.append("}");
        
        try (PrintWriter out = response.getWriter()) {
            out.print(jsonResponse.toString());
            out.flush();
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        int userId = 1;
        String userIdParam = request.getParameter("userId");
        if (userIdParam != null) {
            try {
                userId = Integer.parseInt(userIdParam);
            } catch (NumberFormatException e) {
                // Ignore
            }
        }
        
        ChatHistoryDAO.clearHistory(userId);
        
        try (PrintWriter out = response.getWriter()) {
            out.print("{\"status\":\"success\"}");
            out.flush();
        }
    }

    private String getJsonField(String json, String field) {
        int index = json.indexOf("\"" + field + "\"");
        if (index == -1) return "";
        
        // Check if value is string or array/object
        int valueStart = json.indexOf(":", index + field.length() + 2);
        if (valueStart == -1) return "";
        valueStart++; // skip colon
        
        // trim leading whitespace
        while (valueStart < json.length() && Character.isWhitespace(json.charAt(valueStart))) {
            valueStart++;
        }
        
        if (valueStart >= json.length()) return "";
        
        if (json.charAt(valueStart) == '[') {
            // It's a JSON array (history)
            int count = 1;
            int i = valueStart + 1;
            while (i < json.length() && count > 0) {
                if (json.charAt(i) == '[') count++;
                else if (json.charAt(i) == ']') count--;
                i++;
            }
            return json.substring(valueStart, i);
        } else if (json.charAt(valueStart) == '"') {
            // It's a string (message)
            int start = valueStart + 1;
            int end = json.indexOf("\"", start);
            while (end != -1 && json.charAt(end - 1) == '\\') {
                end = json.indexOf("\"", end + 1);
            }
            if (end != -1) {
                return unescapeJson(json.substring(start, end));
            }
        } else {
            // It's a number, boolean, or null
            int end = valueStart;
            while (end < json.length() && json.charAt(end) != ',' && json.charAt(end) != '}') {
                end++;
            }
            return json.substring(valueStart, end).trim();
        }
        return "";
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\b", "\\b")
                .replace("\f", "\\f")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    private static String unescapeJson(String s) {
        return s.replace("\\\\", "\\")
                .replace("\\\"", "\"")
                .replace("\\n", "\n")
                .replace("\\r", "\r")
                .replace("\\t", "\t");
    }
}
