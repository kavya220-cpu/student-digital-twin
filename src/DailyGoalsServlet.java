package src;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/api/daily-goals")
public class DailyGoalsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");

        PrintWriter out = response.getWriter();

        String goalIdStr = request.getParameter("goalId");
        String completedStr = request.getParameter("completed");

        boolean success = false;
        String message = "";

        if (goalIdStr != null && completedStr != null) {
            try {
                int goalId = Integer.parseInt(goalIdStr);
                boolean completed = Boolean.parseBoolean(completedStr);

                // Update database
                DatabaseManager.updateDailyGoalStatus(goalId, completed);
                success = true;
                message = "Goal status updated successfully.";
            } catch (NumberFormatException e) {
                message = "Invalid goalId format.";
            }
        } else {
            message = "Missing parameter goalId or completed.";
        }

        out.print("{\"success\":" + success + ",\"message\":\"" + message + "\"}");
        out.flush();
    }
}
