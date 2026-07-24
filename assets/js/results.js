/* results.js */

document.addEventListener('DOMContentLoaded', () => {
  // Fetch Local Storage Data
  const profileData = localStorage.getItem('nexusED_profile');
  
  // Guard Clause: Redirect to Profile Setup if not configured
  if (!profileData) {
    window.toast.show('warning', 'Profile Setup Required', 'Please configure your profile twin to access the results dashboard.', 4000);
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

  // Questions Database Replica Synced with Java Evaluation logic
  const questionDatabase = {
    HR: [
      { id: "hr1", subject: "HR", topic: "Self Introduction", time: 3, question: "Walk me through your background, emphasizing key projects, technology stack experiences, and your career progression.", keywords: ["background", "education", "experience", "career path", "passion", "skills", "achievements", "engineering", "technology stack"] },
      { id: "hr2", subject: "HR", topic: "Fit", time: 2, question: "Why do you want to join our organization, and what unique values or technical leadership do you bring to our team?", keywords: ["skills", "qualification", "alignment", "cultural fit", "values", "problem solving", "innovation", "contribution", "growth"] },
      { id: "hr3", subject: "HR", topic: "Strengths", time: 2, question: "What are your greatest professional strengths, and how do you leverage them to solve complex technical challenges?", keywords: ["adaptability", "fast learner", "problem solving", "collaboration", "dedication", "detail oriented", "analytical thinking", "leadership"] },
      { id: "hr4", subject: "HR", topic: "Weaknesses", time: 3, question: "Describe a significant professional weakness or setback you faced, and detail the steps you took to overcome and improve it.", keywords: ["public speaking", "delegation", "detail overfocus", "workload balance", "feedback", "learn", "self aware", "improvement", "action plan"] },
      { id: "hr5", subject: "HR", topic: "Career Goals", time: 3, question: "Where do you envision your career trajectory in five years in terms of technical mastery and organizational leadership?", keywords: ["career trajectory", "technical mastery", "leadership", "mentorship", "architecture", "learn", "tech lead", "senior role", "stability"] }
    ],
    Technical: [
      { id: "tech1", subject: "Java", topic: "OOP concepts", time: 3, question: "What is the difference between abstract classes and interfaces in Java, and when should you choose one over the other?", keywords: ["abstract class", "interface", "state", "multiple inheritance", "default methods", "API contract", "constant variables", "structural blueprint"] },
      { id: "tech2", subject: "Python", topic: "Multithreading", time: 4, question: "Explain Python's Global Interpreter Lock (GIL) and how it affects CPU-bound vs I/O-bound multi-threaded applications.", keywords: ["GIL", "thread safety", "CPU bound", "IO bound", "CPython", "concurrency", "parallel execution", "multiprocessing"] },
      { id: "tech3", subject: "DBMS", topic: "Transactions", time: 3, question: "Describe the ACID properties of database transactions and explain how isolation level anomalies like dirty reads occur.", keywords: ["atomicity", "consistency", "isolation", "durability", "ACID", "transaction", "safety", "commit", "rollback"] },
      { id: "tech4", subject: "Operating Systems", topic: "Memory", time: 4, question: "How does virtual memory paging work, and what is thrashing in operating system resource management?", keywords: ["virtual memory", "paging", "page fault", "frame allocation", "page replacement", "thrashing", "swap space", "page table"] },
      { id: "tech5", subject: "Computer Networks", topic: "Protocols", time: 2, question: "What is the TCP three-way handshake process, and why is TCP preferred over UDP for reliable data transfer?", keywords: ["three way handshake", "SYN", "ACK", "seq number", "reliable transport", "packet delivery", "connection oriented", "checksum", "packet reordering"] },
      { id: "tech6", subject: "OOP", topic: "Pillars", time: 3, question: "Describe the four core pillars of OOP and give a real-world software design pattern example where polymorphism is applied.", keywords: ["encapsulation", "inheritance", "polymorphism", "abstraction", "interface", "override", "software design pattern", "subclass"] },
      { id: "tech7", subject: "SQL", topic: "Queries", time: 2, question: "Explain the difference between INNER JOIN, LEFT OUTER JOIN, and CROSS JOIN in database queries, detailing performance implications.", keywords: ["inner join", "left outer join", "cross join", "query execution plan", "index lookup", "cartesian product", "matching rows", "null values"] },
      { id: "tech8", subject: "DSA", topic: "Algorithms", time: 4, question: "Compare Quick Sort and Merge Sort algorithms, explaining their time complexities, space requirements, and stable sorting properties.", keywords: ["quick sort", "merge sort", "pivot partition", "divide and conquer", "recursive stack", "auxiliary space", "stable sort", "average complexity"] }
    ],
    Behavioral: [
      { id: "beh1", subject: "Behavioral", topic: "Leadership", time: 4, question: "Describe a situation where you had to lead a diverse team on short notice. How did you organize tasks under pressure?", keywords: ["leadership", "coordinate", "task delegation", "deadline pressure", "communication", "listen", "timeline", "project milestone", "delegation"] },
      { id: "beh2", subject: "Behavioral", topic: "Conflict Resolution", time: 3, question: "Tell me about a conflict or difference in technical opinions you had with a teammate. How did you resolve it objectively?", keywords: ["conflict resolution", "compromise", "active listening", "objective criteria", "STAR", "project goals", "resolve", "teammate", "perspective"] },
      { id: "beh3", subject: "Behavioral", topic: "Teamwork", time: 3, question: "Describe a project challenge where you collaborated in a cross-functional team to achieve a critical business objective.", keywords: ["collaboration", "cross functional", "milestone", "challenge", "support", "communication", "business objective", "outcome, project execution"] },
      { id: "beh4", subject: "Behavioral", topic: "Communication", time: 3, question: "How do you present a complex technical architecture concept to a non-technical stakeholder or business client?", keywords: ["analogy", "simplification", "layman terms", "business value", "check in", "examples", "avoid jargon", "visual diagrams", "communicate"] }
    ],
    Aptitude: [
      { id: "apt1", subject: "Aptitude", topic: "Puzzles", time: 3, question: "How would you approach solving a riddle or complex mathematical puzzle?", keywords: ["pattern", "logic", "breakdown", "analyze", "solve", "steps", "iterate", "formula", "verify"] }
    ],
    GD: [
      { id: "gd1", subject: "GD", topic: "AI Automation", time: 4, question: "Is Artificial Intelligence a threat or a tool for entry-level developers?", keywords: ["tool", "threat", "automation", "productivity", "learning", "code assistance", "prompt engineering", "validate", "balance"] }
    ],
    Coding: [
      { id: "code1", subject: "Coding", topic: "Pseudo-code", time: 5, question: "Write and explain the pseudo-code logic to reverse a singly linked list in-place.", keywords: ["prev", "current", "next", "loop", "reverse", "pointer", "swap", "iteration", "head", "null"] }
    ]
  };

  // DOM Elements
  const trackTitle = document.getElementById('results-track-title');
  const textOverall = document.getElementById('text-overall');
  const textTechnical = document.getElementById('text-technical');
  const textCommunication = document.getElementById('text-communication');
  const textConfidence = document.getElementById('text-confidence');
  const textFacial = document.getElementById('text-facial');

  const ringOverall = document.getElementById('ring-overall');
  const ringTechnical = document.getElementById('ring-technical');
  const ringCommunication = document.getElementById('ring-communication');
  const ringConfidence = document.getElementById('ring-confidence');
  const ringFacial = document.getElementById('ring-facial');

  const starRatingBox = document.getElementById('star-rating-icons');
  const ratingText = document.getElementById('results-rating-text');
  
  const strengthsBox = document.getElementById('results-strengths-box');
  const weaknessesBox = document.getElementById('results-weaknesses-box');
  const completionFill = document.getElementById('results-completion-fill');
  const completionText = document.getElementById('results-completion-text');

  // Facial metrics DOM
  const resultsMetricEye = document.getElementById('results-metric-eye');
  const resultsFillEye = document.getElementById('results-fill-eye');
  const resultsMetricPosture = document.getElementById('results-metric-posture');
  const resultsFillPosture = document.getElementById('results-fill-posture');
  const resultsMetricSmile = document.getElementById('results-metric-smile');
  const resultsFillSmile = document.getElementById('results-fill-smile');
  
  const feedbackChecklist = document.getElementById('results-feedback-checklist');
  const historyTableBody = document.getElementById('results-history-table-body');

  // Load Session Data
  const lastSessionData = localStorage.getItem('nexusED_last_interview_session');
  if (!lastSessionData) {
    window.toast.show('warning', 'No Session Data Found', 'Please run a mock interview first before opening results.', 4000);
    setTimeout(() => {
      window.location.href = 'mock-interview.html';
    }, 1500);
    return;
  }

  const session = JSON.parse(lastSessionData);
  trackTitle.textContent = session.track;

  // Run Evaluation calculations
  const evaluation = evaluateSession(session);

  // Render KPIs & SVG circular rings
  renderKPIs(evaluation);

  // Render strengths & weaknesses
  renderLists(evaluation);

  // Render Checklist suggestions
  renderFeedbackChecklist(evaluation);

  // Commit this session into attempts list logs
  saveSessionToAttemptsLogs(session, evaluation);

  // Render attempts table logs
  renderHistoryTable();

  // --- Core JS Evaluation replica (matching Java classes) ---
  function evaluateSession(session) {
    const track = session.track;
    const answers = session.answers;
    const timers = session.timers;
    const fm = session.facialMetrics || { eye: 85, posture: 80, smile: 65 };

    const questions = questionDatabase[track] || questionDatabase.HR;
    
    let totalQuestions = questions.length;
    let answeredCount = 0;

    let totalTechPoints = 0;
    let totalCommPoints = 0;
    let totalConfPoints = 0;

    let strengths = [];
    let weaknesses = [];
    let feedback = [];

    questions.forEach(q => {
      const answer = (answers[q.id] || "").trim();
      const timeSpent = timers[q.id] || 0;

      if (answer === "") {
        return; 
      }
      answeredCount++;

      // Word counting
      const wordsList = answer.split(/\s+/);
      const wordCount = wordsList.length;

      // Sentence counting
      const sentenceList = answer.split(/[.!?]+/);
      const sentenceCount = Math.max(sentenceList.length - 1, 1);
      const avgSentenceLength = wordCount / sentenceCount;

      // Rule 1: Word count bounds
      let wordLengthScore = 0;
      if (wordCount < 30) {
        wordLengthScore = 40;
      } else if (wordCount <= 80) {
        wordLengthScore = 75;
      } else {
        wordLengthScore = 100;
      }

      // Rule 2: Keyword checking
      let matchedKeywordsCount = 0;
      const answerLower = answer.toLowerCase();
      
      const expectedKws = q.keywords;
      expectedKws.forEach(kw => {
        if (answerLower.includes(kw.toLowerCase())) {
          matchedKeywordsCount++;
        }
      });
      const keywordScore = expectedKws.length > 0 ? (matchedKeywordsCount / expectedKws.length) * 100 : 100;

      // Rule 5: Readability calculations
      let readabilityScore = 100;
      if (avgSentenceLength > 25) {
        readabilityScore -= 20; 
      } else if (avgSentenceLength < 5) {
        readabilityScore -= 15; 
      }

      // Rule 4: Confidence by time checks
      const targetSeconds = q.time * 60;
      let timeScore = 100;
      if (timeSpent < 15) {
        timeScore = 30; 
      } else if (timeSpent > targetSeconds * 1.5) {
        timeScore = 60; 
      } else {
        timeScore = 95; 
      }

      const qTechScore = (keywordScore * 0.7) + (readabilityScore * 0.3);
      const qCommScore = (wordLengthScore * 0.6) + (readabilityScore * 0.4);
      const qConfScore = (timeScore * 0.7) + (wordLengthScore * 0.3);

      totalTechPoints += qTechScore;
      totalCommPoints += qCommScore;
      totalConfPoints += qConfScore;
    });

    const completionRate = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

    let technicalScore = 0;
    let communicationScore = 0;
    let confidenceScore = 0;
    
    if (answeredCount > 0) {
      technicalScore = totalTechPoints / answeredCount;
      communicationScore = totalCommPoints / answeredCount;
      confidenceScore = totalConfPoints / answeredCount;
    }

    // Facial expressions average scoring
    const facialScore = (fm.eye * 0.4) + (fm.posture * 0.4) + (fm.smile * 0.2);

    // Rule 3: Completion Penalty incorporating facial metrics
    // weights: Tech(35%), Comm(25%), Conf(20%), Facial(20%)
    const completionFactor = completionRate / 100;
    const overallScore = ((technicalScore * 0.35) + 
                          (communicationScore * 0.25) + 
                          (confidenceScore * 0.20) + 
                          (facialScore * 0.20)) * completionFactor;

    // Strengths and weaknesses compiling
    if (technicalScore >= 80) {
      strengths.push("Strong technical vocabulary with relevant subject keywords.");
    } else {
      weaknesses.push("Technical answers lack critical domain terminology.");
      feedback.push({ text: "Revise domain terminology & practice keywords", val: 15 });
    }

    if (communicationScore >= 75) {
      strengths.push("Well-structured sentence phrasing with sufficient content depth.");
    } else {
      weaknesses.push("Answers are either too brief or have poor structural flow.");
      feedback.push({ text: "Write longer structured answers (30-80 words target)", val: 15 });
    }

    if (confidenceScore >= 75) {
      strengths.push("Paced answer delivery within optimal time limits.");
    } else {
      weaknesses.push("Unbalanced timing - either rushed submission or hesitant pacing.");
      feedback.push({ text: "Practice timed exercises to optimize pacing", val: 10 });
    }

    // Facial feedback suggestions
    if (facialScore >= 75) {
      strengths.push("Engaging body language with solid eye contact and steady focus.");
    } else {
      weaknesses.push("Fluctuating eye contact or posture movements noted.");
      feedback.push({ text: "Keep steady eye contact with the camera lens", val: 10 });
      feedback.push({ text: "Smile occasionally to project enthusiasm", val: 10 });
    }

    if (completionRate < 100) {
      weaknesses.push("Incomplete interview. Some questions were left blank.");
      feedback.push({ text: "Answer all interview questions to prevent penalties", val: 20 });
    } else {
      strengths.push("Completed all interview question nodes successfully.");
    }

    // Star rating
    let starCount = 1;
    let starsText = "Poor";
    if (overallScore >= 85) {
      starCount = 5;
      starsText = "Excellent";
    } else if (overallScore >= 70) {
      starCount = 4;
      starsText = "Good";
    } else if (overallScore >= 50) {
      starCount = 3;
      starsText = "Average";
    } else if (overallScore >= 30) {
      starCount = 2;
      starsText = "Fair";
    }

    return {
      overallScore: Math.round(overallScore),
      technicalScore: Math.round(technicalScore),
      communicationScore: Math.round(communicationScore),
      confidenceScore: Math.round(confidenceScore),
      facialScore: Math.round(facialScore),
      facialMetrics: fm,
      completionRate: Math.round(completionRate),
      strengths,
      weaknesses,
      feedback,
      stars: starCount,
      ratingText: starsText
    };
  }

  // Render Donuts & Stars
  function renderKPIs(evals) {
    textOverall.textContent = `${evals.overallScore}%`;
    textTechnical.textContent = `${evals.technicalScore}%`;
    textCommunication.textContent = `${evals.communicationScore}%`;
    textConfidence.textContent = `${evals.confidenceScore}%`;
    textFacial.textContent = `${evals.facialScore}%`;

    // SVG stroke calculations (Circumference = 301.59)
    const circ = 301.59;
    setTimeout(() => {
      ringOverall.style.strokeDashoffset = circ - (evals.overallScore / 100) * circ;
      ringTechnical.style.strokeDashoffset = circ - (evals.technicalScore / 100) * circ;
      ringCommunication.style.strokeDashoffset = circ - (evals.communicationScore / 100) * circ;
      ringConfidence.style.strokeDashoffset = circ - (evals.confidenceScore / 100) * circ;
      ringFacial.style.strokeDashoffset = circ - (evals.facialScore / 100) * circ;
    }, 150);

    // Star Icons
    starRatingBox.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const activeClass = i <= evals.stars ? 'active' : '';
      starRatingBox.innerHTML += `<i data-lucide="star" class="${activeClass}"></i>`;
    }
    ratingText.textContent = evals.ratingText;

    // Render facial breakdown sliders
    resultsMetricEye.textContent = `${evals.facialMetrics.eye}%`;
    resultsFillEye.style.width = `${evals.facialMetrics.eye}%`;

    resultsMetricPosture.textContent = `${evals.facialMetrics.posture}%`;
    resultsFillPosture.style.width = `${evals.facialMetrics.posture}%`;

    resultsMetricSmile.textContent = `${evals.facialMetrics.smile}%`;
    resultsFillSmile.style.width = `${evals.facialMetrics.smile}%`;

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // Render Lists
  function renderLists(evals) {
    strengthsBox.innerHTML = '';
    if (evals.strengths.length === 0) {
      strengthsBox.innerHTML = `<li class="text-muted fs-xs">No specific strengths calculated.</li>`;
    } else {
      evals.strengths.forEach(st => {
        strengthsBox.innerHTML += `<li><i data-lucide="check" style="width:14px; height:14px; flex-shrink:0;"></i><span>${st}</span></li>`;
      });
    }

    weaknessesBox.innerHTML = '';
    if (evals.weaknesses.length === 0) {
      weaknessesBox.innerHTML = `<li class="text-muted fs-xs" style="color:var(--success);">Flawless! No weaknesses detected.</li>`;
    } else {
      evals.weaknesses.forEach(wk => {
        weaknessesBox.innerHTML += `<li><i data-lucide="alert-circle" style="width:14px; height:14px; flex-shrink:0;"></i><span>${wk}</span></li>`;
      });
    }

    // Completion fill
    completionText.textContent = `${evals.completionRate}%`;
    setTimeout(() => {
      completionFill.style.width = `${evals.completionRate}%`;
    }, 200);

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // Render Suggestions Checklist
  function renderFeedbackChecklist(evals) {
    feedbackChecklist.innerHTML = '';

    if (evals.feedback.length === 0) {
      feedbackChecklist.innerHTML = `<p class="text-success fs-xs fw-semibold">✔ Excellent work! Your interview meets all rule benchmarks.</p>`;
      return;
    }

    evals.feedback.forEach((fb, idx) => {
      const item = document.createElement('div');
      item.className = 'checklist-item animate__animated animate__fadeInUp';
      item.style.animationDelay = `${idx * 0.05}s`;
      item.innerHTML = `
        <div class="checklist-checkbox">
          <i data-lucide="check"></i>
        </div>
        <span class="checklist-text">${fb.text} (+${fb.val} points)</span>
      `;

      item.addEventListener('click', () => {
        const isChecked = item.classList.contains('checked');
        let currentScore = parseInt(textOverall.textContent);

        if (!isChecked) {
          item.classList.add('checked');
          currentScore = Math.min(currentScore + fb.val, 100);
          window.toast.show('success', 'Recalculating Score', `Score boosted to ${currentScore}%!`, 1500);
        } else {
          item.classList.remove('checked');
          currentScore = Math.max(currentScore - fb.val, 0);
        }

        // Update Overall UI
        textOverall.textContent = `${currentScore}%`;
        const circ = 301.59;
        ringOverall.style.strokeDashoffset = circ - (currentScore / 100) * circ;
      });

      feedbackChecklist.appendChild(item);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // Save attempts to LocalStorage attempts list
  function saveSessionToAttemptsLogs(session, evals) {
    const attempts = JSON.parse(localStorage.getItem('nexusED_mock_attempts')) || [];
    
    const newAttempt = {
      id: Date.now().toString(),
      track: session.track,
      date: new Date().toLocaleDateString(),
      timeSpent: session.totalTime,
      overallScore: evals.overallScore,
      ratingText: evals.ratingText
    };

    const lastSessionId = sessionStorage.getItem('last_saved_session_id');
    if (lastSessionId !== session.totalTime.toString() + session.track) {
      attempts.push(newAttempt);
      localStorage.setItem('nexusED_mock_attempts', JSON.stringify(attempts));
      sessionStorage.setItem('last_saved_session_id', session.totalTime.toString() + session.track);
    }
  }

  // Render attempts table logs
  function renderHistoryTable() {
    const attempts = JSON.parse(localStorage.getItem('nexusED_mock_attempts')) || [];
    historyTableBody.innerHTML = '';

    if (attempts.length === 0) {
      historyTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No historical attempts saved yet.</td></tr>`;
      return;
    }

    attempts.slice().reverse().forEach(att => {
      const mins = Math.floor(att.timeSpent / 60);
      const secs = att.timeSpent % 60;
      const formattedTime = `${mins}m ${secs}s`;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${att.track} Round</strong></td>
        <td>${att.date}</td>
        <td>${formattedTime}</td>
        <td><span class="fw-semibold text-primary">${att.overallScore}%</span></td>
        <td><span class="badge-level level-expert" style="font-size:0.65rem;">${att.ratingText}</span></td>
      `;
      historyTableBody.appendChild(tr);
    });
  }
});
