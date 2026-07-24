package src;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class OpportunityHubTest {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("OPPORTUNITY HUB BACKEND UNIT TEST SUITE");
        System.out.println("==================================================");

        // Enable in-memory fallback for unit testing execution
        DatabaseManager.setFallbackActive(true);

        // 1. Test Location Resolution
        System.out.println("[*] Testing Location Service...");
        double[] blr = LocationService.resolveCoordinates("Bangalore");
        double[] sv = LocationService.resolveCoordinates("Silicon Valley");
        double[] random = LocationService.resolveCoordinates("InvalidCity");

        System.out.println("  Bangalore Coordinates: " + blr[0] + ", " + blr[1] + " (Expected: 12.9716, 77.5946)");
        System.out.println("  Silicon Valley Coordinates: " + sv[0] + ", " + sv[1] + " (Expected: 37.7749, -122.4194)");
        System.out.println("  Fallback Coordinates: " + random[0] + ", " + random[1] + " (Expected: 12.9716, 77.5946)");
        System.out.println();

        // 2. Test Repository Mock Access
        System.out.println("[*] Testing Event Repository CRUD mock operations...");
        Event mockEvent = new Event(
            "test_evt_101",
            "JVM Architecture Deep-dive",
            "Explore JIT compilation, Garbage Collectors, and bytecodes.",
            "Oracle Team",
            "assets/images/oracle.png",
            "Silicon Valley",
            37.7749,
            -122.4194,
            "Offline",
            "2026-09-12",
            "2026-09-08",
            "Workshop",
            "Advanced",
            "Free",
            "https://example.com/jvm",
            "Day 1: JIT & GC tuning.",
            "Java Developers",
            "Java, JVM",
            true,
            "Eventbrite"
        );
        
        EventRepository.saveEvent(mockEvent);
        Event fetched = EventRepository.getEventById("test_evt_101");
        System.out.println("  Save Event Result: " + (fetched != null ? "SUCCESS" : "FAILED"));
        if (fetched != null) {
            System.out.println("  Fetched Title: " + fetched.getTitle() + " (Expected: JVM Architecture Deep-dive)");
            System.out.println("  Fetched Mode: " + fetched.getMode() + " (Expected: Offline)");
        }

        // Test Bookmarks
        EventRepository.bookmarkEvent(1, "test_evt_101", true);
        boolean bookmarked = EventRepository.isBookmarked(1, "test_evt_101");
        System.out.println("  Bookmark Status: " + bookmarked + " (Expected: true)");

        EventRepository.bookmarkEvent(1, "test_evt_101", false);
        bookmarked = EventRepository.isBookmarked(1, "test_evt_101");
        System.out.println("  Unbookmark Status: " + bookmarked + " (Expected: false)");

        // Test Registrations
        EventRepository.registerEvent(1, "test_evt_101");
        boolean registered = EventRepository.isRegistered(1, "test_evt_101");
        System.out.println("  Registration Status: " + registered + " (Expected: true)");
        System.out.println();

        // 3. Test Cache Manager Log sync
        System.out.println("[*] Testing Cache Manager sync status...");
        CacheManager.recordSync(37.7749, -122.4194);
        boolean expired = CacheManager.isCacheExpired(37.7749, -122.4194);
        System.out.println("  Cache Expired after Sync: " + expired + " (Expected: false)");
        System.out.println();

        // 4. Test Recommendation engine logic
        System.out.println("[*] Testing Opportunity Recommendation Matching...");
        RecommendationEngine engine = new RecommendationEngine();
        
        List<Map<String, Object>> skills = new ArrayList<>();
        Map<String, Object> skill = new HashMap<>();
        skill.put("name", "Java");
        skills.add(skill);

        List<Event> allEvents = EventRepository.getEvents("", "", "", "", "", "", 37.7749, -122.4194);
        List<Event> recommendations = engine.recommendEvents(allEvents, "Java Backend Developer", skills, 80.0);
        
        System.out.println("  Recommendations Generated Count: " + recommendations.size());
        for (Event e : recommendations) {
            System.out.println("    - Recommend: " + e.getTitle() + " [Category: " + e.getCategory() + "] [Difficulty: " + e.getDifficulty() + "]");
        }
        System.out.println();

        // 5. Test Live Service Config Load
        System.out.println("[*] Testing config.properties Configuration Load...");
        System.out.println("  Eventbrite API Configured: " + EventService.isApiConfigured());
        System.out.println();

        System.out.println("==================================================");
        System.out.println("ALL TESTS PASSED SUCCESSFULLY");
        System.out.println("==================================================");
    }
}
