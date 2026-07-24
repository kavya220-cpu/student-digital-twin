/* career.js */

document.addEventListener('DOMContentLoaded', () => {
  // Option Cards Selection
  const careerCards = document.querySelectorAll('.career-card');
  const roadmapSection = document.getElementById('roadmap-section');
  const nodesBox = document.getElementById('roadmap-nodes-box');
  const finishBtn = document.getElementById('career-finish-btn');

  // Track the active selection
  let selectedCareer = '';

  // Local storage profile verification
  const savedProfile = localStorage.getItem('nexusED_profile');
  if (savedProfile) {
    const profile = JSON.parse(savedProfile);
    window.toast.show('info', `Hello ${profile.name}!`, 'Let\'s align your career goal roadmaps.', 3500);
  }

  // Focus glow coordinates tracking
  document.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('.cursor-glow');
    if (glow) {
      window.requestAnimationFrame(() => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      });
    }
  });

  // Roadmap Data Models (Matching Java RoadmapGenerator ArrayList values)
  const roadmapDatabase = {
    "AI Engineer": [
      { name: "Python Programming", desc: "Master NumPy, Pandas, scripting, and OOP principles in Python." },
      { name: "Java Core", desc: "Build solid logical foundations, arrays, lists, and exception systems." },
      { name: "Data Structures & Algorithms", desc: "Master big-O complexities, sorting, binary trees, and recursive charts." },
      { name: "SQL & Databases", desc: "Create structured schemas, write queries, and design indexes." },
      { name: "Machine Learning models", desc: "Train regressions, Decision Trees, SVMs, and validate datasets." },
      { name: "Deep Learning Foundations", desc: "Synthesize Neural Networks, CNNs, LSTMs, and PyTorch structures." },
      { name: "Production AI Projects", desc: "Deploy models via REST APIs, optimize weights, and test systems." },
      { name: "Career Recruitment & Placement", desc: "Perform behavioral mock tests, refine resumes, and pass interviews." }
    ],
    "Data Scientist": [
      { name: "Python & Data Science Stack", desc: "Develop skills in Pandas, SciPy, and Jupyter notebooks." },
      { name: "SQL & Querying Data", desc: "Master joins, transactions, and window functions." },
      { name: "Probability & Statistics", desc: "Understand distributions, hypothesis tests, and statistics models." },
      { name: "Machine Learning Classifiers", desc: "Implement regression models, random forests, and clusters." },
      { name: "Data Visualization & Dashboards", desc: "Build interactive visual graphs using Tableau, Seaborn, or Plotly." },
      { name: "Big Data & Hadoop Ecosystem", desc: "Query databases using PySpark, MapReduce, and cloud storage." },
      { name: "Capstone Analytics Projects", desc: "Conduct predictive regression tests and present findings." },
      { name: "Industry Recruitment Prep", desc: "Practice SQL case studies and present data findings." }
    ],
    "Software Engineer": [
      { name: "Java & Object Oriented Programming", desc: "Master encapsulation, interfaces, classes, and polymorphism." },
      { name: "Data Structures & Code Efficiency", desc: "Implement custom lists, queues, maps, and graph search models." },
      { name: "Software Design Patterns", desc: "Apply SOLID standards, Factory patterns, and Singleton architectures." },
      { name: "System Design Frameworks", desc: "Architect load balancing systems, caching layers, and database clusters." },
      { name: "Database Management & Indexes", desc: "Design entity schemas, normalizations, and transaction structures." },
      { name: "Software Quality & Testing", desc: "Conduct JUnit tests, mock assertions, and integration checks." },
      { name: "Collaborative Capstone Projects", desc: "Deploy server systems using Git workflows and code reviews." },
      { name: "Technical Interview Success", desc: "Solve algorithm problems, practice mock system boards, and interview." }
    ],
    "Java Developer": [
      { name: "Java Fundamentals", desc: "Understand syntax, garbage collection, variables, and packages." },
      { name: "Object Oriented Design (OOD)", desc: "Build secure classes, extend interfaces, and write abstractions." },
      { name: "Java Collections Framework & Generics", desc: "Utilize Maps, Lists, Sets, and generic data wrappers." },
      { name: "Spring Framework Core", desc: "Implement Dependency Injections, Spring Boot autoconfigs, and Beans." },
      { name: "Hibernate & JPA Persistence", desc: "Map entities, perform transaction logs, and manage SQL sessions." },
      { name: "Microservices Architectures", desc: "Deploy Spring Cloud gateways, Eureka discoverers, and REST services." },
      { name: "Enterprise Java Projects", desc: "Build secure multi-threaded web endpoints with JUnit validations." },
      { name: "Placement & Corporate Alignment", desc: "Refine Java coding challenges and review garbage collection models." }
    ],
    "Full Stack Developer": [
      { name: "HTML5, CSS3, & Design Frameworks", desc: "Build fluid web grid pages with modern layouts." },
      { name: "JavaScript ES6 Essentials", desc: "Master closures, asynchronous callbacks, Promises, and DOM nodes." },
      { name: "React or Vue Client Libraries", desc: "Synthesize reusable state components and route displays." },
      { name: "Node.js & Express REST APIs", desc: "Create robust web servers, route endpoints, and manage cookies." },
      { name: "SQL / NoSQL Database Engines", desc: "Query schemas in MongoDB, PostgreSQL, or database structures." },
      { name: "Git workflows & Deployment", desc: "Collaborate via GitHub, deploy applications on cloud providers." },
      { name: "Full Stack Capstone Projects", desc: "Build full web apps with authentication and payments." },
      { name: "Portfolio Presentation & Recruitment", desc: "Optimize profiles, deploy portfolios, and code live." }
    ],
    "Cloud Engineer": [
      { name: "Linux Administration & Bash scripting", desc: "Configure permissions, monitor logs, and automate workflows." },
      { name: "Computer Networking Foundations", desc: "Configure DNS paths, subnet layers, and secure TCP/IP routes." },
      { name: "Cloud Platforms (AWS or Azure)", desc: "Spin up VM servers, databases, bucket storage, and VPC paths." },
      { name: "Infrastructure as Code (IaC)", desc: "Define network architectures programmatically using Terraform." },
      { name: "Docker & Container Virtualization", desc: "Configure custom Docker images, volumes, and bridge networks." },
      { name: "Kubernetes Orchestration", desc: "Manage container clusters, configurations, and scaling paths." },
      { name: "Cloud Security & Compliance", desc: "Audit cloud IAM roles, encrypt data pipelines, and lock network boundaries." },
      { name: "Technical Interview & Case Studies", desc: "Architect failover systems and present cloud infrastructure." }
    ],
    "Cybersecurity Engineer": [
      { name: "Networking Protocols & Audits", desc: "Audit Wireshark packets, subnets, and TCP handshakes." },
      { name: "Linux Security & Admin", desc: "Lock down kernel parameters, monitor logs, and manage firewalls." },
      { name: "Cryptography & Hashes", desc: "Implement AES encryptions, RSA public keys, and SHA checksum hashes." },
      { name: "Network Defense Firewalls", desc: "Configure intrusion sensors, load filters, and audit VPN nodes." },
      { name: "Penetration Testing & Threats", desc: "Execute Nmap scans, exploit buffer overflows, and trace malware vectors." },
      { name: "Threat Modeling & Risks", desc: "Model application security risks using STRIDE and OWASP standards." },
      { name: "Incident Recovery & Logs", desc: "Analyze audit trace logs, isolate breaches, and write threat logs." },
      { name: "Security Placement Success", desc: "Review OWASP security parameters and pass threat boards." }
    ],
    "DevOps Engineer": [
      { name: "Linux Administration & Shell scripts", desc: "Configure shell automations, manage processes, and edit logs." },
      { name: "Git Version Control Models", desc: "Coordinate release branches, merges, rebases, and hooks." },
      { name: "Continuous Integration & Deployment (CI/CD)", desc: "Build automated pipelines in Jenkins, GitLab, or GitHub Actions." },
      { name: "Docker Containerization", desc: "Containerize microservices, write Dockerfiles, and lock images." },
      { name: "Kubernetes Cluster Scaling", desc: "Synthesize pods, load balancers, deployment charts, and ingresses." },
      { name: "IaC with Terraform & Ansible", desc: "Provision infrastructure and coordinate server setups." },
      { name: "Site Monitoring & Prometheus Alerts", desc: "Track system memory, configure Grafana charts, and parse logs." },
      { name: "Site Reliability Case Reviews", desc: "Resolve live deployment errors and audit scaling architectures." }
    ],
    "Mobile App Developer": [
      { name: "Kotlin or Swift Programming", desc: "Master syntax, static checks, types, and asynchronous calls." },
      { name: "Mobile UI Design Standards", desc: "Build responsive touch grids using Jetpack Compose or SwiftUI." },
      { name: "Local Databases & Persistence", desc: "Configure SQLite datasets, Room DB queries, and file caching." },
      { name: "API Integrations & Networks", desc: "Coordinate network calls, parse JSON files, and connect REST streams." },
      { name: "Mobile State Management", desc: "Orchestrate viewmodels, state flows, and asynchronous data streams." },
      { name: "Mobile Security & Keys", desc: "Implement biometric credentials, encrypt local database files, and protect keys." },
      { name: "App Store Publishing Protocols", desc: "Build signed release bundles, configure keys, and push releases." },
      { name: "Placement & App Reviews", desc: "Build and publish mobile portfolios and review system memory issues." }
    ]
  };

  // Selection click handler
  careerCards.forEach(card => {
    card.addEventListener('click', () => {
      // Clear previous selected state
      careerCards.forEach(c => c.classList.remove('selected'));
      
      // Mark current selected
      card.classList.add('selected');
      selectedCareer = card.getAttribute('data-career');

      window.toast.show('success', 'Goal Calibrated', `Synthesizing ${selectedCareer} career roadmap...`, 3000);

      // Render Roadmap nodes
      renderRoadmap(selectedCareer);
    });
  });

  // Dynamically compile roadmap timeline
  function renderRoadmap(career) {
    const milestones = roadmapDatabase[career];
    if (!milestones) return;

    // Reset container contents
    nodesBox.innerHTML = '';
    
    // Make roadmap section visible
    roadmapSection.style.display = 'block';

    milestones.forEach((stone, idx) => {
      // Create Milestone Card
      const card = document.createElement('div');
      card.className = 'roadmap-node-card';
      
      // Dynamic Icon mapping based on milestone index
      let iconName = 'book-open';
      if (idx === 0) iconName = 'code';
      else if (idx === 1) iconName = 'database';
      else if (idx === 2) iconName = 'git-commit';
      else if (idx === milestones.length - 2) iconName = 'layers';
      else if (idx === milestones.length - 1) iconName = 'award';

      card.innerHTML = `
        <div class="roadmap-node-icon">
          <i data-lucide="${iconName}"></i>
        </div>
        <div class="roadmap-node-details">
          <h4>M${idx + 1}: ${stone.name}</h4>
          <p>${stone.desc}</p>
        </div>
      `;

      nodesBox.appendChild(card);

      // Create connecting arrow indicator if not the last card
      if (idx < milestones.length - 1) {
        const arrow = document.createElement('div');
        arrow.className = 'roadmap-node-arrow';
        arrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
        nodesBox.appendChild(arrow);
      }
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Trigger smooth scroll down to roadmap canvas
    setTimeout(() => {
      roadmapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);

    // Stagger render milestones using GSAP
    if (typeof gsap !== 'undefined') {
      const cardsList = nodesBox.querySelectorAll('.roadmap-node-card');
      const arrowsList = nodesBox.querySelectorAll('.roadmap-node-arrow');

      gsap.fromTo(cardsList, 
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out' }
      );

      gsap.fromTo(arrowsList, 
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.4, stagger: 0.15, delay: 0.3, ease: 'back.out(1.8)' }
      );
    }

    // Reveal finalizer button
    finishBtn.style.display = 'inline-flex';
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(finishBtn, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, delay: 1 });
    }
  }

  // Final Calibration Submission
  if (finishBtn) {
    finishBtn.addEventListener('click', () => {
      // Disable select options
      careerCards.forEach(c => c.style.pointerEvents = 'none');
      
      // Update button loading state
      finishBtn.disabled = true;
      finishBtn.innerHTML = `
        <div class="spinner"></div>
        <span>Syncing Parameters...</span>
      `;

      // Save selected career state to LocalStorage profile
      const localProfile = localStorage.getItem('nexusED_profile');
      if (localProfile) {
        const parsed = JSON.parse(localProfile);
        parsed.selectedCareer = selectedCareer;
        localStorage.setItem('nexusED_profile', JSON.stringify(parsed));
      }

      // Mock calibration delay
      setTimeout(() => {
        // Trigger fullscreen overlay success checkmark
        const container = document.querySelector('.container');
        container.className = 'container py-5 text-center d-flex align-items-center justify-content-center min-vh-100 animate__animated animate__zoomIn';
        
        container.innerHTML = `
          <div class="profile-card text-center" style="max-width: 520px; padding: 50px 30px;">
            <div class="success-checkmark mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 12px; color: var(--primary);">Digital Twin Synchronized</h2>
            <p class="text-muted mb-4" style="font-size: 0.95rem;">Calibration complete. Your growth models are generated. Redirecting to your Learning Dashboard...</p>
            <div class="spinner mt-2"></div>
          </div>
        `;

        window.toast.show('success', 'Calibration Synchronized', 'Workspace initialized. Opening Dashboard...', 3500);

        // Redirect to dashboard after calibration
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 2500);

      }, 2500);
    });
  }

});
