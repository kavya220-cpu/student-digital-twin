/**
 * Skill Entity Model Class.
 * NexusED – Student Digital Twin & Growth Intelligence Platform
 */
public class Skill {
    private String name;
    private String level; // Beginner, Intermediate, Advanced, Expert
    private int progress; // 0 to 100
    private String lastUpdated;

    public Skill() {}

    public Skill(String name, String level, int progress, String lastUpdated) {
        this.name = name;
        this.level = level;
        this.progress = progress;
        this.lastUpdated = lastUpdated;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }

    public String getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(String lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    @Override
    public String toString() {
        return "Skill{" +
                "name='" + name + '\'' +
                ", level='" + level + '\'' +
                ", progress=" + progress +
                "%, lastUpdated='" + lastUpdated + '\'' +
                '}';
    }
}
