package src;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/api/timeline")
public class GrowthTimelineServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private GrowthTimelineService growthTimelineService = new GrowthTimelineService();

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");

        PrintWriter out = response.getWriter();
        int userId = 1;
        String userParam = request.getParameter("userId");
        if (userParam != null) {
            try {
                userId = Integer.parseInt(userParam);
            } catch (NumberFormatException e) {}
        }

        List<GrowthTimeline> timeline = growthTimelineService.getTimelineForUser(userId);

        StringBuilder json = new StringBuilder();
        json.append("[");
        for (int i = 0; i < timeline.size(); i++) {
            GrowthTimeline t = timeline.get(i);
            json.append("{");
            json.append("\"id\":").append(t.getId()).append(",");
            json.append("\"title\":\"").append(t.getTitle()).append("\",");
            json.append("\"description\":\"").append(t.getDescription()).append("\",");
            json.append("\"category\":\"").append(t.getCategory()).append("\",");
            json.append("\"event_date\":\"").append(t.getEventDate()).append("\",");
            json.append("\"related_module\":\"").append(t.getRelatedModule() == null ? "" : t.getRelatedModule()).append("\",");
            json.append("\"completion_percentage\":").append(t.getCompletionPercentage());
            json.append("}");
            if (i < timeline.size() - 1) {
                json.append(",");
            }
        }
        json.append("]");

        out.print(json.toString());
        out.flush();
    }
}
