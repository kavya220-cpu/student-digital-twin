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

@WebServlet("/api/analytics")
public class AnalyticsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");

        PrintWriter out = response.getWriter();

        int userId = 1;
        String userIdParam = request.getParameter("userId");
        if (userIdParam != null) {
            try {
                userId = Integer.parseInt(userIdParam);
            } catch (NumberFormatException e) {
                // Keep default
            }
        }

        AnalyticsService service = new AnalyticsService();
        Map<String, Object> data = service.getStudentAnalytics(userId);

        // Serialize to JSON manually
        StringBuilder json = new StringBuilder();
        json.append("{");
        
        json.append("\"skillsCompletion\":").append(data.get("skillsCompletion")).append(",");
        json.append("\"totalSkills\":").append(data.get("totalSkills")).append(",");
        json.append("\"totalCertificates\":").append(data.get("totalCertificates")).append(",");
        json.append("\"resumeScore\":").append(data.get("resumeScore")).append(",");
        json.append("\"interviewScore\":").append(data.get("interviewScore")).append(",");
        json.append("\"readinessScore\":").append(data.get("readinessScore")).append(",");
        json.append("\"readinessLevel\":\"").append(data.get("readinessLevel")).append("\",");

        // Project Stats
        Map<String, Integer> pStats = (Map<String, Integer>) data.get("projectStats");
        json.append("\"projectStats\":{");
        json.append("\"total\":").append(pStats.get("total")).append(",");
        json.append("\"completed\":").append(pStats.get("completed")).append(",");
        json.append("\"ongoing\":").append(pStats.get("ongoing"));
        json.append("},");

        // CGPA Trend
        List<Map<String, Object>> trend = (List<Map<String, Object>>) data.get("cgpaTrend");
        json.append("\"cgpaTrend\":[");
        for (int i = 0; i < trend.size(); i++) {
            Map<String, Object> m = trend.get(i);
            json.append("{");
            json.append("\"semester\":").append(m.get("semester")).append(",");
            json.append("\"sgpa\":").append(m.get("sgpa"));
            json.append("}");
            if (i < trend.size() - 1) json.append(",");
        }
        json.append("],");

        // Readiness Breakdown
        Map<String, Double> breakdown = (Map<String, Double>) data.get("readinessBreakdown");
        json.append("\"readinessBreakdown\":{");
        int count = 0;
        for (Map.Entry<String, Double> entry : breakdown.entrySet()) {
            json.append("\"").append(entry.getKey()).append("\":").append(entry.getValue());
            if (count < breakdown.size() - 1) json.append(",");
            count++;
        }
        json.append("}");

        json.append("}");
        
        out.print(json.toString());
        out.flush();
    }
}
