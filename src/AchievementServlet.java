package src;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/api/achievements")
public class AchievementServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private AchievementService achievementService = new AchievementService();

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

        List<Achievement> achievements = achievementService.getAchievementsForUser(userId);
        int totalXp = achievementService.calculateTotalXP(achievements);

        // Simple XP Level System: 100 XP per level
        int xpPerLevel = 100;
        int currentLevel = (totalXp / xpPerLevel) + 1;
        int nextLevelXpThreshold = xpPerLevel;
        int currentLevelProgressXp = totalXp % xpPerLevel;
        int nextLevelProgress = (int) (((double) currentLevelProgressXp / xpPerLevel) * 100);

        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"totalXp\":").append(totalXp).append(",");
        json.append("\"currentLevel\":").append(currentLevel).append(",");
        json.append("\"nextLevelXpThreshold\":").append(nextLevelXpThreshold).append(",");
        json.append("\"nextLevelProgress\":").append(nextLevelProgress).append(",");
        json.append("\"achievements\":[");
        for (int i = 0; i < achievements.size(); i++) {
            Achievement a = achievements.get(i);
            json.append("{");
            json.append("\"id\":").append(a.getId()).append(",");
            json.append("\"badge_name\":\"").append(a.getBadgeName()).append("\",");
            json.append("\"badge_icon\":\"").append(a.getBadgeIcon()).append("\",");
            json.append("\"category\":\"").append(a.getCategory()).append("\",");
            json.append("\"description\":\"").append(a.getDescription()).append("\",");
            json.append("\"xp\":").append(a.getXp()).append(",");
            json.append("\"earned_date\":").append(a.getEarnedDate() == null ? "null" : "\"" + a.getEarnedDate() + "\"").append(",");
            json.append("\"status\":\"").append(a.getStatus()).append("\"");
            json.append("}");
            if (i < achievements.size() - 1) {
                json.append(",");
            }
        }
        json.append("]");
        json.append("}");

        out.print(json.toString());
        out.flush();
    }
}
