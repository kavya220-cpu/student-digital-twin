import java.util.ArrayList;
import java.util.List;

/**
 * Manager Class for Student Skills.
 * NexusED – Student Digital Twin & Growth Intelligence Platform
 */
public class SkillManager {
    private final List<Skill> skills;

    public SkillManager() {
        this.skills = new ArrayList<>();
    }

    /**
     * Registers a new skill into the student twin.
     * @param skill The skill object to add.
     */
    public void addSkill(Skill skill) {
        if (skill != null && !skill.getName().trim().isEmpty()) {
            // Avoid adding duplicates by name
            for (Skill s : skills) {
                if (s.getName().equalsIgnoreCase(skill.getName().trim())) {
                    System.out.println("Skill '" + skill.getName() + "' already exists. Use update instead.");
                    return;
                }
            }
            skills.add(skill);
        }
    }

    /**
     * Updates an existing skill's level and progress.
     * @param name The target skill name.
     * @param level New level rating.
     * @param progress New completion progress.
     * @param lastUpdated Timestamp.
     * @return true if found and updated, false otherwise.
     */
    public boolean updateSkill(String name, String level, int progress, String lastUpdated) {
        for (Skill s : skills) {
            if (s.getName().equalsIgnoreCase(name.trim())) {
                s.setLevel(level);
                s.setProgress(Math.max(0, Math.min(100, progress)));
                s.setLastUpdated(lastUpdated);
                return true;
            }
        }
        return false;
    }

    /**
     * Deletes a skill.
     * @param name Name of target skill to delete.
     * @return true if deleted, false otherwise.
     */
    public boolean deleteSkill(String name) {
        for (int i = 0; i < skills.size(); i++) {
            if (skills.get(i).getName().equalsIgnoreCase(name.trim())) {
                skills.remove(i);
                return true;
            }
        }
        return false;
    }

    /**
     * Searches skills matching a query string.
     * @param query The search query.
     * @return List of matching Skill objects.
     */
    public ArrayList<Skill> searchSkill(String query) {
        ArrayList<Skill> results = new ArrayList<>();
        if (query == null || query.trim().isEmpty()) {
            return new ArrayList<>(skills); // Return all if query is empty
        }
        String cleanQuery = query.toLowerCase().trim();
        for (Skill s : skills) {
            if (s.getName().toLowerCase().contains(cleanQuery) || s.getLevel().toLowerCase().contains(cleanQuery)) {
                results.add(s);
            }
        }
        return results;
    }

    /**
     * Calculates the overall aggregated progress of all registered skills.
     * @return Average progress percentage (0.0 to 100.0). Returns 0.0 if no skills are present.
     */
    public double calculateOverallProgress() {
        if (skills.isEmpty()) {
            return 0.0;
        }
        double sum = 0.0;
        for (Skill s : skills) {
            sum += s.getProgress();
        }
        return sum / skills.size();
    }

    /**
     * Fetch the list of all registered skills.
     * @return List of Skill objects.
     */
    public List<Skill> getSkills() {
        return skills;
    }

    /**
     * Standalone main test runner for validation.
     */
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("      NexusED - SkillManager Test Runner          ");
        System.out.println("==================================================");

        SkillManager manager = new SkillManager();

        // Adding skills
        manager.addSkill(new Skill("Java", "Intermediate", 60, "2026-07-23"));
        manager.addSkill(new Skill("Python", "Beginner", 30, "2026-07-22"));
        manager.addSkill(new Skill("SQL", "Advanced", 80, "2026-07-23"));

        System.out.println("Initial Skills count: " + manager.getSkills().size());
        System.out.println("Overall average skill progress: " + manager.calculateOverallProgress() + "%");

        // Updating a skill
        boolean isUpdated = manager.updateSkill("Python", "Intermediate", 55, "2026-07-23");
        System.out.println("\nUpdate Python check: " + isUpdated);
        System.out.println("Python after update: " + manager.searchSkill("Python").get(0));
        System.out.println("New average skill progress: " + manager.calculateOverallProgress() + "%");

        // Search skills
        System.out.println("\nSearching for 'ja' in skills:");
        for (Skill s : manager.searchSkill("ja")) {
            System.out.println("  Found: " + s);
        }

        // Deleting a skill
        boolean isDeleted = manager.deleteSkill("Java");
        System.out.println("\nDeleted Java? " + isDeleted);
        System.out.println("Skills remaining count: " + manager.getSkills().size());

        System.out.println("==================================================");
    }
}
