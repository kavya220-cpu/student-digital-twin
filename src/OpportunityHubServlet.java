package src;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/api/opportunities")
public class OpportunityHubServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    public void init() throws ServletException {
        super.init();
        // Fail-safe initialization of DB tables
        EventRepository.initializeTables();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");

        PrintWriter out = response.getWriter();

        int userId = 1;
        String userIdStr = request.getParameter("userId");
        if (userIdStr != null) {
            try {
                userId = Integer.parseInt(userIdStr);
            } catch (NumberFormatException e) {
                // Keep default
            }
        }

        // Get coordinates or city
        double lat = 12.9716; // default Bangalore
        double lng = 77.5946;
        String city = request.getParameter("city");
        if (city != null && !city.trim().isEmpty()) {
            double[] coords = LocationService.resolveCoordinates(city);
            lat = coords[0];
            lng = coords[1];
        } else {
            String latStr = request.getParameter("lat");
            String lngStr = request.getParameter("lng");
            if (latStr != null && lngStr != null) {
                try {
                    lat = Double.parseDouble(latStr);
                    lng = Double.parseDouble(lngStr);
                } catch (NumberFormatException e) {
                    // Keep default
                }
            }
        }

        // Filters
        String search = request.getParameter("search");
        String category = request.getParameter("category");
        String mode = request.getParameter("mode");
        String difficulty = request.getParameter("difficulty");
        String fee = request.getParameter("fee");
        String dateFilter = request.getParameter("date");
        String listType = request.getParameter("type"); // "saved", "registered", or "all"

        List<Event> rawEvents;
        
        if ("saved".equalsIgnoreCase(listType)) {
            rawEvents = EventRepository.getSavedEvents(userId);
        } else if ("registered".equalsIgnoreCase(listType)) {
            rawEvents = EventRepository.getRegisteredEvents(userId);
        } else {
            // Main fetch (API + Cache sync)
            rawEvents = EventService.fetchOpportunities(lat, lng, search, category);
        }

        // Apply java-side filters (mode, difficulty, fee, date)
        List<Event> filtered = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (Event e : rawEvents) {
            // Mode filter
            if (mode != null && !mode.trim().isEmpty() && !e.getMode().equalsIgnoreCase(mode.trim())) {
                continue;
            }
            // Difficulty filter
            if (difficulty != null && !difficulty.trim().isEmpty() && !e.getDifficulty().equalsIgnoreCase(difficulty.trim())) {
                continue;
            }
            // Fee filter
            if (fee != null && !fee.trim().isEmpty()) {
                boolean isFree = e.getRegistrationFee().toLowerCase().contains("free") || e.getRegistrationFee().equals("0") || e.getRegistrationFee().isEmpty();
                if ("free".equalsIgnoreCase(fee) && !isFree) continue;
                if ("paid".equalsIgnoreCase(fee) && isFree) continue;
            }
            // Date filter
            if (dateFilter != null && !dateFilter.trim().isEmpty()) {
                try {
                    LocalDate eventDate = LocalDate.parse(e.getEventDate());
                    long daysBetween = ChronoUnit.DAYS.between(today, eventDate);
                    if ("today".equalsIgnoreCase(dateFilter) && daysBetween != 0) {
                        continue;
                    } else if ("week".equalsIgnoreCase(dateFilter) && (daysBetween < 0 || daysBetween > 7)) {
                        continue;
                    } else if ("month".equalsIgnoreCase(dateFilter) && (daysBetween < 0 || daysBetween > 30)) {
                        continue;
                    }
                } catch (DateTimeParseException ex) {
                    // Skip filter on date parsing failure
                }
            }
            filtered.add(e);
        }

        // Personalized recommendations ranking
        Map<String, Object> profile = DatabaseManager.getStudentProfile(userId);
        List<Map<String, Object>> skills = DatabaseManager.getSkills(userId);
        Map<String, Object> resume = DatabaseManager.getResumes(userId);
        Map<String, Object> interview = DatabaseManager.getInterviewResults(userId);
        Map<String, Object> coding = DatabaseManager.getCodingProgress(userId);

        double codingProgress = coding.containsKey("total") ? Math.min(((Integer) coding.get("total") / 100.0) * 100.0, 100.0) : 0.0;
        double resumeScore = resume.containsKey("score") ? (Integer) resume.get("score") : 70.0;
        double interviewScore = interview.containsKey("overall") ? (Integer) interview.get("overall") : 65.0;
        double cgpaVal = profile.containsKey("cgpa") ? (Double) profile.get("cgpa") : 0.0;

        CareerReadinessCalculator calculator = new CareerReadinessCalculator();
        CareerReadiness readiness = calculator.calculateReadiness(
            cgpaVal,
            skills.size(),
            DatabaseManager.getProjects(userId).size(),
            DatabaseManager.getCertifications(userId).size(),
            codingProgress,
            resumeScore,
            interviewScore
        );

        RecommendationEngine recEngine = new RecommendationEngine();
        String careerGoal = (String) profile.getOrDefault("selected_career", "AI Student");
        List<Event> recommended = recEngine.recommendEvents(filtered, careerGoal, skills, readiness.getOverallPercentage());

        // Determine Sync status message
        String syncStatus = EventService.isApiConfigured() ? "live" : "cached";

        // Build Response JSON manually
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"syncStatus\":\"").append(syncStatus).append("\",");
        
        // Return resolved location
        json.append("\"location\":{");
        json.append("\"lat\":").append(lat).append(",");
        json.append("\"lng\":").append(lng);
        json.append("},");

        // Recommended events list
        json.append("\"recommended\":[");
        for (int i = 0; i < recommended.size(); i++) {
            appendEventJSON(json, recommended.get(i), userId);
            if (i < recommended.size() - 1) json.append(",");
        }
        json.append("],");

        // Main events list
        json.append("\"events\":[");
        for (int i = 0; i < filtered.size(); i++) {
            appendEventJSON(json, filtered.get(i), userId);
            if (i < filtered.size() - 1) json.append(",");
        }
        json.append("]");

        json.append("}");

        out.print(json.toString());
        out.flush();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");

        PrintWriter out = response.getWriter();

        String action = request.getParameter("action");
        String eventId = request.getParameter("eventId");
        
        int userId = 1;
        String userIdStr = request.getParameter("userId");
        if (userIdStr != null) {
            try {
                userId = Integer.parseInt(userIdStr);
            } catch (NumberFormatException e) {
                // Keep default
            }
        }

        boolean success = false;
        String message = "";

        if (eventId == null || eventId.trim().isEmpty()) {
            message = "Missing eventId parameter.";
        } else if ("bookmark".equalsIgnoreCase(action)) {
            String saveStr = request.getParameter("save");
            boolean save = Boolean.parseBoolean(saveStr);
            EventRepository.bookmarkEvent(userId, eventId, save);
            success = true;
            message = save ? "Event bookmarked successfully." : "Event removed from bookmarks.";
        } else if ("register".equalsIgnoreCase(action)) {
            EventRepository.registerEvent(userId, eventId);
            success = true;
            message = "Successfully registered for event!";
        } else {
            message = "Invalid action parameter.";
        }

        out.print("{\"success\":" + success + ",\"message\":\"" + message + "\"}");
        out.flush();
    }

    private void appendEventJSON(StringBuilder json, Event e, int userId) {
        boolean isBookmarked = EventRepository.isBookmarked(userId, e.getId());
        boolean isRegistered = EventRepository.isRegistered(userId, e.getId());

        json.append("{");
        json.append("\"id\":\"").append(e.getId()).append("\",");
        json.append("\"title\":\"").append(escape(e.getTitle())).append("\",");
        json.append("\"description\":\"").append(escape(e.getDescription())).append("\",");
        json.append("\"organizer\":\"").append(escape(e.getOrganizer())).append("\",");
        json.append("\"companyLogo\":\"").append(escape(e.getCompanyLogo())).append("\",");
        json.append("\"location\":\"").append(escape(e.getLocation())).append("\",");
        json.append("\"latitude\":").append(e.getLatitude()).append(",");
        json.append("\"longitude\":").append(e.getLongitude()).append(",");
        json.append("\"mode\":\"").append(escape(e.getMode())).append("\",");
        json.append("\"eventDate\":\"").append(escape(e.getEventDate())).append("\",");
        json.append("\"registrationDeadline\":\"").append(escape(e.getRegistrationDeadline())).append("\",");
        json.append("\"category\":\"").append(escape(e.getCategory())).append("\",");
        json.append("\"difficulty\":\"").append(escape(e.getDifficulty())).append("\",");
        json.append("\"registrationFee\":\"").append(escape(e.getRegistrationFee())).append("\",");
        json.append("\"registrationUrl\":\"").append(escape(e.getRegistrationUrl())).append("\",");
        json.append("\"agenda\":\"").append(escape(e.getAgenda())).append("\",");
        json.append("\"eligibility\":\"").append(escape(e.getEligibility())).append("\",");
        json.append("\"requiredSkills\":\"").append(escape(e.getRequiredSkills())).append("\",");
        json.append("\"hasCertificate\":").append(e.isHasCertificate()).append(",");
        json.append("\"source\":\"").append(escape(e.getSource())).append("\",");
        json.append("\"bookmarked\":").append(isBookmarked).append(",");
        json.append("\"registered\":").append(isRegistered);
        json.append("}");
    }

    private String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\b", "\\b")
                .replace("\f", "\\f")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
