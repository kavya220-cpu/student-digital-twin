package src;

import java.util.List;
import java.util.Map;

public class CareerReadiness {
    private double overallPercentage;
    private String level; // Foundation Stage, Developing, Placement Ready, Industry Ready
    private String description;
    private Map<String, Double> contributionBreakdown;
    private List<String> suggestions;

    public CareerReadiness(double overallPercentage, String level, String description,
                           Map<String, Double> contributionBreakdown, List<String> suggestions) {
        this.overallPercentage = overallPercentage;
        this.level = level;
        this.description = description;
        this.contributionBreakdown = contributionBreakdown;
        this.suggestions = suggestions;
    }

    public double getOverallPercentage() { return overallPercentage; }
    public void setOverallPercentage(double overallPercentage) { this.overallPercentage = overallPercentage; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Map<String, Double> getContributionBreakdown() { return contributionBreakdown; }
    public void setContributionBreakdown(Map<String, Double> contributionBreakdown) { this.contributionBreakdown = contributionBreakdown; }

    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }
}
