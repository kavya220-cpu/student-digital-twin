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
        
        // Call Groq API
        String systemPrompt = "You are NexusAI, a highly intelligent and helpful personal AI assistant inside the NexusED learning platform. "
                + "You behave like ChatGPT and can answer almost any question naturally including study doubts, ML, DSA, resume guidance, writing help, and general knowledge. "
                + "Always format code in standard Markdown blocks, use mathematical expressions in LaTeX if needed, and structure tables, numbered lists, or bullet points clearly.";
        
        String aiResponse = GroqService.generateChatResponse(systemPrompt, message, history);
        
        // Save to database
        ChatHistoryDAO.saveMessage(userId, message, aiResponse);
        
        // Build JSON response
        StringBuilder jsonResponse = new StringBuilder();
        jsonResponse.append("{");
        jsonResponse.append("\"response\":\"").append(escapeJson(aiResponse)).append("\"");
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
