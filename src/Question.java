package src;

public class Question {
    public String id;
    public String category; // HR, Technical, Aptitude, GD, Coding
    public String subject;  // Java, Python, C, C++, DBMS, OS, Computer Networks, OOP, SQL, Data Structures, Algorithms, Machine Learning, Cloud Computing, Behavioral, Situational, Communication, Leadership, Current Affairs, Technology Trends, Business Topics
    public String topic;    
    public String questionText;
    public String answerText;
    public String difficulty; // Easy, Medium, Hard
    public int estTimeMinutes;

    public Question(String id, String category, String subject, String topic, String questionText, String answerText, String difficulty, int estTimeMinutes) {
        this.id = id;
        this.category = category;
        this.subject = subject;
        this.topic = topic;
        this.questionText = questionText;
        this.answerText = answerText;
        this.difficulty = difficulty;
        this.estTimeMinutes = estTimeMinutes;
    }
}
