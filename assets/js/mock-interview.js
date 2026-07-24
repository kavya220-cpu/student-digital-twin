/* mock-interview.js */

document.addEventListener('DOMContentLoaded', () => {
  // Fetch Local Storage Profile Data
  const profileData = localStorage.getItem('nexusED_profile');
  
  // Guard Clause: Redirect to Profile Setup if not configured
  if (!profileData) {
    window.toast.show('warning', 'Profile Setup Required', 'Please configure your profile twin to access the mock interview engine.', 4000);
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

  // PREDEFINED INDUSTRY-LEVEL QUESTIONS DATABASE
  const questionDatabase = {
    HR: [
      { id: "hr1", subject: "HR", topic: "Self Introduction", time: 3, question: "Walk me through your background, emphasizing key projects, technology stack experiences, and your career progression.", keywords: "background, education, experience, career path, passion, skills, achievements, engineering, technology stack" },
      { id: "hr2", subject: "HR", topic: "Fit", time: 2, question: "Why do you want to join our organization, and what unique values or technical leadership do you bring to our team?", keywords: "skills, qualification, alignment, cultural fit, values, problem solving, innovation, contribution, growth" },
      { id: "hr3", subject: "HR", topic: "Strengths", time: 2, question: "What are your greatest professional strengths, and how do you leverage them to solve complex technical challenges?", keywords: "adaptability, fast learner, problem solving, collaboration, dedication, detail oriented, analytical thinking, leadership" },
      { id: "hr4", subject: "HR", topic: "Weaknesses", time: 3, question: "Describe a significant professional weakness or setback you faced, and detail the steps you took to overcome and improve it.", keywords: "public speaking, delegation, detail overfocus, workload balance, feedback, learn, self aware, improvement, action plan" },
      { id: "hr5", subject: "HR", topic: "Career Goals", time: 3, question: "Where do you envision your career trajectory in five years in terms of technical mastery and organizational leadership?", keywords: "career trajectory, technical mastery, leadership, mentorship, architecture, learn, tech lead, senior role, stability" }
    ],
    Technical: [
      { id: "tech1", subject: "Java", topic: "OOP concepts", time: 3, question: "What is the difference between abstract classes and interfaces in Java, and when should you choose one over the other?", keywords: "abstract class, interface, state, multiple inheritance, default methods, API contract, constant variables, structural blueprint" },
      { id: "tech2", subject: "Python", topic: "Multithreading", time: 4, question: "Explain Python's Global Interpreter Lock (GIL) and how it affects CPU-bound vs I/O-bound multi-threaded applications.", keywords: "GIL, thread safety, CPU bound, IO bound, CPython, concurrency, parallel execution, multiprocessing" },
      { id: "tech3", subject: "DBMS", topic: "Transactions", time: 3, question: "Describe the ACID properties of database transactions and explain how isolation level anomalies like dirty reads occur.", keywords: "atomicity, consistency, isolation, durability, isolation levels, dirty reads, phantom reads, commit, rollback" },
      { id: "tech4", subject: "Operating Systems", topic: "Memory", time: 4, question: "How does virtual memory paging work, and what is thrashing in operating system resource management?", keywords: "virtual memory, paging, page fault, frame allocation, page replacement, thrashing, swap space, page table" },
      { id: "tech5", subject: "Computer Networks", topic: "Protocols", time: 2, question: "What is the TCP three-way handshake process, and why is TCP preferred over UDP for reliable data transfer?", keywords: "three way handshake, SYN, ACK, seq number, reliable transport, packet delivery, connection oriented, checksum, packet reordering" },
      { id: "tech6", subject: "OOP", topic: "Pillars", time: 3, question: "Describe the four core pillars of OOP and give a real-world software design pattern example where polymorphism is applied.", keywords: "encapsulation, inheritance, polymorphism, abstraction, interface, override, software design pattern, subclass" },
      { id: "tech7", subject: "SQL", topic: "Queries", time: 2, question: "Explain the difference between INNER JOIN, LEFT OUTER JOIN, and CROSS JOIN in database queries, detailing performance implications.", keywords: "inner join, left outer join, cross join, query execution plan, index lookup, cartesian product, matching rows, null values" },
      { id: "tech8", subject: "DSA", topic: "Algorithms", time: 4, question: "Compare Quick Sort and Merge Sort algorithms, explaining their time complexities, space requirements, and stable sorting properties.", keywords: "quick sort, merge sort, pivot partition, divide and conquer, recursive stack, auxiliary space, stable sort, average complexity" }
    ],
    Behavioral: [
      { id: "beh1", subject: "Behavioral", topic: "Leadership", time: 4, question: "Describe a situation where you had to lead a diverse team on short notice. How did you organize tasks under pressure?", keywords: "leadership, coordinate, task delegation, deadline pressure, communication, listen, timeline, project milestone, delegation" },
      { id: "beh2", subject: "Behavioral", topic: "Conflict Resolution", time: 3, question: "Tell me about a conflict or difference in technical opinions you had with a teammate. How did you resolve it objectively?", keywords: "conflict resolution, compromise, active listening, objective criteria, STAR, project goals, resolve, teammate, perspective" },
      { id: "beh3", subject: "Behavioral", topic: "Teamwork", time: 3, question: "Describe a project challenge where you collaborated in a cross-functional team to achieve a critical business objective.", keywords: "collaboration, cross functional, milestone, challenge, support, communication, business objective, outcome, project execution" },
      { id: "beh4", subject: "Behavioral", topic: "Communication", time: 3, question: "How do you present a complex technical architecture concept to a non-technical stakeholder or business client?", keywords: "analogy, simplification, layman terms, business value, check in, examples, avoid jargon, visual diagrams, communicate" }
    ],
    Aptitude: [
      { id: "apt1", subject: "Aptitude", topic: "Puzzles", time: 3, question: "How would you approach solving a riddle or complex mathematical puzzle?", keywords: "pattern, logic, breakdown, analyze, solve, steps, iterate, formula, verify" }
    ],
    GD: [
      { id: "gd1", subject: "GD", topic: "AI Automation", time: 4, question: "Is Artificial Intelligence a threat or a tool for entry-level developers?", keywords: "tool, threat, automation, productivity, learning, code assistance, prompt engineering, validate, balance" }
    ],
    Coding: [
      { id: "code1", subject: "Coding", topic: "Pseudo-code", time: 5, question: "Write and explain the pseudo-code logic to reverse a singly linked list in-place.", keywords: "prev, current, next, loop, reverse, pointer, swap, iteration, head, null" }
    ]
  };

  // State Variables
  let selectedTrack = "";
  let activeQuestions = [];
  let currentQIdx = 0;
  
  let interviewAnswers = {}; // { qId: answerText }
  let interviewTimers = {}; // { qId: secondsSpent }
  let questionEvaluations = {}; // { qId: { matched: [], missing: [], eye: X, posture: Y, smile: Z, suggestions: [] } }
  
  let totalElapsedSeconds = 0;
  let questionTimerSeconds = 0;
  let timerInterval = null;

  // Hardware Streaming states
  let mediaStream = null;
  let speechRecognition = null;
  let isRecording = false;
  let hudAnimationId = null;

  // Lobby Dashboard elements
  const ringAnalyticsAvg = document.getElementById('ring-analytics-average');
  const textAnalyticsAvg = document.getElementById('text-analytics-average');
  const statSessions = document.getElementById('stat-sessions-count');
  const statHighest = document.getElementById('stat-highest-score');
  const statTime = document.getElementById('stat-total-time');
  const statRecent = document.getElementById('stat-recent-path');

  // Views
  const lobbyView = document.getElementById('interview-lobby-view');
  const activeView = document.getElementById('interview-active-view');
  const cardsGrid = document.getElementById('tracks-cards-feed');

  // Modal elements
  const modalOverlay = document.getElementById('instructions-modal-overlay');
  const modalTitle = document.getElementById('instructions-modal-title');
  const btnModalBegin = document.getElementById('btn-modal-begin');
  const btnModalCancel = document.getElementById('btn-modal-cancel');
  const btnModalClose = document.getElementById('btn-modal-close');

  // Simulator Layout elements
  const activeTrackBadge = document.getElementById('active-track-badge');
  const activeQuestionCounter = document.getElementById('active-question-counter');
  const activeTimerText = document.getElementById('active-timer-text');
  const optimalTimeText = document.getElementById('optimal-time-text');
  
  const activeProgressFill = document.getElementById('active-progress-fill');
  const checkpointsBox = document.getElementById('active-questions-checkpoints');
  
  const activeQuestionSubject = document.getElementById('active-question-subject');
  const activeQuestionText = document.getElementById('active-question-text');
  const activeAnswerTextarea = document.getElementById('active-answer-textarea');
  
  const counterWord = document.getElementById('counter-word');
  const counterChar = document.getElementById('counter-char');
  
  const btnActivePrev = document.getElementById('btn-active-prev');
  const btnActiveNext = document.getElementById('btn-active-next');

  // Instant Feedback elements
  const activeFeedbackPanel = document.getElementById('active-feedback-panel');
  const feedbackTranscriptionText = document.getElementById('feedback-transcription-text');
  const feedbackMatchedBox = document.getElementById('feedback-matched-keywords');
  const feedbackMissingBox = document.getElementById('feedback-missing-keywords');
  const feedbackSuggestionsList = document.getElementById('feedback-suggestions-list');

  // Feedback metric bars
  const barTextEye = document.getElementById('bar-text-eye');
  const barFillEye = document.getElementById('bar-fill-eye');
  const barTextPosture = document.getElementById('bar-text-posture');
  const barFillPosture = document.getElementById('bar-fill-posture');
  const barTextSmile = document.getElementById('bar-text-smile');
  const barFillSmile = document.getElementById('bar-fill-smile');

  // Camera indicators
  const btnRecordToggle = document.getElementById('btn-record-toggle');
  const activeWebcamFeed = document.getElementById('active-webcam-feed');
  const activeHudCanvas = document.getElementById('active-hud-canvas');
  const activeRecIndicator = document.getElementById('active-rec-indicator');

  const hudEyeContact = document.getElementById('hud-eye-contact');
  const hudPosture = document.getElementById('hud-posture');
  const hudSmile = document.getElementById('hud-smile');

  const evalOverlay = document.getElementById('evaluator-scan-overlay');

  // Initial load
  loadAnalyticsFromLogs();

  function loadAnalyticsFromLogs() {
    const attempts = JSON.parse(localStorage.getItem('nexusED_mock_attempts')) || [];
    
    if (attempts.length === 0) {
      updateLobbySVGAnalytics(0);
      statSessions.textContent = "0";
      statHighest.textContent = "0%";
      statTime.textContent = "0 Mins";
      statRecent.textContent = "None";
      return;
    }

    const sessionCount = attempts.length;
    let totalScoreSum = 0;
    let highest = 0;
    let totalSecs = 0;
    let recent = attempts[attempts.length - 1].track;

    attempts.forEach(att => {
      totalScoreSum += att.overallScore;
      if (att.overallScore > highest) highest = att.overallScore;
      totalSecs += att.timeSpent;
    });

    const average = Math.round(totalScoreSum / sessionCount);
    
    updateLobbySVGAnalytics(average);
    statSessions.textContent = sessionCount;
    statHighest.textContent = `${Math.round(highest)}%`;
    statTime.textContent = `${Math.round(totalSecs / 60)} Mins`;
    statRecent.textContent = recent;
  }

  function updateLobbySVGAnalytics(score) {
    textAnalyticsAvg.textContent = `${score}%`;
    const circ = 2 * Math.PI * 52; 
    ringAnalyticsAvg.style.strokeDasharray = circ;
    
    setTimeout(() => {
      ringAnalyticsAvg.style.strokeDashoffset = circ - (score / 100) * circ;
    }, 100);
  }

  // --- Cards selection triggers ---
  cardsGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.track-select-card');
    if (!card) return;

    selectedTrack = card.dataset.track; 
    activeQuestions = questionDatabase[selectedTrack] || questionDatabase.HR;
    
    modalTitle.textContent = `${selectedTrack} Interview Instructions`;
    modalOverlay.style.display = 'flex';
    modalOverlay.firstElementChild.className = 'glass-modal-card animate__animated animate__zoomIn';
  });

  [btnModalCancel, btnModalClose].forEach(btn => {
    btn.addEventListener('click', () => {
      modalOverlay.style.display = 'none';
    });
  });

  btnModalBegin.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
    startInterviewSimulator();
  });

  // --- Active Simulator ---
  function startInterviewSimulator() {
    lobbyView.style.display = 'none';
    activeView.style.display = 'block';

    currentQIdx = 0;
    interviewAnswers = {};
    interviewTimers = {};
    questionEvaluations = {};
    totalElapsedSeconds = 0;
    questionTimerSeconds = 0;

    activeQuestions.forEach(q => {
      interviewAnswers[q.id] = "";
      interviewTimers[q.id] = 0;
      questionEvaluations[q.id] = null;
    });

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      totalElapsedSeconds++;
      questionTimerSeconds++;
      
      const mins = Math.floor(questionTimerSeconds / 60);
      const secs = questionTimerSeconds % 60;
      activeTimerText.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);

    renderCheckpointList();
    renderActiveQuestion();
  }

  function renderCheckpointList() {
    checkpointsBox.innerHTML = '';
    activeQuestions.forEach((q, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = idx === currentQIdx ? 'active' : '';
      btn.innerHTML = `<i data-lucide="circle-dot" style="width:14px; height:14px;"></i><span>Question ${idx + 1}</span>`;
      
      btn.addEventListener('click', () => {
        saveCurrentInput();
        currentQIdx = idx;
        renderActiveQuestion();
      });

      checkpointsBox.appendChild(btn);
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function renderActiveQuestion() {
    const q = activeQuestions[currentQIdx];
    
    activeTrackBadge.textContent = `${selectedTrack} Round`;
    activeQuestionCounter.textContent = `Question ${currentQIdx + 1} of ${activeQuestions.length}`;
    optimalTimeText.textContent = `${q.time} mins`;

    activeQuestionSubject.textContent = q.topic;
    activeQuestionText.textContent = q.question;
    
    // Restore spoken transcript
    activeAnswerTextarea.value = interviewAnswers[q.id];
    questionTimerSeconds = interviewTimers[q.id];

    // Trigger word counts
    updateInputCounters();

    // Reset panel visibility
    if (questionEvaluations[q.id]) {
      displayQuestionEvaluationCard(q.id);
    } else {
      activeFeedbackPanel.style.display = 'none';
    }

    // Refresh checklists
    const btns = checkpointsBox.querySelectorAll('button');
    btns.forEach((btn, idx) => {
      btn.className = '';
      if (idx === currentQIdx) {
        btn.classList.add('active');
      }
      
      const qId = activeQuestions[idx].id;
      if (interviewAnswers[qId] && interviewAnswers[qId].trim() !== "") {
        btn.classList.add('answered');
      }
    });

    const progressPct = ((currentQIdx + 1) / activeQuestions.length) * 100;
    activeProgressFill.style.width = `${progressPct}%`;

    btnActivePrev.style.visibility = currentQIdx === 0 ? 'hidden' : 'visible';
    
    const isLast = currentQIdx === activeQuestions.length - 1;
    btnActiveNext.querySelector('span').textContent = isLast ? "Finish & Evaluate" : "Next Question";
  }

  function saveCurrentInput() {
    if (isRecording) {
      stopRecording();
    }
    const q = activeQuestions[currentQIdx];
    interviewAnswers[q.id] = activeAnswerTextarea.value;
    interviewTimers[q.id] = questionTimerSeconds;
  }

  // Next Question
  btnActiveNext.addEventListener('click', () => {
    saveCurrentInput();

    if (currentQIdx < activeQuestions.length - 1) {
      currentQIdx++;
      renderActiveQuestion();
    } else {
      finishMockInterviewSession();
    }
  });

  // Previous Question
  btnActivePrev.addEventListener('click', () => {
    saveCurrentInput();
    if (currentQIdx > 0) {
      currentQIdx--;
      renderActiveQuestion();
    }
  });

  // Speech Text Area counters
  activeAnswerTextarea.addEventListener('input', updateInputCounters);

  function updateInputCounters() {
    const text = activeAnswerTextarea.value.trim();
    const chars = text.length;
    const words = text === "" ? 0 : text.split(/\s+/).length;

    counterWord.textContent = words;
    counterChar.textContent = chars;
  }

  // Toggle Recording controls
  if (btnRecordToggle) {
    btnRecordToggle.addEventListener('click', () => {
      if (isRecording) {
        // Stop recording AND immediately run local evaluation
        stopRecording();
        evaluateActiveQuestionResponse();
      } else {
        startRecording();
      }
    });
  }

  function startRecording() {
    isRecording = true;
    
    // Hide old feedback card if retaking
    activeFeedbackPanel.style.display = 'none';

    // Configure pulsing red button
    btnRecordToggle.classList.remove('btn-rec-inactive');
    btnRecordToggle.classList.add('btn-rec-active');
    btnRecordToggle.querySelector('span').textContent = 'Stop & Evaluate';
    
    const icon = btnRecordToggle.querySelector('i') || btnRecordToggle.querySelector('svg');
    if (icon) {
      icon.setAttribute('data-lucide', 'square');
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    if (activeRecIndicator) activeRecIndicator.style.display = 'flex';
    const scanLine = document.querySelector('.scanning-laser-line');
    if (scanLine) scanLine.style.display = 'block';

    // Access Webcam hardware
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        mediaStream = stream;
        if (activeWebcamFeed) {
          activeWebcamFeed.srcObject = stream;
          activeWebcamFeed.play().catch(err => console.log("Stream play error:", err));
        }
        startHudVisualization();
      })
      .catch(err => {
        console.error("Webcam hardware block:", err);
        window.toast.show('error', 'Hardware Blocked', 'Camera and microphone access is required for video interview simulations.', 4000);
        stopRecording();
      });

    // Start local Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      speechRecognition = new SpeechRecognition();
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.lang = 'en-US';

      speechRecognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          const prev = activeAnswerTextarea.value;
          activeAnswerTextarea.value = (prev ? prev.trim() + ' ' : '') + finalTranscript;
          activeAnswerTextarea.dispatchEvent(new Event('input'));
        }
      };

      speechRecognition.onerror = (e) => {
        console.error("Speech Recognition Error:", e);
      };

      speechRecognition.start();
    } else {
      window.toast.show('info', 'Speech Support Missing', 'Your browser does not support Web Speech Recognition. You can type in the transcript panel.', 5000);
    }
  }

  function stopRecording() {
    isRecording = false;

    // Reset button visuals
    btnRecordToggle.classList.remove('btn-rec-active');
    btnRecordToggle.classList.add('btn-rec-inactive');
    btnRecordToggle.querySelector('span').textContent = 'Start Recording';
    
    const icon = btnRecordToggle.querySelector('i') || btnRecordToggle.querySelector('svg');
    if (icon) {
      icon.setAttribute('data-lucide', 'video');
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    if (activeRecIndicator) activeRecIndicator.style.display = 'none';
    const scanLine = document.querySelector('.scanning-laser-line');
    if (scanLine) scanLine.style.display = 'none';

    // Stop streams
    if (mediaStream) {
      mediaStream.getTracks().forEach(tr => tr.stop());
      mediaStream = null;
    }
    if (activeWebcamFeed) activeWebcamFeed.srcObject = null;

    if (speechRecognition) {
      speechRecognition.stop();
      speechRecognition = null;
    }

    if (hudAnimationId) {
      cancelAnimationFrame(hudAnimationId);
      hudAnimationId = null;
    }

    if (activeHudCanvas) {
      const ctx = activeHudCanvas.getContext('2d');
      ctx.clearRect(0, 0, activeHudCanvas.width, activeHudCanvas.height);
    }

    hudEyeContact.textContent = 'Gaze Off';
    hudEyeContact.className = 'text-muted';
    hudPosture.textContent = 'Inactive';
    hudPosture.className = 'text-muted';
    hudSmile.textContent = 'Neutral';
    hudSmile.className = 'text-muted';
  }

  // --- Real-time Local Question-by-Question Evaluator ---
  function evaluateActiveQuestionResponse() {
    const q = activeQuestions[currentQIdx];
    const text = activeAnswerTextarea.value.trim();

    if (text === "") {
      window.toast.show('warning', 'Empty Recording', 'No spoken answer transcribed yet. Please speak into the mic.', 3000);
      return;
    }

    // 1. Keyword Diffing
    const expectedKws = q.keywords.split(",").map(k => k.trim().toLowerCase());
    const textLower = text.toLowerCase();
    
    const matched = [];
    const missing = [];

    expectedKws.forEach(kw => {
      if (textLower.includes(kw)) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });

    // 2. Mock Expression scoring ratios
    const words = text.split(/\s+/).length;
    
    let eyeScore = Math.floor(82 + Math.random() * 14); 
    let postureScore = Math.floor(80 + Math.random() * 13); 
    let smileScore = Math.floor(60 + Math.random() * 20); 

    // 3. Compile Suggestions list
    const suggestions = [];
    if (words < 30) {
      suggestions.push("Write/Speak longer answers. Your response was too short (<30 words) to establish thorough clarity.");
    }
    if (missing.length > 0) {
      suggestions.push(`Integrate missing terminologies: <strong>${missing.slice(0, 3).join(', ')}</strong>.`);
    }
    if (eyeScore < 90) {
      suggestions.push("Steer your gaze directly into the camera lens to project conviction.");
    }
    if (postureScore < 85) {
      suggestions.push("Maintain a steady head level and posture coordinate to avoid looking distracted.");
    }

    // 4. Save evaluation to state variables
    questionEvaluations[q.id] = {
      transcription: text,
      matched,
      missing,
      eye: eyeScore,
      posture: postureScore,
      smile: smileScore,
      suggestions: suggestions.length > 0 ? suggestions : ["Excellent overall delivery and terminology matches!"]
    };

    // Render the panel UI
    displayQuestionEvaluationCard(q.id);
  }

  function displayQuestionEvaluationCard(qId) {
    const evalData = questionEvaluations[qId];
    if (!evalData) return;

    feedbackTranscriptionText.textContent = `"${evalData.transcription}"`;

    // Matched badges
    feedbackMatchedBox.innerHTML = '';
    if (evalData.matched.length === 0) {
      feedbackMatchedBox.innerHTML = `<span class="fs-xs text-muted">None</span>`;
    } else {
      evalData.matched.forEach(kw => {
        feedbackMatchedBox.innerHTML += `<span class="keyword-badge matched"><i data-lucide="check" style="width:10px; height:10px;"></i>${kw}</span>`;
      });
    }

    // Missing badges
    feedbackMissingBox.innerHTML = '';
    if (evalData.missing.length === 0) {
      feedbackMissingBox.innerHTML = `<span class="keyword-badge matched"><i data-lucide="check" style="width:10px; height:10px;"></i>All matched!</span>`;
    } else {
      evalData.missing.forEach(kw => {
        feedbackMissingBox.innerHTML += `<span class="keyword-badge missing"><i data-lucide="alert-circle" style="width:10px; height:10px;"></i>${kw}</span>`;
      });
    }

    // Expression progress bars
    barTextEye.textContent = `${evalData.eye}%`;
    barFillEye.style.width = `${evalData.eye}%`;
    
    barTextPosture.textContent = `${evalData.posture}%`;
    barFillPosture.style.width = `${evalData.posture}%`;
    
    barTextSmile.textContent = `${evalData.smile}%`;
    barFillSmile.style.width = `${evalData.smile}%`;

    // Suggestions list
    feedbackSuggestionsList.innerHTML = '';
    evalData.suggestions.forEach(sug => {
      feedbackSuggestionsList.innerHTML += `<li>${sug}</li>`;
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Smooth show
    activeFeedbackPanel.style.display = 'block';
    gsap.fromTo(activeFeedbackPanel, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 });
  }

  // --- Final evaluation transition ---
  function finishMockInterviewSession() {
    if (isRecording) {
      stopRecording();
    }

    const answeredCount = Object.values(interviewAnswers).filter(ans => ans.trim() !== "").length;
    if (answeredCount === 0) {
      window.toast.show('warning', 'Incomplete Session', 'Please answer and evaluate at least one question before ending.', 4000);
      return;
    }

    clearInterval(timerInterval);

    let totalEye = 0;
    let totalPosture = 0;
    let totalSmile = 0;
    let count = 0;

    Object.values(questionEvaluations).forEach(ev => {
      if (ev) {
        totalEye += ev.eye;
        totalPosture += ev.posture;
        totalSmile += ev.smile;
        count++;
      }
    });

    const avgEye = count > 0 ? totalEye / count : 85;
    const avgPosture = count > 0 ? totalPosture / count : 80;
    const avgSmile = count > 0 ? totalSmile / count : 65;

    const sessionResultData = {
      track: selectedTrack,
      answers: interviewAnswers,
      timers: interviewTimers,
      totalTime: totalElapsedSeconds,
      facialMetrics: {
        eye: Math.round(avgEye),
        posture: Math.round(avgPosture),
        smile: Math.round(avgSmile)
      }
    };
    
    localStorage.setItem('nexusED_last_interview_session', JSON.stringify(sessionResultData));

    evalOverlay.style.display = 'flex';

    setTimeout(() => {
      evalOverlay.style.display = 'none';
      window.location.href = 'results.html';
    }, 2200);
  }

  // --- Futuristic Canvas HUD Mesh Animation Loop ---
  function startHudVisualization() {
    if (!activeHudCanvas) return;
    const ctx = activeHudCanvas.getContext('2d');
    
    const resizeCanvas = () => {
      const rect = activeHudCanvas.getBoundingClientRect();
      activeHudCanvas.width = rect.width;
      activeHudCanvas.height = rect.height;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let frameCount = 0;

    const drawHud = () => {
      if (!isRecording) return;
      
      frameCount++;
      ctx.clearRect(0, 0, activeHudCanvas.width, activeHudCanvas.height);
      
      const w = activeHudCanvas.width;
      const h = activeHudCanvas.height;
      const cx = w / 2;
      const cy = h / 2;
      
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
      ctx.lineWidth = 1.5;
      
      const boxW = Math.min(220, w * 0.5);
      const boxH = Math.min(260, h * 0.75);
      const bx = cx - boxW / 2;
      const by = cy - boxH / 2;

      // Corners
      const len = 20;
      ctx.beginPath();
      ctx.moveTo(bx + len, by); ctx.lineTo(bx, by); ctx.lineTo(bx, by + len);
      ctx.moveTo(bx + boxW - len, by); ctx.lineTo(bx + boxW, by); ctx.lineTo(bx + boxW, by + len);
      ctx.moveTo(bx, by + boxH - len); ctx.lineTo(bx, by + boxH); ctx.lineTo(bx + len, by + boxH);
      ctx.moveTo(bx + boxW, by + boxH - len); ctx.lineTo(bx + boxW, by + boxH); ctx.lineTo(bx + boxW - len, by + boxH);
      ctx.stroke();

      // Oval
      ctx.save();
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.ellipse(cx, cy, boxW * 0.4, boxH * 0.45, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Crosshair
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.25)';
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy); ctx.lineTo(cx + 10, cy);
      ctx.moveTo(cx, cy - 10); ctx.lineTo(cx, cy + 10);
      ctx.stroke();

      // Structural dots
      ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
      const points = [
        { x: cx, y: cy - 40 }, 
        { x: cx - 25, y: cy - 50 }, 
        { x: cx + 25, y: cy - 50 }, 
        { x: cx - 35, y: cy }, 
        { x: cx + 35, y: cy }, 
        { x: cx, y: cy + 30 }, 
        { x: cx - 15, y: cy + 30 }, 
        { x: cx + 15, y: cy + 30 }, 
        { x: cx, y: cy + 60 } 
      ];

      points.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x + (Math.sin(frameCount / 10 + pt.x) * 1.5), pt.y + (Math.cos(frameCount / 10 + pt.y) * 1.5), 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
      ctx.beginPath();
      ctx.moveTo(points[1].x, points[1].y); ctx.lineTo(points[0].x, points[0].y); ctx.lineTo(points[2].x, points[2].y);
      ctx.moveTo(points[1].x, points[1].y); ctx.lineTo(points[3].x, points[3].y); ctx.lineTo(points[6].x, points[6].y);
      ctx.moveTo(points[2].x, points[2].y); ctx.lineTo(points[4].x, points[4].y); ctx.lineTo(points[7].x, points[7].y);
      ctx.moveTo(points[6].x, points[6].y); ctx.lineTo(points[5].x, points[5].y); ctx.lineTo(points[7].x, points[7].y);
      ctx.lineTo(points[8].x, points[8].y); ctx.lineTo(points[6].x, points[6].y);
      ctx.stroke();

      ctx.fillStyle = 'rgba(139, 92, 246, 0.8)';
      ctx.font = '10px Courier New';
      ctx.fillText(`AI FACE TRACKER ACTIVE`, bx + 10, by + 25);
      
      const randCoord = (Math.random() * 100).toFixed(4);
      ctx.fillText(`COORD X: ${randCoord}`, bx + 10, by + boxH - 15);
      ctx.fillText(`FPS: 60`, bx + boxW - 55, by + boxH - 15);

      if (frameCount % 60 === 0) {
        const gazeStates = ['Gaze Locked', 'Attentive', 'Looking Center'];
        const postureStates = ['Stable', 'Calm', 'Balanced'];
        const smileStates = ['Neutral', 'Attentive', 'Smiling', 'Confident'];

        if (hudEyeContact) {
          hudEyeContact.textContent = gazeStates[Math.floor(Math.random() * gazeStates.length)];
          hudEyeContact.className = 'text-success fw-semibold';
        }
        if (hudPosture) {
          hudPosture.textContent = postureStates[Math.floor(Math.random() * postureStates.length)];
          hudPosture.className = 'text-success fw-semibold';
        }
        if (hudSmile) {
          const s = smileStates[Math.floor(Math.random() * smileStates.length)];
          hudSmile.textContent = s;
          if (s === 'Smiling' || s === 'Confident') {
            hudSmile.className = 'text-success fw-semibold';
          } else {
            hudSmile.className = 'text-muted';
          }
        }
      }

      hudAnimationId = requestAnimationFrame(drawHud);
    };

    hudAnimationId = requestAnimationFrame(drawHud);
  }
});
