package src;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DatabaseManager {
    private static final String URL = "jdbc:mysql://localhost:3306/nexused_new_db?useSSL=false&allowPublicKeyRetrieval=true";
    private static final String USER = "root";
    private static final String PASSWORD = "password";
    private static boolean useFallback = false;

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("[DatabaseManager] MySQL JDBC Driver not found. Falling back to in-memory mock data.");
            useFallback = true;
        }
    }

    public static Connection getConnection() throws SQLException {
        if (useFallback) {
            throw new SQLException("Fallback mode active. MySQL server not connected.");
        }
        try {
            return DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (SQLException e) {
            System.err.println("[DatabaseManager] Connection to MySQL failed. Entering in-memory fallback: " + e.getMessage());
            useFallback = true;
            throw e;
        }
    }

    public static boolean isFallbackActive() {
        return useFallback;
    }

    public static void setFallbackActive(boolean active) {
        useFallback = active;
    }

    // --- Student Profile Queries ---
    public static Map<String, Object> getStudentProfile(int userId) {
        Map<String, Object> profile = new HashMap<>();
        if (useFallback) {
            profile.put("name", "Kavya");
            profile.put("email", "kavya@nexused.edu");
            profile.put("cgpa", 8.42);
            profile.put("selected_career", "AI Engineer");
            profile.put("attendance", 88.5);
            return profile;
        }

        String sql = "SELECT * FROM student_profile WHERE user_id = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    profile.put("name", rs.getString("name"));
                    profile.put("email", rs.getString("email"));
                    profile.put("cgpa", rs.getDouble("cgpa"));
                    profile.put("selected_career", rs.getString("selected_career"));
                    profile.put("attendance", rs.getDouble("attendance"));
                }
            }
        } catch (SQLException e) {
            System.err.println("Error fetching profile: " + e.getMessage());
        }
        return profile;
    }

    // --- SGPA History Queries ---
    public static List<Map<String, Object>> getSemesterSGPA(int userId) {
        List<Map<String, Object>> marks = new ArrayList<>();
        if (useFallback) {
            marks.add(createMarkMap(1, 8.20));
            marks.add(createMarkMap(2, 8.55));
            marks.add(createMarkMap(3, 8.10));
            marks.add(createMarkMap(4, 8.80));
            return marks;
        }

        String sql = "SELECT semester, sgpa FROM semester_marks WHERE user_id = ? ORDER BY semester";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    marks.add(createMarkMap(rs.getInt("semester"), rs.getDouble("sgpa")));
                }
            }
        } catch (SQLException e) {
            System.err.println("Error fetching marks: " + e.getMessage());
        }
        return marks;
    }

    private static Map<String, Object> createMarkMap(int sem, double sgpa) {
        Map<String, Object> m = new HashMap<>();
        m.put("semester", sem);
        m.put("sgpa", sgpa);
        return m;
    }

    // --- Skills Queries ---
    public static List<Map<String, Object>> getSkills(int userId) {
        List<Map<String, Object>> list = new ArrayList<>();
        if (useFallback) {
            list.add(createSkillMap("Java", "Expert"));
            list.add(createSkillMap("Python", "Intermediate"));
            list.add(createSkillMap("DBMS", "Intermediate"));
            list.add(createSkillMap("Machine Learning", "Beginner"));
            return list;
        }

        String sql = "SELECT skill_name, level FROM skills WHERE user_id = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(createSkillMap(rs.getString("skill_name"), rs.getString("level")));
                }
            }
        } catch (SQLException e) {
            System.err.println("Error fetching skills: " + e.getMessage());
        }
        return list;
    }

    private static Map<String, Object> createSkillMap(String name, String level) {
        Map<String, Object> s = new HashMap<>();
        s.put("name", name);
        s.put("level", level);
        return s;
    }

    // --- Roadmap Queries ---
    public static List<Map<String, Object>> getRoadmapSkills(int userId) {
        List<Map<String, Object>> list = new ArrayList<>();
        if (useFallback) {
            list.add(createRoadmapMap("Java Core Programming", "Completed", 1));
            list.add(createRoadmapMap("SQL & DBMS Foundations", "Completed", 2));
            list.add(createRoadmapMap("Python & ML basics", "Ongoing", 3));
            list.add(createRoadmapMap("Deep Learning Frameworks", "Planned", 4));
            list.add(createRoadmapMap("Cloud Deployment Architecture", "Planned", 5));
            return list;
        }

        String sql = "SELECT skill_name, status, seq_no FROM roadmap_skills WHERE user_id = ? ORDER BY seq_no";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(createRoadmapMap(rs.getString("skill_name"), rs.getString("status"), rs.getInt("seq_no")));
                }
            }
        } catch (SQLException e) {
            System.err.println("Error fetching roadmap: " + e.getMessage());
        }
        return list;
    }

    private static Map<String, Object> createRoadmapMap(String name, String status, int seq) {
        Map<String, Object> r = new HashMap<>();
        r.put("name", name);
        r.put("status", status);
        r.put("seq", seq);
        return r;
    }

    // --- Projects Queries ---
    public static List<Map<String, Object>> getProjects(int userId) {
        List<Map<String, Object>> list = new ArrayList<>();
        if (useFallback) {
            list.add(createProjectMap("NexusED Twin Platform", "Digital twin career simulator", "Ongoing", "github.com/kavya/nexus-twin"));
            list.add(createProjectMap("Voice Assistant Pipeline", "Audio parsing engine", "Completed", "github.com/kavya/voice-nlp"));
            return list;
        }

        String sql = "SELECT title, description, status, github_url FROM projects WHERE user_id = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(createProjectMap(
                        rs.getString("title"),
                        rs.getString("description"),
                        rs.getString("status"),
                        rs.getString("github_url")
                    ));
                }
            }
        } catch (SQLException e) {
            System.err.println("Error fetching projects: " + e.getMessage());
        }
        return list;
    }

    private static Map<String, Object> createProjectMap(String title, String desc, String status, String gh) {
        Map<String, Object> p = new HashMap<>();
        p.put("title", title);
        p.put("desc", desc);
        p.put("status", status);
        p.put("github", gh);
        return p;
    }

    // --- Certifications Queries ---
    public static List<Map<String, Object>> getCertifications(int userId) {
        List<Map<String, Object>> list = new ArrayList<>();
        if (useFallback) {
            list.add(createCertMap("Oracle Certified Professional: Java SE 17", "Oracle", "OCP-99238", "2026-03-12"));
            list.add(createCertMap("AWS Cloud Practitioner", "Amazon Web Services", "AWS-99120", "2026-06-05"));
            return list;
        }

        String sql = "SELECT title, authority, license_number, date_obtained FROM certifications WHERE user_id = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(createCertMap(
                        rs.getString("title"),
                        rs.getString("authority"),
                        rs.getString("license_number"),
                        rs.getString("date_obtained")
                    ));
                }
            }
        } catch (SQLException e) {
            System.err.println("Error fetching certs: " + e.getMessage());
        }
        return list;
    }

    private static Map<String, Object> createCertMap(String title, String authority, String lic, String date) {
        Map<String, Object> c = new HashMap<>();
        c.put("title", title);
        c.put("authority", authority);
        c.put("license", lic);
        c.put("date", date);
        return c;
    }

    // --- Resume Queries ---
    public static Map<String, Object> getResumes(int userId) {
        Map<String, Object> resume = new HashMap<>();
        if (useFallback) {
            resume.put("score", 82);
            resume.put("ats_score", 78);
            resume.put("completion", 90);
            return resume;
        }

        String sql = "SELECT resume_score, ats_score, completion_rate FROM resumes WHERE user_id = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    resume.put("score", rs.getInt("resume_score"));
                    resume.put("ats_score", rs.getInt("ats_score"));
                    resume.put("completion", rs.getInt("completion_rate"));
                }
            }
        } catch (SQLException e) {
            System.err.println("Error fetching resume: " + e.getMessage());
        }
        return resume;
    }

    // --- Interview Results Queries ---
    public static Map<String, Object> getInterviewResults(int userId) {
        Map<String, Object> results = new HashMap<>();
        if (useFallback) {
            results.put("overall", 81);
            results.put("tech", 85);
            results.put("comm", 78);
            results.put("conf", 80);
            results.put("facial", 82);
            return results;
        }

        String sql = "SELECT overall_score, tech_score, comm_score, conf_score, facial_score FROM interview_results WHERE user_id = ? ORDER BY id DESC LIMIT 1";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    results.put("overall", rs.getInt("overall_score"));
                    results.put("tech", rs.getInt("tech_score"));
                    results.put("comm", rs.getInt("comm_score"));
                    results.put("conf", rs.getInt("conf_score"));
                    results.put("facial", rs.getInt("facial_score"));
                }
            }
        } catch (SQLException e) {
            System.err.println("Error fetching interview: " + e.getMessage());
        }
        return results;
    }

    // --- Coding Progress Queries ---
    public static Map<String, Object> getCodingProgress(int userId) {
        Map<String, Object> cp = new HashMap<>();
        if (useFallback) {
            cp.put("total", 45);
            cp.put("easy", 20);
            cp.put("medium", 20);
            cp.put("hard", 5);
            cp.put("streak", 5);
            cp.put("fav_topic", "Arrays");
            return cp;
        }

        String sql = "SELECT * FROM coding_progress WHERE user_id = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    cp.put("total", rs.getInt("total_solved"));
                    cp.put("easy", rs.getInt("easy_solved"));
                    cp.put("medium", rs.getInt("medium_solved"));
                    cp.put("hard", rs.getInt("hard_solved"));
                    cp.put("streak", rs.getInt("streak"));
                    cp.put("fav_topic", rs.getString("favorite_topic"));
                }
            }
        } catch (SQLException e) {
            System.err.println("Error fetching coding progress: " + e.getMessage());
        }
        return cp;
    }

    // --- Recommendations Queries ---
    public static List<Map<String, Object>> getRecommendations(int userId) {
        List<Map<String, Object>> list = new ArrayList<>();
        if (useFallback) {
            list.add(createRecMap(1, "Elevate Python and ML skills parameters from Beginner to Intermediate.", "Medium", "Pending", "Skills"));
            list.add(createRecMap(2, "Complete at least 55 additional coding questions in the Coding Tracker.", "High", "Pending", "Coding"));
            return list;
        }

        String sql = "SELECT id, text, priority, status, category FROM recommendations WHERE user_id = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(createRecMap(
                        rs.getInt("id"),
                        rs.getString("text"),
                        rs.getString("priority"),
                        rs.getString("status"),
                        rs.getString("category")
                    ));
                }
            }
        } catch (SQLException e) {
            System.err.println("Error fetching recommendations: " + e.getMessage());
        }
        return list;
    }

    private static Map<String, Object> createRecMap(int id, String text, String prio, String status, String cat) {
        Map<String, Object> r = new HashMap<>();
        r.put("id", id);
        r.put("text", text);
        r.put("priority", prio);
        r.put("status", status);
        r.put("category", cat);
        return r;
    }

    // --- Daily Goals Queries ---
    public static List<Map<String, Object>> getDailyGoals(int userId, String date) {
        List<Map<String, Object>> list = new ArrayList<>();
        if (useFallback) {
            list.add(createGoalMap(1, "Solve 2 DSA questions in Coding Tracker", true));
            list.add(createGoalMap(2, "Update Voice Assistant project details in Projects", false));
            list.add(createGoalMap(3, "Run an AI Mock Interview trial", false));
            return list;
        }

        String sql = "SELECT id, text, is_completed FROM daily_goals WHERE user_id = ? AND date_assigned = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ps.setString(2, date);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(createGoalMap(
                        rs.getInt("id"),
                        rs.getString("text"),
                        rs.getBoolean("is_completed")
                    ));
                }
            }
        } catch (SQLException e) {
            System.err.println("Error fetching goals: " + e.getMessage());
        }
        return list;
    }

    private static Map<String, Object> createGoalMap(int id, String text, boolean comp) {
        Map<String, Object> g = new HashMap<>();
        g.put("id", id);
        g.put("text", text);
        g.put("completed", comp);
        return g;
    }

    public static void updateDailyGoalStatus(int goalId, boolean isCompleted) {
        if (useFallback) {
            return;
        }

        String sql = "UPDATE daily_goals SET is_completed = ? WHERE id = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setBoolean(1, isCompleted);
            ps.setInt(2, goalId);
            ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("Error updating goal status: " + e.getMessage());
        }
    }

    // --- Achievements Queries ---
    public static List<Map<String, Object>> getAchievements(int userId) {
        List<Map<String, Object>> list = new ArrayList<>();
        if (useFallback) {
            list.add(createAchievementMap("First Login", "🏅", "Academic", "Successfully logged into NexusED.", 10, "2026-07-24", "Unlocked"));
            list.add(createAchievementMap("Coding Explorer", "💻", "Coding", "Solved your first coding problem.", 15, "2026-07-24", "Unlocked"));
            list.add(createAchievementMap("Resume Ready", "📄", "Resume", "Generated your first professional resume.", 50, "2026-07-25", "Unlocked"));
            list.add(createAchievementMap("Interview Beginner", "🎤", "Interview", "Completed your first mock interview.", 60, "2026-07-25", "Unlocked"));
            list.add(createAchievementMap("Java Master", "🏆", "Academic", "Reached Advanced level in Java.", 100, null, "Locked"));
            list.add(createAchievementMap("Cloud Explorer", "☁", "Certificates", "Completed Google Cloud Certification.", 150, null, "Locked"));
            list.add(createAchievementMap("AI Learner", "🚀", "Roadmap", "Completed AI Engineer Roadmap Milestone.", 80, null, "Locked"));
            list.add(createAchievementMap("Placement Ready", "🎯", "Career", "Career Readiness Index reached Industry Ready.", 200, null, "Locked"));
            return list;
        }

        String sql = "SELECT * FROM achievements WHERE user_id = ? ORDER BY status DESC, achievement_id ASC";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> a = new HashMap<>();
                    a.put("id", rs.getInt("achievement_id"));
                    a.put("badge_name", rs.getString("badge_name"));
                    a.put("badge_icon", rs.getString("badge_icon"));
                    a.put("category", rs.getString("category"));
                    a.put("description", rs.getString("description"));
                    a.put("xp", rs.getInt("xp"));
                    a.put("earned_date", rs.getString("earned_date"));
                    a.put("status", rs.getString("status"));
                    list.add(a);
                }
            }
        } catch (SQLException e) {
            System.err.println("Error fetching achievements: " + e.getMessage());
        }
        return list;
    }

    private static Map<String, Object> createAchievementMap(String name, String icon, String cat, String desc, int xp, String date, String status) {
        Map<String, Object> a = new HashMap<>();
        a.put("badge_name", name);
        a.put("badge_icon", icon);
        a.put("category", cat);
        a.put("description", desc);
        a.put("xp", xp);
        a.put("earned_date", date);
        a.put("status", status);
        return a;
    }

    // --- Growth Timeline Queries ---
    public static List<Map<String, Object>> getGrowthTimeline(int userId) {
        List<Map<String, Object>> list = new ArrayList<>();
        if (useFallback) {
            list.add(createTimelineMap("Joined NexusED", "Initialized twin profile mapping parameters.", "Achievements", "2026-07-24", "Dashboard", 10));
            list.add(createTimelineMap("Created Student Profile", "Completed basic profile twin setup metrics.", "Academic", "2026-07-24", "Profile", 20));
            list.add(createTimelineMap("Selected Career Goal", "Set professional target to AI Engineer.", "Career", "2026-07-24", "Roadmap", 30));
            list.add(createTimelineMap("Completed Java Basics", "Finished syntax and inheritance fundamentals.", "Skills", "2026-07-24", "Skill Tracker", 45));
            list.add(createTimelineMap("Learned SQL", "Gained basic understanding of database relations.", "Skills", "2026-07-24", "Skill Tracker", 55));
            list.add(createTimelineMap("Completed Google Cloud Certificate", "Obtained verified GCP Foundational badge.", "Certificates", "2026-07-25", "Certificates", 65));
            list.add(createTimelineMap("Built Smart Complaint Project", "Deployed intelligent classifier solution with Github sync.", "Projects", "2026-07-25", "Projects", 75));
            list.add(createTimelineMap("Completed Mock Interview", "Passed initial Technical Screening session successfully.", "Interview", "2026-07-25", "AI Mock Interview", 80));
            list.add(createTimelineMap("Resume ATS Score Improved to 86%", "Enhanced resume keywords optimization.", "Resume", "2026-07-25", "Resume Analyzer", 85));
            list.add(createTimelineMap("Solved 100 Coding Problems", "Milestone completed in Coding Tracker.", "Coding", "2026-07-26", "Coding Tracker", 90));
            list.add(createTimelineMap("Career Readiness reached 78%", "Graduated to placement readiness stage.", "Career", "2026-07-26", "Career Readiness", 95));
            list.add(createTimelineMap("Industry Ready", "Unlocked peak technical alignment metrics.", "Achievements", "2026-07-26", "Career Readiness", 100));
            return list;
        }

        String sql = "SELECT * FROM growth_timeline WHERE user_id = ? ORDER BY timeline_id ASC";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> t = new HashMap<>();
                    t.put("id", rs.getInt("timeline_id"));
                    t.put("title", rs.getString("title"));
                    t.put("description", rs.getString("description"));
                    t.put("category", rs.getString("category"));
                    t.put("event_date", rs.getString("event_date"));
                    t.put("related_module", rs.getString("related_module"));
                    t.put("completion_percentage", rs.getInt("completion_percentage"));
                    list.add(t);
                }
            }
        } catch (SQLException e) {
            System.err.println("Error fetching growth timeline: " + e.getMessage());
        }
        return list;
    }

    private static Map<String, Object> createTimelineMap(String title, String desc, String cat, String date, String module, int pct) {
        Map<String, Object> t = new HashMap<>();
        t.put("title", title);
        t.put("description", desc);
        t.put("category", cat);
        t.put("event_date", date);
        t.put("related_module", module);
        t.put("completion_percentage", pct);
        return t;
    }
}
