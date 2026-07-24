# NexusED – Student Digital Twin & Growth Intelligence Platform

NexusED is a premium, state-of-the-art academic optimization and career readiness platform designed to empower students with growth intelligence. Utilizing a Glassmorphic SaaS design aesthetic, NexusED integrates student performance metrics, predictive career path calculators, an Opportunity Hub, and an advanced **AI Study Assistant** powered by the Google Gemini API.

---

## 🚀 Key Modules & Features

### 1. 📚 AI Study Assistant (New Module)
An intelligent learning companion that processes uploaded materials (PDF, PPT, DOCX, PNG, JPG, JPEG) to compile customized study resources:
*   **Upload Center**: Drag & drop or browse local files under 25MB.
*   **Study Analysis**: Generates 5-point summaries, detailed study notes, key concepts, and technical keywords.
*   **Practice Center**: Dynamic quiz deck featuring 20 MCQs with instant scoring and 3D flipping flashcards.
*   **Interview & Viva Prep**: Formulates technical, HR, and university-style viva questions with outline answers.
*   **Conversational Tutor (Ask AI)**: Docked chatbot interface to ask questions directly about document contents.
*   **Actionable Downloads**: Export notes, MCQs, and flashcards to text files.

### 2. 🚀 Career Hub
*   **Opportunity Hub**: Integrates Eventbrite APIs to sync live hackathons, coding contests, workshops, and webinars. Uses OpenStreetMap mapping for offline location rendering.
*   **Resume Builder & Analyzer**: Formulates high-scoring resumes and evaluates ATS compatibility ratings.
*   **AI Mock Interview**: Interactive verbal simulations tracking breakdown scores (Technical, HR, facial expressions).

### 3. 🎓 Academic Tracker
*   **Student Digital Twin**: Interactive dashboard mapping CGPA, attendance metrics, and predictive career readiness scores.
*   **Skill Tracker**: Maps student capabilities (Beginner, Intermediate, Expert) to target career tracks.
*   **Roadmaps**: Custom sequential milestones tracking progress.

---

## 🛠️ Technology Stack
*   **Frontend**: HTML5, Vanilla CSS3 (Glassmorphism, CSS Variables), JavaScript (ES6+), GSAP Animations, Lucide Icons, Bootstrap Grid & Utilities.
*   **Backend**: Java EE (Servlets, MVC Architecture), JDBC, event/data caching layers.
*   **APIs**: Google Gemini Flash 1.5 API, Eventbrite REST API.
*   **Database**: MySQL Server 8.0.

---

## 📦 Project Directory Structure

```text
├── assets/
│   ├── css/            # CSS Stylesheets (variables, theme, animations, etc.)
│   ├── js/             # Client Javascript files (auth, toast, validation, etc.)
│   └── images/         # Static visual banners and avatars
├── src/
│   ├── DatabaseManager.java         # JDBC Connection configuration
│   ├── DocumentRepository.java      # SQL queries for study assistant data
│   ├── GeminiService.java           # Google Gemini API connector & Fallback
│   ├── AnalysisService.java         # Document parser and DDL orchestrator
│   ├── ChatAssistant.java           # Chat tutoring query processor
│   ├── DocumentUploadServlet.java   # Multi-part servlet endpoint mapping
│   ├── EventService.java            # Eventbrite integration servlet
│   ├── schema.sql                   # DDL database schema definitions
│   └── config.properties            # Private API keys
├── study-assistant.html             # AI Study Assistant landing page
├── analysis.html                    # Study analysis dashboard
└── index.html                       # Login landing entry point
```

---

## ⚙️ Setup & Installation

### 1. Database Setup (MySQL)
1. Open your MySQL terminal or Workbench and log in:
   ```sql
   mysql -u root -p
   ```
2. Re-create the database using the seeding script (the schema is pre-configured to build all 23 tables):
   ```sql
   CREATE DATABASE IF NOT EXISTS nexused_new_db;
   USE nexused_new_db;
   SOURCE C:/Users/kavya/schema_new.sql;
   ```

### 2. API Key Configuration
Add your Google Gemini API key to `src/config.properties`:
```properties
gemini.api.key=<YOUR_GEMINI_API_KEY>
```

### 3. Build & Deploy
1. Compile the project files:
   ```bash
   javac src/*.java
   ```
2. Copy the compiled `.class` files and the static directories (`/assets`, `/pages`, etc.) into your local **Tomcat webapps** root directory.
3. Start your Tomcat server and navigate to `http://localhost:8080/index.html` to access the application!
