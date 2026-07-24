/* skills.js */

document.addEventListener('DOMContentLoaded', () => {
  // Fetch Local Storage Data
  const profileData = localStorage.getItem('nexusED_profile');
  
  // Guard Clause: Redirect to Profile Setup if not configured
  if (!profileData) {
    window.toast.show('warning', 'Profile Setup Required', 'Please configure your profile twin to access the skill tracker.', 4000);
    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 1500);
    return;
  }

  const profile = JSON.parse(profileData);
  let skills = JSON.parse(localStorage.getItem('nexusED_skills')) || [];

  // Core Subtopics Database
  const topicsDatabase = {
    "Python": [
      "Basic Syntax & Indentation",
      "Control Flows (Loops/If-Else)",
      "Functions, Parameters & Scope",
      "Data Structures (Lists, Dicts, Tuples)",
      "Object Oriented Programming (OOP)"
    ],
    "Java": [
      "Syntax & Datatypes",
      "Object Oriented Programming (OOP)",
      "Exception Handling (Try-Catch)",
      "Java Collections Framework (List, Map)",
      "Multi-threading & Daemon Threads"
    ],
    "SQL": [
      "Database Schemas & Relations",
      "Basic Queries (SELECT, WHERE, ORDER BY)",
      "Joins (INNER, LEFT, RIGHT, FULL)",
      "Aggregations & Grouping (GROUP BY, HAVING)",
      "Subqueries, Indexes & Performance"
    ],
    "Git": [
      "Repository Initialization & Commits",
      "Branching Models & Resolving Conflicts",
      "Pull Requests & Remote Collaborations",
      "Rebasing & Stashing Code",
      "Git Hooks & Automated Actions"
    ],
    "React": [
      "JSX, Elements & Virtual DOM",
      "State Management & Props (useState)",
      "Component Lifecycles & useEffect Hook",
      "React Router & Navigations",
      "Global Stores (Context API & Redux)"
    ],
    "JavaScript": [
      "Execution Context & Closures",
      "Asynchronous JS (Promises, Async/Await)",
      "DOM Traversal & Manipulations",
      "Event Handlers & Propagations",
      "ES6 Modules & Modern Patterns"
    ]
  };

  const genericTopics = [
    "Fundamental Concepts & Logic",
    "Syntax, Structures & Data Rules",
    "Intermediate Logic & Custom Bindings",
    "Testing, Mocking & Debugging Tasks",
    "System Deployment & Portability Setup"
  ];

  // Certification Quizzes - 10 Intermediate questions per core skill
  const quizBank = {
    "Python": [
      { q: "What is the output of print(2 ** 3 ** 2)?", options: ["64", "512", "262144", "Error"], correct: 1, exp: "Exponents are evaluated right-to-left. 3**2 is 9, and 2**9 is 512." },
      { q: "Which of the following is mutable in Python?", options: ["tuple", "string", "list", "int"], correct: 2, exp: "Lists are mutable (can be changed in-place); tuples, strings, and ints are immutable." },
      { q: "What is the output of print('abc'.find('d'))?", options: ["-1", "0", "None", "Error"], correct: 0, exp: "find() returns the lowest index if found, and -1 if the substring is missing." },
      { q: "Which method is used to add an item to a set?", options: ["append()", "add()", "insert()", "push()"], correct: 1, exp: "Sets use add(), lists use append() or insert(), while queues/arrays utilize push()." },
      { q: "What is the output of len({1, 2, 2, 3})?", options: ["2", "3", "4", "Error"], correct: 1, exp: "Sets filter out duplicate items. {1, 2, 2, 3} simplifies to {1, 2, 3}, which has length 3." },
      { q: "How do you start a constructor in a Python class?", options: ["def constructor()", "def __init__()", "def init()", "def new()"], correct: 1, exp: "constructors are initialized by declaring def __init__(self)." },
      { q: "Which module is utilized for regular expression matching?", options: ["regex", "re", "regex_match", "math"], correct: 1, exp: "The standard library module for regex calculations is re." },
      { q: "What is the default return value of a function that doesn't explicitly return anything?", options: ["None", "0", "False", "Void"], correct: 0, exp: "Functions returning nothing return the None singleton." },
      { q: "What does print('Python'[1:4]) output?", options: ["Pyt", "yth", "ytho", "Pytn"], correct: 1, exp: "Slicing [1:4] takes indices 1, 2, and 3 ('y', 't', 'h')." },
      { q: "What is the result of 3 // 2 in Python?", options: ["1.5", "1", "2", "0"], correct: 1, exp: "The double slash (//) represents floor/integer division, rounding down to 1." }
    ],
    "Java": [
      { q: "Which keyword prevents a Java class from being inherited?", options: ["static", "final", "private", "abstract"], correct: 1, exp: "final classes cannot be subclassed; final methods cannot be overridden." },
      { q: "What is the default value of a boolean primitive variable?", options: ["true", "false", "null", "0"], correct: 1, exp: "Primitive boolean variables defaults to false." },
      { q: "Which collection class preserves insertion order?", options: ["HashSet", "ArrayList", "TreeMap", "HashMap"], correct: 1, exp: "ArrayList retains insertion sequences; HashSets/HashMaps do not guarantee order." },
      { q: "Which exception is thrown when accessing methods on a null object reference?", options: ["NullPointerException", "ArrayIndexOutOfBoundsException", "ArithmeticException", "IOException"], correct: 0, exp: "Invoking operations on null references throws a NullPointerException." },
      { q: "What memory model stores local variables inside methods?", options: ["Heap", "Stack", "Class Area", "Metaspace"], correct: 1, exp: "Local variables are allocated inside Stack frames; objects reside on the Heap." },
      { q: "Which operator checks if two variables point to the same memory allocation?", options: ["equals()", "==", "compare()", "instanceof"], correct: 1, exp: "== evaluates referential equality; equals() checks contents value equality." },
      { q: "Can we overload the main() method in Java?", options: ["Yes", "No", "Only if it is abstract", "Only if it returns int"], correct: 0, exp: "Yes, you can overload the main method, but JVM only runs public static void main(String[] args)." },
      { q: "Which of the following is a checked exception?", options: ["NullPointerException", "ArithmeticException", "IOException", "IllegalArgumentException"], correct: 2, exp: "IOException is checked and must be handled at compile-time; the others are Runtime (unchecked)." },
      { q: "What does JVM stand for?", options: ["Java Virtual Model", "Java Variable Manager", "Java Virtual Machine", "Java Value Metric"], correct: 2, exp: "JVM stands for Java Virtual Machine, compiling bytecodes into machine instruction." },
      { q: "Which package is imported by default in every Java file?", options: ["java.util", "java.io", "java.lang", "java.net"], correct: 2, exp: "java.lang package is automatically imported by the compiler." }
    ],
    "SQL": [
      { q: "Which command deletes all rows from a table without logging individual row deletions?", options: ["DELETE", "DROP", "TRUNCATE", "REMOVE"], correct: 2, exp: "TRUNCATE is a DDL command deleting all records quickly without parsing constraints." },
      { q: "What is the default sorting order of ORDER BY?", options: ["Descending", "Ascending", "Alphabetical", "Chronological"], correct: 1, exp: "ORDER BY defaults to Ascending (ASC) order." },
      { q: "Which SQL join returns all records matching in both tables?", options: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN"], correct: 2, exp: "INNER JOIN yields only matching intersecting rows." },
      { q: "How do you filter records for NULL values in a query?", options: ["WHERE col = NULL", "WHERE col IS NULL", "WHERE col NULL", "WHERE col IS EMPTY"], correct: 1, exp: "Null checks are evaluated using the IS NULL operator, as '=' yields NULL (unknown)." },
      { q: "Which clause is used to filter aggregated group values?", options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], correct: 1, exp: "HAVING filters aggregates groups; WHERE filters rows before aggregation." },
      { q: "Which function calculates the total number of records?", options: ["SUM()", "COUNT()", "TOTAL()", "ADD()"], correct: 1, exp: "COUNT() returns the total record row count." },
      { q: "Can a Primary Key column contain NULL values?", options: ["Yes", "No", "Only if specified", "Only in MySQL"], correct: 1, exp: "Primary keys enforce UNIQUE and NOT NULL constraints." },
      { q: "Which constraint ensures all cell values are distinct?", options: ["NOT NULL", "UNIQUE", "CHECK", "DEFAULT"], correct: 1, exp: "UNIQUE constraints force all values in a column to be distinct." },
      { q: "What operator matches wildcard text patterns?", options: ["LIKE", "IN", "BETWEEN", "EQUAL"], correct: 0, exp: "LIKE operator matches text wildcards using % and _." },
      { q: "Which command edits schemas or table configurations?", options: ["UPDATE", "ALTER", "MODIFY", "CHANGE"], correct: 1, exp: "ALTER TABLE modifies structural attributes of the database." }
    ],
    "Git": [
      { q: "Which command initializes a new local repository?", options: ["git start", "git init", "git create", "git new"], correct: 1, exp: "git init configures a local repository, creating the hidden .git metadata folder." },
      { q: "How do you view the commit log history?", options: ["git log", "git history", "git status", "git diff"], correct: 0, exp: "git log renders chronological listings of commit hashes." },
      { q: "Which command stages modifications for commit?", options: ["git add", "git commit", "git stage", "git push"], correct: 0, exp: "git add stages files; git commit writes snapshots to history." },
      { q: "What does 'git clone' do?", options: ["Copies a directory", "Clones a remote repository locally", "Pushes commits", "Reverts changes"], correct: 1, exp: "git clone creates a copy of a target remote repository on your local machine." },
      { q: "How do you switch branches?", options: ["git branch", "git checkout", "git commit", "git merge"], correct: 1, exp: "git checkout (or git switch) moves the HEAD pointer to target branches." },
      { q: "Which command fetches changes and merges them directly?", options: ["git fetch", "git pull", "git sync", "git get"], correct: 1, exp: "git pull runs git fetch followed immediately by a git merge." },
      { q: "What stores files temporarily without committing them?", options: ["git index", "git stash", "git cache", "git commit"], correct: 1, exp: "git stash saves dirty working state on a stack for later retrieval." },
      { q: "Which command checks current staged/unstaged changes?", options: ["git diff", "git log", "git status", "git branch"], correct: 2, exp: "git status checks untracked, modified, and staged file states." },
      { q: "How do you delete a branch locally?", options: ["git branch -d", "git delete", "git branch -x", "git remove"], correct: 0, exp: "git branch with the -d (or -D force) flag deletes the branch." },
      { q: "What shows changes between commits or working tree?", options: ["git log", "git diff", "git status", "git branch"], correct: 1, exp: "git diff renders line-by-line differences between modifications." }
    ]
  };

  const genericQuiz = [
    { q: "What does OOP stand for?", options: ["Optimal Output Procedures", "Object Oriented Programming", "Online Object Processing", "Office Operations Protocol"], correct: 1, exp: "OOP stands for Object Oriented Programming." },
    { q: "Which data structure operates on a Last-In, First-Out (LIFO) model?", options: ["Queue", "Stack", "Linked List", "Binary Tree"], correct: 1, exp: "Stacks operate on LIFO; Queues use FIFO." },
    { q: "Which data structure operates on a First-In, First-Out (FIFO) model?", options: ["Stack", "Queue", "Max Heap", "Hash Map"], correct: 1, exp: "Queues operate on a FIFO sequence." },
    { q: "What is the time complexity of a binary search algorithm in a sorted array?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], correct: 1, exp: "Binary search cuts searchable zones in half, executing in logarithmic O(log n) complexity." },
    { q: "What is the average time complexity for hash map lookup insertions?", options: ["O(log n)", "O(1)", "O(n)", "O(n^2)"], correct: 1, exp: "Hash tables resolve lookup keys in constant O(1) time." },
    { q: "Which concept wraps methods and properties into a single unit?", options: ["Inheritance", "Abstraction", "Polymorphism", "Encapsulation"], correct: 3, exp: "Encapsulation bundles properties/methods together and restricts direct access." },
    { q: "What allows one interface to represent multiple action forms?", options: ["Encapsulation", "Polymorphism", "Inheritance", "Recursion"], correct: 1, exp: "Polymorphism allows overriding method executions dynamically at runtime." },
    { q: "Which network layer handles logical routing in the OSI model?", options: ["Data Link Layer", "Physical Layer", "Network Layer", "Transport Layer"], correct: 2, exp: "The Network Layer manages routing packets across IPs." },
    { q: "What does API stand for in software architectures?", options: ["Access Port Indicator", "Application Programming Interface", "Auto Port Integration", "Access Point Interconnect"], correct: 1, exp: "API stands for Application Programming Interface." },
    { q: "Which coding rule states that developers should avoid repeating logic?", options: ["KISS", "YAGNI", "SOLID", "DRY"], correct: 3, exp: "DRY stands for Don't Repeat Yourself." }
  ];

  // Test session state
  let activeQuizQuestions = [];
  let currentQuestionIdx = 0;
  let userScore = 0;
  let activeQuizSkill = '';

  // Setup cursor glow tracking coordinates
  document.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('.cursor-glow');
    if (glow) {
      window.requestAnimationFrame(() => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      });
    }
  });

  // Render profile info in Sidebar
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

  // DOM elements cache
  const gridBox = document.getElementById('skills-grid-box');
  const searchInput = document.getElementById('skill-search-input');
  const filterDropdown = document.getElementById('skill-level-filter');
  
  const modalOverlay = document.getElementById('skill-modal-overlay');
  const modalCard = document.getElementById('skill-modal-card');
  const modalTitle = document.getElementById('skill-modal-title');
  const modalForm = document.getElementById('skill-modal-form');
  
  const addTrigger = document.getElementById('btn-add-skill-trigger');
  const modalClose = document.getElementById('btn-modal-close');
  const modalCancel = document.getElementById('btn-modal-cancel');
  const modalSave = document.getElementById('btn-modal-save');
  
  const rangeSlider = document.getElementById('modal-skill-progress');
  const rangeValue = document.getElementById('range-progress-value');
  
  const editOriginalName = document.getElementById('edit-original-name');
  
  const skillNameInput = document.getElementById('modal-skill-name');
  const skillLevelSelect = document.getElementById('modal-skill-level');

  // Quiz Modal Cache
  const quizOverlay = document.getElementById('quiz-modal-overlay');
  const quizCard = document.getElementById('quiz-modal-card');
  const quizClose = document.getElementById('btn-quiz-close');
  const quizContent = document.getElementById('quiz-content-box');

  if (quizClose) {
    quizClose.addEventListener('click', closeQuizModal);
  }

  function closeQuizModal() {
    if (typeof gsap !== 'undefined') {
      gsap.to(quizCard, { scale: 0.9, y: 20, duration: 0.3 });
      gsap.to(quizOverlay, { opacity: 0, duration: 0.3, onComplete: () => {
        quizOverlay.style.display = 'none';
      }});
    } else {
      quizOverlay.style.display = 'none';
    }
  }

  // Initial render
  renderSkillsGrid(skills);

  // --- Render Skills list ---
  function renderSkillsGrid(skillsList) {
    gridBox.innerHTML = '';
    
    if (skillsList.length === 0) {
      gridBox.innerHTML = `
        <div class="col-12 text-center py-5 animate__animated animate__fadeIn">
          <i data-lucide="award" class="text-muted mb-3" style="width: 48px; height: 48px;"></i>
          <p class="text-muted">No skills found matching the parameters.</p>
        </div>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons();
      return;
    }

    skillsList.forEach(s => {
      // Setup dynamic topics checks
      const topicsList = topicsDatabase[s.name] || genericTopics;
      
      // Ensure completedTopics field exists in LocalStorage
      if (!s.completedTopics) {
        s.completedTopics = [];
        // Approximate existing progress value to checked checkmarks
        const approxCheckedCount = Math.round((s.progress / 100) * topicsList.length);
        for(let i=0; i<approxCheckedCount; i++) {
          s.completedTopics.push(topicsList[i]);
        }
      }

      const col = document.createElement('div');
      col.className = 'col-xl-4 col-md-6 col-12 animate__animated animate__fadeInUp';
      
      const levelClass = s.level ? `level-${s.level.toLowerCase()}` : 'level-beginner';
      
      // Build Checklist HTML
      let checklistHtml = '';
      topicsList.forEach((topic, idx) => {
        const isChecked = s.completedTopics.includes(topic) ? 'checked' : '';
        const isLineThrough = isChecked ? 'completed' : '';
        checklistHtml += `
          <label class="topic-checkbox-row" onclick="event.stopPropagation();">
            <input type="checkbox" class="topic-checkbox-input" ${isChecked} onchange="toggleTopicCheck(event, '${s.name}', '${topic}')">
            <span class="topic-checkbox-label ${isLineThrough}">${topic}</span>
          </label>
        `;
      });

      const cardId = `topics-drop-${s.name.replace(/\s+/g, '-')}`;

      col.innerHTML = `
        <article class="skill-card">
          <div class="skill-card-header">
            <h3 class="skill-title">${s.name}</h3>
            <span class="badge-level ${levelClass}">${s.level}</span>
          </div>

          <div class="skill-progress-section">
            <div class="skill-progress-info">
              <span>Competency Sync</span>
              <span class="skill-progress-value" id="prog-val-${s.name.replace(/\s+/g, '-')}">${s.progress}%</span>
            </div>
            <div class="skill-progress-track">
              <div class="skill-progress-fill" id="prog-fill-${s.name.replace(/\s+/g, '-')}" style="width: 0%;"></div>
            </div>
          </div>

          <!-- Sub-Topics Dropdown Button -->
          <button type="button" class="btn-expand-topics" onclick="toggleCardTopics(event, '${s.name}')">
            <i data-lucide="chevron-down"></i>
            <span>View Sub-Topics</span>
          </button>

          <!-- Hidden sub-topics dropdown checkbox list -->
          <div class="skill-topics-dropdown" id="${cardId}">
            ${checklistHtml}
          </div>

          <div class="skill-card-footer">
            <span>Updated: ${s.lastUpdated || '-'}</span>
            <div class="skill-actions">
              <button type="button" class="btn-action-icon btn-challenge" title="Take Certification Test (10 Questions)" onclick="startSkillQuiz('${s.name}')">
                <i data-lucide="brain"></i>
              </button>
              <button type="button" class="btn-action-icon btn-edit" title="Edit skill" onclick="openEditModal('${s.name}', '${s.level}', ${s.progress})">
                <i data-lucide="edit-3"></i>
              </button>
              <button type="button" class="btn-action-icon btn-delete" title="Delete skill" onclick="deleteSkillTrigger('${s.name}')">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </div>
        </article>
      `;

      gridBox.appendChild(col);

      // Animate progress bar fill on load
      setTimeout(() => {
        const fill = col.querySelector('.skill-progress-fill');
        if (fill) fill.style.width = `${s.progress}%`;
      }, 100);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // --- Checkbox Click Handler ---
  window.toggleTopicCheck = (event, skillName, topicName) => {
    event.stopPropagation();
    const isChecked = event.target.checked;
    
    // Find skill
    const skill = skills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
    if (!skill) return;

    // Direct check blocker if certified
    if (skill.progress === 100 && skill.level === "Expert") {
      window.toast.show('info', 'Skill Certified', 'This skill has been certified at 100%. Manual topic toggling is locked.', 3500);
      event.target.checked = !isChecked; // Restore checkbox state
      return;
    }

    if (!skill.completedTopics) skill.completedTopics = [];

    if (isChecked) {
      if (!skill.completedTopics.includes(topicName)) {
        skill.completedTopics.push(topicName);
      }
      event.target.nextElementSibling.classList.add('completed');
    } else {
      const idx = skill.completedTopics.indexOf(topicName);
      if (idx >= 0) {
        skill.completedTopics.splice(idx, 1);
      }
      event.target.nextElementSibling.classList.remove('completed');
    }

    // Recalculate progress percentage (max 95% from manual checkboxes, 100% requires the test!)
    const topicsList = topicsDatabase[skillName] || genericTopics;
    let nextProgress = Math.round((skill.completedTopics.length / topicsList.length) * 100);
    if (nextProgress === 100) nextProgress = 95; // 100% requires taking the test!
    
    skill.progress = nextProgress;
    skill.lastUpdated = new Date().toISOString().split('T')[0];

    // Save to LocalStorage
    localStorage.setItem('nexusED_skills', JSON.stringify(skills));

    // Dynamic update progress UI instantly without redrawing entire grid
    const cleanId = skillName.replace(/\s+/g, '-');
    const valText = document.getElementById(`prog-val-${cleanId}`);
    const fillBar = document.getElementById(`prog-fill-${cleanId}`);
    
    if (valText) valText.textContent = `${nextProgress}%`;
    if (fillBar) fillBar.style.width = `${nextProgress}%`;

    window.toast.show('info', 'Progress Updated', `${skillName} manual progress adjusted: ${nextProgress}%`, 2500);
  };

  // --- Expand Dropdown toggles ---
  window.toggleCardTopics = (e, skillName) => {
    const btn = e.currentTarget;
    const dropId = `topics-drop-${skillName.replace(/\s+/g, '-')}`;
    const dropdown = document.getElementById(dropId);
    if (!dropdown) return;
    
    const isExpanded = btn.classList.contains('expanded');
    if (isExpanded) {
      btn.classList.remove('expanded');
      dropdown.classList.remove('expanded');
    } else {
      btn.classList.add('expanded');
      dropdown.classList.add('expanded');
    }
  };

  // --- Start Certification Test (10 Questions) ---
  window.startSkillQuiz = (skillName) => {
    activeQuizSkill = skillName;
    activeQuizQuestions = quizBank[skillName] || genericQuiz;
    currentQuestionIdx = 0;
    userScore = 0;

    openQuizModalOverlay();
  };

  function openQuizModalOverlay() {
    quizOverlay.style.display = 'flex';
    
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(quizOverlay, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(quizCard, { scale: 0.9, y: 20 }, { scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' });
    }

    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    const q = activeQuizQuestions[currentQuestionIdx];
    const progressPercent = Math.round((currentQuestionIdx / activeQuizQuestions.length) * 100);

    quizContent.innerHTML = `
      <!-- Mini quiz progress bar -->
      <div class="mb-3">
        <div class="d-flex justify-content-between fs-xs text-muted mb-1">
          <span>Question ${currentQuestionIdx + 1} of ${activeQuizQuestions.length}</span>
          <span>${progressPercent}% Complete</span>
        </div>
        <div class="progress-ring-track" style="height:4px; background:var(--border-color); border-radius:10px; overflow:hidden;">
          <div style="height:100%; background:var(--primary); width:${progressPercent}%"></div>
        </div>
      </div>

      <div class="quiz-question-box">
        <p class="mb-2 fw-semibold">${q.q}</p>
        ${q.code ? `<pre class="quiz-code-block">${q.code}</pre>` : ''}
      </div>

      <div class="quiz-options-list">
        ${q.options.map((opt, i) => `
          <button type="button" class="quiz-option" onclick="handleQuizOptionSelect(this, ${i}, ${q.correct})">
            ${opt}
          </button>
        `).join('')}
      </div>

      <!-- Action Button container -->
      <div id="quiz-action-container" style="display:none;" class="d-flex justify-content-between align-items-center">
        <div id="quiz-feedback-hint" class="fs-xs fw-semibold"></div>
        <button type="button" class="btn-premium btn-premium-primary" onclick="advanceQuizQuestion()">
          <span>${currentQuestionIdx === activeQuizQuestions.length - 1 ? 'Finish & Score' : 'Next Question'}</span>
          <i data-lucide="arrow-right" class="arrow-icon"></i>
        </button>
      </div>

      <!-- Explanation box -->
      <div id="quiz-explanation-box" class="alert alert-info animate__animated animate__fadeIn mt-3" style="display:none; font-size: 0.8rem; line-height: 1.45;">
      </div>
    `;

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  window.handleQuizOptionSelect = (btn, selectedIdx, correctIdx) => {
    const allOptions = btn.parentNode.querySelectorAll('.quiz-option');
    allOptions.forEach(b => b.disabled = true);

    const actionContainer = document.getElementById('quiz-action-container');
    const feedbackHint = document.getElementById('quiz-feedback-hint');
    const explanationBox = document.getElementById('quiz-explanation-box');
    const currentQ = activeQuizQuestions[currentQuestionIdx];

    if (selectedIdx === correctIdx) {
      btn.classList.add('correct');
      userScore++;
      feedbackHint.innerHTML = `<span class="text-success">Correct choice! +1 Point</span>`;
    } else {
      btn.classList.add('incorrect');
      allOptions[correctIdx].classList.add('correct');
      feedbackHint.innerHTML = `<span class="text-danger">Incorrect choice</span>`;
    }

    // Reveal explanation text
    explanationBox.innerHTML = `<strong>Explanation:</strong> ${currentQ.exp || 'Core system syntax validation.'}`;
    explanationBox.style.display = 'block';
    
    // Reveal action button
    actionContainer.style.display = 'flex';
  };

  window.advanceQuizQuestion = () => {
    currentQuestionIdx++;
    if (currentQuestionIdx < activeQuizQuestions.length) {
      renderQuizQuestion();
    } else {
      renderQuizResult();
    }
  };

  function renderQuizResult() {
    const isPassed = userScore >= 7; // >= 70% passing grade
    
    if (isPassed) {
      // Perform skill completion!
      let skill = skills.find(s => s.name.toLowerCase() === activeQuizSkill.toLowerCase());
      const todayStr = new Date().toISOString().split('T')[0];
      
      const topicsList = topicsDatabase[activeQuizSkill] || genericTopics;

      if (skill) {
        skill.progress = 100;
        skill.level = "Expert";
        skill.lastUpdated = todayStr;
        skill.completedTopics = [...topicsList]; // Mark all completed!
      } else {
        skills.push({
          name: activeQuizSkill,
          level: "Expert",
          progress: 100,
          lastUpdated: todayStr,
          completedTopics: [...topicsList]
        });
      }

      // Save
      localStorage.setItem('nexusED_skills', JSON.stringify(skills));
      window.toast.show('success', 'Certification Succeeded!', `${activeQuizSkill} has been certified at 100%!`, 4000);
      
      // Update primary views
      applyFilters();

      // Renders successful certificate layout
      quizContent.innerHTML = `
        <div class="quiz-success-box animate__animated animate__zoomIn">
          <div class="quiz-success-icon" style="width:70px; height:70px; font-size: 1.8rem; background:rgba(34,197,94,0.12)">
            👑
          </div>
          <h3 class="mb-2" style="font-weight:800; color:var(--success);">PASSED & CERTIFIED</h3>
          <div class="fs-2xl fw-bold mb-3" style="color:var(--text-main);">${userScore * 10}% Score</div>
          <p class="text-muted fs-xs mb-4">Congratulations! You answered ${userScore} out of 10 questions correctly, surpassing the 70% threshold. <strong>${activeQuizSkill}</strong> has been marked as <strong>Completed (100% Expert)</strong>.</p>
          
          <button type="button" class="btn-premium btn-premium-primary" onclick="closeQuizModal()" style="width:100%;">
            <span>Close and Sync Twin</span>
          </button>
        </div>
      `;
    } else {
      // Failed exam results
      window.toast.show('error', 'Certification Failed', 'Score fell below the 70% passing threshold.', 4000);
      
      quizContent.innerHTML = `
        <div class="quiz-success-box animate__animated animate__zoomIn">
          <div class="quiz-success-icon" style="width:70px; height:70px; font-size: 1.8rem; background:rgba(239,68,68,0.12); color:var(--danger)">
            ⚠️
          </div>
          <h3 class="mb-2" style="font-weight:800; color:var(--danger);">CERTIFICATION FAILED</h3>
          <div class="fs-2xl fw-bold mb-3" style="color:var(--text-main);">${userScore * 10}% Score</div>
          <p class="text-muted fs-xs mb-4">You answered ${userScore} out of 10 questions correctly. A minimum score of <strong>70% (7/10)</strong> is required to certify this skill core. Progress remains unchanged. Read materials and retry.</p>
          
          <button type="button" class="btn-premium btn-premium-secondary" onclick="startSkillQuiz('${activeQuizSkill}')" style="width:100%; margin-bottom: 10px;">
            <span>Retry Examination</span>
          </button>
          <button type="button" class="btn-premium btn-premium-primary" onclick="closeQuizModal()" style="width:100%;">
            <span>Close</span>
          </button>
        </div>
      `;
    }
  }

  // --- Search and Filters ---
  function applyFilters() {
    const query = searchInput.value.toLowerCase().trim();
    const selectedLevel = filterDropdown.value;

    let filtered = skills.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(query);
      const matchLevel = selectedLevel === 'all' || s.level === selectedLevel;
      return matchSearch && matchLevel;
    });

    renderSkillsGrid(filtered);
  }

  searchInput.addEventListener('input', applyFilters);
  filterDropdown.addEventListener('change', applyFilters);

  // --- Live Range Slider values updates ---
  rangeSlider.addEventListener('input', () => {
    rangeValue.textContent = `${rangeSlider.value}%`;
  });

  // --- Modal Openers ---
  function openModal(titleText, editName = '', levelVal = '', progressVal = 50) {
    modalTitle.textContent = titleText;
    editOriginalName.value = editName;
    
    skillNameInput.value = editName;
    skillLevelSelect.value = levelVal;
    
    if (editName) {
      skillNameInput.disabled = true; // Avoid renaming keys during edits
    } else {
      skillNameInput.disabled = false;
    }
    
    rangeSlider.value = progressVal;
    rangeValue.textContent = `${progressVal}%`;

    // Reset validations
    skillNameInput.classList.remove('is-valid', 'is-invalid');
    skillLevelSelect.classList.remove('is-valid', 'is-invalid');

    modalOverlay.style.display = 'flex';
    
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(modalOverlay, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(modalCard, { scale: 0.9, y: 20 }, { scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' });
    }
  }

  function closeModal() {
    if (typeof gsap !== 'undefined') {
      gsap.to(modalCard, { scale: 0.9, y: 20, duration: 0.3 });
      gsap.to(modalOverlay, { opacity: 0, duration: 0.3, onComplete: () => {
        modalOverlay.style.display = 'none';
      }});
    } else {
      modalOverlay.style.display = 'none';
    }
  }

  addTrigger.addEventListener('click', () => {
    openModal('Register Skill Parameter');
  });

  modalClose.addEventListener('click', closeModal);
  modalCancel.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // --- Edit exposed trigger ---
  window.openEditModal = (name, level, progress) => {
    openModal('Modify Competency Node', name, level, progress);
  };

  // --- Delete exposed trigger ---
  window.deleteSkillTrigger = (name) => {
    const matchedIdx = skills.findIndex(s => s.name.toLowerCase() === name.toLowerCase());
    if (matchedIdx >= 0) {
      skills.splice(matchedIdx, 1);
      localStorage.setItem('nexusED_skills', JSON.stringify(skills));
      
      window.toast.show('success', 'Skill Deleted', `${name} competency parameter removed.`, 3000);
      
      applyFilters();
    }
  };

  // --- Modal save action ---
  modalSave.addEventListener('click', () => {
    const name = skillNameInput.value.trim();
    const level = skillLevelSelect.value;
    const progress = parseInt(rangeSlider.value);
    
    // Validations
    let isValid = true;
    if (!name) {
      skillNameInput.classList.add('is-invalid');
      isValid = false;
    } else {
      skillNameInput.classList.remove('is-invalid');
    }

    if (!level) {
      skillLevelSelect.classList.add('is-invalid');
      isValid = false;
    } else {
      skillLevelSelect.classList.remove('is-invalid');
    }

    if (!isValid) {
      window.toast.show('warning', 'Validation Error', 'Please complete the details.', 3000);
      return;
    }

    const isEdit = editOriginalName.value.length > 0;
    const todayStr = new Date().toISOString().split('T')[0];

    if (isEdit) {
      // Find and update
      const matchedIdx = skills.findIndex(s => s.name.toLowerCase() === editOriginalName.value.toLowerCase());
      if (matchedIdx >= 0) {
        skills[matchedIdx].level = level;
        skills[matchedIdx].progress = progress;
        skills[matchedIdx].lastUpdated = todayStr;
      }
    } else {
      // Check if skill already exists
      const exist = skills.some(s => s.name.toLowerCase() === name.toLowerCase());
      if (exist) {
        window.toast.show('error', 'Duplicate Skill', `${name} parameter already registered.`, 3500);
        return;
      }

      // Add new
      skills.push({
        name,
        level,
        progress,
        lastUpdated: todayStr,
        completedTopics: []
      });
    }

    // Save back to localstorage
    localStorage.setItem('nexusED_skills', JSON.stringify(skills));
    
    window.toast.show('success', isEdit ? 'Competency Updated' : 'Skill Registered', `${name} parameter saved.`, 3000);

    closeModal();
    applyFilters();
  });

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
