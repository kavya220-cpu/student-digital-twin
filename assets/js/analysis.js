/* analysis.js */

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const docId = urlParams.get('id');

  if (!docId) {
    window.location.href = 'study-assistant.html';
    return;
  }

  // DOM Bindings
  const docTitle = document.getElementById('doc-title');
  const difficultyBadge = document.getElementById('difficulty-badge');
  const studyTimeVal = document.getElementById('study-time-val');
  const analysisBookmarkBtn = document.getElementById('analysis-bookmark-btn');
  const summaryPoints = document.getElementById('summary-points');
  const notesText = document.getElementById('notes-text');
  const topicsList = document.getElementById('topics-list');
  const keywordsList = document.getElementById('keywords-list');
  const mcqsList = document.getElementById('mcqs-list');
  const submitQuizBtn = document.getElementById('submit-quiz-btn');
  const quizScoreBanner = document.getElementById('quiz-score-banner');
  const scoreText = document.getElementById('score-text');
  const currentFlashcard = document.getElementById('current-flashcard');
  const fcIndex = document.getElementById('fc-index');
  const fcQuestion = document.getElementById('fc-question');
  const fcAnswer = document.getElementById('fc-answer');
  const fcPrevBtn = document.getElementById('fc-prev-btn');
  const fcNextBtn = document.getElementById('fc-next-btn');
  const fcIndicator = document.getElementById('fc-indicator');
  const techQsList = document.getElementById('tech-qs-list');
  const hrVivaQsList = document.getElementById('hr-viva-qs-list');
  
  // Chat bindings
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const quickQueryBtns = document.querySelectorAll('.quick-query-btn');

  // State caches
  let documentMetadata = null;
  let flashcardData = [];
  let currentFlashcardIndex = 0;
  let mcqData = [];
  let userAnswers = {};
  let conversationHistory = "";
  let isBookmarkedState = false;

  // Base API Host mapper
  const getBaseUrl = () => {
    return window.location.port === '5500' ? 'http://localhost:8080' : '';
  };

  // Helper: Read API key from config.properties dynamically on client side
  const getApiKey = async () => {
    try {
      const res = await fetch('src/config.properties');
      if (!res.ok) throw new Error("Could not load config file");
      const text = await res.text();
      const match = text.match(/gemini\.api\.key\s*=\s*(.+)/);
      if (match && match[1]) {
        return match[1].trim();
      }
    } catch (e) {
      console.error("Failed to read local API key:", e);
    }
    return null;
  };

  // 1. Fetch Analysis details
  const fetchAnalysisDetails = () => {
    fetch(`${getBaseUrl()}/api/study/analysis?id=${docId}`)
      .then(res => {
        if (!res.ok) throw new Error("Data failed to load.");
        return res.json();
      })
      .then(data => {
        documentMetadata = data;
        renderAnalysisPage(data);
      })
      .catch(err => {
        console.error('Fetch analysis failed:', err);
        // Look up localStorage first if docId starts with doc_local_
        if (docId && docId.startsWith('doc_local_')) {
          const localData = JSON.parse(localStorage.getItem(docId));
          if (localData) {
            documentMetadata = localData;
            renderAnalysisPage(localData);
            return;
          }
        }
        // Fallback to static mock CNN analysis data
        const mockData = getMockDataFallback(docId);
        documentMetadata = mockData;
        renderAnalysisPage(mockData);
      });
  };

  const renderAnalysisPage = (data) => {
    // Top Info
    docTitle.textContent = data.filename || "CNN_Notes.pdf";
    difficultyBadge.textContent = data.difficulty || "Medium";
    studyTimeVal.textContent = `${data.study_time || 45} mins`;
    
    // Toggle color classes based on difficulty
    difficultyBadge.className = 'metric-val';
    if (data.difficulty === 'Easy') difficultyBadge.classList.add('text-success');
    else if (data.difficulty === 'Hard') difficultyBadge.classList.add('text-danger');
    else difficultyBadge.classList.add('text-warning');

    // Summary Points
    summaryPoints.innerHTML = '';
    const points = data.summary.split('\n');
    points.forEach(pt => {
      if (!pt.trim() || pt.trim() === '') return;
      const cleanPt = pt.replace(/^[0-9]+\.\s*/, ''); // Remove numbering if duplicate
      const item = document.createElement('div');
      item.className = 'summary-point-item';
      item.innerHTML = `<p>${cleanPt}</p>`;
      summaryPoints.appendChild(item);
    });

    // Notes
    notesText.innerHTML = data.notes.replace(/\n\n/g, '<br><br>');

    // Topics & Keywords
    topicsList.innerHTML = '';
    data.topics.split(',').forEach(tp => {
      if (!tp.trim()) return;
      const tag = document.createElement('span');
      tag.className = 'topic-tag';
      tag.textContent = tp.trim();
      topicsList.appendChild(tag);
    });

    keywordsList.innerHTML = '';
    data.keywords.split(',').forEach(kw => {
      if (!kw.trim()) return;
      const tag = document.createElement('span');
      tag.className = 'keyword-tag';
      tag.textContent = kw.trim();
      keywordsList.appendChild(tag);
    });

    // MCQs Quiz
    mcqData = data.mcqs;
    renderMCQs(data.mcqs);

    // Flashcards
    flashcardData = data.flashcards;
    currentFlashcardIndex = 0;
    renderFlashcard(0);

    // Questions Accordions
    renderQuestions(data.questions);

    if (typeof lucide !== 'undefined') lucide.createIcons();
  };

  // 2. MCQ Quiz Rendering & Scoring
  const renderMCQs = (mcqs) => {
    mcqsList.innerHTML = '';
    if (!mcqs || mcqs.length === 0) {
      mcqsList.innerHTML = '<p class="text-secondary">No practice questions generated.</p>';
      return;
    }

    mcqs.forEach((mcq, idx) => {
      const card = document.createElement('div');
      card.className = 'mcq-item-card';
      card.dataset.index = idx;

      card.innerHTML = `
        <h4 class="mcq-question-text">${idx + 1}. ${mcq.question}</h4>
        <div class="mcq-options-grid">
          <div class="mcq-option-label" data-value="A"><span class="option-prefix">A)</span> <span class="option-text">${mcq.option_a}</span></div>
          <div class="mcq-option-label" data-value="B"><span class="option-prefix">B)</span> <span class="option-text">${mcq.option_b}</span></div>
          <div class="mcq-option-label" data-value="C"><span class="option-prefix">C)</span> <span class="option-text">${mcq.option_c}</span></div>
          <div class="mcq-option-label" data-value="D"><span class="option-prefix">D)</span> <span class="option-text">${mcq.option_d}</span></div>
        </div>
      `;

      // Select handler
      card.querySelectorAll('.mcq-option-label').forEach(opt => {
        opt.addEventListener('click', () => {
          // Clear current selection inside this question
          card.querySelectorAll('.mcq-option-label').forEach(o => o.classList.remove('selected'));
          opt.classList.add('selected');
          userAnswers[idx] = opt.dataset.value;
        });
      });

      mcqsList.appendChild(card);
    });
  };

  submitQuizBtn.addEventListener('click', () => {
    if (mcqData.length === 0) return;

    let score = 0;
    mcqData.forEach((mcq, idx) => {
      const card = mcqsList.querySelector(`.mcq-item-card[data-index="${idx}"]`);
      const selectedOpt = userAnswers[idx];
      const correctOpt = mcq.correct_answer.trim().toUpperCase();

      // Clear previous status style classes
      card.querySelectorAll('.mcq-option-label').forEach(o => {
        o.classList.remove('correct', 'incorrect');
      });

      if (selectedOpt === correctOpt) {
        score++;
        card.querySelector(`.mcq-option-label[data-value="${selectedOpt}"]`).classList.add('correct');
      } else {
        if (selectedOpt) {
          card.querySelector(`.mcq-option-label[data-value="${selectedOpt}"]`).classList.add('incorrect');
        }
        card.querySelector(`.mcq-option-label[data-value="${correctOpt}"]`).classList.add('correct');
      }
    });

    // Score display
    scoreText.textContent = `${score} / ${mcqData.length}`;
    quizScoreBanner.style.display = 'flex';
    quizScoreBanner.className = 'quiz-banner animate__animated animate__zoomIn';
    
    // Auto scroll to banner
    quizScoreBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // 3. 3D Flashcard Deck Controls
  const renderFlashcard = (idx) => {
    if (flashcardData.length === 0) {
      currentFlashcard.style.display = 'none';
      fcIndicator.textContent = "0/0";
      return;
    }

    currentFlashcard.style.display = 'block';
    currentFlashcard.classList.remove('flipped'); // Reset flip state on change
    
    const fc = flashcardData[idx];
    fcIndex.textContent = `Card ${idx + 1}`;
    fcQuestion.textContent = fc.question;
    fcAnswer.textContent = fc.answer;
    fcIndicator.textContent = `${idx + 1} / ${flashcardData.length}`;

    // Disabled styles
    fcPrevBtn.disabled = idx === 0;
    fcNextBtn.disabled = idx === flashcardData.length - 1;
  };

  currentFlashcard.addEventListener('click', () => {
    currentFlashcard.classList.toggle('flipped');
  });

  fcPrevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentFlashcardIndex > 0) {
      currentFlashcardIndex--;
      renderFlashcard(currentFlashcardIndex);
    }
  });

  fcNextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentFlashcardIndex < flashcardData.length - 1) {
      currentFlashcardIndex++;
      renderFlashcard(currentFlashcardIndex);
    }
  });

  // 4. Accordions Questions
  const renderQuestions = (qs) => {
    techQsList.innerHTML = '';
    hrVivaQsList.innerHTML = '';

    if (!qs || qs.length === 0) {
      techQsList.innerHTML = '<p class="text-secondary">No questions generated.</p>';
      hrVivaQsList.innerHTML = '<p class="text-secondary">No questions generated.</p>';
      return;
    }

    qs.forEach(q => {
      const item = document.createElement('div');
      item.className = 'q-accordion-item';
      
      item.innerHTML = `
        <button class="q-accordion-trigger">
          <span>${q.question}</span>
          <i data-lucide="chevron-down"></i>
        </button>
        <div class="q-accordion-content">
          <div class="q-accordion-inner">
            <strong>Key Answer Points:</strong><br>${q.answer_outline}
          </div>
        </div>
      `;

      item.querySelector('.q-accordion-trigger').addEventListener('click', () => {
        item.classList.toggle('active');
      });

      if (q.question_type.toLowerCase() === 'technical') {
        techQsList.appendChild(item);
      } else {
        hrVivaQsList.appendChild(item);
      }
    });
  };

  // 5. Tabs Trigger Controls
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });

  // 6. Ask AI Tutors Conversational queries
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = chatInput.value.trim();
    if (!query) return;

    chatInput.value = '';
    appendChatMessage('user', query);

    // AI typing bubble
    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-msg ai-msg typing';
    typingBubble.innerHTML = '<span class="dots-pulse">AI is compiling answer...</span>';
    chatMessages.appendChild(typingBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const payload = `id=${encodeURIComponent(docId)}&message=${encodeURIComponent(query)}&history=${encodeURIComponent(conversationHistory)}`;

    fetch(`${getBaseUrl()}/api/study/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload
    })
      .then(res => res.json())
      .then(data => {
        typingBubble.remove();
        if (data.status === 'success') {
          appendChatMessage('ai', data.reply);
          conversationHistory += `User: ${query}\nAI: ${data.reply}\n`;
        } else {
          appendChatMessage('ai', 'Error generating response: ' + data.message);
        }
      })
      .catch(() => {
        // Fallback to query Gemini directly on the client side when offline
        simulateTutoringReply(query, typingBubble);
      });
  });

  const appendChatMessage = (sender, text) => {
    const bubble = document.createElement('div');
    bubble.className = `chat-msg ${sender === 'user' ? 'user-msg' : 'ai-msg'}`;
    bubble.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  quickQueryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      chatInput.value = btn.textContent;
      chatForm.dispatchEvent(new Event('submit'));
    });
  });

  // 7. Downloads and Bookmarks Triggers
  document.querySelectorAll('.download-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      
      // If it is a local offline upload, generate text file directly in browser for download!
      if (docId && docId.startsWith('doc_local_')) {
        generateLocalDownload(type);
        return;
      }
      
      window.location.href = `${getBaseUrl()}/api/study/download?id=${docId}&type=${type}`;
    });
  });

  const generateLocalDownload = (type) => {
    if (!documentMetadata) return;
    let fileContent = "";
    let filename = `${type}_${documentMetadata.filename || 'study_notes'}.txt`;

    if (type === 'notes') {
      fileContent = `========== CORE TOPICS & SUMMARY ==========\n${documentMetadata.summary}\n\n========== DETAILED STUDY NOTES ==========\n${documentMetadata.notes}`;
    } else if (type === 'mcqs') {
      fileContent = "========== MULTIPLE CHOICE QUESTIONS (MCQs) ==========\n\n";
      documentMetadata.mcqs.forEach((m, idx) => {
        fileContent += `${idx + 1}. ${m.question}\n   A) ${m.option_a}\n   B) ${m.option_b}\n   C) ${m.option_c}\n   D) ${m.option_d}\n   Correct Answer: ${m.correct_answer}\n\n`;
      });
    } else if (type === 'flashcards') {
      fileContent = "========== STUDY FLASHCARDS ==========\n\n";
      documentMetadata.flashcards.forEach((f, idx) => {
        fileContent += `Card ${idx + 1}\nQuestion: ${f.question}\nAnswer: ${f.answer}\n\n`;
      });
    }

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('success', 'Download Started', `Your local export for ${type} is ready.`);
  };

  analysisBookmarkBtn.addEventListener('click', () => {
    isBookmarkedState = !isBookmarkedState;
    fetch(`${getBaseUrl()}/api/study/bookmark?id=${docId}&state=${isBookmarkedState}`, { method: 'POST' })
      .then(() => {
        updateBookmarkBtnUI(isBookmarkedState);
      })
      .catch(() => {
        updateBookmarkBtnUI(isBookmarkedState);
      });
  });

  const updateBookmarkBtnUI = (state) => {
    analysisBookmarkBtn.className = state ? 'icon-btn bookmark-btn active' : 'icon-btn bookmark-btn';
    const icon = analysisBookmarkBtn.querySelector('i');
    if (icon) {
      icon.style.fill = state ? 'currentColor' : 'none';
    }
  };

  // Dynamic chatbot tutor logic querying Gemini directly in browser
  const simulateTutoringReply = async (q, typingBubble) => {
    try {
      const apiKey = await getApiKey();
      if (!apiKey) throw new Error("No API key available");

      const docContext = documentMetadata 
        ? `Document Name: "${documentMetadata.filename}"\nSummary: ${documentMetadata.summary}\nTopics: ${documentMetadata.topics}\nStudy Notes Outline: ${documentMetadata.notes.substring(0, 4000)}` 
        : '';

      const prompt = `You are an AI Study Tutor for the Student Growth Platform NexusED.
Answer the student's question about their document contents. Use the document summary/notes outline context below.
Be concise, smart, and helpful.

Document Context:
${docContext}

Conversation History:
${conversationHistory}

Student Question: ${q}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!res.ok) throw new Error("Gemini query failed");
      const resultJson = await res.json();
      const reply = resultJson.candidates[0].content.parts[0].text;

      typingBubble.remove();
      appendChatMessage('ai', reply);
      conversationHistory += `User: ${q}\nAI: ${reply}\n`;

    } catch (e) {
      console.error("Gemini tutoring query failed:", e);
      typingBubble.remove();
      const reply = simulateTutoringReplyStatic(q);
      appendChatMessage('ai', reply);
      conversationHistory += `User: ${q}\nAI: ${reply}\n`;
    }
  };

  // Static tutoring response backup
  const simulateTutoringReplyStatic = (q) => {
    const ql = q.toLowerCase();
    if (ql.includes("dbms") || ql.includes("normalization")) {
      return "DBMS Normalization is the systematic process of reducing redundancy and dependency. For example, in 3NF, every non-prime attribute must depend only on the primary key (no transitive dependency). A real-world example is an Order table: instead of storing customer names directly, store a CustomerID that references a separate Customers table.";
    } else if (ql.includes("cnn") || ql.includes("convolution")) {
      return "A Convolutional Neural Network (CNN) acts like a visual scanner. The convolutional layers slide filters (kernels) across pixel matrices to extract spatial features (like lines, circles, and borders). These feature maps are then compressed using pooling layers before classification.";
    }
    return "Great question! Based on your uploaded document, this topic refers to the core parameters designed to optimize dynamic flow. Let me know if you would like me to compile more MCQs or explain this in a simpler analogy!";
  };

  // Static Fallback Builder
  const getMockDataFallback = (id) => {
    return {
      id: id,
      filename: "CNN_Notes.pdf",
      difficulty: "Medium",
      study_time: 45,
      summary: "1. Convolutional Neural Networks (CNNs) are specialized neural networks for processing grid-structured data like images.\n2. Convolution layers extract local features using learnable kernels.\n3. Pooling layers (Max/Average pooling) reduce spatial dimensions and compute parameters.\n4. Fully Connected (FC) layers classify extracted features into final class labels.\n5. Backpropagation tunes kernel weights to minimize classification loss.",
      notes: "Convolutional Neural Networks (CNNs) represent a milestone in Computer Vision. Instead of treating images as flat 1D vectors where spatial structures are lost, CNNs process them as 2D/3D matrices. A typical architecture consists of Convolutional layers, Pooling layers, and Fully Connected layers.\n\n**Convolution Layer**: This layer performs a mathematical convolution operation. It slides a small kernel (filter) across the image to generate a feature map. By using different kernels, the network detects edges, textures, and higher-level shapes.\n\n**Pooling Layer**: Pooling operations summarize regional activities. Max pooling selects the maximum value in a window. This introduces translation invariance, meaning the network can recognize features regardless of their exact pixel coordinates.\n\n**Fully Connected Layer**: After several convolution and pooling stages, the multi-dimensional feature maps are flattened and passed to dense layers. These layers compute high-level reasoning and assign class probabilities using activation functions like Softmax.",
      topics: "Convolution Operation, Spatial Hierarchies, Translation Invariance, Overfitting Mitigation",
      keywords: "CNN, Kernel, Pooling, Feature Map, Flattening, Activation Function, Softmax",
      flashcards: [
        { question: "What is the primary role of a convolution layer?", answer: "To extract spatial features from input images using mathematical filters (kernels)." },
        { question: "Why is Max Pooling used?", answer: "To reduce the dimensions of feature maps while retaining the most prominent features." },
        { question: "What does flattening do?", answer: "Converts 2D feature maps into a 1D vector to feed into fully connected layers." }
      ],
      mcqs: [
        { question: "Which layer introduces spatial feature mapping in CNNs?", option_a: "Pooling Layer", option_b: "Convolution Layer", option_c: "Fully Connected Layer", option_d: "Input Layer", correct_answer: "B" },
        { question: "What is the main advantage of Max Pooling?", option_a: "Increase parameters", option_b: "Translate invariance & dimensionality reduction", option_c: "Linearize activations", option_d: "None of the above", correct_answer: "B" }
      ],
      questions: [
        { question: "What is the vanishing gradient problem in deep CNNs, and how does ReLU help?", question_type: "Technical", answer_outline: "Vanishing gradient occurs when gradients shrink exponentially during backpropagation. ReLU helps by keeping a constant gradient of 1 for all positive inputs." },
        { question: "Why are you interested in computer vision architectures?", question_type: "HR", answer_outline: "Explain your passion for visual data analytics and its real-world impacts like medical imaging or autonomous driving." },
        { question: "Explain the mathematical difference between convolution and correlation.", question_type: "Viva", answer_outline: "Convolution involves flipping the kernel matrix before sliding, while cross-correlation slides the kernel directly without flipping." }
      ]
    };
  };

  // Toast Helper
  const showToast = (type, title, message) => {
    if (window.toast) {
      window.toast.show(type, title, message, 3000);
    } else {
      alert(`${title}: ${message}`);
    }
  };

  // Run start fetch
  fetchAnalysisDetails();
});
