package src;

import java.util.Map;

public class ChatAssistant {

    public static String askQuestion(String docId, String userMessage, String historyContext) {
        // 1. Fetch document context
        Map<String, Object> analysis = DocumentRepository.getDocumentAnalysis(docId);
        String summary = (String) analysis.getOrDefault("summary", "");
        String notes = (String) analysis.getOrDefault("notes", "");
        String topics = (String) analysis.getOrDefault("topics", "");
        String keywords = (String) analysis.getOrDefault("keywords", "");

        // Find filename
        String filename = "";
        try {
            java.util.List<Map<String, Object>> recentDocs = DocumentRepository.getRecentDocuments(1);
            for (Map<String, Object> doc : recentDocs) {
                if (docId.equals(doc.get("id"))) {
                    filename = (String) doc.get("filename");
                    break;
                }
            }
        } catch (Exception e) {
            System.err.println("[ChatAssistant] Error resolving filename for routing: " + e.getMessage());
        }

        // Smart routing check
        boolean referencesDoc = GroqService.referencesDocument(userMessage, filename, topics, keywords);

        // 2. Build system instruction prompt based on route
        String systemInstruction = "You are NexusAI,\nthe AI assistant for NexusED.\n\n"
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

        StringBuilder prompt = new StringBuilder();
        prompt.append(systemInstruction).append("\n\n");

        if (referencesDoc) {
            prompt.append("=== Document Study Context ===\n")
                  .append("Topics Covered: ").append(topics).append("\n")
                  .append("Summary:\n").append(summary).append("\n")
                  .append("Detailed Notes Outline:\n").append(notes).append("\n")
                  .append("==============================\n\n")
                  .append("Remember: The user's question is about this document. Use the context provided above to formulate your response.");
        } else {
            prompt.append("Ignore any uploaded document and answer using your own general knowledge. "
                  + "Do not reference any document context or write 'Based on the uploaded document'.");
        }

        if (historyContext != null && !historyContext.trim().isEmpty()) {
            prompt.append("\n\n=== Conversation History ===\n")
                  .append(historyContext).append("\n")
                  .append("============================\n\n");
        }

        prompt.append("Student's Query: \"").append(userMessage).append("\"\n\n");

        // 3. Generate response
        if (GroqService.isKeyConfigured()) {
            return GroqService.generateChatResponse(prompt.toString(), userMessage, "[]");
        } else {
            return GeminiService.generateContent(prompt.toString());
        }
    }
}
