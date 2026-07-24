package src;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class EventService {
    private static String apiBase = "https://www.eventbriteapi.com/v3/";
    private static String privateToken = "";
    private static boolean isApiAvailable = false;

    static {
        // Load configurations
        try (InputStream input = EventService.class.getClassLoader().getResourceAsStream("config.properties")) {
            Properties prop = new Properties();
            if (input != null) {
                prop.load(input);
                apiBase = prop.getProperty("eventbrite.api.base", apiBase);
                privateToken = prop.getProperty("eventbrite.private.token", "");
            } else {
                // Try direct file loading as fallback
                java.io.File file = new java.io.File("src/config.properties");
                if (file.exists()) {
                    try (java.io.FileInputStream fis = new java.io.FileInputStream(file)) {
                        prop.load(fis);
                        apiBase = prop.getProperty("eventbrite.api.base", apiBase);
                        privateToken = prop.getProperty("eventbrite.private.token", "");
                    }
                }
            }
            if (privateToken != null && !privateToken.trim().isEmpty() && !privateToken.contains("<PRIVATE_TOKEN>")) {
                isApiAvailable = true;
            }
        } catch (Exception e) {
            System.err.println("[EventService] Failed to load config.properties: " + e.getMessage());
        }
    }

    public static boolean isApiConfigured() {
        return isApiAvailable;
    }

    public static List<Event> fetchOpportunities(double lat, double lng, String search, String category) {
        List<Event> events = new ArrayList<>();
        boolean success = false;

        // Ensure DDL/Schema tables are active before query
        EventRepository.initializeTables();

        // 1. Try Live Eventbrite API sync if cache is expired
        if (isApiAvailable && CacheManager.isCacheExpired(lat, lng)) {
            try {
                String queryUrl = apiBase + "events/search/?location.latitude=" + lat + 
                                  "&location.longitude=" + lng + 
                                  "&location.within=50km";
                if (search != null && !search.trim().isEmpty()) {
                    queryUrl += "&q=" + java.net.URLEncoder.encode(search, "UTF-8");
                }
                
                URL url = new URL(queryUrl);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Authorization", "Bearer " + privateToken);
                conn.setRequestProperty("Accept", "application/json");
                conn.setConnectTimeout(5000);
                conn.setReadTimeout(5000);

                int code = conn.getResponseCode();
                if (code == 200) {
                    try (BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"))) {
                        StringBuilder sb = new StringBuilder();
                        String line;
                        while ((line = in.readLine()) != null) {
                            sb.append(line);
                        }
                        
                        // Parse JSON response and cache into MySQL
                        List<Event> fetched = parseEventbriteJSON(sb.toString(), lat, lng);
                        if (!fetched.isEmpty()) {
                            for (Event e : fetched) {
                                EventRepository.saveEvent(e);
                                events.add(e);
                            }
                            CacheManager.recordSync(lat, lng);
                            success = true;
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("[EventService] Live sync failed: " + e.getMessage() + ". Defaulting to local database cache.");
            }
        }

        // 2. Double-Fallback: Generate Dynamic Mock Events for coordinates if API fails or isn't fully configured
        // This ensures the student gets location-specific items on their UI immediately!
        if (events.isEmpty()) {
            List<Event> dynamicMocks = generateDynamicMockEventsForCoordinates(lat, lng);
            for (Event e : dynamicMocks) {
                EventRepository.saveEvent(e);
            }
        }

        // 3. Query all filtered items from database
        events = EventRepository.getEvents(search, category, null, null, null, null, lat, lng);
        return events;
    }

    private static List<Event> parseEventbriteJSON(String json, double queryLat, double queryLng) {
        List<Event> list = new ArrayList<>();
        try {
            // Find "events": [...] array in JSON
            int eventsStart = json.indexOf("\"events\"");
            if (eventsStart == -1) return list;

            // Extract each event element block using regex matching
            Pattern eventPattern = Pattern.compile("\\{\\s*\"name\"\\s*:\\s*\\{\\s*\"text\"\\s*:\\s*\"([^\"]+)\"[^\\}]+\"description\"\\s*:\\s*\\{\\s*\"text\"\\s*:\\s*\"([^\"]+)\"[^\\}]+.*?\"id\"\\s*:\\s*\"([^\"]+)\".*?\"url\"\\s*:\\s*\"([^\"]+)\".*?\"start\"\\s*:\\s*\\{\\s*\"local\"\\s*:\\s*\"([^\"]+)\"");
            Matcher m = eventPattern.matcher(json);

            int index = 1;
            while (m.find()) {
                String title = m.group(1);
                String desc = m.group(2);
                String id = m.group(3);
                String url = m.group(4);
                String dateTime = m.group(5);

                // Build a parsed Event representation
                Event e = new Event();
                e.setId("evt_eb_" + id);
                e.setTitle(title);
                e.setDescription(desc.length() > 500 ? desc.substring(0, 497) + "..." : desc);
                e.setOrganizer("Eventbrite Host");
                e.setCompanyLogo("assets/images/eventbrite.png");
                e.setLocation("Sync Coordinate Area");
                e.setLatitude(queryLat);
                e.setLongitude(queryLng);
                e.setMode(queryLat == 0.0 ? "Online" : "Offline");
                e.setEventDate(dateTime.split("T")[0]);
                e.setRegistrationDeadline(dateTime.split("T")[0]);
                e.setCategory(index % 2 == 0 ? "Workshop" : "Conference");
                e.setDifficulty("Intermediate");
                e.setRegistrationFee("Free");
                e.setRegistrationUrl(url);
                e.setAgenda("Day 1: Technical Keynotes. Day 2: Lab sessions.");
                e.setEligibility("Open to all students");
                e.setRequiredSkills("General Development");
                e.setHasCertificate(true);
                e.setSource("Eventbrite");

                list.add(e);
                index++;
            }
        } catch (Exception ex) {
            System.err.println("[EventService] Error parsing Eventbrite JSON: " + ex.getMessage());
        }
        return list;
    }

    private static List<Event> generateDynamicMockEventsForCoordinates(double lat, double lng) {
        List<Event> list = new ArrayList<>();
        // Approximate location string
        String locStr = (Math.abs(lat - 12.9716) < 0.5) ? "Bangalore, India" : 
                        (Math.abs(lat - 37.7749) < 0.5) ? "Silicon Valley, CA" : 
                        (lat == 0.0) ? "Online Portal" : "Coordinates Area (" + String.format("%.2f", lat) + ", " + String.format("%.2f", lng) + ")";

        list.add(new Event(
            "evt_dyn_1_" + String.format("%.0f", lat * 10),
            "AI Developer Summit 2026",
            "Explore cutting-edge large language models, agent design patterns, and deployment engines.",
            "Nexus Tech Community",
            "assets/images/techlabs.png",
            locStr,
            lat,
            lng,
            lat == 0.0 ? "Online" : "Offline",
            "2026-08-25",
            "2026-08-20",
            "Conference",
            "Intermediate",
            "Free",
            "https://example.com/aisummit",
            "9 AM: Agent Architectures. 12 PM: RAG Optimization. 3 PM: Parallel Workspaces.",
            "Active programming students",
            "Java, Python, DBMS",
            true,
            "Eventbrite"
        ));

        list.add(new Event(
            "evt_dyn_2_" + String.format("%.0f", lat * 10),
            "Full Stack Boot Camp",
            "A structured boot camp focused on building responsive glassmorphic interfaces and servlets endpoints.",
            "NexusED Academy",
            "assets/images/vercel.png",
            locStr,
            lat,
            lng,
            lat == 0.0 ? "Online" : "Offline",
            "2026-09-10",
            "2026-09-08",
            "Bootcamp",
            "Beginner",
            "Free",
            "https://example.com/bootcamp",
            "Day 1: Glassmorphic UI CSS. Day 2: JDBC & Servlets controller APIs.",
            "Students interested in web architecture",
            "HTML5, CSS3, JavaScript",
            true,
            "Eventbrite"
        ));

        list.add(new Event(
            "evt_dyn_3_" + String.format("%.0f", lat * 10),
            "Algorithms Coding Arena",
            "Compete with peers in this live competitive coding contest featuring arrays, trees and dynamic programming.",
            "Algorithms League",
            "assets/images/codechef.png",
            "Online Portal",
            0.0,
            0.0,
            "Online",
            "2026-08-12",
            "2026-08-11",
            "Coding Contest",
            "Advanced",
            "Free",
            "https://example.com/codingarena",
            "6 PM: Coding challenges open. 9 PM: Leaderboard audit & analysis.",
            "Open to all competitive coders",
            "Java, Python",
            false,
            "Eventbrite"
        ));

        return list;
    }
}
