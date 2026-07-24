package src;

import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Properties;

public class GeminiService {
    private static String apiKey = "";
    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

    static {
        // Load API key from config.properties
        try (InputStream input = GeminiService.class.getClassLoader().getResourceAsStream("config.properties")) {
            Properties prop = new Properties();
            if (input != null) {
                prop.load(input);
                apiKey = prop.getProperty("gemini.api.key", "");
            } else {
                java.io.File file = new java.io.File("src/config.properties");
                if (file.exists()) {
                    try (java.io.FileInputStream fis = new java.io.FileInputStream(file)) {
                        prop.load(fis);
                        apiKey = prop.getProperty("gemini.api.key", "");
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("[GeminiService] Failed to load config.properties: " + e.getMessage());
        }
    }

    public static boolean isKeyConfigured() {
        return apiKey != null && !apiKey.trim().isEmpty() && !apiKey.contains("<YOUR_GEMINI_API_KEY>");
    }

    public static String generateContent(String prompt) {
        if (!isKeyConfigured()) {
            System.out.println("[GeminiService] Gemini API Key not configured. Using mock database fallback.");
            return generateMockAnalysisForPrompt(prompt);
        }

        try {
            // Escape prompt for JSON body
            String jsonPayload = "{\"contents\":[{\"parts\":[{\"text\":\"" + escapeJson(prompt) + "\"}]}]}";
            
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(GEMINI_URL + apiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                return extractTextFromResponse(response.body());
            } else {
                System.err.println("[GeminiService] Server returned error: " + response.statusCode() + ". Body: " + response.body());
                return generateMockAnalysisForPrompt(prompt);
            }
        } catch (Exception e) {
            System.err.println("[GeminiService] Connection failed: " + e.getMessage() + ". Using mock fallback.");
            return generateMockAnalysisForPrompt(prompt);
        }
    }

    public static String generateContentWithImage(String prompt, String base64Image, String mimeType) {
        if (!isKeyConfigured()) {
            return generateMockAnalysisForPrompt(prompt);
        }

        try {
            String jsonPayload = "{"
                    + "\"contents\": [{"
                    + "  \"parts\": ["
                    + "    {\"text\": \"" + escapeJson(prompt) + "\"},"
                    + "    {\"inlineData\": {\"mimeType\": \"" + mimeType + "\", \"data\": \"" + base64Image + "\"}}"
                    + "  ]"
                    + "}]"
                    + "}";

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(GEMINI_URL + apiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                return extractTextFromResponse(response.body());
            } else {
                System.err.println("[GeminiService] Server returned error: " + response.statusCode() + ". Body: " + response.body());
                return generateMockAnalysisForPrompt(prompt);
            }
        } catch (Exception e) {
            System.err.println("[GeminiService] Connection failed: " + e.getMessage() + ". Using mock fallback.");
            return generateMockAnalysisForPrompt(prompt);
        }
    }

    private static String extractTextFromResponse(String json) {
        // Simple regex parsing of Gemini JSON structure: {"candidates":[{"content":{"parts":[{"text":"..."}]}}]}
        try {
            int textStart = json.indexOf("\"text\"");
            if (textStart == -1) return json;
            
            // Move cursor past "text": "
            int start = json.indexOf("\"", textStart + 6) + 1;
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
            System.err.println("[GeminiService] Failed to extract text: " + e.getMessage());
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

    private static String generateMockAnalysisForPrompt(String prompt) {
        String promptLower = prompt.toLowerCase();
        
        // 1. DBMS normalizations check
        if (promptLower.contains("dbms") || promptLower.contains("normalization") || promptLower.contains("sql")) {
            return "{\"summary\":\"1. Normalization is a database design technique that organizes tables to minimize redundancy.\n" +
                   "2. First Normal Form (1NF) requires atomic attributes and no repeating groups.\n" +
                   "3. Second Normal Form (2NF) removes partial dependencies on composite primary keys.\n" +
                   "4. Third Normal Form (3NF) eliminates transitive dependencies on non-key attributes.\n" +
                   "5. Boyce-Codd Normal Form (BCNF) is a stronger version where every determinant must be a super key.\"," +
                   "\"notes\":\"Database normalization is essential for maintaining data integrity and reducing anomalies (Insert, Update, Delete). Each stage of normalization (Normal Forms) introduces stricter structural criteria:\\n\\n" +
                   "**First Normal Form (1NF)**: A table is in 1NF if all attributes contain only atomic (indivisible) values. Multi-valued or composite columns must be split into separate rows/columns.\\n\\n" +
                   "**Second Normal Form (2NF)**: The table must be in 1NF and have no partial dependencies. This means no non-prime attribute should depend on a proper subset of any candidate key. This is only relevant for tables with composite keys.\\n\\n" +
                   "**Third Normal Form (3NF)**: The table must be in 2NF and have no transitive dependencies. A transitive dependency exists when a non-key column depends on another non-key column which then depends on the primary key.\\n\\n" +
                   "**BCNF**: For any functional dependency X -> Y, X must be a superkey.\"," +
                   "\"topics\":\"First Normal Form, Second Normal Form, Third Normal Form, Transitive Dependency, BCNF\"," +
                   "\"keywords\":\"Normalization, 1NF, 2NF, 3NF, BCNF, Functional Dependency, Anomaly, Database Key\"," +
                   "\"difficulty\":\"Medium\"," +
                   "\"study_time\":30," +
                   "\"flashcards\":[" +
                   "  {\"question\":\"What is BCNF?\", \"answer\":\"Boyce-Codd Normal Form, where for every FD X -> Y, X must be a super key.\"}," +
                   "  {\"question\":\"What is transitive dependency?\", \"answer\":\"A dependency where a non-prime attribute determines another non-prime attribute.\"}," +
                   "  {\"question\":\"What is partial dependency?\", \"answer\":\"A dependency where a non-prime attribute is determined by only a part of a composite primary key.\"}" +
                   "]," +
                   "\"mcqs\":[" +
                   "  {\"question\":\"Which normal form eliminates partial dependencies?\", \"option_a\":\"1NF\", \"option_b\":\"2NF\", \"option_c\":\"3NF\", \"option_d\":\"BCNF\", \"correct_answer\":\"B\"}," +
                   "  {\"question\":\"A table is in 3NF if it has no transitively dependent key attributes.\", \"option_a\":\"True\", \"option_b\":\"False\", \"option_c\":\"Depends on keys\", \"option_d\":\"None\", \"correct_answer\":\"A\"}" +
                   "]," +
                   "\"questions\":[" +
                   "  {\"question\":\"Why is BCNF stricter than 3NF?\", \"question_type\":\"Technical\", \"answer_outline\":\"BCNF does not allow non-prime attributes to determine prime attributes, which 3NF permits under certain conditions.\"}," +
                   "  {\"question\":\"Explain how normalization improves query performance.\", \"question_type\":\"Viva\", \"answer_outline\":\"It reduces table width and duplication, resulting in smaller records and faster scans, though it requires joins.\"}" +
                   "]}";
        }

        // 2. Default: General Data Structures study notes
        return "{\"summary\":\"1. Data Structures organize and store data efficiently for quick algorithmic access.\n" +
               "2. Arrays are contiguous blocks of memory offering O(1) random access but O(N) insertion times.\n" +
               "3. Linked Lists consist of nodes linked by pointers, offering O(1) dynamic insertions.\n" +
               "4. Stacks operate on a Last-In-First-Out (LIFO) protocol used in recursion call Stacks.\n" +
               "5. Queues operate on a First-In-First-Out (FIFO) protocol used in task schedulers.\"," +
               "\"notes\":\"Understanding basic structures like Arrays and Linked Lists forms the foundation of software architecture. Each structure has distinct time complexities for core search, insertion, and deletion algorithms:\\n\\n" +
               "**Arrays**: Stored in contiguous memory locations. Because the memory is consecutive, we can calculate the memory address of any element instantly using its index, giving constant O(1) read access. However, inserting or deleting elements requires shifting elements, resulting in linear O(N) complexity.\\n\\n" +
               "**Linked Lists**: Elements are stored dynamically anywhere in memory, with each node holding a value and a pointer reference to the next node. Navigating elements requires traversal (O(N) search), but inserting or deleting a node requires only pointer re-assignments, which takes O(1) time once the node is located.\"," +
               "\"topics\":\"Array Complexity, Linked List Pointers, LIFO Stack Stack, FIFO Queue schedulers\"," +
               "\"keywords\":\"Array, Linked List, Stack, Queue, LIFO, FIFO, Pointer, Time Complexity\"," +
               "\"difficulty\":\"Easy\"," +
               "\"study_time\":20," +
               "\"flashcards\":[" +
               "  {\"question\":\"What is the time complexity of searching a value in an unsorted Array?\", \"answer\":\"O(N) - Linear Time Complexity.\"}," +
               "  {\"question\":\"What is LIFO?\", \"answer\":\"Last-In-First-Out, the operational structure of Stacks.\"}," +
               "  {\"question\":\"What is FIFO?\", \"answer\":\"First-In-First-Out, the operational structure of Queues.\"}" +
               "]," +
               "\"mcqs\":[" +
               "  {\"question\":\"Which structure offers O(1) random access?\", \"option_a\":\"Linked List\", \"option_b\":\"Stack\", \"option_c\":\"Array\", \"option_d\":\"Tree\", \"correct_answer\":\"C\"}," +
               "  {\"question\":\"Linked Lists elements must be stored in contiguous memory locations.\", \"option_a\":\"True\", \"option_b\":\"False\", \"option_c\":\"Condition applies\", \"option_d\":\"None\", \"correct_answer\":\"B\"}" +
               "]," +
               "\"questions\":[" +
               "  {\"question\":\"Compare Array vs Linked List in terms of memory overhead.\", \"question_type\":\"Technical\", \"answer_outline\":\"Arrays have no pointer overhead, but have static sizing. Linked lists dynamically size but store reference pointers, adding memory overhead.\"}," +
               "  {\"question\":\"Explain the time complexity of pushing an element to a Stack.\", \"question_type\":\"Viva\", \"answer_outline\":\"Pushing takes O(1) constant time since we only insert at the top node.\"}" +
               "]}";
    }
}
