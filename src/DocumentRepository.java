package src;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DocumentRepository {
    private static final List<Map<String, Object>> mockDocs = new ArrayList<>();
    private static final Map<String, Map<String, Object>> mockAnalysis = new HashMap<>();
    private static final Map<String, List<Map<String, String>>> mockFlashcards = new HashMap<>();
    private static final Map<String, List<Map<String, String>>> mockMCQs = new HashMap<>();
    private static final Map<String, List<Map<String, String>>> mockQuestions = new HashMap<>();

    static {
        // Seed mock data for fallback
        Map<String, Object> doc1 = new HashMap<>();
        doc1.put("id", "doc_seed_1");
        doc1.put("filename", "CNN_Notes.pdf");
        doc1.put("file_type", "application/pdf");
        doc1.put("file_size", 1024 * 1024 * 2); // 2 MB
        doc1.put("upload_time", "2026-07-24 10:00:00");
        doc1.put("bookmarked", true);
        mockDocs.add(doc1);

        Map<String, Object> analysis1 = new HashMap<>();
        analysis1.put("summary", "1. Convolutional Neural Networks (CNNs) are specialized neural networks for processing grid-structured data like images.\n2. Convolution layers extract local features using learnable kernels.\n3. Pooling layers (Max/Average pooling) reduce spatial dimensions and compute parameters.\n4. Fully Connected (FC) layers classify extracted features into final class labels.\n5. Backpropagation tunes kernel weights to minimize classification loss.");
        analysis1.put("notes", "Convolutional Neural Networks (CNNs) represent a milestone in Computer Vision. Instead of treating images as flat 1D vectors where spatial structures are lost, CNNs process them as 2D/3D matrices. A typical architecture consists of Convolutional layers, Pooling layers, and Fully Connected layers.\n\n**Convolution Layer**: This layer performs a mathematical convolution operation. It slides a small kernel (filter) across the image to generate a feature map. By using different kernels, the network detects edges, textures, and higher-level shapes.\n\n**Pooling Layer**: Pooling operations summarize regional activities. Max pooling selects the maximum value in a window. This introduces translation invariance, meaning the network can recognize features regardless of their exact pixel coordinates.\n\n**Fully Connected Layer**: After several convolution and pooling stages, the multi-dimensional feature maps are flattened and passed to dense layers. These layers compute high-level reasoning and assign class probabilities using activation functions like Softmax.");
        analysis1.put("topics", "Convolution Operation, Spatial Hierarchies, Translation Invariance, Overfitting Mitigation");
        analysis1.put("keywords", "CNN, Kernel, Pooling, Feature Map, Flattening, Activation Function, Softmax");
        analysis1.put("difficulty", "Medium");
        analysis1.put("study_time", 45); // 45 mins
        mockAnalysis.put("doc_seed_1", analysis1);

        List<Map<String, String>> fcList = new ArrayList<>();
        addMockFC(fcList, "What is the primary role of a convolution layer?", "To extract spatial features from input images using mathematical filters (kernels).");
        addMockFC(fcList, "Why is Max Pooling used?", "To reduce the dimensions of feature maps while retaining the most prominent features.");
        addMockFC(fcList, "What does flattening do?", "Converts 2D feature maps into a 1D vector to feed into fully connected layers.");
        mockFlashcards.put("doc_seed_1", fcList);

        List<Map<String, String>> mcqList = new ArrayList<>();
        addMockMCQ(mcqList, "Which layer introduces spatial feature mapping in CNNs?", "Pooling Layer", "Convolution Layer", "Fully Connected Layer", "Input Layer", "B");
        addMockMCQ(mcqList, "What is the main advantage of Max Pooling?", "Increase parameters", "Translate invariance & dimensionality reduction", "Linearize activations", "None of the above", "B");
        mockMCQs.put("doc_seed_1", mcqList);

        List<Map<String, String>> qList = new ArrayList<>();
        addMockQ(qList, "What is the vanishing gradient problem in deep CNNs, and how does ReLU help?", "Technical", "Vanishing gradient occurs when gradients shrink exponentially during backpropagation. ReLU helps by keeping a constant gradient of 1 for all positive inputs.");
        addMockQ(qList, "Why are you interested in computer vision architectures?", "HR", "Explain your passion for visual data analytics and its real-world impacts like medical imaging or autonomous driving.");
        addMockQ(qList, "Explain the mathematical difference between convolution and correlation.", "Viva", "Convolution involves flipping the kernel matrix before sliding, while cross-correlation slides the kernel directly without flipping.");
        mockQuestions.put("doc_seed_1", qList);
    }

    private static void addMockFC(List<Map<String, String>> list, String q, String a) {
        Map<String, String> m = new HashMap<>();
        m.put("question", q);
        m.put("answer", a);
        list.add(m);
    }

    private static void addMockMCQ(List<Map<String, String>> list, String q, String a, String b, String c, String d, String ans) {
        Map<String, String> m = new HashMap<>();
        m.put("question", q);
        m.put("option_a", a);
        m.put("option_b", b);
        m.put("option_c", c);
        m.put("option_d", d);
        m.put("correct_answer", ans);
        list.add(m);
    }

    private static void addMockQ(List<Map<String, String>> list, String q, String type, String outline) {
        Map<String, String> m = new HashMap<>();
        m.put("question", q);
        m.put("question_type", type);
        m.put("answer_outline", outline);
        list.add(m);
    }

    public static void initializeTables() {
        if (DatabaseManager.isFallbackActive()) return;

        String[] ddl = {
            "CREATE TABLE IF NOT EXISTS uploaded_documents (" +
            "    id VARCHAR(100) PRIMARY KEY," +
            "    user_id INT," +
            "    filename VARCHAR(255) NOT NULL," +
            "    file_type VARCHAR(50)," +
            "    file_size INT," +
            "    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
            "    bookmarked BOOLEAN DEFAULT FALSE," +
            "    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE" +
            ")",

            "CREATE TABLE IF NOT EXISTS document_analysis (" +
            "    document_id VARCHAR(100) PRIMARY KEY," +
            "    summary TEXT," +
            "    notes TEXT," +
            "    topics TEXT," +
            "    keywords TEXT," +
            "    difficulty VARCHAR(50)," +
            "    study_time INT," +
            "    FOREIGN KEY (document_id) REFERENCES uploaded_documents(id) ON DELETE CASCADE" +
            ")",

            "CREATE TABLE IF NOT EXISTS flashcards (" +
            "    id INT PRIMARY KEY AUTO_INCREMENT," +
            "    document_id VARCHAR(100)," +
            "    question TEXT NOT NULL," +
            "    answer TEXT NOT NULL," +
            "    FOREIGN KEY (document_id) REFERENCES uploaded_documents(id) ON DELETE CASCADE" +
            ")",

            "CREATE TABLE IF NOT EXISTS mcqs (" +
            "    id INT PRIMARY KEY AUTO_INCREMENT," +
            "    document_id VARCHAR(100)," +
            "    question TEXT NOT NULL," +
            "    option_a TEXT NOT NULL," +
            "    option_b TEXT NOT NULL," +
            "    option_c TEXT NOT NULL," +
            "    option_d TEXT NOT NULL," +
            "    correct_answer CHAR(1) NOT NULL," +
            "    FOREIGN KEY (document_id) REFERENCES uploaded_documents(id) ON DELETE CASCADE" +
            ")",

            "CREATE TABLE IF NOT EXISTS interview_questions (" +
            "    id INT PRIMARY KEY AUTO_INCREMENT," +
            "    document_id VARCHAR(100)," +
            "    question TEXT NOT NULL," +
            "    question_type VARCHAR(50)," +
            "    answer_outline TEXT," +
            "    FOREIGN KEY (document_id) REFERENCES uploaded_documents(id) ON DELETE CASCADE" +
            ")"
        };

        try (Connection conn = DatabaseManager.getConnection();
             Statement stmt = conn.createStatement()) {
            for (String sql : ddl) {
                stmt.execute(sql);
            }
        } catch (SQLException e) {
            System.err.println("[DocumentRepository] Fail-safe tables check: " + e.getMessage());
        }
    }

    public static void saveDocument(String id, int userId, String filename, String fileType, int fileSize) {
        if (DatabaseManager.isFallbackActive()) {
            Map<String, Object> doc = new HashMap<>();
            doc.put("id", id);
            doc.put("filename", filename);
            doc.put("file_type", fileType);
            doc.put("file_size", fileSize);
            doc.put("upload_time", new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date()));
            doc.put("bookmarked", false);
            mockDocs.add(doc);
            return;
        }

        initializeTables();
        String sql = "INSERT INTO uploaded_documents (id, user_id, filename, file_type, file_size) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, id);
            ps.setInt(2, userId);
            ps.setString(3, filename);
            ps.setString(4, fileType);
            ps.setInt(5, fileSize);
            ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[DocumentRepository] Error saving document metadata: " + e.getMessage());
        }
    }

    public static void saveAnalysis(String docId, String summary, String notes, String topics, String keywords, String difficulty, int studyTime) {
        if (DatabaseManager.isFallbackActive()) {
            Map<String, Object> a = new HashMap<>();
            a.put("summary", summary);
            a.put("notes", notes);
            a.put("topics", topics);
            a.put("keywords", keywords);
            a.put("difficulty", difficulty);
            a.put("study_time", studyTime);
            mockAnalysis.put(docId, a);
            return;
        }

        String sql = "INSERT INTO document_analysis (document_id, summary, notes, topics, keywords, difficulty, study_time) VALUES (?, ?, ?, ?, ?, ?, ?) " +
                     "ON DUPLICATE KEY UPDATE summary=?, notes=?, topics=?, keywords=?, difficulty=?, study_time=?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, docId);
            ps.setString(2, summary);
            ps.setString(3, notes);
            ps.setString(4, topics);
            ps.setString(5, keywords);
            ps.setString(6, difficulty);
            ps.setInt(7, studyTime);
            
            ps.setString(8, summary);
            ps.setString(9, notes);
            ps.setString(10, topics);
            ps.setString(11, keywords);
            ps.setString(12, difficulty);
            ps.setInt(13, studyTime);
            ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[DocumentRepository] Error saving analysis data: " + e.getMessage());
        }
    }

    public static void saveFlashcards(String docId, List<Map<String, String>> cards) {
        if (DatabaseManager.isFallbackActive()) {
            mockFlashcards.put(docId, cards);
            return;
        }

        // Delete existing flashcards for clean overwrite
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement del = conn.prepareStatement("DELETE FROM flashcards WHERE document_id = ?")) {
            del.setString(1, docId);
            del.executeUpdate();
        } catch (SQLException e) {
            // Ignore
        }

        String sql = "INSERT INTO flashcards (document_id, question, answer) VALUES (?, ?, ?)";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            for (Map<String, String> card : cards) {
                ps.setString(1, docId);
                ps.setString(2, card.getOrDefault("question", ""));
                ps.setString(3, card.getOrDefault("answer", ""));
                ps.addBatch();
            }
            ps.executeBatch();
        } catch (SQLException e) {
            System.err.println("[DocumentRepository] Error saving flashcards batch: " + e.getMessage());
        }
    }

    public static void saveMCQs(String docId, List<Map<String, String>> mcqs) {
        if (DatabaseManager.isFallbackActive()) {
            mockMCQs.put(docId, mcqs);
            return;
        }

        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement del = conn.prepareStatement("DELETE FROM mcqs WHERE document_id = ?")) {
            del.setString(1, docId);
            del.executeUpdate();
        } catch (SQLException e) {
            // Ignore
        }

        String sql = "INSERT INTO mcqs (document_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            for (Map<String, String> mcq : mcqs) {
                ps.setString(1, docId);
                ps.setString(2, mcq.getOrDefault("question", ""));
                ps.setString(3, mcq.getOrDefault("option_a", ""));
                ps.setString(4, mcq.getOrDefault("option_b", ""));
                ps.setString(5, mcq.getOrDefault("option_c", ""));
                ps.setString(6, mcq.getOrDefault("option_d", ""));
                ps.setString(7, mcq.getOrDefault("correct_answer", "A"));
                ps.addBatch();
            }
            ps.executeBatch();
        } catch (SQLException e) {
            System.err.println("[DocumentRepository] Error saving MCQs batch: " + e.getMessage());
        }
    }

    public static void saveQuestions(String docId, List<Map<String, String>> questions) {
        if (DatabaseManager.isFallbackActive()) {
            mockQuestions.put(docId, questions);
            return;
        }

        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement del = conn.prepareStatement("DELETE FROM interview_questions WHERE document_id = ?")) {
            del.setString(1, docId);
            del.executeUpdate();
        } catch (SQLException e) {
            // Ignore
        }

        String sql = "INSERT INTO interview_questions (document_id, question, question_type, answer_outline) VALUES (?, ?, ?, ?)";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            for (Map<String, String> q : questions) {
                ps.setString(1, docId);
                ps.setString(2, q.getOrDefault("question", ""));
                ps.setString(3, q.getOrDefault("question_type", "Technical"));
                ps.setString(4, q.getOrDefault("answer_outline", ""));
                ps.addBatch();
            }
            ps.executeBatch();
        } catch (SQLException e) {
            System.err.println("[DocumentRepository] Error saving interview questions batch: " + e.getMessage());
        }
    }

    public static List<Map<String, Object>> getRecentDocuments(int userId) {
        List<Map<String, Object>> list = new ArrayList<>();
        if (DatabaseManager.isFallbackActive()) {
            return mockDocs;
        }

        initializeTables();
        String sql = "SELECT * FROM uploaded_documents WHERE user_id = ? ORDER BY upload_time DESC";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", rs.getString("id"));
                    map.put("filename", rs.getString("filename"));
                    map.put("file_type", rs.getString("file_type"));
                    map.put("file_size", rs.getInt("file_size"));
                    map.put("upload_time", rs.getTimestamp("upload_time").toString());
                    map.put("bookmarked", rs.getBoolean("bookmarked"));
                    list.add(map);
                }
            }
        } catch (SQLException e) {
            System.err.println("[DocumentRepository] Error loading recent documents: " + e.getMessage());
        }
        return list;
    }

    public static Map<String, Object> getDocumentAnalysis(String docId) {
        Map<String, Object> map = new HashMap<>();
        if (DatabaseManager.isFallbackActive()) {
            return mockAnalysis.getOrDefault(docId, new HashMap<>());
        }

        String sql = "SELECT * FROM document_analysis WHERE document_id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, docId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    map.put("summary", rs.getString("summary"));
                    map.put("notes", rs.getString("notes"));
                    map.put("topics", rs.getString("topics"));
                    map.put("keywords", rs.getString("keywords"));
                    map.put("difficulty", rs.getString("difficulty"));
                    map.put("study_time", rs.getInt("study_time"));
                }
            }
        } catch (SQLException e) {
            System.err.println("[DocumentRepository] Error loading document analysis: " + e.getMessage());
        }
        return map;
    }

    public static List<Map<String, String>> getFlashcards(String docId) {
        List<Map<String, String>> list = new ArrayList<>();
        if (DatabaseManager.isFallbackActive()) {
            return mockFlashcards.getOrDefault(docId, new ArrayList<>());
        }

        String sql = "SELECT * FROM flashcards WHERE document_id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, docId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, String> m = new HashMap<>();
                    m.put("question", rs.getString("question"));
                    m.put("answer", rs.getString("answer"));
                    list.add(m);
                }
            }
        } catch (SQLException e) {
            System.err.println("[DocumentRepository] Error loading flashcards: " + e.getMessage());
        }
        return list;
    }

    public static List<Map<String, String>> getMCQs(String docId) {
        List<Map<String, String>> list = new ArrayList<>();
        if (DatabaseManager.isFallbackActive()) {
            return mockMCQs.getOrDefault(docId, new ArrayList<>());
        }

        String sql = "SELECT * FROM mcqs WHERE document_id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, docId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, String> m = new HashMap<>();
                    m.put("question", rs.getString("question"));
                    m.put("option_a", rs.getString("option_a"));
                    m.put("option_b", rs.getString("option_b"));
                    m.put("option_c", rs.getString("option_c"));
                    m.put("option_d", rs.getString("option_d"));
                    m.put("correct_answer", rs.getString("correct_answer"));
                    list.add(m);
                }
            }
        } catch (SQLException e) {
            System.err.println("[DocumentRepository] Error loading MCQs: " + e.getMessage());
        }
        return list;
    }

    public static List<Map<String, String>> getQuestions(String docId) {
        List<Map<String, String>> list = new ArrayList<>();
        if (DatabaseManager.isFallbackActive()) {
            return mockQuestions.getOrDefault(docId, new ArrayList<>());
        }

        String sql = "SELECT * FROM interview_questions WHERE document_id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, docId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, String> m = new HashMap<>();
                    m.put("question", rs.getString("question"));
                    m.put("question_type", rs.getString("question_type"));
                    m.put("answer_outline", rs.getString("answer_outline"));
                    list.add(m);
                }
            }
        } catch (SQLException e) {
            System.err.println("[DocumentRepository] Error loading questions: " + e.getMessage());
        }
        return list;
    }

    public static void bookmarkDocument(String docId, boolean bookmark) {
        if (DatabaseManager.isFallbackActive()) {
            for (Map<String, Object> doc : mockDocs) {
                if (docId.equals(doc.get("id"))) {
                    doc.put("bookmarked", bookmark);
                    break;
                }
            }
            return;
        }

        String sql = "UPDATE uploaded_documents SET bookmarked = ? WHERE id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setBoolean(1, bookmark);
            ps.setString(2, docId);
            ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[DocumentRepository] Error updating bookmark status: " + e.getMessage());
        }
    }

    public static boolean isBookmarked(String docId) {
        if (DatabaseManager.isFallbackActive()) {
            for (Map<String, Object> doc : mockDocs) {
                if (docId.equals(doc.get("id"))) {
                    return (Boolean) doc.get("bookmarked");
                }
            }
            return false;
        }

        String sql = "SELECT bookmarked FROM uploaded_documents WHERE id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, docId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getBoolean("bookmarked");
                }
            }
        } catch (SQLException e) {
            System.err.println("[DocumentRepository] Error checking bookmark status: " + e.getMessage());
        }
        return false;
    }
}
