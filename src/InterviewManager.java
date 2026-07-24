package src;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class InterviewManager {
    private List<Question> questions = new ArrayList<>();
    private Set<String> bookmarkedIds = new HashSet<>();
    private Set<String> completedIds = new HashSet<>();

    public InterviewManager() {
        loadMockQuestions();
    }

    public void addQuestion(Question q) {
        questions.add(q);
    }

    public List<Question> getAllQuestions() {
        return questions;
    }

    public List<Question> filterBySubject(String subject) {
        List<Question> result = new ArrayList<>();
        for (Question q : questions) {
            if (q.subject.equalsIgnoreCase(subject)) {
                result.add(q);
            }
        }
        return result;
    }

    public List<Question> filterByDifficulty(String difficulty) {
        List<Question> result = new ArrayList<>();
        for (Question q : questions) {
            if (q.difficulty.equalsIgnoreCase(difficulty)) {
                result.add(q);
            }
        }
        return result;
    }

    public List<Question> searchQuestions(String query) {
        List<Question> result = new ArrayList<>();
        String lowerQuery = query.toLowerCase();
        for (Question q : questions) {
            if (q.questionText.toLowerCase().contains(lowerQuery) || 
                q.topic.toLowerCase().contains(lowerQuery) || 
                q.subject.toLowerCase().contains(lowerQuery)) {
                result.add(q);
            }
        }
        return result;
    }

    public void toggleBookmark(String qId) {
        if (bookmarkedIds.contains(qId)) {
            bookmarkedIds.remove(qId);
        } else {
            bookmarkedIds.add(qId);
        }
    }

    public void markAsCompleted(String qId, boolean completed) {
        if (completed) {
            completedIds.add(qId);
        } else {
            completedIds.remove(qId);
        }
    }

    public int getCompletionCount() {
        return completedIds.size();
    }

    public int getBookmarkedCount() {
        return bookmarkedIds.size();
    }

    public int getReadinessIndex() {
        if (questions.isEmpty()) return 0;
        return (int) (((double) completedIds.size() / questions.size()) * 100);
    }

    public boolean isBookmarked(String qId) {
        return bookmarkedIds.contains(qId);
    }

    public boolean isCompleted(String qId) {
        return completedIds.contains(qId);
    }

    private void loadMockQuestions() {
        // Load standard high-quality interview questions
        questions.add(new Question("q1", "Technical", "Java", "OOP", 
            "What is the difference between an abstract class and an interface in Java?", 
            "Abstract classes can have state and default implementations. Interfaces (before Java 8) only contain declarations. Java classes can implement multiple interfaces but inherit only one class.", 
            "Medium", 5));
            
        questions.add(new Question("q2", "Technical", "Python", "Data Structures", 
            "What is a Python decorator and how does it work?", 
            "A decorator is a design pattern in Python that allows a user to add new functionality to an existing object without modifying its structure. It is represented by the @decorator syntax.", 
            "Hard", 6));
            
        questions.add(new Question("q3", "Technical", "SQL", "Joins", 
            "Explain the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN.", 
            "INNER JOIN returns records with matching values in both tables. LEFT JOIN returns all records from the left table and matched from the right. RIGHT JOIN is the inverse of LEFT JOIN.", 
            "Easy", 4));
            
        questions.add(new Question("q4", "HR", "Behavioral", "Situational", 
            "Tell me about a time you handled a conflict within a project team.", 
            "Use the STAR method (Situation, Task, Action, Result). Outline the conflict context, your objective intervention, active listening actions, and the positive resolution.", 
            "Medium", 5));

        questions.add(new Question("q5", "GD", "Technology Trends", "Current Affairs", 
            "Is Artificial Intelligence a threat to entry-level software engineering jobs?", 
            "AI acts as a productivity multiplier rather than a complete job replacement. It automates syntax boilerplates but increases the demand for system architecture, testing, and validation skills.", 
            "Easy", 6));
    }
}
