package src;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class InterviewEngine {
    private List<Question> questions = new ArrayList<>();
    private Map<String, String> studentAnswers = new HashMap<>();
    private Map<String, Integer> timeSpentPerQuestion = new HashMap<>(); // in seconds
    private String interviewType;
    private int currentQuestionIndex = 0;

    public InterviewEngine(String interviewType) {
        this.interviewType = interviewType;
        loadQuestionsForType();
    }

    public void loadQuestionsForType() {
        questions.clear();
        
        if (interviewType.equalsIgnoreCase("Technical")) {
            questions.add(new Question("tech1", "Technical", "Java", "OOP concepts", 
                "What is the difference between an abstract class and an interface in Java?", 
                "Abstract class, concrete methods, state, extends, implements, interface, inherit, default implementation", 
                "Medium", 3));
            
            questions.add(new Question("tech2", "Technical", "Python", "Multithreading", 
                "What is the Global Interpreter Lock (GIL) in Python and why does it matter?", 
                "GIL, global interpreter lock, thread, mutex, execution, memory, parallel, python, CPython", 
                "Hard", 4));
            
            questions.add(new Question("tech3", "Technical", "DBMS", "Transactions", 
                "What are the ACID properties in DBMS?", 
                "Atomicity, Consistency, Isolation, Durability, ACID, transaction, safety, commit, state", 
                "Medium", 3));
            
            questions.add(new Question("tech4", "Technical", "Operating Systems", "Memory", 
                "What is virtual memory and how does paging work?", 
                "Virtual memory, paging, page table, frame, physical address, RAM, swap, logical address, fragmentation", 
                "Hard", 4));
            
            questions.add(new Question("tech5", "Technical", "Computer Networks", "Protocols", 
                "What is the difference between TCP and UDP protocols?", 
                "TCP, UDP, connection-oriented, connectionless, handshake, reliable, fast, packet delivery, checksum", 
                "Easy", 2));

            questions.add(new Question("tech6", "Technical", "OOP", "Pillars", 
                "Describe the four core pillars of Object-Oriented Programming.", 
                "Encapsulation, Inheritance, Polymorphism, Abstraction, objects, classes, override, hide state", 
                "Easy", 3));

            questions.add(new Question("tech7", "Technical", "SQL", "Queries", 
                "Explain the difference between INNER JOIN and LEFT JOIN in SQL.", 
                "Inner join, left join, table, match, null, values, rows, query, data", 
                "Easy", 2));

            questions.add(new Question("tech8", "Technical", "DSA", "Algorithms", 
                "What is the difference between Quick Sort and Merge Sort?", 
                "Quick sort, Merge sort, divide and conquer, pivot, stable, complexity, auxiliary memory, sorting, in-place", 
                "Medium", 4));

        } else if (interviewType.equalsIgnoreCase("HR")) {
            questions.add(new Question("hr1", "HR", "General", "Self Introduction", 
                "Tell me about yourself.", 
                "Background, education, experience, career path, passion, skills, achievements, hobby", 
                "Easy", 3));
            
            questions.add(new Question("hr2", "HR", "General", "Fit", 
                "Why should we hire you?", 
                "Skills, qualification, fit, value, work ethic, solve, problems, align, growth, contribution", 
                "Easy", 2));
            
            questions.add(new Question("hr3", "HR", "General", "Strengths", 
                "What are your greatest strengths?", 
                "Adaptability, fast learner, problem-solving, communication, teamwork, dedidcation, detail-oriented, leadership", 
                "Easy", 2));
            
            questions.add(new Question("hr4", "HR", "General", "Weaknesses", 
                "What are your weaknesses?", 
                "Public speaking, delegating, detail overfocus, balance, workaholic, learn, improve, self-aware", 
                "Medium", 3));
            
            questions.add(new Question("hr5", "HR", "General", "Career Goals", 
                "Where do you see yourself in five years?", 
                "Growth, leadership, expertise, contribution, management, learn, tech lead, senior role, stability", 
                "Medium", 3));

        } else if (interviewType.equalsIgnoreCase("Behavioral")) {
            questions.add(new Question("beh1", "Behavioral", "Leadership", "Coordination", 
                "Describe a situation where you had to lead a diverse team on short notice.", 
                "Leadership, coordinate, delegation, deadline, communication, listen, timeline, delegate, objective", 
                "Medium", 4));
            
            questions.add(new Question("beh2", "Behavioral", "Conflict Resolution", "Resolution", 
                "How do you handle conflict or differing opinions within a project team?", 
                "Conflict, compromise, listening, objective, STAR, goals, resolve, team, perspective, values", 
                "Medium", 3));
            
            questions.add(new Question("beh3", "Behavioral", "Teamwork", "Collaboration", 
                "Describe a time you worked in a team to achieve a difficult goal.", 
                "Team, goal, collaboration, coordinate, communication, milestones, challenge, support, result", 
                "Easy", 3));
            
            questions.add(new Question("beh4", "Behavioral", "Communication", "Simplifying", 
                "How do you explain a complex technical concept to a non-technical manager?", 
                "Analogy, simplify, layman, business value, check-in, examples, avoid jargon, communicate", 
                "Easy", 3));
        } else {
            // Aptitude, GD, Coding general fallback questions
            questions.add(new Question("gen1", "Aptitude", "Logic", "Solving", 
                "How would you approach solving a riddle or complex mathematical puzzle?", 
                "Pattern, logic, breakdown, analyze, solve, steps, iterate, formula, verify", 
                "Medium", 3));
            
            questions.add(new Question("gen2", "GD", "Technology Trends", "Discussion", 
                "Is Artificial Intelligence a threat or a tool for entry-level developers?", 
                "Tool, threat, automation, productivity, learning, code assistance, prompt engineering, validate, balance", 
                "Medium", 4));
        }
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public Question getCurrentQuestion() {
        if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.size()) {
            return questions.get(currentQuestionIndex);
        }
        return null;
    }

    public boolean nextQuestion() {
        if (currentQuestionIndex < questions.size() - 1) {
            currentQuestionIndex++;
            return true;
        }
        return false;
    }

    public boolean previousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            return true;
        }
        return false;
    }

    public void submitAnswer(String questionId, String answer, int timeSpentSeconds) {
        studentAnswers.put(questionId, answer);
        timeSpentPerQuestion.put(questionId, timeSpentSeconds);
    }

    public String getAnswer(String questionId) {
        return studentAnswers.getOrDefault(questionId, "");
    }

    public int getTimeSpent(String questionId) {
        return timeSpentPerQuestion.getOrDefault(questionId, 0);
    }

    public int getCurrentQuestionIndex() {
        return currentQuestionIndex;
    }

    public String getInterviewType() {
        return interviewType;
    }

    public Map<String, String> getStudentAnswers() {
        return studentAnswers;
    }

    public Map<String, Integer> getTimeSpentPerQuestion() {
        return timeSpentPerQuestion;
    }
}
