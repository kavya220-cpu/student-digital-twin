package src;

import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Properties;

public class GroqService {
    private static String apiKey = "";
    private static final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL_NAME = "llama3-8b-8192";

    static {
        // Load API key from config.properties
        try (InputStream input = GroqService.class.getClassLoader().getResourceAsStream("config.properties")) {
            Properties prop = new Properties();
            if (input != null) {
                prop.load(input);
                apiKey = prop.getProperty("groq.api.key", "");
            } else {
                java.io.File file = new java.io.File("src/config.properties");
                if (file.exists()) {
                    try (java.io.FileInputStream fis = new java.io.FileInputStream(file)) {
                        prop.load(fis);
                        apiKey = prop.getProperty("groq.api.key", "");
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("[GroqService] Failed to load config.properties: " + e.getMessage());
        }
    }

    public static boolean isKeyConfigured() {
        return apiKey != null && !apiKey.trim().isEmpty();
    }

    public static boolean referencesDocument(String userMessage, String filename, String topics, String keywords) {
        if (userMessage == null) return false;
        String q = userMessage.toLowerCase();
        
        // Mentions document directly
        if (q.contains("this document") || q.contains("the document") || q.contains("uploaded document") ||
            q.contains("my document") || q.contains("this pdf") || q.contains("the pdf") ||
            q.contains("uploaded pdf") || q.contains("my pdf") || q.contains("this file") ||
            q.contains("the file") || q.contains("uploaded file") || q.contains("my file") ||
            q.contains("summarize") || q.contains("summary") || q.contains("mcqs") ||
            q.contains("flashcards") || q.contains("chapter") || q.contains("study guide")) {
            return true;
        }
        
        // Check filename matches
        if (filename != null) {
            String cleanName = filename.toLowerCase().replaceAll("\\.[^.]+$", "");
            String[] nameParts = cleanName.split("[\\s_.-]+");
            for (String part : nameParts) {
                if (part.length() > 2 && q.contains(part)) {
                    return true;
                }
            }
        }
        
        // Check topics matches
        if (topics != null) {
            String[] topicParts = topics.toLowerCase().split("[,\\s]+");
            for (String part : topicParts) {
                if (part.length() > 3 && q.contains(part)) {
                    return true;
                }
            }
        }
        
        // Check keywords matches
        if (keywords != null) {
            String[] kwParts = keywords.toLowerCase().split("[,\\s]+");
            for (String part : kwParts) {
                if (part.length() > 3 && q.contains(part)) {
                    return true;
                }
            }
        }
        
        return false;
    }

    public static String generateChatResponse(String systemPrompt, String userMessage, String historyJsonArray) {
        if (!isKeyConfigured()) {
            return "Error: Groq API Key is not configured. Please add groq.api.key inside src/config.properties.";
        }

        // Retry logic: up to 3 retries
        int maxRetries = 3;
        int retryDelayMs = 1000;
        Exception lastException = null;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                // Build OpenAI-style chat payload
                StringBuilder jsonPayload = new StringBuilder();
                jsonPayload.append("{");
                jsonPayload.append("\"model\": \"").append(MODEL_NAME).append("\",");
                jsonPayload.append("\"messages\": [");

                // System message
                jsonPayload.append("{\"role\": \"system\", \"content\": \"").append(escapeJson(systemPrompt)).append("\"}");

                // Add history messages if historyJsonArray is provided and not empty
                // historyJsonArray structure: [{"role":"user","content":"..."},{"role":"assistant","content":"..."}]
                if (historyJsonArray != null && !historyJsonArray.trim().isEmpty() && historyJsonArray.trim().startsWith("[")) {
                    String cleanHistory = historyJsonArray.trim();
                    // Strip the outer brackets
                    cleanHistory = cleanHistory.substring(1, cleanHistory.length() - 1).trim();
                    if (!cleanHistory.isEmpty()) {
                        jsonPayload.append(", ").append(cleanHistory);
                    }
                }

                // Current user message
                jsonPayload.append(", {\"role\": \"user\", \"content\": \"").append(escapeJson(userMessage)).append("\"}");
                jsonPayload.append("],");
                jsonPayload.append("\"temperature\": 0.7");
                jsonPayload.append("}");

                HttpClient client = HttpClient.newHttpClient();
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(GROQ_URL))
                        .header("Content-Type", "application/json")
                        .header("Authorization", "Bearer " + apiKey)
                        .POST(HttpRequest.BodyPublishers.ofString(jsonPayload.toString()))
                        .build();

                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() == 200) {
                    return extractTextFromResponse(response.body());
                } else {
                    System.err.println("[GroqService] Groq API returned status " + response.statusCode() + ": " + response.body());
                    if (response.statusCode() >= 500) {
                        // Server errors are worth retrying
                        Thread.sleep(retryDelayMs * attempt);
                        continue;
                    }
                    return "Error: API returned status " + response.statusCode();
                }
            } catch (Exception e) {
                lastException = e;
                System.err.println("[GroqService] Attempt " + attempt + " failed: " + e.getMessage());
                try {
                    Thread.sleep(retryDelayMs * attempt);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    return "Error: Thread was interrupted during api call retry.";
                }
            }
        }

        return "I'm having trouble connecting to the AI service. Please try again in a few moments. " + 
               (lastException != null ? "(" + lastException.getMessage() + ")" : "");
    }

    private static String extractTextFromResponse(String json) {
        try {
            int contentIndex = json.indexOf("\"content\"");
            if (contentIndex == -1) return json;

            // Move cursor past "content": "
            int start = json.indexOf("\"", contentIndex + 9) + 1;
            int end = json.indexOf("\"", start);

            // Traverse carefully to avoid escaped quotes
            while (end != -1 && json.charAt(end - 1) == '\\') {
                end = json.indexOf("\"", end + 1);
            }

            if (start != -1 && end != -1) {
                String rawText = json.substring(start, end);
                return unescapeJson(rawText);
            }
        } catch (Exception e) {
            System.err.println("[GroqService] Failed to extract content: " + e.getMessage());
        }
        return json;
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
