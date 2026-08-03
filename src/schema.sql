-- schema.sql
-- NexusED – MySQL Database Schema & Seed Data

CREATE DATABASE IF NOT EXISTS nexused_db;
USE nexused_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    role VARCHAR(50) DEFAULT 'Student'
);

-- 2. Student Profile Table
CREATE TABLE IF NOT EXISTS student_profile (
    user_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    cgpa DECIMAL(3,2) DEFAULT 0.00,
    photo TEXT,
    selected_career VARCHAR(100) DEFAULT 'AI Student',
    attendance DECIMAL(5,2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3. Semester Marks Table
CREATE TABLE IF NOT EXISTS semester_marks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    semester INT NOT NULL,
    sgpa DECIMAL(3,2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 4. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    subject_name VARCHAR(100) NOT NULL,
    marks INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 5. Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    skill_name VARCHAR(100) NOT NULL,
    level VARCHAR(20) NOT NULL, -- Beginner, Intermediate, Expert
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 6. Career Goals Table
CREATE TABLE IF NOT EXISTS career_goals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    goal_title VARCHAR(100) NOT NULL,
    target_date VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 7. Roadmap Skills Table
CREATE TABLE IF NOT EXISTS roadmap_skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    skill_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'Planned', -- Completed, Ongoing, Planned
    seq_no INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 8. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'Planned', -- Completed, Ongoing, Planned
    github_url VARCHAR(200),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 9. Certifications Table
CREATE TABLE IF NOT EXISTS certifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(150) NOT NULL,
    authority VARCHAR(100) NOT NULL,
    license_number VARCHAR(100),
    date_obtained VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 10. Resumes Table
CREATE TABLE IF NOT EXISTS resumes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    resume_score INT DEFAULT 0,
    ats_score INT DEFAULT 0,
    completion_rate INT DEFAULT 0,
    file_path VARCHAR(250),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 11. Interview Results Table
CREATE TABLE IF NOT EXISTS interview_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    overall_score INT DEFAULT 0,
    tech_score INT DEFAULT 0,
    comm_score INT DEFAULT 0,
    conf_score INT DEFAULT 0,
    facial_score INT DEFAULT 0,
    date_taken VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 12. Coding Progress Table
CREATE TABLE IF NOT EXISTS coding_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    total_solved INT DEFAULT 0,
    easy_solved INT DEFAULT 0,
    medium_solved INT DEFAULT 0,
    hard_solved INT DEFAULT 0,
    streak INT DEFAULT 0,
    favorite_topic VARCHAR(50) DEFAULT 'Arrays',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 13. Recommendations Table
CREATE TABLE IF NOT EXISTS recommendations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    text TEXT NOT NULL,
    priority VARCHAR(10) NOT NULL, -- High, Medium, Low
    status VARCHAR(20) DEFAULT 'Pending', -- Pending, In Progress, Completed
    category VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 14. Daily Goals Table
CREATE TABLE IF NOT EXISTS daily_goals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    text VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    date_assigned VARCHAR(20) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ==========================================
-- SEED DATA FOR TESTING
-- ==========================================

-- Insert Default Student User
INSERT INTO users (user_id, username, password, role) 
VALUES (1, 'kavya', 'kavya', 'Student')
ON DUPLICATE KEY UPDATE user_id=1;

-- Insert Student Profile
INSERT INTO student_profile (user_id, name, email, cgpa, photo, selected_career, attendance)
VALUES (1, 'Kavya', 'kavya@nexused.edu', 8.42, NULL, 'AI Engineer', 88.50)
ON DUPLICATE KEY UPDATE user_id=1;

-- Insert Semester Marks Trend
INSERT INTO semester_marks (user_id, semester, sgpa) VALUES 
(1, 1, 8.20),
(1, 2, 8.55),
(1, 3, 8.10),
(1, 4, 8.80)
ON DUPLICATE KEY UPDATE id=id;

-- Insert Core Skills
INSERT INTO skills (user_id, skill_name, level) VALUES
(1, 'Java', 'Expert'),
(1, 'Python', 'Intermediate'),
(1, 'DBMS', 'Intermediate'),
(1, 'Machine Learning', 'Beginner')
ON DUPLICATE KEY UPDATE id=id;

-- Insert Career Roadmap Tasks
INSERT INTO roadmap_skills (user_id, skill_name, status, seq_no) VALUES
(1, 'Java Core Programming', 'Completed', 1),
(1, 'SQL & DBMS Foundations', 'Completed', 2),
(1, 'Python & ML basics', 'Ongoing', 3),
(1, 'Deep Learning Frameworks', 'Planned', 4),
(1, 'Cloud Deployment Architecture', 'Planned', 5)
ON DUPLICATE KEY UPDATE id=id;

-- Insert Projects
INSERT INTO projects (user_id, title, description, status, github_url) VALUES
(1, 'NexusED Twin Platform', 'Digital twin career index simulator matching skills models.', 'Ongoing', 'github.com/kavya/nexus-twin'),
(1, 'Voice Assistant Pipeline', 'Audio parsing engine with local voice command recognition.', 'Completed', 'github.com/kavya/voice-nlp')
ON DUPLICATE KEY UPDATE id=id;

-- Insert Certifications
INSERT INTO certifications (user_id, title, authority, license_number, date_obtained) VALUES
(1, 'Oracle Certified Professional: Java SE 17', 'Oracle', 'OCP-99238', '2026-03-12'),
(1, 'AWS Cloud Practitioner', 'Amazon Web Services', 'AWS-99120', '2026-06-05')
ON DUPLICATE KEY UPDATE id=id;

-- Insert Resume Details
INSERT INTO resumes (user_id, resume_score, ats_score, completion_rate, file_path) VALUES
(1, 82, 78, 90, 'resume_kavya_ai_engineer.pdf')
ON DUPLICATE KEY UPDATE id=id;

-- Insert Mock Interview Results
INSERT INTO interview_results (user_id, overall_score, tech_score, comm_score, conf_score, facial_score, date_taken) VALUES
(1, 81, 85, 78, 80, 82, '2026-07-23')
ON DUPLICATE KEY UPDATE id=id;

-- Insert Coding Progress
INSERT INTO coding_progress (user_id, total_solved, easy_solved, medium_solved, hard_solved, streak, favorite_topic) VALUES
(1, 45, 20, 20, 5, 5, 'Arrays')
ON DUPLICATE KEY UPDATE id=id;

-- Insert Recommendations
INSERT INTO recommendations (user_id, text, priority, status, category) VALUES
(1, 'Elevate Python and ML skills parameters from Beginner to Intermediate.', 'Medium', 'Pending', 'Skills'),
(1, 'Complete at least 55 additional coding questions in the Coding Tracker.', 'High', 'Pending', 'Coding')
ON DUPLICATE KEY UPDATE id=id;

-- Insert Daily Goals
INSERT INTO daily_goals (user_id, text, is_completed, date_assigned) VALUES
(1, 'Solve 2 DSA questions in Coding Tracker', 1, '2026-07-24'),
(1, 'Update Voice Assistant project details in Projects', 0, '2026-07-24'),
(1, 'Run an AI Mock Interview trial', 0, '2026-07-24')
ON DUPLICATE KEY UPDATE id=id;

-- 15. Events Table
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    organizer VARCHAR(255),
    company_logo TEXT,
    location VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    mode VARCHAR(50), -- Online, Offline, Hybrid
    event_date VARCHAR(50),
    registration_deadline VARCHAR(50),
    category VARCHAR(50), -- Hackathon, Workshop, Conference, Bootcamp, Internship, Coding Contest, Webinar, Tech Meetup
    difficulty VARCHAR(50), -- Beginner, Intermediate, Advanced
    registration_fee VARCHAR(50),
    registration_url TEXT,
    agenda TEXT,
    eligibility TEXT,
    required_skills TEXT,
    has_certificate BOOLEAN DEFAULT FALSE,
    source VARCHAR(50) DEFAULT 'Eventbrite'
);

-- 16. Saved Events Table
CREATE TABLE IF NOT EXISTS saved_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    event_id VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, event_id)
);

-- 17. Registered Events Table
CREATE TABLE IF NOT EXISTS registered_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    event_id VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, event_id)
);

-- 18. Event Cache Sync Log Table
CREATE TABLE IF NOT EXISTS event_cache (
    id INT PRIMARY KEY AUTO_INCREMENT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    last_sync_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed Data for Opportunities
INSERT INTO events (id, title, description, organizer, company_logo, location, latitude, longitude, mode, event_date, registration_deadline, category, difficulty, registration_fee, registration_url, agenda, eligibility, required_skills, has_certificate, source)
VALUES 
('evt_seed_1', 'National Hackathon 2026', 'A 36-hour sprint to build innovative solutions for sustainable tech.', 'TechLabs', 'assets/images/techlabs.png', 'Bangalore, India', 12.9716, 77.5946, 'Offline', '2026-08-15', '2026-08-10', 'Hackathon', 'Intermediate', 'Free', 'https://example.com/hackathon2026', 'Day 1: Hacking kicks off. Day 2: Pitching & Judging.', 'Undergraduate Students', 'Java, Git, SQL', 1, 'Local'),
('evt_seed_2', 'Advanced Web Development Workshop', 'A deep dive into advanced reactive architectures and service workers.', 'Vercel Devs', 'assets/images/vercel.png', 'Online', 0.0, 0.0, 'Online', '2026-08-20', '2026-08-19', 'Workshop', 'Advanced', '$15', 'https://example.com/webworkshop', '10 AM: Service Workers. 1 PM: Edge Rendering.', 'Developers with basic JS experience', 'JavaScript, CSS, HTML5', 1, 'Local'),
('evt_seed_3', 'Java Cloud Native Bootcamp', 'Immersive bootcamp covering Spring Boot, Docker, and AWS deployments.', 'Oracle Academy', 'assets/images/oracle.png', 'Hybrid', 12.9716, 77.5946, 'Hybrid', '2026-09-01', '2026-08-28', 'Bootcamp', 'Beginner', 'Free', 'https://example.com/javacloud', 'Week 1: Spring Boot. Week 2: Containers & K8s.', 'Computer Science majors', 'Java, DBMS', 1, 'Local'),
('evt_seed_4', 'Global Competitive Coding League', 'Compete with elite algorithms minds globally in a 5-hour contest.', 'CodeChef Chapter', 'assets/images/codechef.png', 'Online', 0.0, 0.0, 'Online', '2026-08-05', '2026-08-04', 'Coding Contest', 'Advanced', 'Free', 'https://example.com/contest', '5 PM - 10 PM: 6 Algorithm Problems.', 'Open to all students', 'Java, Python, C++', 0, 'Local')
ON DUPLICATE KEY UPDATE id=id;

-- 19. Uploaded Documents Table
CREATE TABLE IF NOT EXISTS uploaded_documents (
    id VARCHAR(100) PRIMARY KEY,
    user_id INT,
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_size INT,
    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bookmarked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 20. Document Analysis Table
CREATE TABLE IF NOT EXISTS document_analysis (
    document_id VARCHAR(100) PRIMARY KEY,
    summary TEXT,
    notes TEXT,
    topics TEXT,
    keywords TEXT,
    difficulty VARCHAR(50),
    study_time INT,
    FOREIGN KEY (document_id) REFERENCES uploaded_documents(id) ON DELETE CASCADE
);

-- 21. Flashcards Table
CREATE TABLE IF NOT EXISTS flashcards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    document_id VARCHAR(100),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    FOREIGN KEY (document_id) REFERENCES uploaded_documents(id) ON DELETE CASCADE
);

-- 22. MCQs Table
CREATE TABLE IF NOT EXISTS mcqs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    document_id VARCHAR(100),
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer CHAR(1) NOT NULL,
    FOREIGN KEY (document_id) REFERENCES uploaded_documents(id) ON DELETE CASCADE
);

-- 23. Interview & Viva Questions Table
CREATE TABLE IF NOT EXISTS interview_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    document_id VARCHAR(100),
    question TEXT NOT NULL,
    question_type VARCHAR(50), -- 'HR', 'Technical', 'Viva'
    answer_outline TEXT,
    FOREIGN KEY (document_id) REFERENCES uploaded_documents(id) ON DELETE CASCADE
);

-- 24. Chat History Table for NexusAI
CREATE TABLE IF NOT EXISTS chat_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 25. Achievements & Badges Table
CREATE TABLE IF NOT EXISTS achievements (
    achievement_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    badge_name VARCHAR(100) NOT NULL,
    badge_icon VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    xp INT DEFAULT 0,
    earned_date VARCHAR(20),
    status VARCHAR(20) DEFAULT 'Locked', -- 'Unlocked', 'Locked'
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 26. Student Growth Timeline Table
CREATE TABLE IF NOT EXISTS growth_timeline (
    timeline_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    event_date VARCHAR(20) NOT NULL,
    related_module VARCHAR(100),
    completion_percentage INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Seed Data for Achievements & Badges
INSERT INTO achievements (user_id, badge_name, badge_icon, category, description, xp, earned_date, status) VALUES
(1, 'First Login', '🏅', 'Academic', 'Successfully logged into NexusED.', 10, '2026-07-24', 'Unlocked'),
(1, 'Coding Explorer', '💻', 'Coding', 'Solved your first coding problem.', 15, '2026-07-24', 'Unlocked'),
(1, 'Resume Ready', '📄', 'Resume', 'Generated your first professional resume.', 50, '2026-07-25', 'Unlocked'),
(1, 'Interview Beginner', '🎤', 'Interview', 'Completed your first mock interview.', 60, '2026-07-25', 'Unlocked'),
(1, 'Java Master', '🏆', 'Academic', 'Reached Advanced level in Java.', 100, NULL, 'Locked'),
(1, 'Cloud Explorer', '☁', 'Certificates', 'Completed Google Cloud Certification.', 150, NULL, 'Locked'),
(1, 'AI Learner', '🚀', 'Roadmap', 'Completed AI Engineer Roadmap Milestone.', 80, NULL, 'Locked'),
(1, 'Placement Ready', '🎯', 'Career', 'Career Readiness Index reached Industry Ready.', 200, NULL, 'Locked')
ON DUPLICATE KEY UPDATE achievement_id=achievement_id;

-- Seed Data for Growth Timeline
INSERT INTO growth_timeline (user_id, title, description, category, event_date, related_module, completion_percentage) VALUES
(1, 'Joined NexusED', 'Initialized twin profile mapping parameters.', 'Achievements', '2026-07-24', 'Dashboard', 10),
(1, 'Created Student Profile', 'Completed basic profile twin setup metrics.', 'Academic', '2026-07-24', 'Profile', 20),
(1, 'Selected Career Goal', 'Set professional target to AI Engineer.', 'Career', '2026-07-24', 'Roadmap', 30),
(1, 'Completed Java Basics', 'Finished syntax and inheritance fundamentals.', 'Skills', '2026-07-24', 'Skill Tracker', 45),
(1, 'Learned SQL', 'Gained basic understanding of database relations.', 'Skills', '2026-07-24', 'Skill Tracker', 55),
(1, 'Completed Google Cloud Certificate', 'Obtained verified GCP Foundational badge.', 'Certificates', '2026-07-25', 'Certificates', 65),
(1, 'Built Smart Complaint Project', 'Deployed intelligent classifier solution with Github sync.', 'Projects', '2026-07-25', 'Projects', 75),
(1, 'Completed Mock Interview', 'Passed initial Technical Screening session successfully.', 'Interview', '2026-07-25', 'AI Mock Interview', 80),
(1, 'Resume ATS Score Improved to 86%', 'Enhanced resume keywords optimization.', 'Resume', '2026-07-25', 'Resume Analyzer', 85),
(1, 'Solved 100 Coding Problems', 'Milestone completed in Coding Tracker.', 'Coding', '2026-07-26', 'Coding Tracker', 90),
(1, 'Career Readiness reached 78%', 'Graduated to placement readiness stage.', 'Career', '2026-07-26', 'Career Readiness', 95),
(1, 'Industry Ready', 'Unlocked peak technical alignment metrics.', 'Achievements', '2026-07-26', 'Career Readiness', 100)
ON DUPLICATE KEY UPDATE timeline_id=timeline_id;


