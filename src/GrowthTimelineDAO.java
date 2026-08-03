package src;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class GrowthTimelineDAO {
    public List<GrowthTimeline> getTimelineByUserId(int userId) {
        List<GrowthTimeline> list = new ArrayList<>();
        List<Map<String, Object>> rawData = DatabaseManager.getGrowthTimeline(userId);

        for (Map<String, Object> map : rawData) {
            GrowthTimeline t = new GrowthTimeline();
            t.setId(map.containsKey("id") ? (Integer) map.get("id") : 0);
            t.setUserId(userId);
            t.setTitle((String) map.get("title"));
            t.setDescription((String) map.get("description"));
            t.setCategory((String) map.get("category"));
            t.setEventDate((String) map.get("event_date"));
            t.setRelatedModule((String) map.get("related_module"));
            t.setCompletionPercentage(map.containsKey("completion_percentage") ? (Integer) map.get("completion_percentage") : 0);
            list.add(t);
        }
        return list;
    }
}
