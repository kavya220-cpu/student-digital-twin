package src;

public class Achievement {
    private int id;
    private int userId;
    private String badgeName;
    private String badgeIcon;
    private String category;
    private String description;
    private int xp;
    private String earnedDate;
    private String status;

    public Achievement() {}

    public Achievement(int id, int userId, String badgeName, String badgeIcon, String category, String description, int xp, String earnedDate, String status) {
        this.id = id;
        this.userId = userId;
        this.badgeName = badgeName;
        this.badgeIcon = badgeIcon;
        this.category = category;
        this.description = description;
        this.xp = xp;
        this.earnedDate = earnedDate;
        this.status = status;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getBadgeName() { return badgeName; }
    public void setBadgeName(String badgeName) { this.badgeName = badgeName; }

    public String getBadgeIcon() { return badgeIcon; }
    public void setBadgeIcon(String badgeIcon) { this.badgeIcon = badgeIcon; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getXp() { return xp; }
    public void setXp(int xp) { this.xp = xp; }

    public String getEarnedDate() { return earnedDate; }
    public void setEarnedDate(String earnedDate) { this.earnedDate = earnedDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
