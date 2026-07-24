package src;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@WebServlet({"/api/study/upload", "/api/study/recent", "/api/study/analysis", "/api/study/bookmark", "/api/study/chat", "/api/study/download"})
@MultipartConfig(maxFileSize = 1024 * 1024 * 25) // 25 MB max limit
public class DocumentUploadServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getServletPath();
        resp.setCharacterEncoding("UTF-8");

        if ("/api/study/recent".equals(path)) {
            // Fetch recent uploads (hardcode userId = 1 for current user session)
            List<Map<String, Object>> list = DocumentRepository.getRecentDocuments(1);
            writeJson(resp, toJson(list));
        } 
        else if ("/api/study/analysis".equals(path)) {
            String docId = req.getParameter("id");
            if (docId == null || docId.trim().isEmpty()) {
                sendError(resp, 400, "Missing document id.");
                return;
            }

            Map<String, Object> analysis = DocumentRepository.getDocumentAnalysis(docId);
            if (analysis.isEmpty()) {
                sendError(resp, 404, "Analysis not found for this document.");
                return;
            }

            List<Map<String, String>> flashcards = DocumentRepository.getFlashcards(docId);
            List<Map<String, String>> mcqs = DocumentRepository.getMCQs(docId);
            List<Map<String, String>> questions = DocumentRepository.getQuestions(docId);

            // Assemble a master JSON payload
            StringBuilder sb = new StringBuilder();
            sb.append("{")
              .append("\"id\":\"").append(docId).append("\",")
              .append("\"summary\":\"").append(escapeJson(analysis.getOrDefault("summary", "").toString())).append("\",")
              .append("\"notes\":\"").append(escapeJson(analysis.getOrDefault("notes", "").toString())).append("\",")
              .append("\"topics\":\"").append(escapeJson(analysis.getOrDefault("topics", "").toString())).append("\",")
              .append("\"keywords\":\"").append(escapeJson(analysis.getOrDefault("keywords", "").toString())).append("\",")
              .append("\"difficulty\":\"").append(escapeJson(analysis.getOrDefault("difficulty", "").toString())).append("\",")
              .append("\"study_time\":").append(analysis.getOrDefault("study_time", 30)).append(",")
              .append("\"flashcards\":").append(listMapToJson(flashcards)).append(",")
              .append("\"mcqs\":").append(listMapToJson(mcqs)).append(",")
              .append("\"questions\":").append(listMapToJson(questions))
              .append("}");

            writeJson(resp, sb.toString());
        } 
        else if ("/api/study/download".equals(path)) {
            String docId = req.getParameter("id");
            String type = req.getParameter("type"); // "notes", "mcqs", "flashcards"
            if (docId == null || type == null) {
                sendError(resp, 400, "Missing query parameters.");
                return;
            }

            Map<String, Object> analysis = DocumentRepository.getDocumentAnalysis(docId);
            if (analysis.isEmpty()) {
                sendError(resp, 404, "Document data not found.");
                return;
            }

            resp.setContentType("text/plain");
            resp.setHeader("Content-Disposition", "attachment; filename=" + type + "_" + docId + ".txt");
            PrintWriter out = resp.getWriter();

            if ("notes".equalsIgnoreCase(type)) {
                out.println("========== CORE TOPICS & SUMMARY ==========");
                out.println(analysis.getOrDefault("summary", ""));
                out.println("\n========== DETAILED STUDY NOTES ==========");
                out.println(analysis.getOrDefault("notes", ""));
            } 
            else if ("mcqs".equalsIgnoreCase(type)) {
                out.println("========== 20 MULTIPLE CHOICE QUESTIONS (MCQs) ==========");
                List<Map<String, String>> mcqs = DocumentRepository.getMCQs(docId);
                for (int i = 0; i < mcqs.size(); i++) {
                    Map<String, String> m = mcqs.get(i);
                    out.println((i + 1) + ". " + m.get("question"));
                    out.println("   A) " + m.get("option_a"));
                    out.println("   B) " + m.get("option_b"));
                    out.println("   C) " + m.get("option_c"));
                    out.println("   D) " + m.get("option_d"));
                    out.println("   Correct Answer: " + m.get("correct_answer") + "\n");
                }
            } 
            else if ("flashcards".equalsIgnoreCase(type)) {
                out.println("========== INTERACTIVE FLASHCARDS ==========");
                List<Map<String, String>> flashcards = DocumentRepository.getFlashcards(docId);
                for (int i = 0; i < flashcards.size(); i++) {
                    Map<String, String> f = flashcards.get(i);
                    out.println("Flashcard " + (i + 1));
                    out.println("Question: " + f.get("question"));
                    out.println("Answer:   " + f.get("answer") + "\n---------------------------------------------\n");
                }
            }
            out.flush();
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getServletPath();
        resp.setCharacterEncoding("UTF-8");

        if ("/api/study/upload".equals(path)) {
            try {
                Part filePart = req.getPart("file");
                if (filePart == null) {
                    sendError(resp, 400, "No file uploaded.");
                    return;
                }

                String filename = getFilename(filePart);
                String fileType = filePart.getContentType();
                int fileSize = (int) filePart.getSize();

                // Validate Size limit (25 MB)
                if (fileSize > 1024 * 1024 * 25) {
                    sendError(resp, 400, "File sizes must be under 25 MB.");
                    return;
                }

                // Process upload content
                String base64Image = null;
                String extractedText = "";

                if (fileType != null && fileType.startsWith("image/")) {
                    try (InputStream is = filePart.getInputStream()) {
                        byte[] bytes = is.readAllBytes();
                        base64Image = Base64.getEncoder().encodeToString(bytes);
                    }
                } else {
                    // Try basic text stream read for text formats
                    try (InputStream is = filePart.getInputStream()) {
                        byte[] bytes = is.readAllBytes();
                        extractedText = new String(bytes, StandardCharsets.UTF_8);
                        // Clean non-readable ASCII if file is binary (PDF/DOCX)
                        if (extractedText.length() > 5000) {
                            extractedText = extractedText.substring(0, 5000);
                        }
                    }
                }

                // Create ID and save metadata
                String docId = "doc_" + UUID.randomUUID().toString().substring(0, 8);
                DocumentRepository.saveDocument(docId, 1, filename, fileType, fileSize);

                // Run analysis orchestrator (asynchronously or synchronously)
                boolean success = AnalysisService.analyzeDocument(docId, filename, extractedText, base64Image, fileType);
                if (success) {
                    writeJson(resp, "{\"status\":\"success\",\"documentId\":\"" + docId + "\"}");
                } else {
                    sendError(resp, 500, "Failed to analyze study materials.");
                }
            } catch (Exception e) {
                sendError(resp, 500, "Upload processing failed: " + e.getMessage());
            }
        } 
        else if ("/api/study/bookmark".equals(path)) {
            String docId = req.getParameter("id");
            String state = req.getParameter("state");
            if (docId == null || state == null) {
                sendError(resp, 400, "Missing parameters.");
                return;
            }

            boolean bookmark = Boolean.parseBoolean(state);
            DocumentRepository.bookmarkDocument(docId, bookmark);
            writeJson(resp, "{\"status\":\"success\",\"bookmarked\":" + bookmark + "}");
        } 
        else if ("/api/study/chat".equals(path)) {
            try {
                // Parse simple application/x-www-form-urlencoded
                String docId = req.getParameter("id");
                String message = req.getParameter("message");
                String history = req.getParameter("history"); // previous questions/responses context

                if (docId == null || message == null) {
                    sendError(resp, 400, "Missing document context or chat query.");
                    return;
                }

                String reply = ChatAssistant.askQuestion(docId, message, history);
                writeJson(resp, "{\"status\":\"success\",\"reply\":\"" + escapeJson(reply) + "\"}");
            } catch (Exception e) {
                sendError(resp, 500, "Chat Assistant error: " + e.getMessage());
            }
        }
    }

    private String getFilename(Part part) {
        for (String cd : part.getHeader("content-disposition").split(";")) {
            if (cd.trim().startsWith("filename")) {
                return cd.substring(cd.indexOf('=') + 1).trim().replace("\"", "");
            }
        }
        return "unknown_file";
    }

    private void writeJson(HttpServletResponse resp, String json) throws IOException {
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();
        out.print(json);
        out.flush();
    }

    private void sendError(HttpServletResponse resp, int status, String msg) throws IOException {
        resp.setStatus(status);
        writeJson(resp, "{\"status\":\"error\",\"message\":\"" + escapeJson(msg) + "\"}");
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\b", "\\b")
                .replace("\f", "\\f")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    private String toJson(List<Map<String, Object>> list) {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < list.size(); i++) {
            Map<String, Object> map = list.get(i);
            sb.append("{");
            int j = 0;
            for (Map.Entry<String, Object> entry : map.entrySet()) {
                sb.append("\"").append(entry.getKey()).append("\":");
                if (entry.getValue() instanceof Boolean || entry.getValue() instanceof Number) {
                    sb.append(entry.getValue());
                } else {
                    sb.append("\"").append(escapeJson(entry.getValue().toString())).append("\"");
                }
                if (++j < map.size()) sb.append(",");
            }
            sb.append("}");
            if (i < list.size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }

    private String listMapToJson(List<Map<String, String>> list) {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < list.size(); i++) {
            Map<String, String> map = list.get(i);
            sb.append("{");
            int j = 0;
            for (Map.Entry<String, String> entry : map.entrySet()) {
                sb.append("\"").append(entry.getKey()).append("\":\"").append(escapeJson(entry.getValue())).append("\"");
                if (++j < map.size()) sb.append(",");
            }
            sb.append("}");
            if (i < list.size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }
}
