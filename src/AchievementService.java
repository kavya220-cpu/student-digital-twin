package src;

import java.util.List;

public class AchievementService {
    private AchievementDAO achievementDAO = new AchievementDAO();

    public List<Achievement> getAchievementsForUser(int userId) {
        return achievementDAO.getAchievementsByUserId(userId);
    }

    public int calculateTotalXP(List<Achievement> achievements) {
        int totalXp = 0;
        for (Achievement a : achievements) {
            if ("Unlocked".equalsIgnoreCase(a.getStatus())) {
                totalXp += a.getXp();
            }
        }
        return totalXp;
    }
}
