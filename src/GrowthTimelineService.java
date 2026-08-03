package src;

import java.util.List;

public class GrowthTimelineService {
    private GrowthTimelineDAO growthTimelineDAO = new GrowthTimelineDAO();

    public List<GrowthTimeline> getTimelineForUser(int userId) {
        return growthTimelineDAO.getTimelineByUserId(userId);
    }
}
