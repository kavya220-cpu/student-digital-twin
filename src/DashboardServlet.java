package src;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/api/dashboard")
public class DashboardServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Allow CORS for easy local testing
        response.setHeader("Access-Control-Allow-Origin", "*");

        PrintWriter out = response.getWriter();

        int userId = 1; // Default test user
        String userIdParam = request.getParameter("userId");
        if (userIdParam != null) {
            try {
                userId = Integer.parseInt(userIdParam);
            } catch (NumberFormatException e) {
                // Keep default
            }
        }

        // Fetch data elements from DatabaseManager
        Map<String, Object> profile = DatabaseManager.getStudentProfile(userId);
        List<Map<String, Object>> marks = DatabaseManager.getSemesterSGPA(userId);
        List<Map<String, Object>> skills = DatabaseManager.getSkills(userId);
        List<Map<String, Object>> roadmap = DatabaseManager.getRoadmapSkills(userId);
        List<Map<String, Object>> projects = DatabaseManager.getProjects(userId);
        List<Map<String, Object>> certs = DatabaseManager.getCertifications(userId);
        Map<String, Object> resume = DatabaseManager.getResumes(userId);
        Map<String, Object> interview = DatabaseManager.getInterviewResults(userId);
        Map<String, Object> coding = DatabaseManager.getCodingProgress(userId);
        List<Map<String, Object>> recommendations = DatabaseManager.getRecommendations(userId);
        List<Map<String, Object>> goals = DatabaseManager.getDailyGoals(userId, "2026-07-24");

        // Calculate current readiness metrics
        double codingProgress = coding.containsKey("total") ? Math.min(((Integer) coding.get("total") / 100.0) * 100.0, 100.0) : 0.0;
        double resumeScore = resume.containsKey("score") ? (Integer) resume.get("score") : 70.0;
        double interviewScore = interview.containsKey("overall") ? (Integer) interview.get("overall") : 65.0;
        double cgpaVal = profile.containsKey("cgpa") ? (Double) profile.get("cgpa") : 0.0;

        CareerReadinessCalculator calculator = new CareerReadinessCalculator();
        CareerReadiness readiness = calculator.calculateReadiness(
            cgpaVal,
            skills.size(),
            projects.size(),
            certs.size(),
            codingProgress,
            resumeScore,
            interviewScore
        );

        // Serialize to JSON String
        StringBuilder json = new StringBuilder();
        json.append("{");
        
        // Profile
        json.append("\"profile\":{");
        json.append("\"name\":\"").append(profile.getOrDefault("name", "Student")).append("\",");
        json.append("\"email\":\"").append(profile.getOrDefault("email", "")).append("\",");
        json.append("\"cgpa\":").append(profile.getOrDefault("cgpa", 0.0)).append(",");
        json.append("\"selectedCareer\":\"").append(profile.getOrDefault("selected_career", "AI Student")).append("\",");
        json.append("\"attendance\":").append(profile.getOrDefault("attendance", 0.0));
        json.append("},");

        // Career Readiness
        json.append("\"readiness\":{");
        json.append("\"score\":").append(readiness.getOverallPercentage()).append(",");
        json.append("\"level\":\"").append(readiness.getLevel()).append("\",");
        json.append("\"description\":\"").append(readiness.getDescription()).append("\"");
        json.append("},");

        // Resume Summary
        json.append("\"resume\":{");
        json.append("\"score\":").append(resume.getOrDefault("score", 70)).append(",");
        json.append("\"ats\":").append(resume.getOrDefault("ats_score", 65)).append(",");
        json.append("\"completion\":").append(resume.getOrDefault("completion", 70));
        json.append("},");

        // Interview Summary
        json.append("\"interview\":{");
        json.append("\"overall\":").append(interview.getOrDefault("overall", 65)).append(",");
        json.append("\"tech\":").append(interview.getOrDefault("tech", 65)).append(",");
        json.append("\"comm\":").append(interview.getOrDefault("comm", 65)).append(",");
        json.append("\"conf\":").append(interview.getOrDefault("conf", 65)).append(",");
        json.append("\"facial\":").append(interview.getOrDefault("facial", 65));
        json.append("},");

        // Coding Progress Summary
        json.append("\"coding\":{");
        json.append("\"total\":").append(coding.getOrDefault("total", 0)).append(",");
        json.append("\"easy\":").append(coding.getOrDefault("easy", 0)).append(",");
        json.append("\"medium\":").append(coding.getOrDefault("medium", 0)).append(",");
        json.append("\"hard\":").append(coding.getOrDefault("hard", 0)).append(",");
        json.append("\"streak\":").append(coding.getOrDefault("streak", 0)).append(",");
        json.append("\"favTopic\":\"").append(coding.getOrDefault("fav_topic", "Arrays")).append("\"");
        json.append("},");

        // Projects completed count
        json.append("\"projectsCount\":").append(projects.size()).append(",");
        json.append("\"certsCount\":").append(certs.size()).append(",");
        json.append("\"skillsCount\":").append(skills.size()).append(",");

        // Daily Goals List
        json.append("\"goals\":[");
        for (int i = 0; i < goals.size(); i++) {
            Map<String, Object> g = goals.get(i);
            json.append("{");
            json.append("\"id\":").append(g.get("id")).append(",");
            json.append("\"text\":\"").append(g.get("text")).append("\",");
            json.append("\"completed\":").append(g.get("completed"));
            json.append("}");
            if (i < goals.size() - 1) json.append(",");
        }
        json.append("],");

        // Recommendations List
        json.append("\"recommendations\":[");
        for (int i = 0; i < recommendations.size(); i++) {
            Map<String, Object> r = recommendations.get(i);
            json.append("{");
            json.append("\"id\":").append(r.get("id")).append(",");
            json.append("\"text\":\"").append(r.get("text")).append("\",");
            json.append("\"priority\":\"").append(r.get("priority")).append("\",");
            json.append("\"status\":\"").append(r.get("status")).append("\",");
            json.append("\"category\":\"").append(r.get("category")).append("\"");
            json.append("}");
            if (i < recommendations.size() - 1) json.append(",");
        }
        json.append("]");

        json.append("}");
        out.print(json.toString());
        out.flush();
    }
}
