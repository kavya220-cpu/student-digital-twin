package src;

import java.util.Map;

public class ChatAssistant {

    public static String askQuestion(String docId, String userMessage, String historyContext) {
        // 1. Fetch document context
        Map<String, Object> analysis = DocumentRepository.getDocumentAnalysis(docId);
        String summary = (String) analysis.getOrDefault("summary", "");
        String notes = (String) analysis.getOrDefault("notes", "");
        String topics = (String) analysis.getOrDefault("topics", "");

        // 2. Build contextual prompt
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are an expert AI Study Assistant inside the NexusED learning platform.\n")
              .append("The student is asking a question about a study material they uploaded.\n\n")
              .append("=== Document Study Context ===\n")
              .append("Topics Covered: ").append(topics).append("\n")
              .append("Summary:\n").append(summary).append("\n")
              .append("Detailed Notes:\n").append(notes).append("\n")
              .append("==============================\n\n");

        if (historyContext != null && !historyContext.trim().isEmpty()) {
            prompt.append("=== Conversation History ===\n")
                  .append(historyContext).append("\n")
                  .append("============================\n\n");
        }

        prompt.append("Student's Query: \"").append(userMessage).append("\"\n\n")
              .append("Please respond as a professional tutor. Give clear, educational explanations, and provide real-world examples when helpful. Be concise but thorough.");

        // 3. Generate response via GeminiService
        return GeminiService.generateContent(prompt.toString());
    }
}
