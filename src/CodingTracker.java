package src;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CodingTracker {
    private List<CodingQuestion> questions;
    private static final int TARGET_SOLVED = 100;

    public CodingTracker() {
        this.questions = new ArrayList<>();
    }

    public void addQuestion(CodingQuestion q) {
        if (q != null) {
            questions.add(q);
        }
    }

    public void updateQuestion(String id, CodingQuestion updated) {
        for (int i = 0; i < questions.size(); i++) {
            if (questions.get(i).getId().equals(id)) {
                questions.set(i, updated);
                return;
            }
        }
    }

    public void deleteQuestion(String id) {
        questions.removeIf(q -> q.getId().equals(id));
    }

    public int getCountEasy() {
        int count = 0;
        for (CodingQuestion q : questions) {
            if ("Easy".equalsIgnoreCase(q.getDifficulty())) {
                count++;
            }
        }
        return count;
    }

    public int getCountMedium() {
        int count = 0;
        for (CodingQuestion q : questions) {
            if ("Medium".equalsIgnoreCase(q.getDifficulty())) {
                count++;
            }
        }
        return count;
    }

    public int getCountHard() {
        int count = 0;
        for (CodingQuestion q : questions) {
            if ("Hard".equalsIgnoreCase(q.getDifficulty())) {
                count++;
            }
        }
        return count;
    }

    public int getCountByTopic(String topic) {
        int count = 0;
        for (CodingQuestion q : questions) {
            if (q.getTopic() != null && q.getTopic().equalsIgnoreCase(topic)) {
                count++;
            }
        }
        return count;
    }

    public int getTotalSolved() {
        return questions.size();
    }

    public double calculateCodingProgress() {
        if (questions.isEmpty()) return 0.0;
        double progress = ((double) questions.size() / TARGET_SOLVED) * 100.0;
        return Math.min(progress, 100.0);
    }

    public String getFavoriteTopic() {
        if (questions.isEmpty()) return "None";
        Map<String, Integer> topicCounts = new HashMap<>();
        String favorite = "None";
        int max = 0;
        for (CodingQuestion q : questions) {
            String topic = q.getTopic();
            if (topic != null) {
                topicCounts.put(topic, topicCounts.getOrDefault(topic, 0) + 1);
                if (topicCounts.get(topic) > max) {
                    max = topicCounts.get(topic);
                    favorite = topic;
                }
            }
        }
        return favorite;
    }

    public List<CodingQuestion> getQuestions() {
        return questions;
    }
}
