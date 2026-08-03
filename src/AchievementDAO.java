package src;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class AchievementDAO {
    public List<Achievement> getAchievementsByUserId(int userId) {
        List<Achievement> list = new ArrayList<>();
        List<Map<String, Object>> rawData = DatabaseManager.getAchievements(userId);

        for (Map<String, Object> map : rawData) {
            Achievement a = new Achievement();
            a.setId(map.containsKey("id") ? (Integer) map.get("id") : 0);
            a.setUserId(userId);
            a.setBadgeName((String) map.get("badge_name"));
            a.setBadgeIcon((String) map.get("badge_icon"));
            a.setCategory((String) map.get("category"));
            a.setDescription((String) map.get("description"));
            a.setXp((Integer) map.get("xp"));
            a.setEarnedDate((String) map.get("earned_date"));
            a.setStatus((String) map.get("status"));
            list.add(a);
        }
        return list;
    }
}
