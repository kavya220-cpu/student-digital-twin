/* roadmap.js */

document.addEventListener('DOMContentLoaded', () => {
  // Fetch Local Storage Data
  const profileData = localStorage.getItem('nexusED_profile');
  
  // Guard Clause: Redirect to Profile Setup if not configured
  if (!profileData) {
    window.toast.show('warning', 'Profile Setup Required', 'Please configure your profile twin to access your roadmap.', 4000);
    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 1500);
    return;
  }

  const profile = JSON.parse(profileData);
  const career = profile.selectedCareer || "AI Engineer";

  // Setup cursor glow coordinates tracking
  document.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('.cursor-glow');
    if (glow) {
      window.requestAnimationFrame(() => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      });
    }
  });

  // Render profile names/avatars in Sidebar
  document.getElementById('roadmap-career-title').textContent = career;
  const sidebarRole = document.getElementById('sidebar-user-career');
  if (sidebarRole) sidebarRole.textContent = career;
  
  const sidebarName = document.getElementById('sidebar-user-name');
  if (sidebarName) sidebarName.textContent = profile.name;

  const sidebarAvatar = document.getElementById('sidebar-user-avatar');
  if (sidebarAvatar) {
    if (profile.photo) {
      sidebarAvatar.innerHTML = `<img src="${profile.photo}" alt="Student Profile picture">`;
    } else {
      const initials = profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      sidebarAvatar.textContent = initials;
    }
  }

  // Roadmap Milestones Database (Expanded 13-step paths matching Java RoadmapGenerator)
  const roadmapData = {
    "AI Engineer": [
      { name: "Python Foundations", desc: "Scripting, loops, functions, lists, dicts, OOP, NumPy and Pandas.", time: "16 Hours", resource: "Python.org Docs" },
      { name: "Object Oriented Programming (OOP)", desc: "Classes, encapsulation, abstraction, inheritance, and SOLID principles.", time: "12 Hours", resource: "Core Java Guides" },
      { name: "Data Structures & Algorithms", desc: "Big-O syntax, binary searches, lists, trees, graphs, sorting and recursions.", time: "28 Hours", resource: "LeetCode Path" },
      { name: "SQL & Database Queries", desc: "Relations, schemas, joins, groups, window functions, and query tuning.", time: "14 Hours", resource: "SQL Zoo Tutorials" },
      { name: "Mathematics & Statistics", desc: "Linear algebra, matrix operations, derivatives, distributions, and probability.", time: "20 Hours", resource: "Khan Academy Stats" },
      { name: "Machine Learning Models", desc: "Regressions, decisions, SVMs, clusters, Scikit-learn, and validation scores.", time: "30 Hours", resource: "Kaggle ML Course" },
      { name: "Deep Learning Foundations", desc: "Neural graphs, weight optimizers, backpropagations, PyTorch, and CNN modules.", time: "35 Hours", resource: "DeepLearning.AI" },
      { name: "Computer Vision (CV) Architectures", desc: "Image filters, convolutions, object detectors, OpenCV, and ResNet layers.", time: "24 Hours", resource: "Stanford CS231n" },
      { name: "Natural Language Processing (NLP)", desc: "Tokenization, bag-of-words, TF-IDF, RNNs, LSTMs, Transformers, and HuggingFace.", time: "24 Hours", resource: "Hugging Face Course" },
      { name: "Generative AI & LLMs", desc: "Prompt engineers, fine-tunings, Vector databases (Pinecone), RAG, and OpenAI APIs.", time: "18 Hours", resource: "LangChain Academy" },
      { name: "AI Capstone Projects", desc: "Synthesizing generative agents, deploying REST APIs, and Docker configurations.", time: "40 Hours", resource: "NexusED Lab boards" },
      { name: "Industry Internship Calibration", desc: "Work on enterprise codebases, code reviews, and scale production systems.", time: "80 Hours", resource: "Internship Sync" },
      { name: "Final Recruitment & Placement Success", desc: "Mock code tests, system designs, vocal interview tests, and resume tune.", time: "20 Hours", resource: "Placement Portal" }
    ],
    "Data Scientist": [
      { name: "Python for Data Science", desc: "NumPy, Pandas, Matplotlib, Jupyter notebooks, and data structures.", time: "18 Hours", resource: "DataCamp Course" },
      { name: "SQL & Database Architectures", desc: "Relational tables, subqueries, indexing, and aggregations.", time: "14 Hours", resource: "SQL Tutorial Path" },
      { name: "Probability & Descriptive Statistics", desc: "Means, medians, variances, Bayes theorem, and hypothesis validations.", time: "20 Hours", resource: "OpenStax Stats" },
      { name: "Data Cleaning & Feature Engineering", desc: "Imputations, outliers, scales, encodings, and dimension reductions (PCA).", time: "16 Hours", resource: "Kaggle Feature course" },
      { name: "Exploratory Data Analysis (EDA)", desc: "Visual analytics, correlation matrices, and distribution check graphs.", time: "12 Hours", resource: "Seaborn Guides" },
      { name: "Supervised Machine Learning", desc: "Linear regression, random forests, boosting, and metric evaluations.", time: "26 Hours", resource: "Scikit-Learn Docs" },
      { name: "Unsupervised ML & Clustering", desc: "K-Means, hierarchical clustering, DBSCAN, and anomaly detection.", time: "16 Hours", resource: "ML Mastery Guides" },
      { name: "Data Visualization & Storytelling", desc: "Build dashboard reports in Tableau, PowerBI, or Plotly Dashboards.", time: "18 Hours", resource: "Tableau Academy" },
      { name: "Big Data Engines (Spark & Hadoop)", desc: "Query large clusters, use PySpark, MapReduce, and cloud nodes.", time: "24 Hours", resource: "Databricks Path" },
      { name: "Deep Learning & NLP Basics", desc: "Basic neural networks, sentiment checkers, and text classifiers.", time: "20 Hours", resource: "TensorFlow Guides" },
      { name: "Analytics Projects", desc: "Perform predictive analytics projects and write reports.", time: "30 Hours", resource: "Github Portfolios" },
      { name: "Data Science Internship", desc: "Align with analytics business cases and design metrics.", time: "80 Hours", resource: "Corporate Projects" },
      { name: "Final Interview & Placement", desc: "Case study practice, statistics boards, and resume reviews.", time: "18 Hours", resource: "Mock Portals" }
    ],
    "Software Engineer": [
      { name: "Programming Fundamentals (Java/C++)", desc: "Variables, control flows, functions, loops, memory and compilations.", time: "20 Hours", resource: "Coding Academy" },
      { name: "Object Oriented Programming (OOP)", desc: "Encapsulation, inheritance, polymorphism, interfaces, and patterns.", time: "14 Hours", resource: "OOP standards book" },
      { name: "Data Structures & Algorithms (DSA)", desc: "Complexity levels, recursion, sorting, stacks, trees, and path trackers.", time: "32 Hours", resource: "LeetCode Boards" },
      { name: "SQL & NoSQL Database Management", desc: "Relational queries, indexings, transactions, and MongoDB schemas.", time: "16 Hours", resource: "Database Core Guides" },
      { name: "Operating Systems & Linux Basics", desc: "Processes, thread pools, file paths, terminals, and bash commands.", time: "16 Hours", resource: "Linux Academy" },
      { name: "SOLID Architecture & Clean Coding", desc: "Single responsibility, open-closed principles, and refactoring guidelines.", time: "10 Hours", resource: "Clean Code Book" },
      { name: "Software Design Patterns", desc: "Singleton, Factories, Observers, Decorators, and MVC frameworks.", time: "14 Hours", resource: "Refactoring.Guru" },
      { name: "System Design & Scale Architectures", desc: "Load balancers, CDN nodes, cache layers, and scale configurations.", time: "24 Hours", resource: "Grokking System Design" },
      { name: "Software Testing & QA (JUnit)", desc: "Unit validations, assertions, mock environments, and integration checks.", time: "14 Hours", resource: "JUnit 5 Tutorial" },
      { name: "CI/CD Build Pipelines", desc: "Git branches, GitHub Actions, Docker builds, and cloud deployments.", time: "18 Hours", resource: "DevOps Basics Path" },
      { name: "Collaborative Capstone Projects", desc: "Collaborate via Git pull reviews to deploy operational endpoints.", time: "35 Hours", resource: "NexusED Sandbox" },
      { name: "Software Engineer Internship", desc: "Work on live enterprise development teams and logs systems.", time: "80 Hours", resource: "Internship board" },
      { name: "Placement Board Success", desc: "Algorithm speed tests, mock system design reviews, and mock tests.", time: "20 Hours", resource: "Placement Portal" }
    ],
    "Java Developer": [
      { name: "Java Basics & Logical Syntax", desc: "Java syntax, JVM pathways, compiling, data types, and conditions.", time: "14 Hours", resource: "Oracle Java Docs" },
      { name: "Object Oriented Programming (OOP)", desc: "Inheritance, encapsulation, interface binds, and packages.", time: "12 Hours", resource: "Java OOP Guides" },
      { name: "Java Collections & Generics Framework", desc: "ArrayList, HashMap, Set interfaces, and type safety.", time: "18 Hours", resource: "Java Collections course" },
      { name: "Multi-threading & Memory management", desc: "Threads, sync blocks, garbage collections, and memory leaks.", time: "16 Hours", resource: "Baeldung Java Threads" },
      { name: "SQL & JDBC Database Access", desc: "Database connections, statements, SQL queries, and result mappings.", time: "12 Hours", resource: "JDBC Tutorials" },
      { name: "Hibernate & JPA (ORM Frameworks)", desc: "Entity mapping, sessions, transactions, and criteria queries.", time: "18 Hours", resource: "Hibernate Core" },
      { name: "Spring Framework Core & Beans", desc: "Dependency injection, IOC containers, configurations, and annotations.", time: "20 Hours", resource: "Spring.io Guides" },
      { name: "Spring Boot Microservices", desc: "Auto-configurations, endpoints, JPA integrations, and Actuators.", time: "24 Hours", resource: "Spring Boot course" },
      { name: "Spring Security & JWT Authentication", desc: "User authentications, filters, roles, and JSON Web Tokens.", time: "16 Hours", resource: "Spring Security Docs" },
      { name: "REST API Development & Testing", desc: "Controllers, JSON files, Postman tests, and Mockito tests.", time: "14 Hours", resource: "Mockito Tutorials" },
      { name: "Enterprise Java Capstones", desc: "Build transactional microservices with databases.", time: "30 Hours", resource: "Github Projects" },
      { name: "Java Developer Internship", desc: "Support business microservices and database migrations.", time: "80 Hours", resource: "Corporate Sync" },
      { name: "Final Recruitment Placements", desc: "Java coding puzzles, database queries, and garbage collection checks.", time: "18 Hours", resource: "Placement Board" }
    ],
    "Full Stack Developer": [
      { name: "HTML5 & CSS3 Responsive Frameworks", desc: "Semantic tags, CSS grid layouts, variables, media queries, and animations.", time: "12 Hours", resource: "W3Schools HTML/CSS" },
      { name: "JavaScript & DOM Manipulations", desc: "Scopes, functions, events, listeners, arrays, and DOM trees.", time: "18 Hours", resource: "MDN Web JS Docs" },
      { name: "Asynchronous JS & API Interfacing", desc: "Promises, async/await, fetch calls, and JSON data parsing.", time: "14 Hours", resource: "JavaScript Info" },
      { name: "Frontend Libraries (React / Vue)", desc: "React hooks, component lifecycles, states, and virtual DOMs.", time: "24 Hours", resource: "React.dev Tutorials" },
      { name: "State Management (Redux / Context)", desc: "Global stores, actions, reducers, and context variables.", time: "12 Hours", resource: "Redux Toolkit docs" },
      { name: "Node.js & Express Frameworks", desc: "Backend servers, middlewares, route handlers, and error catching.", time: "20 Hours", resource: "Node.js Academy" },
      { name: "SQL & MongoDB NoSQL Schemas", desc: "Relational queries, Mongo collections, Mongoose models, and queries.", time: "16 Hours", resource: "MongoDB University" },
      { name: "Web Security Protocols & Cookies", desc: "HTTPS, CORS headers, JWT tokens, hashes, and session cookies.", time: "12 Hours", resource: "Web Security Path" },
      { name: "Git Workflows & Docker containers", desc: "GitHub collaborations, Dockerfiles, volumes, and container runs.", time: "14 Hours", resource: "Docker Core Guides" },
      { name: "AWS Deployment & Cloud hosting", desc: "EC2 instances, S3 buckets, PM2 servers, and Nginx configurations.", time: "18 Hours", resource: "AWS Academy" },
      { name: "Full Stack Web App Capstone", desc: "Deploy dynamic web apps with authentication and databases.", time: "30 Hours", resource: "NexusED Sandbox" },
      { name: "Full Stack Internship Calibration", desc: "Collaborate on visual upgrades and back-end endpoints.", time: "80 Hours", resource: "Internship Portal" },
      { name: "Placement Interviews", desc: "Build dynamic portfolios, solve code tests, and pass mocks.", time: "18 Hours", resource: "Mock Portals" }
    ],
    "Cloud Engineer": [
      { name: "Linux Administration & Scripting", desc: "Sysadmin checks, directories, bash loops, cron tasks, and logs.", time: "16 Hours", resource: "Linux Academy" },
      { name: "Computer Networking & VPC structures", desc: "Subnet masks, DNS routes, firewalls, and TCP/IP routes.", time: "14 Hours", resource: "Network Basics" },
      { name: "AWS / Azure Infrastructure Fundamentals", desc: "VM servers, serverless paths, storage buckets, and DB networks.", time: "20 Hours", resource: "AWS Practitioner Path" },
      { name: "Identity & Access Management (IAM)", desc: "Access groups, credentials, IAM policies, and bucket rules.", time: "12 Hours", resource: "Cloud Security Docs" },
      { name: "Cloud Storage & Database management", desc: "RDS systems, DynamoDB schemas, and S3 file configurations.", time: "14 Hours", resource: "AWS Database course" },
      { name: "Infrastructure as Code (IaC - Terraform)", desc: "Provision networks, security groups, and servers programmatically.", time: "18 Hours", resource: "HashiCorp Learn" },
      { name: "Container Virtualization (Docker)", desc: "Docker images, bridges, networks, volumes, and custom Dockerfiles.", time: "14 Hours", resource: "Docker Tutorials" },
      { name: "Cluster Orchestrations (Kubernetes)", desc: "Pods, namespaces, configs, load balancers, and ingresses.", time: "22 Hours", resource: "K8s Academy" },
      { name: "Serverless Architectures & Lambda", desc: "Deploy functions, set triggers, API Gateways, and event routes.", time: "14 Hours", resource: "Serverless.com Guides" },
      { name: "Cloud Security Protocols & Audits", desc: "KMS keys, network firewalls, and cloud infrastructure logs.", time: "14 Hours", resource: "Cloud Audit Path" },
      { name: "Cloud System Capstone Project", desc: "Deploy scaled multi-tier web architectures.", time: "30 Hours", resource: "GitHub Projects" },
      { name: "Cloud Internship Calibration", desc: "Assist operations teams with automation scripts.", time: "80 Hours", resource: "Corporate Sync" },
      { name: "Final Placement & Recruitment", desc: "Review cloud architectures and cost estimations.", time: "20 Hours", resource: "Placement Portal" }
    ],
    "Cybersecurity Engineer": [
      { name: "Computer Networks & Packet Inspections", desc: "Network protocols, Wireshark captures, TCP handshakes, and ports.", time: "18 Hours", resource: "Wireshark Labs" },
      { name: "Linux Server Security Configuration", desc: "System locks, permissions, logs tracking, and iptables configs.", time: "14 Hours", resource: "Securing Linux Path" },
      { name: "Cryptography (Symmetric/Asymmetric)", desc: "AES, DES, RSA public keys, TLS handshakes, and checksum hashes.", time: "16 Hours", resource: "Crypto Course" },
      { name: "VPNs & Intrusion Sensors (IDS/IPS)", desc: "Snort rules, sensor nodes, firewalls, and VPN paths.", time: "14 Hours", resource: "Sensor Setup Guides" },
      { name: "Identity Security & Directories (LDAP)", desc: "Active Directory controls, LDAP paths, SSO, and MFA.", time: "12 Hours", resource: "IAM security core" },
      { name: "Penetration Testing Tools (Nmap/Metasploit)", desc: "Vulnerability scans, buffer overflows, and Metasploit scripts.", time: "24 Hours", resource: "TryHackMe Path" },
      { name: "OWASP Top 10 Web Application Vulnerabilities", desc: "SQL injections, XSS vulnerabilities, broken auth, and CSRF tests.", time: "18 Hours", resource: "OWASP Guides" },
      { name: "Threat Modeling Strides (STRIDE)", desc: "Spoofing, tampering, information disclosures, and threat graphs.", time: "12 Hours", resource: "Threat Modeling book" },
      { name: "Security Information Logging (SIEM)", desc: "Splunk dashboards, log aggregations, alerts, and incident rules.", time: "14 Hours", resource: "Splunk Academy" },
      { name: "Incidence Response & Disaster Recovery", desc: "Isolate breaches, trace malware, collect logs, and restore data.", time: "16 Hours", resource: "Incident Portal" },
      { name: "Cybersecurity Capstone Projects", desc: "Perform penetration audits and write vulnerability reports.", time: "30 Hours", resource: "Security Portfolios" },
      { name: "Security Internship Calibration", desc: "Analyze audit logs and configure corporate firewalls.", time: "80 Hours", resource: "Internship Portal" },
      { name: "Final Placement Boards", desc: "OWASP defenses, cryptographic codes, and network audits.", time: "18 Hours", resource: "Placement portal" }
    ],
    "DevOps Engineer": [
      { name: "Linux Systems & Shell Automations", desc: "Bash scripts, log monitors, cron automations, and commands.", time: "16 Hours", resource: "Linux Shell course" },
      { name: "Git Version Control & Branching Models", desc: "Merge conflicts, rebasing, tags, hooks, and release paths.", time: "12 Hours", resource: "Git Pro Book" },
      { name: "CI/CD Build Pipelines (Jenkins/GitHub Actions)", desc: "Automated test flows, build triggers, caches, and cloud deploys.", time: "20 Hours", resource: "CI/CD Academy" },
      { name: "Docker Containers & Bridges", desc: "Build images, write Dockerfiles, configure volumes, and link networks.", time: "14 Hours", resource: "Docker Docs" },
      { name: "Kubernetes Orchestration & Helm Charts", desc: "Pods, scaling nodes, services, secrets, and Helm chart packages.", time: "22 Hours", resource: "K8s Course" },
      { name: "Terraform Infrastructure Provisioning", desc: "State management, variable declarations, and Terraform configurations.", time: "18 Hours", resource: "HashiCorp Learn" },
      { name: "Configuration Management (Ansible)", desc: "Write playbooks, configure hosts, tasks, and automate configurations.", time: "14 Hours", resource: "Ansible Tutorials" },
      { name: "Telemetry Monitoring (Prometheus/Grafana)", desc: "Track system metrics, create alerts, and design Grafana dashboards.", time: "14 Hours", resource: "Grafana Course" },
      { name: "Log Aggregations (ELK Stack)", desc: "Configure Elasticsearch, Logstash inputs, and Kibana logs.", time: "12 Hours", resource: "Elastic University" },
      { name: "Site Reliability Engineering (SRE) Basics", desc: "Understand SLAs, SLOs, SLIs, error budgets, and system margins.", time: "12 Hours", resource: "Google SRE Book" },
      { name: "DevOps Capstone project", desc: "Build CI/CD pipelines deploying container microservices.", time: "30 Hours", resource: "NexusED Sandbox" },
      { name: "DevOps Internship Calibration", desc: "Maintain continuous pipelines and log aggregations.", time: "80 Hours", resource: "Corporate Sync" },
      { name: "Final Placement Boards", desc: "Pipeline design, Docker configurations, and container scaling.", time: "20 Hours", resource: "Placement Portal" }
    ],
    "Mobile App Developer": [
      { name: "Kotlin / Swift Syntax Fundamentals", desc: "Language syntax, classes, null safety checks, arrays, and lists.", time: "14 Hours", resource: "Android/iOS Docs" },
      { name: "Mobile UI Layouts (Compose / SwiftUI)", desc: "Declarative layouts, themes, scrolling grids, and custom layouts.", time: "16 Hours", resource: "Jetpack Compose Guides" },
      { name: "Local Storage Databases (SQLite/Room)", desc: "Entity tables, DAO queries, migrations, and Room persistence.", time: "14 Hours", resource: "Android Room Course" },
      { name: "Asynchronous programming (Coroutines)", desc: "Async threads, background jobs, flows, and dispatchers.", time: "12 Hours", resource: "Kotlin Coroutines" },
      { name: "Network API calls & JSON files parsing", desc: "Retrofit clients, JSON parses, and network error handling.", time: "14 Hours", resource: "Retrofit Tutorials" },
      { name: "Clean Mobile Architecture (MVVM)", desc: "Viewmodels, repositories, livedata, and clean dependencies.", time: "16 Hours", resource: "Android Architecture" },
      { name: "Push Notifications & Sync channels", desc: "FCM notifications, background tasks, and sync paths.", time: "12 Hours", resource: "Firebase Docs" },
      { name: "Mobile Security & Key encryption", desc: "Keystores, biometric prompts, and database encryptions.", time: "12 Hours", resource: "Android Security" },
      { name: "Hybrid frameworks (Flutter basics)", desc: "Dart programming, widgets tree, and cross-platform compilations.", time: "14 Hours", resource: "Flutter.dev Guides" },
      { name: "App Store Publishing Protocols", desc: "Generate release keys, optimize packages, and publish.", time: "12 Hours", resource: "Google Play Console" },
      { name: "Mobile App Capstone projects", desc: "Develop and deploy fully operational native apps.", time: "30 Hours", resource: "GitHub Projects" },
      { name: "Mobile Developer Internship", desc: "Assist mobile development teams with updates and logs.", time: "80 Hours", resource: "Internship Portal" },
      { name: "Final Recruitment & Placements", desc: "Java/Kotlin algorithms, mobile lifecycle, and cache checks.", time: "18 Hours", resource: "Placement Portal" }
    ]
  };

  // Render Roadmap Timeline
  renderRoadmap();

  function renderRoadmap() {
    const container = document.getElementById('roadmap-nodes-container');
    if (!container) return;

    container.innerHTML = '';
    const milestones = roadmapData[career];
    if (!milestones) {
      container.innerHTML = `<p class="text-center text-muted py-5">No roadmap configured for selected trajectory.</p>`;
      return;
    }

    // Retrieve active skills to map status and progress
    const activeSkills = JSON.parse(localStorage.getItem('nexusED_skills')) || [];
    let completedCount = 0;

    milestones.forEach((stone, idx) => {
      // Check if skill is present in tracker
      const matchedSkill = activeSkills.find(s => s.name.toLowerCase() === stone.name.toLowerCase());
      
      let status = "not-started";
      let progress = 0;
      let level = "Beginner";

      if (matchedSkill) {
        progress = matchedSkill.progress;
        level = matchedSkill.level;
        if (progress === 100) {
          status = "completed";
          completedCount++;
        } else if (progress > 0) {
          status = "in-progress";
        }
      }

      // Format status text
      let statusText = "Not Started";
      let statusClass = "not-started";
      let iconMarkup = '<i data-lucide="circle"></i>';

      if (status === "completed") {
        statusText = "Completed";
        statusClass = "completed";
        iconMarkup = '<i data-lucide="check-circle-2"></i>';
      } else if (status === "in-progress") {
        statusText = "In Progress";
        statusClass = "in-progress";
        iconMarkup = '<i data-lucide="activity"></i>';
      }

      // Estimate deadline based on index (e.g. Weeks 1-2, etc.)
      const startWeek = Math.floor(idx * 1.5) + 1;
      const endWeek = Math.floor((idx + 1) * 1.5);
      const deadlineText = `Deadline: Week ${startWeek}-${endWeek}`;

      // Assemble card HTML
      const card = document.createElement('article');
      card.className = `roadmap-step-card animate__animated animate__fadeInUp`;
      card.setAttribute('data-skill-name', stone.name);
      card.setAttribute('data-status', status);

      card.innerHTML = `
        <div class="card-header-row">
          <div class="card-title-group">
            <span class="milestone-index">Milestone ${idx + 1} • ${level}</span>
            <h3>${stone.name}</h3>
          </div>
          <span class="status-badge ${statusClass}">
            ${iconMarkup}
            <span>${statusText}</span>
          </span>
        </div>

        <p class="card-desc">${stone.desc}</p>

        <!-- Progress bar indicator -->
        <div class="card-progress-section">
          <div class="card-progress-info">
            <span>Milestone Progress</span>
            <span>${progress}%</span>
          </div>
          <div class="card-progress-bar-track">
            <div class="card-progress-bar-fill" style="width: ${progress}%"></div>
          </div>
        </div>

        <!-- Metadata row -->
        <div class="card-metadata">
          <div class="meta-item">
            <i data-lucide="calendar"></i>
            <span>${deadlineText}</span>
          </div>
          <div class="meta-item">
            <i data-lucide="clock"></i>
            <span>${stone.time}</span>
          </div>
          <div class="meta-item">
            <i data-lucide="book-open"></i>
            <a href="#" class="resource-badge">${stone.resource}</a>
          </div>
        </div>

        <!-- Quick toggle action -->
        <div class="card-actions-row">
          <button type="button" class="btn-toggle-status" onclick="toggleMilestoneStatus('${stone.name}', '${status}')">
            <i data-lucide="refresh-cw"></i>
            <span>Toggle Status</span>
          </button>
        </div>
      `;

      container.appendChild(card);
    });

    // Update Completion ratio badge
    document.getElementById('roadmap-completion-ratio').textContent = `${completedCount} / ${milestones.length} Milestones Done`;

    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Trigger stagger enter animation
    if (typeof gsap !== 'undefined') {
      const cardsList = container.querySelectorAll('.roadmap-step-card');
      gsap.fromTo(cardsList, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out' }
      );
    }
  }

  // --- Exposed function to toggle milestone status ---
  window.toggleMilestoneStatus = (skillName, currentStatus) => {
    let activeSkills = JSON.parse(localStorage.getItem('nexusED_skills')) || [];
    const matchedIdx = activeSkills.findIndex(s => s.name.toLowerCase() === skillName.toLowerCase());

    let nextProgress = 0;
    let nextLevel = "Beginner";
    
    // Cycle: not-started (0%) -> in-progress (50%) -> completed (100%) -> not-started (0%)
    if (currentStatus === "not-started") {
      nextProgress = 50;
      nextLevel = "Intermediate";
      window.toast.show('info', 'Milestone In Progress', `Started learning ${skillName}!`, 2500);
    } else if (currentStatus === "in-progress") {
      nextProgress = 100;
      nextLevel = "Advanced";
      window.toast.show('success', 'Milestone Completed', `Completed learning ${skillName}!`, 3000);
    } else {
      nextProgress = 0;
      nextLevel = "Beginner";
      window.toast.show('info', 'Milestone Reset', `${skillName} was reset to Not Started.`, 2500);
    }

    const todayStr = new Date().toISOString().split('T')[0];

    if (matchedIdx >= 0) {
      if (nextProgress === 0) {
        // If reset, remove it from active skills list
        activeSkills.splice(matchedIdx, 1);
      } else {
        // Update existing skill
        activeSkills[matchedIdx].progress = nextProgress;
        activeSkills[matchedIdx].level = nextLevel;
        activeSkills[matchedIdx].lastUpdated = todayStr;
      }
    } else {
      if (nextProgress > 0) {
        // Add new skill object
        activeSkills.push({
          name: skillName,
          level: nextLevel,
          progress: nextProgress,
          lastUpdated: todayStr
        });
      }
    }

    localStorage.setItem('nexusED_skills', JSON.stringify(activeSkills));
    
    // Re-render
    renderRoadmap();
  };

  // --- Logout trigger ---
  const logoutBtn = document.getElementById('logout-trigger');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('nexusED_profile');
      window.toast.show('info', 'Signed Out', 'Tearing down twin session...', 2500);
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    });
  }

});
