package src;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class AnalysisService {

    public static boolean analyzeDocument(String docId, String filename, String contentText, String base64Image, String mimeType) {
        // 1. Build prompt instructions
        StringBuilder prompt = new StringBuilder();
        prompt.append("Analyze the following study material from document: ").append(filename).append("\n\n");
        if (contentText != null && !contentText.trim().isEmpty()) {
            prompt.append("Document Text Content:\n").append(contentText).append("\n\n");
        }
        prompt.append("You MUST analyze this content and return a JSON object with the following fields and structures EXACTLY:\n")
              .append("{\n")
              .append("  \"summary\": \"Short summary as exactly 5 numbered points.\",\n")
              .append("  \"notes\": \"Detailed study notes explaining all core topics in simple language.\",\n")
              .append("  \"topics\": \"Comma-separated list of major topics.\",\n")
              .append("  \"keywords\": \"Comma-separated list of technical keywords.\",\n")
              .append("  \"difficulty\": \"Easy, Medium, or Hard based on content.\",\n")
              .append("  \"study_time\": 45,\n") // numeric estimated study time in minutes
              .append("  \"flashcards\": [\n")
              .append("     {\"question\": \"Question text\", \"answer\": \"Answer text\"}\n")
              .append("  ],\n")
              .append("  \"mcqs\": [\n")
              .append("     {\"question\": \"Question text\", \"option_a\": \"A option\", \"option_b\": \"B option\", \"option_c\": \"C option\", \"option_d\": \"D option\", \"correct_answer\": \"A\"}\n")
              .append("  ],\n")
              .append("  \"questions\": [\n")
              .append("     {\"question\": \"Question text\", \"question_type\": \"Technical or HR or Viva\", \"answer_outline\": \"Brief response outline\"}\n")
              .append("  ]\n")
              .append("}\n\n")
              .append("Generate at least 3 flashcards, 5 MCQs (up to 20 if possible), and 4 questions. Return ONLY raw JSON. No markdown backticks.");

        // 2. Query Gemini
        String jsonResponse;
        if (base64Image != null && !base64Image.trim().isEmpty()) {
            jsonResponse = GeminiService.generateContentWithImage(prompt.toString(), base64Image, mimeType);
        } else {
            jsonResponse = GeminiService.generateContent(prompt.toString());
        }

        // Remove markdown backticks if present
        if (jsonResponse.contains("```json")) {
            int start = jsonResponse.indexOf("```json") + 7;
            int end = jsonResponse.lastIndexOf("```");
            if (end > start) {
                jsonResponse = jsonResponse.substring(start, end).trim();
            }
        } else if (jsonResponse.contains("```")) {
            int start = jsonResponse.indexOf("```") + 3;
            int end = jsonResponse.lastIndexOf("```");
            if (end > start) {
                jsonResponse = jsonResponse.substring(start, end).trim();
            }
        }

        // 3. Parse JSON response and save
        return parseAndSave(docId, jsonResponse);
    }

    private static boolean parseAndSave(String docId, String json) {
        try {
            // Extraction using regex for high robustness
            String summary = extractJsonStringField(json, "summary");
            String notes = extractJsonStringField(json, "notes");
            String topics = extractJsonStringField(json, "topics");
            String keywords = extractJsonStringField(json, "keywords");
            String difficulty = extractJsonStringField(json, "difficulty");
            if (difficulty.isEmpty()) difficulty = "Medium";
            
            int studyTime = 30;
            Pattern pTime = Pattern.compile("\"study_time\"\\s*:\\s*([0-9]+)");
            Matcher mTime = pTime.matcher(json);
            if (mTime.find()) {
                studyTime = Integer.parseInt(mTime.group(1));
            }

            // Save Base Analysis details
            DocumentRepository.saveAnalysis(docId, summary, notes, topics, keywords, difficulty, studyTime);

            // Parse & Save Flashcards
            List<Map<String, String>> flashcards = parseFlashcards(json);
            if (!flashcards.isEmpty()) {
                DocumentRepository.saveFlashcards(docId, flashcards);
            }

            // Parse & Save MCQs
            List<Map<String, String>> mcqs = parseMCQs(json);
            if (!mcqs.isEmpty()) {
                DocumentRepository.saveMCQs(docId, mcqs);
            }

            // Parse & Save Questions
            List<Map<String, String>> questions = parseQuestions(json);
            if (!questions.isEmpty()) {
                DocumentRepository.saveQuestions(docId, questions);
            }

            return true;
        } catch (Exception e) {
            System.err.println("[AnalysisService] Error parsing and saving analysis results: " + e.getMessage());
            return false;
        }
    }

    private static String extractJsonStringField(String json, String field) {
        Pattern pattern = Pattern.compile("\"" + field + "\"\\s*:\\s*\"([^\"]+)\"");
        Matcher m = pattern.matcher(json);
        if (m.find()) {
            return unescape(m.group(1));
        }
        
        // Fallback for multiline string matches
        Pattern multilinePattern = Pattern.compile("\"" + field + "\"\\s*:\\s*\"(.*?)\"(?:,|\\n|\\r|\\})", Pattern.DOTALL);
        Matcher mm = multilinePattern.matcher(json);
        if (mm.find()) {
            String val = mm.group(1);
            // strip surrounding quotes if present
            if (val.startsWith("\"")) val = val.substring(1);
            if (val.endsWith("\"")) val = val.substring(0, val.length() - 1);
            return unescape(val);
        }
        return "";
    }

    private static List<Map<String, String>> parseFlashcards(String json) {
        List<Map<String, String>> list = new ArrayList<>();
        try {
            int cardsIndex = json.indexOf("\"flashcards\"");
            if (cardsIndex == -1) return list;
            
            Pattern p = Pattern.compile("\\{\\s*\"question\"\\s*:\\s*\"([^\"]+)\"\\s*,\\s*\"answer\"\\s*:\\s*\"([^\"]+)\"\\s*\\}");
            Matcher m = p.matcher(json);
            m.region(cardsIndex, json.length());
            
            while (m.find()) {
                Map<String, String> card = new HashMap<>();
                card.put("question", unescape(m.group(1)));
                card.put("answer", unescape(m.group(2)));
                list.add(card);
            }
        } catch (Exception e) {
            System.err.println("[AnalysisService] Error parsing flashcards list: " + e.getMessage());
        }
        return list;
    }

    private static List<Map<String, String>> parseMCQs(String json) {
        List<Map<String, String>> list = new ArrayList<>();
        try {
            int mcqsIndex = json.indexOf("\"mcqs\"");
            if (mcqsIndex == -1) return list;

            Pattern p = Pattern.compile("\\{\\s*\"question\"\\s*:\\s*\"([^\"]+)\"\\s*,\\s*\"option_a\"\\s*:\\s*\"([^\"]+)\"\\s*,\\s*\"option_b\"\\s*:\\s*\"([^\"]+)\"\\s*,\\s*\"option_c\"\\s*:\\s*\"([^\"]+)\"\\s*,\\s*\"option_d\"\\s*:\\s*\"([^\"]+)\"\\s*,\\s*\"correct_answer\"\\s*:\\s*\"([^\"]+)\"\\s*\\}");
            Matcher m = p.matcher(json);
            m.region(mcqsIndex, json.length());

            while (m.find()) {
                Map<String, String> mcq = new HashMap<>();
                mcq.put("question", unescape(m.group(1)));
                mcq.put("option_a", unescape(m.group(2)));
                mcq.put("option_b", unescape(m.group(3)));
                mcq.put("option_c", unescape(m.group(4)));
                mcq.put("option_d", unescape(m.group(5)));
                mcq.put("correct_answer", unescape(m.group(6)));
                list.add(mcq);
            }
        } catch (Exception e) {
            System.err.println("[AnalysisService] Error parsing MCQs list: " + e.getMessage());
        }
        return list;
    }

    private static List<Map<String, String>> parseQuestions(String json) {
        List<Map<String, String>> list = new ArrayList<>();
        try {
            int qIndex = json.indexOf("\"questions\"");
            if (qIndex == -1) return list;

            Pattern p = Pattern.compile("\\{\\s*\"question\"\\s*:\\s*\"([^\"]+)\"\\s*,\\s*\"question_type\"\\s*:\\s*\"([^\"]+)\"\\s*,\\s*\"answer_outline\"\\s*:\\s*\"([^\"]+)\"\\s*\\}");
            Matcher m = p.matcher(json);
            m.region(qIndex, json.length());

            while (m.find()) {
                Map<String, String> q = new HashMap<>();
                q.put("question", unescape(m.group(1)));
                q.put("question_type", unescape(m.group(2)));
                q.put("answer_outline", unescape(m.group(3)));
                list.add(q);
            }
        } catch (Exception e) {
            System.err.println("[AnalysisService] Error parsing questions list: " + e.getMessage());
        }
        return list;
    }

    private static String unescape(String s) {
        if (s == null) return "";
        return s.replace("\\\\", "\\")
                .replace("\\\"", "\"")
                .replace("\\n", "\n")
                .replace("\\r", "\r")
                .replace("\\t", "\t");
    }
}
