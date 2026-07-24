package src;

import java.util.List;
import java.util.Map;

public class AIStudyAssistantTest {

    public static void main(String[] args) {
        System.out.println("========== NexusED AI Study Assistant Test Runner ==========");

        // 1. Initialize Tables
        System.out.println("\n[Test 1] Initializing Database Tables...");
        try {
            DocumentRepository.initializeTables();
            System.out.println("-> Success: Tables verified in MySQL instance.");
        } catch (Exception e) {
            System.err.println("-> Failed: Table initialization failed: " + e.getMessage());
            System.exit(1);
        }

        // 2. Verify API Key Configuration
        System.out.println("\n[Test 2] Verifying Gemini API Key...");
        boolean isConfigured = GeminiService.isKeyConfigured();
        System.out.println("-> Configured Status: " + isConfigured);

        // 3. Run Analysis Pipeline (Using Mock Fallback simulation)
        System.out.println("\n[Test 3] Simulating Document Analysis...");
        String testDocId = "doc_test_999";
        String filename = "DBMS_Normalization_Practice.docx";
        String sampleText = "Database normalization organizing schemas. 1NF atomic. 2NF partial dependencies. 3NF transitive dependencies. BCNF determinants.";

        try {
            boolean success = AnalysisService.analyzeDocument(testDocId, filename, sampleText, null, null);
            if (success) {
                System.out.println("-> Success: Document analyzed and results populated.");
            } else {
                System.err.println("-> Failed: Document analysis pipeline failed.");
                System.exit(1);
            }
        } catch (Exception e) {
            System.err.println("-> Failed: Exception in analysis pipeline: " + e.getMessage());
            System.exit(1);
        }

        // 4. Verify Repository Queries
        System.out.println("\n[Test 4] Verifying Data Retrieval from Database...");
        try {
            Map<String, Object> analysis = DocumentRepository.getDocumentAnalysis(testDocId);
            List<Map<String, String>> flashcards = DocumentRepository.getFlashcards(testDocId);
            List<Map<String, String>> mcqs = DocumentRepository.getMCQs(testDocId);
            List<Map<String, String>> questions = DocumentRepository.getQuestions(testDocId);

            System.out.println("-> Analysis Fields: " + (analysis != null && !analysis.isEmpty()));
            System.out.println("-> Flashcards Count: " + flashcards.size());
            System.out.println("-> MCQs Count: " + mcqs.size());
            System.out.println("-> Questions Count: " + questions.size());

            if (analysis == null || analysis.isEmpty() || flashcards.isEmpty() || mcqs.isEmpty() || questions.isEmpty()) {
                System.err.println("-> Failed: Some generated structures are empty or missing.");
                System.exit(1);
            }
            System.out.println("-> Success: All child tables queried successfully.");
        } catch (Exception e) {
            System.err.println("-> Failed: Data query failed: " + e.getMessage());
            System.exit(1);
        }

        // 5. Test Chatbot Query
        System.out.println("\n[Test 5] Testing Chat Assistant Tutoring...");
        try {
            String reply = ChatAssistant.askQuestion(testDocId, "Explain 3NF in simple terms.", "");
            System.out.println("-> User Query: Explain 3NF in simple terms.");
            System.out.println("-> AI Reply: " + reply.substring(0, Math.min(120, reply.length())) + "...");
            if (reply == null || reply.trim().isEmpty()) {
                System.err.println("-> Failed: Chat Assistant returned empty response.");
                System.exit(1);
            }
            System.out.println("-> Success: Tutoring query completed successfully.");
        } catch (Exception e) {
            System.err.println("-> Failed: Chat tutoring query failed: " + e.getMessage());
            System.exit(1);
        }

        System.out.println("\n============================================================");
        System.out.println("ALL TESTS PASSED SUCCESSFULLY! AI Study Assistant is ready.");
        System.out.println("============================================================");
    }
}
