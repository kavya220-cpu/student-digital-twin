/* question-bank.js */

document.addEventListener('DOMContentLoaded', () => {
  // Fetch Local Storage Data
  const profileData = localStorage.getItem('nexusED_profile');
  
  // Guard Clause: Redirect to Profile Setup if not configured
  if (!profileData) {
    window.toast.show('warning', 'Profile Setup Required', 'Please configure your profile twin to access the question bank.', 4000);
    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 1500);
    return;
  }

  const profile = JSON.parse(profileData);
  
  // Sidebar user credentials load
  const sidebarRole = document.getElementById('sidebar-user-career');
  if (sidebarRole) sidebarRole.textContent = profile.selectedCareer || "AI Student";
  
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

  // Question database: 27 high-quality interview preparation questions + 6 Aptitude questions
  const questionsList = [
    // Technical: Java
    { id: "tech1", category: "Technical", subject: "Java", topic: "OOP concepts", difficulty: "Medium", estTime: 5, question: "What is the difference between an abstract class and an interface in Java?", answer: "An abstract class can have state (instance variables) and concrete methods with implementations. An interface (before Java 8) can only declare method signatures. In Java, a class can implement multiple interfaces, but can only extend one abstract class. Use abstract class for 'is-a' relationships and interface for 'can-do' features." },
    { id: "tech2", category: "Technical", subject: "Java", topic: "Memory Management", difficulty: "Hard", estTime: 6, question: "How does Garbage Collection work in Java and what are the heap generations?", answer: "Java Garbage Collection (GC) automatically manages memory allocation. The Heap memory is divided into three generations: 1) Young Generation (Eden and Survivor spaces where new objects are created), 2) Old/Tenured Generation (where long-lived objects are moved after surviving young collections), and 3) Permanent/Metaspace (holding metadata). Minor GC cleans the young heap, and Major GC runs full Old heap sweeps." },
    
    // Technical: Python
    { id: "tech3", category: "Technical", subject: "Python", topic: "Multithreading", difficulty: "Hard", estTime: 6, question: "What is the Global Interpreter Lock (GIL) in Python and why does it matter?", answer: "The GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes at once. This lock is necessary because CPython's memory management is not thread-safe. Consequently, Python threads cannot achieve true parallelism on multi-core systems. For CPU-bound tasks, Python programmers use multiprocessing instead of multithreading." },
    { id: "tech4", category: "Technical", subject: "Python", topic: "Data Structures", difficulty: "Easy", estTime: 4, question: "What is the difference between a list and a tuple in Python?", answer: "Lists are mutable, meaning their elements can be modified, added, or deleted after creation. They are defined using square brackets []. Tuples are immutable, meaning their structure cannot be altered after creation. They use parentheses () and are slightly faster and more memory-efficient than lists." },

    // Technical: C++
    { id: "tech5", category: "Technical", subject: "C++", topic: "Polymorphism", difficulty: "Medium", estTime: 5, question: "Explain virtual functions and runtime polymorphism in C++.", answer: "A virtual function is a member function declared in a base class that is redefined (overridden) in a derived class. When called using a pointer or reference to the base class, C++ resolves the call at runtime (dynamic binding) using a virtual table (vtable) pointer. This achieves runtime polymorphism." },

    // Technical: DBMS
    { id: "tech6", category: "Technical", subject: "DBMS", topic: "Transaction safety", difficulty: "Medium", estTime: 5, question: "What are the ACID properties in DBMS?", answer: "ACID represents properties that guarantee database transactions are processed reliably: 1) Atomicity (all-or-nothing operations), 2) Consistency (data moves from one valid state to another), 3) Isolation (concurrent execution yields same state as sequential execution), 4) Durability (once committed, changes survive power failures)." },

    // Technical: SQL
    { id: "tech7", category: "Technical", subject: "SQL", topic: "Joins", difficulty: "Easy", estTime: 4, question: "Explain the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN.", answer: "INNER JOIN returns records only when there are matching values in both tables. LEFT JOIN returns all records from the left table, and matched rows from the right table (unmatched right rows yield NULL). RIGHT JOIN does the reverse, returning all right-side records and matched left-side ones." },
    { id: "tech8", category: "Technical", subject: "SQL", topic: "Aggregations", difficulty: "Medium", estTime: 5, question: "What is the difference between the WHERE and HAVING clauses in SQL?", answer: "WHERE filters rows before any group aggregations are performed (it cannot contain aggregate functions like SUM or COUNT). HAVING filters groups after GROUP BY calculations have completed, and is used directly with aggregate functions." },

    // Technical: OOP
    { id: "tech9", category: "Technical", subject: "OOP", topic: "Core Principles", difficulty: "Easy", estTime: 5, question: "Describe the four core principles of Object-Oriented Programming.", answer: "1) Encapsulation (wrapping data and methods into a single class, hiding state details), 2) Inheritance (classes deriving properties from parent classes), 3) Polymorphism (methods performing differently depending on object type), 4) Abstraction (hiding complex internal details and exposing only essential interfaces)." },

    // Technical: Computer Networks
    { id: "tech10", category: "Technical", subject: "Computer Networks", topic: "Protocols", difficulty: "Easy", estTime: 4, question: "What is the difference between TCP and UDP protocols?", answer: "TCP is a connection-oriented, reliable protocol that guarantees ordered delivery of packets through handshakes and checksum validation. UDP is connectionless and lightweight, offering fast, best-effort delivery of packets without verification, commonly used in live video streaming and gaming." },

    // Coding: Data Structures
    { id: "code1", category: "Coding", subject: "Data Structures", topic: "Linked Lists", difficulty: "Hard", estTime: 7, question: "Write the logic to reverse a singly linked list in-place.", answer: "To reverse a list in-place, maintain three pointers: prev (null), current (head), and next (null). Iterate through the list: save current's next link, reverse current's pointer to point to prev, shift prev to current, and current to next. Return prev as the new head pointer." },
    { id: "code2", category: "Coding", subject: "Data Structures", topic: "Linked Lists", difficulty: "Hard", estTime: 6, question: "How do you detect a loop in a Singly Linked List?", answer: "Use Floyd's Cycle-Finding Algorithm (slow and fast pointers). Initialize both pointers at head. Move the slow pointer by 1 step and the fast pointer by 2 steps. If there is a cycle/loop, the fast pointer will eventually catch up and meet the slow pointer. If the fast pointer reaches NULL, no cycle exists." },

    // Coding: Algorithms
    { id: "code3", category: "Coding", subject: "Algorithms", topic: "Searching", difficulty: "Easy", estTime: 4, question: "What is the time complexity of Binary Search and what are its requirements?", answer: "Binary Search operates in O(log N) time complexity. Its fundamental requirement is that the target array MUST be sorted. It recursively cuts the search space in half by comparing the target to the middle element." },
    { id: "code4", category: "Coding", subject: "Algorithms", topic: "Sorting", difficulty: "Medium", estTime: 6, question: "Explain the difference between Quick Sort and Merge Sort.", answer: "Merge Sort is a stable sorting algorithm operating in O(N log N) worst-case time, requiring extra memory O(N) for temp arrays. Quick Sort is unstable but in-place, needing O(log N) memory. Its average complexity is O(N log N) but worst-case can be O(N^2) if pivots are chosen poorly." },
    { id: "code5", category: "Coding", subject: "Algorithms", topic: "Dynamic Programming", difficulty: "Hard", estTime: 7, question: "How does Dynamic Programming optimize the Fibonacci calculation?", answer: "Standard recursive Fibonacci operates in exponential time O(2^N) due to duplicate sub-problem executions. Dynamic Programming optimizes this to linear time O(N) by saving intermediate calculations (memoization) or building totals iteratively (tabulation)." },

    // Coding: Machine Learning
    { id: "code6", category: "Coding", subject: "Machine Learning", topic: "Model Fitting", difficulty: "Medium", estTime: 5, question: "Explain the difference between Overfitting and Underfitting in ML models.", answer: "Overfitting occurs when a model learns the training data noise too well, resulting in low training error but high test error. Underfitting occurs when the model is too simple to capture the underlying pattern, yielding high error in both training and test sets." },
    { id: "code7", category: "Coding", subject: "Machine Learning", topic: "Learning Paradigms", difficulty: "Easy", estTime: 4, question: "What is the difference between Supervised and Unsupervised Learning?", answer: "Supervised Learning trains models using labeled data inputs, meaning each training example includes the correct target output (e.g. classification, regression). Unsupervised Learning processes unlabeled inputs to identify hidden clusters and structures (e.g. clustering)." },

    // Coding: Cloud Computing
    { id: "code8", category: "Coding", subject: "Cloud Computing", topic: "Cloud Services", difficulty: "Easy", estTime: 4, question: "Describe IaaS, PaaS, and SaaS cloud service models.", answer: "1) IaaS (Infrastructure-as-a-Service: provides virtual hardware, storage, and networking, e.g. AWS EC2), 2) PaaS (Platform-as-a-Service: provides runtime environment for app deployment without infrastructure maintenance, e.g. Heroku), 3) SaaS (Software-as-a-Service: fully managed software apps accessed over web, e.g. Google Drive)." },

    // HR: Behavioral
    { id: "hr1", category: "HR", subject: "Behavioral", topic: "Conflict Resolution", difficulty: "Medium", estTime: 5, question: "How do you handle conflict or differing opinions within a project team?", answer: "Address conflicts objectively using the STAR model: focus on project goals rather than personal differences. Outline a time you actively listened to a team member's concerns, found a compromise backed by metrics, and achieved a collaborative project completion." },
    { id: "hr2", category: "HR", subject: "Behavioral", topic: "Failures & Growth", difficulty: "Medium", estTime: 5, question: "Tell me about a time you experienced a failure in an academic project.", answer: "Discuss a genuine technical setback, emphasizing your troubleshooting actions and lessons learned. Outline how you identified the error, researched a solution, resolved it, and added testing steps to prevent it in the future." },

    // HR: Situational
    { id: "hr3", category: "HR", subject: "Situational", topic: "Time Management", difficulty: "Medium", estTime: 5, question: "How do you react when facing multiple tight project deadlines simultaneously?", answer: "Explain your prioritization framework: evaluate tasks based on urgency and business impact, create daily checklists, communicate transparently with stakeholders, and organize your work into focused blocks." },

    // HR: Communication
    { id: "hr4", category: "HR", subject: "Communication", topic: "Simplifying Tech", difficulty: "Easy", estTime: 5, question: "How do you explain a complex technical concept to a non-technical manager?", answer: "Use analogies from everyday life, avoid industry jargon, focus on the 'why' (business value) rather than the 'how' (code), and check in periodically with questions like 'does that make sense?' to verify clarity." },

    // HR: Leadership
    { id: "hr5", category: "HR", subject: "Leadership", topic: "Team Coordination", difficulty: "Medium", estTime: 5, question: "Describe a situation where you had to lead a diverse team on short notice.", answer: "Outline how you quickly assessed team members' strengths, assigned tasks clearly, set up communication channels (Slack/Discord), resolved friction, and successfully delivered the project on time." },

    // GD: Technology Trends
    { id: "gd1", category: "GD", subject: "Technology Trends", topic: "Automation & Work", difficulty: "Easy", estTime: 6, question: "Is Artificial Intelligence a threat to entry-level software engineering jobs?", answer: "AI is a productivity booster rather than a complete replacement. While it automates boilerplate code, it increases the demand for software engineers skilled in architecture design, logic validation, debugging, and prompt engineering." },
    { id: "gd2", category: "GD", subject: "Technology Trends", topic: "Decentralized Web", difficulty: "Hard", estTime: 6, question: "What is Web3 and how does it differ from Web2?", answer: "Web2 is dominated by centralized platforms that control user data (e.g. Google, Meta). Web3 is built on blockchain networks, enabling user ownership of data, decentralized governance (DAOs), and trustless token economies." },

    // GD: Current Affairs
    { id: "gd3", category: "GD", subject: "Current Affairs", topic: "Work Culture", difficulty: "Easy", estTime: 5, question: "Discuss the advantages and disadvantages of Hybrid Work vs Remote Work.", answer: "Remote work offers flexibility, saves commute time, and widens talent pools. However, it can lead to isolation and communication delays. Hybrid work balances this by combining in-person collaboration days with remote flexibility." },

    // GD: Business Topics
    { id: "gd4", category: "GD", subject: "Business Topics", topic: "Labor Markets", difficulty: "Medium", estTime: 5, question: "What is the impact of the Gig Economy on traditional corporate employment?", answer: "The Gig Economy provides freelancers with flexibility and companies with specialized on-demand talent. However, it lacks corporate benefits like healthcare, job security, and career development pathways." },

    // Aptitude: Quantitative
    { id: "apt1", category: "Aptitude", subject: "Quantitative Aptitude", topic: "Time and Distance", difficulty: "Easy", estTime: 4, question: "A train 120m long passes a post in 12 seconds. What is its speed in km/hr?", answer: "Speed = Distance / Time = 120m / 12s = 10 m/s. To convert m/s to km/hr, multiply by 18/5. So, 10 * (18 / 5) = 36 km/hr." },
    { id: "apt2", category: "Aptitude", subject: "Quantitative Aptitude", topic: "Time and Work", difficulty: "Medium", estTime: 5, question: "If 5 men or 9 women can finish a piece of work in 19 days, in how many days can 3 men and 6 women finish it?", answer: "5 men = 9 women implies 1 man = 1.8 women. Therefore, 3 men + 6 women = 3*(1.8) + 6 = 11.4 women. Since 9 women take 19 days, 11.4 women will take (9 * 19) / 11.4 = 15 days." },
    { id: "apt3", category: "Aptitude", subject: "Quantitative Aptitude", topic: "Simple Interest", difficulty: "Easy", estTime: 4, question: "A sum of money doubles itself in 8 years at simple interest. What is the rate of interest per annum?", answer: "Let principal be P. Amount becomes 2P, so SI = P. Formula: SI = (P * R * T) / 100. P = (P * R * 8) / 100 implies R = 100 / 8 = 12.5% per annum." },

    // Aptitude: Logical Reasoning
    { id: "apt4", category: "Aptitude", subject: "Logical Reasoning", topic: "Number Series", difficulty: "Medium", estTime: 4, question: "Find the missing number in the sequence: 2, 6, 12, 20, 30, 42, ?", answer: "The differences between successive terms are: 4, 6, 8, 10, 12. The difference increases by 2 each time. The next difference will be 14. So, the missing number is 42 + 14 = 56." },
    { id: "apt5", category: "Aptitude", subject: "Logical Reasoning", topic: "Blood Relations", difficulty: "Medium", estTime: 4, question: "Pointing to a photograph, a man says, 'She is the daughter of my grandmother's only child.' How is the woman related to the man?", answer: "The grandmother's only child is the man's parent (father or mother). The daughter of that parent is the sister of the man. Therefore, the woman in the photograph is the sister of the man." },

    // Aptitude: Data Interpretation
    { id: "apt6", category: "Aptitude", subject: "Data Interpretation", topic: "Growth calculations", difficulty: "Medium", estTime: 5, question: "Explain how to calculate the compounded annual growth rate (CAGR) from a multi-year sales table.", answer: "CAGR represents the smoothed annual growth rate. Formula: CAGR = (Ending Value / Beginning Value)^(1 / Number of Years) - 1. In a table, take the sales figure of the final year, divide by the initial year, raise to the power of 1 divided by elapsed years, and subtract 1." }
  ];

  // Load progress arrays
  let completedQuestions = JSON.parse(localStorage.getItem('nexusED_completed_questions')) || [];
  let bookmarkedQuestions = JSON.parse(localStorage.getItem('nexusED_bookmarked_questions')) || [];

  // Active state
  let activeSubject = "Java";

  // DOM elements
  const techBox = document.getElementById('list-tech-subjects');
  const hrBox = document.getElementById('list-hr-subjects');
  const gdBox = document.getElementById('list-gd-subjects');
  const aptitudeBox = document.getElementById('list-aptitude-subjects');
  
  const searchInput = document.getElementById('q-search-input');
  const difficultyFilter = document.getElementById('q-difficulty-filter');
  const feedBox = document.getElementById('questions-feed-box');

  // Load subjects categories menus
  initializeSubjectsMenu();
  
  // Parse URL Parameters for custom routing
  parseURLParams();

  // Render question list
  renderQuestions();

  // --- Initialize Left Sidebar Subjects List ---
  function initializeSubjectsMenu() {
    const subjects = {
      Technical: ["Java", "Python", "C++", "DBMS", "SQL", "OOP", "Computer Networks", "Data Structures", "Algorithms", "Machine Learning", "Cloud Computing"],
      HR: ["Behavioral", "Situational", "Communication", "Leadership"],
      GD: ["Technology Trends", "Current Affairs", "Business Topics"],
      Aptitude: ["Quantitative Aptitude", "Logical Reasoning", "Data Interpretation"]
    };

    // Render Tech
    techBox.innerHTML = '';
    subjects.Technical.forEach(subj => {
      techBox.appendChild(createSubjectButton(subj));
    });

    // Render HR
    hrBox.innerHTML = '';
    subjects.HR.forEach(subj => {
      hrBox.appendChild(createSubjectButton(subj));
    });

    // Render GD
    gdBox.innerHTML = '';
    subjects.GD.forEach(subj => {
      gdBox.appendChild(createSubjectButton(subj));
    });

    // Render Aptitude
    if (aptitudeBox) {
      aptitudeBox.innerHTML = '';
      subjects.Aptitude.forEach(subj => {
        aptitudeBox.appendChild(createSubjectButton(subj));
      });
    }
  }

  function createSubjectButton(subjName) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `subject-btn ${subjName === activeSubject ? 'active' : ''}`;
    btn.dataset.subject = subjName;
    
    // Count how many questions belong to this subject
    const count = questionsList.filter(q => q.subject === subjName).length;

    btn.innerHTML = `
      <span>${subjName}</span>
      <span class="subj-count-badge">${count}</span>
    `;

    btn.addEventListener('click', () => {
      document.querySelectorAll('.subject-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSubject = subjName;
      
      renderQuestions();
    });

    return btn;
  }

  // Parse routing parameters
  function parseURLParams() {
    const params = new URLSearchParams(window.location.search);
    const subjectParam = params.get('subject');
    if (subjectParam) {
      const matchedBtn = document.querySelector(`.subject-btn[data-subject="${subjectParam}"]`);
      if (matchedBtn) {
        document.querySelectorAll('.subject-btn').forEach(b => b.classList.remove('active'));
        matchedBtn.classList.add('active');
        activeSubject = subjectParam;
      }
    }
  }

  // --- Render Questions list ---
  function renderQuestions() {
    feedBox.innerHTML = '';
    
    const query = searchInput.value.toLowerCase().trim();
    const diff = difficultyFilter.value; 

    // Filter by subject first
    let list = questionsList.filter(q => q.subject === activeSubject);

    if (diff !== 'all') {
      list = list.filter(q => q.difficulty === diff);
    }

    if (query !== "") {
      const broadSearch = questionsList.filter(q => {
        return q.question.toLowerCase().includes(query) || 
               q.answer.toLowerCase().includes(query) || 
               q.topic.toLowerCase().includes(query) ||
               q.subject.toLowerCase().includes(query);
      });
      list = broadSearch;
    }

    if (list.length === 0) {
      feedBox.innerHTML = `
        <div class="dash-panel text-center py-5 animate__animated animate__fadeIn">
          <i data-lucide="help-circle" class="text-muted mb-2" style="width: 44px; height: 44px; margin: 0 auto; display:block;"></i>
          <p class="text-muted mb-0">No questions found matching active filters.</p>
        </div>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons();
      return;
    }

    list.forEach((q, idx) => {
      const isBookmarked = bookmarkedQuestions.includes(q.id);
      const isCompleted = completedQuestions.includes(q.id);

      const card = document.createElement('article');
      card.className = 'question-card animate__animated animate__fadeInUp';
      card.style.animationDelay = `${idx * 0.05}s`;
      card.id = `q-node-${q.id}`;

      const diffClass = q.difficulty.toLowerCase(); 

      card.innerHTML = `
        <div class="question-header-row">
          <div class="d-flex align-items-start gap-3">
            <button type="button" class="btn-complete-checkbox ${isCompleted ? 'completed' : ''}" onclick="toggleQuestionCompleted(event, '${q.id}')">
              <i data-lucide="check"></i>
            </button>
            
            <div>
              <h3 class="question-title-text">${q.question}</h3>
              <div class="q-meta-tags-row">
                <span class="difficulty-badge ${diffClass}">${q.difficulty}</span>
                <span class="q-meta-item"><i data-lucide="hash"></i><span>${q.topic}</span></span>
                <span class="q-meta-item"><i data-lucide="clock"></i><span>${q.estTime} min read</span></span>
              </div>
            </div>
          </div>

          <div class="q-action-buttons">
            <button type="button" class="btn-bookmark-star ${isBookmarked ? 'active' : ''}" onclick="toggleQuestionBookmark(event, '${q.id}')">
              <i data-lucide="star"></i>
            </button>
          </div>
        </div>

        <!-- Collapsible Attempt & Answer Workspace Panel -->
        <div class="answer-panel">
          
          <div class="attempt-workspace-wrap" id="workspace-${q.id}">
            <div class="answer-title">Attempt Practice Answer</div>
            <textarea class="form-input focus-glow-transition mt-1 mb-2" id="attempt-input-${q.id}" style="width:100%; min-height: 80px; font-size:0.78rem; background: rgba(0,0,0,0.1); border: 1px solid var(--border-color); border-radius: 6px; padding: 8px;" placeholder="Type your answer draft here to compare with model response key..."></textarea>
            
            <div class="d-flex gap-2">
              <button type="button" class="btn-premium btn-premium-primary" style="padding: 6px 12px; font-size: 0.72rem;" onclick="checkQuestionAttempt('${q.id}')">
                Check Answer
              </button>
              <button type="button" class="btn-premium btn-premium-secondary" style="padding: 6px 12px; font-size: 0.72rem;" onclick="revealAnswerKeyDirect('${q.id}')">
                Just Reveal Answer
              </button>
            </div>
          </div>

          <div class="checked-comparison-wrap mt-2" id="comparison-${q.id}" style="display:none;">
            <div class="mb-3" id="user-draft-review-box-${q.id}">
              <div class="answer-title text-muted">Your Practice Draft</div>
              <p class="answer-body-text italic" id="user-draft-text-${q.id}" style="color:var(--text-main); font-weight:500;"></p>
            </div>
            
            <div>
              <div class="answer-title text-primary">Official Model Answer Key</div>
              <p class="answer-body-text">${q.answer}</p>
            </div>

            <button type="button" class="btn-premium btn-premium-secondary mt-3" style="padding: 6px 12px; font-size: 0.72rem;" onclick="resetQuestionAttempt('${q.id}')">
              Reset & Retake
            </button>
          </div>

        </div>
      `;

      // Expand card on click
      card.addEventListener('click', (e) => {
        // Prevent collapse when interacting with fields
        if (e.target.closest('.btn-complete-checkbox') || 
            e.target.closest('.btn-bookmark-star') || 
            e.target.closest('.btn-premium') || 
            e.target.closest('textarea') || 
            e.target.closest('button')) {
          return;
        }

        const isExpanded = card.classList.contains('expanded');
        
        document.querySelectorAll('.question-card').forEach(el => el.classList.remove('expanded'));

        if (!isExpanded) {
          card.classList.add('expanded');
        }
      });

      feedBox.appendChild(card);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();

    handleURLExpandParam();
  }

  // Auto expand URL target questions
  function handleURLExpandParam() {
    const params = new URLSearchParams(window.location.search);
    const expandId = params.get('expand');
    if (expandId) {
      const card = document.getElementById(`q-node-${expandId}`);
      if (card) {
        setTimeout(() => {
          card.classList.add('expanded');
          
          if (typeof gsap !== 'undefined') {
            gsap.to(window, { duration: 0.8, scrollTo: card, ease: 'power2.out' });
          } else {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
      }
    }
  }

  // --- Workspace Actions ---
  window.checkQuestionAttempt = (qId) => {
    const input = document.getElementById(`attempt-input-${qId}`);
    const draftText = input ? input.value.trim() : "";

    if (draftText === "") {
      window.toast.show('warning', 'Answer Required', 'Please type a draft response before checking the answer.', 3000);
      return;
    }

    const workspace = document.getElementById(`workspace-${qId}`);
    const comparison = document.getElementById(`comparison-${qId}`);
    const reviewBox = document.getElementById(`user-draft-review-box-${qId}`);
    const draftParagraph = document.getElementById(`user-draft-text-${qId}`);

    if (workspace) workspace.style.display = 'none';
    if (comparison) comparison.style.display = 'block';
    if (reviewBox) reviewBox.style.display = 'block';
    
    if (draftParagraph) {
      draftParagraph.textContent = `"${draftText}"`;
    }

    markQuestionCompletedState(qId, true);
  };

  window.revealAnswerKeyDirect = (qId) => {
    const workspace = document.getElementById(`workspace-${qId}`);
    const comparison = document.getElementById(`comparison-${qId}`);
    const reviewBox = document.getElementById(`user-draft-review-box-${qId}`);

    if (workspace) workspace.style.display = 'none';
    if (comparison) comparison.style.display = 'block';
    if (reviewBox) reviewBox.style.display = 'none';

    markQuestionCompletedState(qId, true);
  };

  window.resetQuestionAttempt = (qId) => {
    const workspace = document.getElementById(`workspace-${qId}`);
    const comparison = document.getElementById(`comparison-${qId}`);
    const input = document.getElementById(`attempt-input-${qId}`);

    if (workspace) workspace.style.display = 'block';
    if (comparison) comparison.style.display = 'none';
    if (input) input.value = '';

    markQuestionCompletedState(qId, false);
  };

  function markQuestionCompletedState(qId, isCompleted) {
    let completedList = JSON.parse(localStorage.getItem('nexusED_completed_questions')) || [];
    
    if (isCompleted) {
      if (!completedList.includes(qId)) completedList.push(qId);
    } else {
      completedList = completedList.filter(id => id !== qId);
    }

    localStorage.setItem('nexusED_completed_questions', JSON.stringify(completedList));

    const card = document.getElementById(`q-node-${qId}`);
    if (card) {
      const btn = card.querySelector('.btn-complete-checkbox');
      if (btn) {
        if (isCompleted) {
          btn.classList.add('completed');
        } else {
          btn.classList.remove('completed');
        }
      }
    }
  }

  // --- Event Filters ---
  searchInput.addEventListener('input', renderQuestions);
  difficultyFilter.addEventListener('change', renderQuestions);

  // Expose Bookmark Toggle Action
  window.toggleQuestionBookmark = (event, qId) => {
    event.stopPropagation(); 
    
    const idx = bookmarkedQuestions.indexOf(qId);
    const btn = event.currentTarget;

    if (idx >= 0) {
      bookmarkedQuestions.splice(idx, 1);
      btn.classList.remove('active');
      window.toast.show('info', 'Bookmark Removed', 'Question removed from saved favorites.', 1500);
    } else {
      bookmarkedQuestions.push(qId);
      btn.classList.add('active');
      window.toast.show('success', 'Question Bookmarked', 'Added topic to your favorites dashboard.', 2000);
    }

    localStorage.setItem('nexusED_bookmarked_questions', JSON.stringify(bookmarkedQuestions));
  };

  // Expose Completion Toggle Action
  window.toggleQuestionCompleted = (event, qId) => {
    event.stopPropagation();
    
    const idx = completedQuestions.indexOf(qId);
    const btn = event.currentTarget;

    if (idx >= 0) {
      completedQuestions.splice(idx, 1);
      btn.classList.remove('completed');
      window.toast.show('info', 'Practice Reset', 'Marked topic as incomplete.', 1500);
    } else {
      completedQuestions.push(qId);
      btn.classList.add('completed');
      window.toast.show('success', 'Topic Practiced', 'Marked question as completed! Synchronizing readiness.', 2000);
    }

    localStorage.setItem('nexusED_completed_questions', JSON.stringify(completedQuestions));
  };
});
