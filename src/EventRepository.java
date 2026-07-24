package src;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class EventRepository {
    private static final List<Event> mockEvents = new ArrayList<>();
    private static final List<String> mockBookmarks = new ArrayList<>(); // Format: "userId:eventId"
    private static final List<String> mockRegistrations = new ArrayList<>(); // Format: "userId:eventId"
    private static long mockLastSync = 0;

    static {
        // Initialize mock seed data
        mockEvents.add(new Event("evt_seed_1", "National Hackathon 2026", "A 36-hour sprint to build innovative solutions for sustainable tech.", "TechLabs", "assets/images/techlabs.png", "Bangalore, India", 12.9716, 77.5946, "Offline", "2026-08-15", "2026-08-10", "Hackathon", "Intermediate", "Free", "https://example.com/hackathon2026", "Day 1: Hacking kicks off. Day 2: Pitching & Judging.", "Undergraduate Students", "Java, Git, SQL", true, "Local"));
        mockEvents.add(new Event("evt_seed_2", "Advanced Web Development Workshop", "A deep dive into advanced reactive architectures and service workers.", "Vercel Devs", "assets/images/vercel.png", "Online", 0.0, 0.0, "Online", "2026-08-20", "2026-08-19", "Workshop", "Advanced", "$15", "https://example.com/webworkshop", "10 AM: Service Workers. 1 PM: Edge Rendering.", "Developers with basic JS experience", "JavaScript, CSS, HTML5", true, "Local"));
        mockEvents.add(new Event("evt_seed_3", "Java Cloud Native Bootcamp", "Immersive bootcamp covering Spring Boot, Docker, and AWS deployments.", "Oracle Academy", "assets/images/oracle.png", "Hybrid", 12.9716, 77.5946, "Hybrid", "2026-09-01", "2026-08-28", "Bootcamp", "Beginner", "Free", "https://example.com/javacloud", "Week 1: Spring Boot. Week 2: Containers & K8s.", "Computer Science majors", "Java, DBMS", true, "Local"));
        mockEvents.add(new Event("evt_seed_4", "Global Competitive Coding League", "Compete with elite algorithms minds globally in a 5-hour contest.", "CodeChef Chapter", "assets/images/codechef.png", "Online", 0.0, 0.0, "Online", "2026-08-05", "2026-08-04", "Coding Contest", "Advanced", "Free", "https://example.com/contest", "5 PM - 10 PM: 6 Algorithm Problems.", "Open to all students", "Java, Python, C++", false, "Local"));
    }

    public static void initializeTables() {
        if (DatabaseManager.isFallbackActive()) return;

        String[] ddl = {
            "CREATE TABLE IF NOT EXISTS events (" +
            "    id VARCHAR(100) PRIMARY KEY," +
            "    title VARCHAR(255) NOT NULL," +
            "    description TEXT," +
            "    organizer VARCHAR(255)," +
            "    company_logo TEXT," +
            "    location VARCHAR(255)," +
            "    latitude DECIMAL(10, 8)," +
            "    longitude DECIMAL(11, 8)," +
            "    mode VARCHAR(50)," +
            "    event_date VARCHAR(50)," +
            "    registration_deadline VARCHAR(50)," +
            "    category VARCHAR(50)," +
            "    difficulty VARCHAR(50)," +
            "    registration_fee VARCHAR(50)," +
            "    registration_url TEXT," +
            "    agenda TEXT," +
            "    eligibility TEXT," +
            "    required_skills TEXT," +
            "    has_certificate BOOLEAN DEFAULT FALSE," +
            "    source VARCHAR(50) DEFAULT 'Eventbrite'" +
            ")",

            "CREATE TABLE IF NOT EXISTS saved_events (" +
            "    id INT PRIMARY KEY AUTO_INCREMENT," +
            "    user_id INT," +
            "    event_id VARCHAR(100)," +
            "    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE," +
            "    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE," +
            "    UNIQUE KEY (user_id, event_id)" +
            ")",

            "CREATE TABLE IF NOT EXISTS registered_events (" +
            "    id INT PRIMARY KEY AUTO_INCREMENT," +
            "    user_id INT," +
            "    event_id VARCHAR(100)," +
            "    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE," +
            "    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE," +
            "    UNIQUE KEY (user_id, event_id)" +
            ")",

            "CREATE TABLE IF NOT EXISTS event_cache (" +
            "    id INT PRIMARY KEY AUTO_INCREMENT," +
            "    latitude DECIMAL(10, 8)," +
            "    longitude DECIMAL(11, 8)," +
            "    last_sync_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" +
            ")"
        };

        try (Connection conn = DatabaseManager.getConnection()) {
            try (Statement stmt = conn.createStatement()) {
                for (String sql : ddl) {
                    stmt.execute(sql);
                }
            }
        } catch (SQLException e) {
            System.err.println("[EventRepository] Failed to initialize tables: " + e.getMessage());
        }
    }

    public static void saveEvent(Event event) {
        if (DatabaseManager.isFallbackActive()) {
            mockEvents.removeIf(e -> e.getId().equals(event.getId()));
            mockEvents.add(event);
            return;
        }

        String sql = "INSERT INTO events (id, title, description, organizer, company_logo, location, latitude, longitude, mode, event_date, registration_deadline, category, difficulty, registration_fee, registration_url, agenda, eligibility, required_skills, has_certificate, source) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) " +
                     "ON DUPLICATE KEY UPDATE title=?, description=?, organizer=?, company_logo=?, location=?, latitude=?, longitude=?, mode=?, event_date=?, registration_deadline=?, category=?, difficulty=?, registration_fee=?, registration_url=?, agenda=?, eligibility=?, required_skills=?, has_certificate=?, source=?";

        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, event.getId());
            ps.setString(2, event.getTitle());
            ps.setString(3, event.getDescription());
            ps.setString(4, event.getOrganizer());
            ps.setString(5, event.getCompanyLogo());
            ps.setString(6, event.getLocation());
            ps.setDouble(7, event.getLatitude());
            ps.setDouble(8, event.getLongitude());
            ps.setString(9, event.getMode());
            ps.setString(10, event.getEventDate());
            ps.setString(11, event.getRegistrationDeadline());
            ps.setString(12, event.getCategory());
            ps.setString(13, event.getDifficulty());
            ps.setString(14, event.getRegistrationFee());
            ps.setString(15, event.getRegistrationUrl());
            ps.setString(16, event.getAgenda());
            ps.setString(17, event.getEligibility());
            ps.setString(18, event.getRequiredSkills());
            ps.setBoolean(19, event.isHasCertificate());
            ps.setString(20, event.getSource());

            // Bind update parameters
            ps.setString(21, event.getTitle());
            ps.setString(22, event.getDescription());
            ps.setString(23, event.getOrganizer());
            ps.setString(24, event.getCompanyLogo());
            ps.setString(25, event.getLocation());
            ps.setDouble(26, event.getLatitude());
            ps.setDouble(27, event.getLongitude());
            ps.setString(28, event.getMode());
            ps.setString(29, event.getEventDate());
            ps.setString(30, event.getRegistrationDeadline());
            ps.setString(31, event.getCategory());
            ps.setString(32, event.getDifficulty());
            ps.setString(33, event.getRegistrationFee());
            ps.setString(34, event.getRegistrationUrl());
            ps.setString(35, event.getAgenda());
            ps.setString(36, event.getEligibility());
            ps.setString(37, event.getRequiredSkills());
            ps.setBoolean(38, event.isHasCertificate());
            ps.setString(39, event.getSource());

            ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[EventRepository] Error saving event: " + e.getMessage());
        }
    }

    public static List<Event> getEvents(String search, String category, String mode, String difficulty, String fee, String dateFilter, Double lat, Double lng) {
        List<Event> list = new ArrayList<>();

        if (DatabaseManager.isFallbackActive()) {
            // Apply simple filter logic in-memory
            for (Event e : mockEvents) {
                if (matchesFilter(e, search, category, mode, difficulty, fee)) {
                    list.add(e);
                }
            }
            return list;
        }

        StringBuilder sql = new StringBuilder("SELECT * FROM events WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (search != null && !search.trim().isEmpty()) {
            sql.append(" AND (title LIKE ? OR description LIKE ? OR organizer LIKE ? OR required_skills LIKE ?)");
            String term = "%" + search.trim() + "%";
            params.add(term);
            params.add(term);
            params.add(term);
            params.add(term);
        }

        if (category != null && !category.trim().isEmpty()) {
            sql.append(" AND category = ?");
            params.add(category.trim());
        }

        if (mode != null && !mode.trim().isEmpty()) {
            sql.append(" AND mode = ?");
            params.add(mode.trim());
        }

        if (difficulty != null && !difficulty.trim().isEmpty()) {
            sql.append(" AND difficulty = ?");
            params.add(difficulty.trim());
        }

        if (fee != null && !fee.trim().isEmpty()) {
            if ("free".equalsIgnoreCase(fee)) {
                sql.append(" AND (registration_fee LIKE '%Free%' OR registration_fee = '0' OR registration_fee = '')");
            } else {
                sql.append(" AND NOT (registration_fee LIKE '%Free%' OR registration_fee = '0' OR registration_fee = '')");
            }
        }

        if (lat != null && lng != null && lat != 0.0 && lng != 0.0) {
            // Filter by bounding box (approx. 50km = 0.5 degrees)
            sql.append(" AND (latitude BETWEEN ? AND ?) AND (longitude BETWEEN ? AND ?)");
            params.add(lat - 0.5);
            params.add(lat + 0.5);
            params.add(lng - 0.5);
            params.add(lng + 0.5);
        }

        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(extractEvent(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("[EventRepository] Error getting events: " + e.getMessage());
        }
        return list;
    }

    private static boolean matchesFilter(Event e, String search, String category, String mode, String difficulty, String fee) {
        if (search != null && !search.trim().isEmpty()) {
            String term = search.toLowerCase();
            boolean match = e.getTitle().toLowerCase().contains(term) ||
                            e.getDescription().toLowerCase().contains(term) ||
                            e.getOrganizer().toLowerCase().contains(term);
            if (!match) return false;
        }
        if (category != null && !category.trim().isEmpty() && !e.getCategory().equalsIgnoreCase(category.trim())) {
            return false;
        }
        if (mode != null && !mode.trim().isEmpty() && !e.getMode().equalsIgnoreCase(mode.trim())) {
            return false;
        }
        if (difficulty != null && !difficulty.trim().isEmpty() && !e.getDifficulty().equalsIgnoreCase(difficulty.trim())) {
            return false;
        }
        if (fee != null && !fee.trim().isEmpty()) {
            boolean isFree = e.getRegistrationFee().toLowerCase().contains("free") || e.getRegistrationFee().equals("0") || e.getRegistrationFee().isEmpty();
            if ("free".equalsIgnoreCase(fee) && !isFree) return false;
            if ("paid".equalsIgnoreCase(fee) && isFree) return false;
        }
        return true;
    }

    public static Event getEventById(String id) {
        if (DatabaseManager.isFallbackActive()) {
            for (Event e : mockEvents) {
                if (e.getId().equals(id)) return e;
            }
            return null;
        }

        String sql = "SELECT * FROM events WHERE id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return extractEvent(rs);
                }
            }
        } catch (SQLException e) {
            System.err.println("[EventRepository] Error getting event by id: " + e.getMessage());
        }
        return null;
    }

    public static void bookmarkEvent(int userId, String eventId, boolean save) {
        if (DatabaseManager.isFallbackActive()) {
            String key = userId + ":" + eventId;
            if (save) {
                if (!mockBookmarks.contains(key)) mockBookmarks.add(key);
            } else {
                mockBookmarks.remove(key);
            }
            return;
        }

        String sql;
        if (save) {
            sql = "INSERT IGNORE INTO saved_events (user_id, event_id) VALUES (?, ?)";
        } else {
            sql = "DELETE FROM saved_events WHERE user_id = ? AND event_id = ?";
        }

        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ps.setString(2, eventId);
            ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[EventRepository] Error bookmarking event: " + e.getMessage());
        }
    }

    public static void registerEvent(int userId, String eventId) {
        if (DatabaseManager.isFallbackActive()) {
            String key = userId + ":" + eventId;
            if (!mockRegistrations.contains(key)) {
                mockRegistrations.add(key);
            }
            return;
        }

        String sql = "INSERT IGNORE INTO registered_events (user_id, event_id) VALUES (?, ?)";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ps.setString(2, eventId);
            ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[EventRepository] Error registering for event: " + e.getMessage());
        }
    }

    public static boolean isBookmarked(int userId, String eventId) {
        if (DatabaseManager.isFallbackActive()) {
            return mockBookmarks.contains(userId + ":" + eventId);
        }

        String sql = "SELECT 1 FROM saved_events WHERE user_id = ? AND event_id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ps.setString(2, eventId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            System.err.println("[EventRepository] Error checking bookmark status: " + e.getMessage());
        }
        return false;
    }

    public static boolean isRegistered(int userId, String eventId) {
        if (DatabaseManager.isFallbackActive()) {
            return mockRegistrations.contains(userId + ":" + eventId);
        }

        String sql = "SELECT 1 FROM registered_events WHERE user_id = ? AND event_id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ps.setString(2, eventId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            System.err.println("[EventRepository] Error checking registration status: " + e.getMessage());
        }
        return false;
    }

    public static List<Event> getSavedEvents(int userId) {
        List<Event> list = new ArrayList<>();
        if (DatabaseManager.isFallbackActive()) {
            for (String key : mockBookmarks) {
                if (key.startsWith(userId + ":")) {
                    String eId = key.split(":")[1];
                    Event e = getEventById(eId);
                    if (e != null) list.add(e);
                }
            }
            return list;
        }

        String sql = "SELECT e.* FROM events e JOIN saved_events s ON e.id = s.event_id WHERE s.user_id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(extractEvent(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("[EventRepository] Error getting saved events: " + e.getMessage());
        }
        return list;
    }

    public static List<Event> getRegisteredEvents(int userId) {
        List<Event> list = new ArrayList<>();
        if (DatabaseManager.isFallbackActive()) {
            for (String key : mockRegistrations) {
                if (key.startsWith(userId + ":")) {
                    String eId = key.split(":")[1];
                    Event e = getEventById(eId);
                    if (e != null) list.add(e);
                }
            }
            return list;
        }

        String sql = "SELECT e.* FROM events e JOIN registered_events r ON e.id = r.event_id WHERE r.user_id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(extractEvent(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("[EventRepository] Error getting registered events: " + e.getMessage());
        }
        return list;
    }

    public static long getLastSyncTime(double lat, double lng) {
        if (DatabaseManager.isFallbackActive()) {
            return mockLastSync;
        }

        String sql = "SELECT UNIX_TIMESTAMP(last_sync_time) * 1000 AS last_sync FROM event_cache " +
                     "WHERE (latitude BETWEEN ? AND ?) AND (longitude BETWEEN ? AND ?) ORDER BY last_sync_time DESC LIMIT 1";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setDouble(1, lat - 0.1);
            ps.setDouble(2, lat + 0.1);
            ps.setDouble(3, lng - 0.1);
            ps.setDouble(4, lng + 0.1);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getLong("last_sync");
                }
            }
        } catch (SQLException e) {
            System.err.println("[EventRepository] Error getting sync time: " + e.getMessage());
        }
        return 0;
    }

    public static void updateSyncTime(double lat, double lng) {
        if (DatabaseManager.isFallbackActive()) {
            mockLastSync = System.currentTimeMillis();
            return;
        }

        String sql = "INSERT INTO event_cache (latitude, longitude) VALUES (?, ?)";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setDouble(1, lat);
            ps.setDouble(2, lng);
            ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[EventRepository] Error updating sync log: " + e.getMessage());
        }
    }

    private static Event extractEvent(ResultSet rs) throws SQLException {
        return new Event(
            rs.getString("id"),
            rs.getString("title"),
            rs.getString("description"),
            rs.getString("organizer"),
            rs.getString("company_logo"),
            rs.getString("location"),
            rs.getDouble("latitude"),
            rs.getDouble("longitude"),
            rs.getString("mode"),
            rs.getString("event_date"),
            rs.getString("registration_deadline"),
            rs.getString("category"),
            rs.getString("difficulty"),
            rs.getString("registration_fee"),
            rs.getString("registration_url"),
            rs.getString("agenda"),
            rs.getString("eligibility"),
            rs.getString("required_skills"),
            rs.getBoolean("has_certificate"),
            rs.getString("source")
        );
    }
}
