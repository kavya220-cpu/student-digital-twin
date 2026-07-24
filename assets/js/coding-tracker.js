/* coding-tracker.js */

document.addEventListener('DOMContentLoaded', () => {
  // Fetch Local Storage Data
  const profileData = localStorage.getItem('nexusED_profile');
  
  // Guard Clause: Redirect to Profile Setup if not configured
  if (!profileData) {
    window.toast.show('warning', 'Profile Setup Required', 'Please configure your profile twin to access the coding practice tracker.', 4000);
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

  // Pre-populate with sample questions if database is empty
  const defaultQuestions = [
    { 
      id: "code_1", 
      title: "Two Sum", 
      topic: "Arrays", 
      difficulty: "Easy", 
      solvedDate: getRelativeDateStr(0), 
      notes: "Solved in O(N) using a Hash Map to store complement indices. Space complexity is O(N).",
      codeSnippet: "public int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int complement = target - nums[i];\n        if (map.containsKey(complement)) {\n            return new int[] { map.get(complement), i };\n        }\n        map.put(nums[i], i);\n    }\n    return new int[] {};\n}"
    },
    { 
      id: "code_2", 
      title: "Reverse Linked List", 
      topic: "Linked Lists", 
      difficulty: "Medium", 
      solvedDate: getRelativeDateStr(-1), 
      notes: "In-place reversal using three pointers (prev, curr, next). Time complexity O(N), Space O(1).",
      codeSnippet: "public ListNode reverseList(ListNode head) {\n    ListNode prev = null;\n    ListNode curr = head;\n    while (curr != null) {\n        ListNode nextTemp = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = nextTemp;\n    }\n    return prev;\n}"
    },
    { 
      id: "code_3", 
      title: "Valid Parentheses", 
      topic: "Stacks", 
      difficulty: "Easy", 
      solvedDate: getRelativeDateStr(-2), 
      notes: "Pushed opening brackets onto stack, popped on closing match. Handled empty stack boundaries.",
      codeSnippet: "public boolean isValid(String s) {\n    Stack<Character> stack = new Stack<>();\n    for (char c : s.toCharArray()) {\n        if (c == '(') stack.push(')');\n        else if (c == '{') stack.push('}');\n        else if (c == '[') stack.push(']');\n        else if (stack.isEmpty() || stack.pop() != c) return false;\n    }\n    return stack.isEmpty();\n}"
    },
    { 
      id: "code_4", 
      title: "Edit Distance", 
      topic: "Dynamic Programming", 
      difficulty: "Hard", 
      solvedDate: getRelativeDateStr(-3), 
      notes: "Tabulation DP approach. State definition: dp[i][j] is the operations to align word1[0..i] and word2[0..j].",
      codeSnippet: "public int minDistance(String word1, String word2) {\n    int m = word1.length(), n = word2.length();\n    int[][] dp = new int[m + 1][n + 1];\n    for (int i = 0; i <= m; i++) dp[i][0] = i;\n    for (int j = 0; j <= n; j++) dp[0][j] = j;\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++) {\n            if (word1.charAt(i - 1) == word2.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1];\n            else dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));\n        }\n    }\n    return dp[m][n];\n}"
    },
    { 
      id: "code_5", 
      title: "Binary Tree Level Order Traversal", 
      topic: "Trees", 
      difficulty: "Medium", 
      solvedDate: getRelativeDateStr(-4), 
      notes: "Breadth-First Search (BFS) using a Queue. Level tracking achieved by checking queue size at start of each iteration.",
      codeSnippet: "public List<List<Integer>> levelOrder(TreeNode root) {\n    List<List<Integer>> result = new ArrayList<>();\n    if (root == null) return result;\n    Queue<TreeNode> queue = new LinkedList<>();\n    queue.add(root);\n    while (!queue.isEmpty()) {\n        int size = queue.size();\n        List<Integer> currentLevel = new ArrayList<>();\n        for (int i = 0; i < size; i++) {\n            TreeNode node = queue.poll();\n            currentLevel.add(node.val);\n            if (node.left != null) queue.add(node.left);\n            if (node.right != null) queue.add(node.right);\n        }\n        result.add(currentLevel);\n    }\n    return result;\n}"
    }
  ];

  let questions = JSON.parse(localStorage.getItem('nexusED_coding_questions'));
  if (!questions || questions.length === 0) {
    questions = defaultQuestions;
    localStorage.setItem('nexusED_coding_questions', JSON.stringify(questions));
  }

  // DOM Elements
  const kpiTotal = document.getElementById('kpi-total-solved');
  const kpiEasy = document.getElementById('kpi-easy-solved');
  const kpiMedium = document.getElementById('kpi-medium-solved');
  const kpiHard = document.getElementById('kpi-hard-solved');
  const kpiFav = document.getElementById('kpi-fav-topic');
  const kpiStreak = document.getElementById('kpi-streak');

  const searchInput = document.getElementById('q-search');
  const diffFilter = document.getElementById('filter-difficulty');
  const topicFilter = document.getElementById('filter-topic');
  const questionsBox = document.getElementById('questions-list-box');

  const targetPercentage = document.getElementById('target-percentage-label');
  const targetBar = document.getElementById('target-progress-bar');

  const modalBackdrop = document.getElementById('question-modal-backdrop');
  const modalForm = document.getElementById('question-modal-form');
  const modalTitle = document.getElementById('modal-title-label');
  const fieldId = document.getElementById('modal-field-id');
  const fieldTitle = document.getElementById('modal-field-title');
  const fieldTopic = document.getElementById('modal-field-topic');
  const fieldDifficulty = document.getElementById('modal-field-difficulty');
  const fieldDate = document.getElementById('modal-field-date');
  const fieldNotes = document.getElementById('modal-field-notes');
  const fieldCode = document.getElementById('modal-field-code');

  // Initialize
  renderTracker();

  // Search & Filters Listeners
  searchInput.addEventListener('input', renderTracker);
  diffFilter.addEventListener('change', renderTracker);
  topicFilter.addEventListener('change', renderTracker);

  // --- Main Render Tracker Function ---
  function renderTracker() {
    updateKPIs();
    renderChart();
    renderQuestionsList();
  }

  function updateKPIs() {
    const totalCount = questions.length;
    const easyCount = questions.filter(q => q.difficulty === "Easy").length;
    const mediumCount = questions.filter(q => q.difficulty === "Medium").length;
    const hardCount = questions.filter(q => q.difficulty === "Hard").length;

    kpiTotal.textContent = totalCount;
    kpiEasy.textContent = easyCount;
    kpiMedium.textContent = mediumCount;
    kpiHard.textContent = hardCount;

    if (totalCount > 0) {
      const counts = {};
      let maxCount = 0;
      let favorite = "None";
      questions.forEach(q => {
        counts[q.topic] = (counts[q.topic] || 0) + 1;
        if (counts[q.topic] > maxCount) {
          maxCount = counts[q.topic];
          favorite = q.topic;
        }
      });
      kpiFav.textContent = favorite;
    } else {
      kpiFav.textContent = "None";
    }

    const streak = calculateStreak();
    kpiStreak.textContent = `${streak} Day${streak !== 1 ? 's' : ''}`;

    const targetPercentageValue = Math.min(Math.round((totalCount / 100) * 100), 100);
    targetPercentage.textContent = `${targetPercentageValue}%`;
    setTimeout(() => {
      targetBar.style.width = `${targetPercentageValue}%`;
    }, 150);
  }

  function calculateStreak() {
    if (questions.length === 0) return 0;
    const dates = [...new Set(questions.map(q => q.solvedDate))].sort();
    
    const todayStr = getRelativeDateStr(0);
    const yesterdayStr = getRelativeDateStr(-1);

    if (!dates.includes(todayStr) && !dates.includes(yesterdayStr)) {
      return 0;
    }

    let streak = 0;
    let checkDate = new Date();
    
    if (!dates.includes(todayStr) && dates.includes(yesterdayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const year = checkDate.getFullYear();
      const month = String(checkDate.getMonth() + 1).padStart(2, '0');
      const day = String(checkDate.getDate()).padStart(2, '0');
      const checkStr = `${year}-${month}-${day}`;

      if (dates.includes(checkStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  function renderChart() {
    const weekdayCounts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const checkStr = `${year}-${month}-${day}`;

      const dayName = weekdayNames[d.getDay()];
      
      const count = questions.filter(q => q.solvedDate === checkStr).length;
      if (weekdayCounts[dayName] !== undefined) {
        weekdayCounts[dayName] += count;
      }
    }

    let maxSolved = Math.max(...Object.values(weekdayCounts));
    maxSolved = Math.max(maxSolved, 5);

    Object.keys(weekdayCounts).forEach(day => {
      const rect = document.getElementById(`bar-${day}`);
      if (rect) {
        const val = weekdayCounts[day];
        const barHeight = (val / maxSolved) * 135;
        const yValue = 165 - barHeight;
        
        rect.setAttribute('height', barHeight);
        rect.setAttribute('y', yValue);
      }
    });
  }

  function renderQuestionsList() {
    questionsBox.innerHTML = '';
    
    const query = searchInput.value.toLowerCase().trim();
    const activeDiff = diffFilter.value;
    const activeTopic = topicFilter.value;

    let filtered = questions.slice().reverse();

    if (activeDiff !== 'all') {
      filtered = filtered.filter(q => q.difficulty === activeDiff);
    }
    if (activeTopic !== 'all') {
      filtered = filtered.filter(q => q.topic === activeTopic);
    }
    if (query !== "") {
      filtered = filtered.filter(q => q.title.toLowerCase().includes(query) || q.notes.toLowerCase().includes(query));
    }

    if (filtered.length === 0) {
      questionsBox.innerHTML = `
        <div class="text-center py-5">
          <i data-lucide="help-circle" class="text-muted mb-2" style="width:36px; height:36px; display:block; margin: 0 auto;"></i>
          <p class="text-muted mb-0">No solved questions found matching active filters.</p>
        </div>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons();
      return;
    }

    filtered.forEach(q => {
      const qCard = document.createElement('article');
      qCard.className = 'solved-q-card animate__animated animate__fadeInUp';
      
      const diffClass = q.difficulty.toLowerCase();

      qCard.innerHTML = `
        <div class="q-card-header">
          <div>
            <h4 class="q-card-title">${q.title}</h4>
            <div class="q-card-meta">
              <span class="difficulty-pill ${diffClass}">${q.difficulty}</span>
              <span class="badge-tag">${q.topic}</span>
              <span class="text-secondary" style="font-size:0.7rem;"><i data-lucide="calendar" style="width:12px; height:12px; margin-right:3px; vertical-align:middle;"></i>${q.solvedDate}</span>
            </div>
          </div>
          
          <div class="q-card-actions">
            <button type="button" class="btn-card-action" onclick="openEditQuestionModal('${q.id}')" aria-label="Edit question">
              <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
            </button>
            <button type="button" class="btn-card-action delete" onclick="deleteQuestion('${q.id}')" aria-label="Delete question">
              <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
            </button>
          </div>
        </div>
        ${q.notes ? `<p class="q-card-notes">${q.notes}</p>` : ''}
        ${q.codeSnippet ? `
          <pre style="background: rgba(0, 0, 0, 0.22); border: 1px solid var(--glass-border); border-radius: 6px; padding: 12px; font-size: 0.72rem; overflow-x: auto; max-height: 180px; margin: 6px 0 0 0;" class="font-monospace"><code style="color: #A7F3D0; white-space: pre; font-family: monospace;">${escapeHTML(q.codeSnippet)}</code></pre>
        ` : ''}
      `;

      questionsBox.appendChild(qCard);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // --- CRUD Modal Actions ---
  window.openAddQuestionModal = () => {
    modalForm.reset();
    fieldId.value = "";
    modalTitle.textContent = "Add Solved Question";
    fieldDate.value = getRelativeDateStr(0);
    if (fieldCode) fieldCode.value = "";
    
    modalBackdrop.classList.add('active');
  };

  window.openEditQuestionModal = (id) => {
    const q = questions.find(item => item.id === id);
    if (!q) return;

    fieldId.value = q.id;
    fieldTitle.value = q.title;
    fieldTopic.value = q.topic;
    fieldDifficulty.value = q.difficulty;
    fieldDate.value = q.solvedDate;
    fieldNotes.value = q.notes || "";
    if (fieldCode) fieldCode.value = q.codeSnippet || "";

    modalTitle.textContent = "Edit Solved Question";
    modalBackdrop.classList.add('active');
  };

  window.closeQuestionModal = () => {
    modalBackdrop.classList.remove('active');
  };

  window.saveQuestionForm = (event) => {
    event.preventDefault();

    const id = fieldId.value;
    const title = fieldTitle.value.trim();
    const topic = fieldTopic.value;
    const difficulty = fieldDifficulty.value;
    const solvedDate = fieldDate.value;
    const notes = fieldNotes.value.trim();
    const codeSnippet = fieldCode ? fieldCode.value.trim() : "";

    if (id === "") {
      const newQuestion = {
        id: "code_" + Date.now(),
        title,
        topic,
        difficulty,
        solvedDate,
        notes,
        codeSnippet
      };
      questions.push(newQuestion);
      window.toast.show('success', 'Question Added', 'New solved coding question logged successfully.', 2000);
    } else {
      const idx = questions.findIndex(item => item.id === id);
      if (idx >= 0) {
        questions[idx] = { id, title, topic, difficulty, solvedDate, notes, codeSnippet };
        window.toast.show('success', 'Question Updated', 'Coding question details saved.', 2000);
      }
    }

    localStorage.setItem('nexusED_coding_questions', JSON.stringify(questions));
    closeQuestionModal();
    renderTracker();
  };

  window.deleteQuestion = (id) => {
    if (confirm("Are you sure you want to remove this question from your coding tracker logs?")) {
      questions = questions.filter(item => item.id !== id);
      localStorage.setItem('nexusED_coding_questions', JSON.stringify(questions));
      window.toast.show('info', 'Question Deleted', 'Removed question log entry.', 1500);
      renderTracker();
    }
  };

  // Helper date utility
  function getRelativeDateStr(offsetDays) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Escape HTML helper
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
});
