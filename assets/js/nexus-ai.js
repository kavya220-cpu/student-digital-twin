/* assets/js/nexus-ai.js */

document.addEventListener('DOMContentLoaded', () => {
  const chatMessagesContainer = document.getElementById('chat-messages-container');
  const chatWelcomeScreen = document.getElementById('chat-welcome-screen');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const clearHistoryBtn = document.getElementById('clear-history-btn');
  const quickChipsContainer = document.getElementById('quick-chips-container');
  
  let chatHistory = []; // Local history tracking for multi-turn role preservation
  let isGenerating = false;

  // Initialize marked parser with highlight.js syntax highlighting
  if (typeof marked !== 'undefined') {
    marked.setOptions({
      highlight: function(code, lang) {
        if (typeof hljs !== 'undefined') {
          if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
          }
          return hljs.highlightAuto(code).value;
        }
        return code;
      },
      breaks: true
    });
  }

  // Mouse Glow tracking
  document.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('.cursor-glow');
    if (glow) {
      window.requestAnimationFrame(() => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      });
    }
  });

  const API_BASE = window.location.port === '5500' ? 'http://localhost:8080' : '';

  // Helper: Read API key from config.properties dynamically on client side
  const getApiKey = async () => {
    try {
      const res = await fetch('src/config.properties');
      if (!res.ok) throw new Error("Could not load config file");
      const text = await res.text();
      const match = text.match(/groq\.api\.key\s*=\s*(.+)/);
      if (match && match[1]) {
        return match[1].trim();
      }
    } catch (e) {
      console.error("Failed to read local API key:", e);
    }
    return null;
  };

  // Load chat history on startup
  loadHistory();

  // Load history from API or LocalStorage fallback
  function loadHistory() {
    fetch(API_BASE + '/api/chat')
      .then(res => {
        if (!res.ok) throw new Error("Servlet offline");
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          renderLoadedHistory(data);
        }
      })
      .catch(err => {
        console.warn("[NexusAI] Servlet offline. Loading fallback local storage history: ", err);
        const localHistoryStr = localStorage.getItem('nexusED_chat_history');
        if (localHistoryStr) {
          const localData = JSON.parse(localHistoryStr);
          renderLoadedHistory(localData);
        }
      });
  }

  function renderLoadedHistory(data) {
    if (chatWelcomeScreen) chatWelcomeScreen.style.display = 'none';
    chatMessagesContainer.innerHTML = '';
    chatHistory = [];
    
    data.forEach(item => {
      // Add user message
      addMessageToDOM('user', item.user_message || item.user_message, false);
      // Add assistant message
      addMessageToDOM('assistant', item.ai_response || item.ai_response, false, false, item.isDocMode || false);
      
      // Build memory history array
      chatHistory.push({ role: 'user', content: item.user_message });
      chatHistory.push({ role: 'assistant', content: item.ai_response });
    });
    scrollToBottom();
  }

  // Handle Form Submission
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = chatInput.value.trim();
    if (!query || isGenerating) return;
    
    submitQuery(query);
  });

  // Handle prompt chips click
  document.querySelectorAll('.prompt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (prompt && !isGenerating) {
        submitQuery(prompt);
      }
    });
  });

  // Handle clear history
  clearHistoryBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to clear your chat history with NexusAI?")) {
      localStorage.removeItem('nexusED_chat_history');
      chatHistory = [];
      chatMessagesContainer.innerHTML = '';
      if (chatWelcomeScreen) chatWelcomeScreen.style.display = 'block';

      fetch(API_BASE + '/api/chat', { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
          window.toast?.show('success', 'Chat Cleared', 'Conversation history cleared successfully.', 2500);
        })
        .catch(err => {
          console.warn("[NexusAI] Clear servlet failed (offline), local cache cleared successfully.", err);
          window.toast?.show('success', 'Chat Cleared', 'Offline conversation history cleared.', 2000);
        });
    }
  });

  // Client-side document routing heuristic helper
  function checkDocumentRoute(query) {
    const localUploads = JSON.parse(localStorage.getItem('local_uploads') || '[]');
    if (localUploads.length === 0) {
      return { isDocMode: false, context: null };
    }
    
    const lastDoc = localUploads[0];
    const analysisData = JSON.parse(localStorage.getItem(lastDoc.id) || 'null');
    if (!analysisData) {
      return { isDocMode: false, context: null };
    }
    
    const q = query.toLowerCase();
    
    // Explicit file references
    const mentionsDoc = q.includes("this document") || q.includes("the document") || q.includes("uploaded document") ||
        q.includes("my document") || q.includes("this pdf") || q.includes("the pdf") ||
        q.includes("uploaded pdf") || q.includes("my pdf") || q.includes("this file") ||
        q.includes("the file") || q.includes("uploaded file") || q.includes("my file") ||
        q.includes("summarize") || q.includes("summary") || q.includes("mcqs") ||
        q.includes("flashcards") || q.includes("chapter") || q.includes("study guide");
        
    if (mentionsDoc) {
      return { isDocMode: true, filename: lastDoc.filename, context: analysisData };
    }
    
    // Check filename terms
    if (lastDoc.filename) {
      const cleanName = lastDoc.filename.toLowerCase().replace(/\.[^.]+$/, "");
      const nameParts = cleanName.split(/[\s_.-]+/);
      for (let part of nameParts) {
        if (part.length > 2 && q.includes(part)) {
          return { isDocMode: true, filename: lastDoc.filename, context: analysisData };
        }
      }
    }
    
    // Check topics matching
    if (analysisData.topics) {
      const topicParts = analysisData.topics.toLowerCase().split(/[\s,]+/);
      for (let part of topicParts) {
        if (part.length > 3 && q.includes(part)) {
          return { isDocMode: true, filename: lastDoc.filename, context: analysisData };
        }
      }
    }
    
    // Check keywords matching
    if (analysisData.keywords) {
      const kwParts = analysisData.keywords.toLowerCase().split(/[\s,]+/);
      for (let part of kwParts) {
        if (part.length > 3 && q.includes(part)) {
          return { isDocMode: true, filename: lastDoc.filename, context: analysisData };
        }
      }
    }
    
    return { isDocMode: false, context: null };
  }

  // Submit Query to Groq Backend (Dual-mode: servlet attempt with direct Groq API client fallback)
  async function submitQuery(query) {
    if (chatWelcomeScreen) chatWelcomeScreen.style.display = 'none';
    
    // Add User Message
    addMessageToDOM('user', query, false);
    chatInput.value = '';
    scrollToBottom();

    // Prepare history payload for servlet
    const historyPayload = JSON.stringify(chatHistory);
    
    // Push user message to local memory
    chatHistory.push({ role: 'user', content: query });
    
    // Render Thinking Dots Indicator
    const thinkingIndicator = showThinkingIndicator();
    isGenerating = true;

    try {
      // 1. Try backend Servlet API
      const res = await fetch(API_BASE + '/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: query,
          history: historyPayload
        })
      });

      if (!res.ok) throw new Error("Servlet server not responding");
      const data = await res.json();
      
      thinkingIndicator.remove();
      isGenerating = false;
      const responseText = data.response;
      const isDocMode = data.isDocMode || false;
      
      // Save offline fallback history copy locally
      saveLocalOfflineHistory(query, responseText, isDocMode);

      // Push assistant response to local memory
      chatHistory.push({ role: 'assistant', content: responseText });
      
      // Render assistant message to DOM with simulated streaming effect
      addMessageToDOM('assistant', responseText, true, false, isDocMode);

    } catch (servletErr) {
      console.warn("[NexusAI] Servlet offline. Initiating direct client-side Groq fallback query...", servletErr);
      
      try {
        // 2. Client-side Groq Direct fallback query
        const apiKey = await getApiKey();
        if (!apiKey) {
          throw new Error("Groq API Key not found in config.properties");
        }

        // Run client routing check
        const route = checkDocumentRoute(query);
        const isDocMode = route.isDocMode;

        let systemPrompt = "You are NexusAI,\nthe AI assistant for NexusED.\n\n"
            + "You are an intelligent AI assistant capable of answering\n"
            + "• Study Questions\n"
            + "• Programming\n"
            + "• Mathematics\n"
            + "• Artificial Intelligence\n"
            + "• Machine Learning\n"
            + "• Cloud Computing\n"
            + "• DBMS\n"
            + "• Java\n"
            + "• Python\n"
            + "• SQL\n"
            + "• Resume\n"
            + "• Career Guidance\n"
            + "• Interview Preparation\n"
            + "• General Knowledge\n"
            + "• Writing Assistance\n"
            + "• Productivity\n\n"
            + "If an uploaded document exists,\n"
            + "use it ONLY when the user's question refers to that document.\n"
            + "If the question is unrelated,\n"
            + "ignore the document and answer using your own knowledge.\n\n"
            + "Never reply with\n"
            + "\"Based on your uploaded document\"\n"
            + "unless the question is actually about the uploaded file.\n\n"
            + "Always answer naturally like ChatGPT.";

        if (isDocMode && route.context) {
          systemPrompt += "\n\n=== Document Study Context ===\n"
              + "Filename: " + route.filename + "\n"
              + "Topics Covered: " + route.context.topics + "\n"
              + "Summary:\n" + route.context.summary + "\n"
              + "Detailed Notes Outline:\n" + route.context.notes + "\n"
              + "==============================\n\n"
              + "Remember: The user's question is about this document. Answer it using the context provided above.";
        }

        // Build message payload
        const messages = [{ role: 'system', content: systemPrompt }];
        // Append conversation history
        chatHistory.forEach(item => {
          messages.push({ role: item.role, content: item.content });
        });

        const directRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: messages,
            temperature: 0.7
          })
        });

        if (!directRes.ok) throw new Error(`Groq API returned status ${directRes.status}`);
        const resultJson = await directRes.json();
        
        thinkingIndicator.remove();
        isGenerating = false;
        const responseText = resultJson.choices[0].message.content;

        // Save offline fallback history copy locally
        saveLocalOfflineHistory(query, responseText, isDocMode);

        // Push assistant response to local memory
        chatHistory.push({ role: 'assistant', content: responseText });
        
        // Render assistant message to DOM with simulated streaming effect
        addMessageToDOM('assistant', responseText, true, false, isDocMode);

      } catch (directErr) {
        isGenerating = false;
        if (thinkingIndicator) thinkingIndicator.remove();
        console.error("[NexusAI] Direct Groq query failed:", directErr);
        
        // Display user error notification
        const errorText = "I'm having trouble connecting to the AI service. Please try again in a few moments.";
        addMessageToDOM('assistant', errorText, false, true);
        window.toast?.show('danger', 'Connection Error', 'Groq service connectivity failed.', 4000);
      }
    }
  }

  // Helper: Save copy of chat history to LocalStorage
  function saveLocalOfflineHistory(userMsg, aiMsg, isDocMode) {
    try {
      const localHistoryStr = localStorage.getItem('nexusED_chat_history') || '[]';
      const historyArr = JSON.parse(localHistoryStr);
      historyArr.push({
        user_message: userMsg,
        ai_response: aiMsg,
        isDocMode: isDocMode,
        created_at: new Date().toLocaleTimeString()
      });
      localStorage.setItem('nexusED_chat_history', JSON.stringify(historyArr));
    } catch (e) {
      console.warn("Failed to write to offline localStorage log: ", e);
    }
  }

  // Render Message Bubble to DOM
  function addMessageToDOM(sender, text, animate = false, isError = false, isDocMode = false) {
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${sender}`;
    
    const timestamp = getFormattedTimestamp();
    let badgeHtml = '';
    if (sender === 'assistant' && !isError) {
      badgeHtml = `<span class="mode-badge ${isDocMode ? 'doc-mode' : 'general-mode'}">
        ${isDocMode ? '📄 Using Uploaded Document' : '🤖 General AI Mode'}
      </span>`;
    }
    const metaHtml = `<div class="message-meta">
      <span class="sender-name">${sender === 'user' ? 'You' : 'NexusAI'}</span>
      ${badgeHtml}
      <span class="message-time">${timestamp}</span>
    </div>`;
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    bubble.innerHTML = metaHtml;
    bubble.appendChild(content);
    chatMessagesContainer.appendChild(bubble);

    if (sender === 'assistant' && !isError) {
      // Add message action buttons (copy, regenerate, thumbs down)
      const actions = document.createElement('div');
      actions.className = 'message-actions';
      actions.innerHTML = `
        <button class="btn-msg-action btn-copy" title="Copy response"><i data-lucide="copy"></i></button>
        <button class="btn-msg-action btn-regenerate" title="Regenerate"><i data-lucide="rotate-ccw"></i></button>
        <button class="btn-msg-action btn-like" title="Thumbs Up"><i data-lucide="thumbs-up"></i></button>
        <button class="btn-msg-action btn-dislike" title="Thumbs Down"><i data-lucide="thumbs-down"></i></button>
      `;
      bubble.appendChild(actions);
      
      // Bind copy button action
      actions.querySelector('.btn-copy').addEventListener('click', () => {
        navigator.clipboard.writeText(text);
        window.toast?.show('success', 'Copied', 'Response copied to clipboard.', 1500);
      });

      // Bind regenerate action
      actions.querySelector('.btn-regenerate').addEventListener('click', () => {
        if (!isGenerating && chatHistory.length >= 2) {
          // Find last user message in chatHistory
          let lastUserMsg = "";
          for (let i = chatHistory.length - 1; i >= 0; i--) {
            if (chatHistory[i].role === 'user') {
              lastUserMsg = chatHistory[i].content;
              // Remove history up to that query to keep conversation contextual state correct
              chatHistory = chatHistory.slice(0, i);
              break;
            }
          }
          if (lastUserMsg) {
            submitQuery(lastUserMsg);
          }
        }
      });

      // Bind like/dislike feedback
      actions.querySelector('.btn-like').addEventListener('click', function() {
        this.style.color = 'var(--success)';
        actions.querySelector('.btn-dislike').style.color = '';
        window.toast?.show('success', 'Thank You!', 'Feedback saved.', 1500);
      });

      actions.querySelector('.btn-dislike').addEventListener('click', function() {
        this.style.color = 'var(--danger)';
        actions.querySelector('.btn-like').style.color = '';
        window.toast?.show('info', 'Feedback Saved', 'We will adjust responses accordingly.', 1500);
      });

      if (typeof lucide !== 'undefined') lucide.createIcons({ node: actions });
    }

    if (animate) {
      // Client-side stream/typing emulation effect
      let charIndex = 0;
      const speed = 15; // ms per char
      content.innerHTML = "";
      
      // Stream characters incrementally
      const interval = setInterval(() => {
        charIndex += 4; // Stream chunks of 4 characters for responsive text pacing
        if (charIndex >= text.length) {
          charIndex = text.length;
          clearInterval(interval);
          content.innerHTML = formatTextContent(text);
          scrollToBottom();
        } else {
          content.innerHTML = formatTextContent(text.substring(0, charIndex)) + '<span class="typing-cursor">|</span>';
          scrollToBottom();
        }
      }, speed);
    } else {
      content.innerHTML = formatTextContent(text);
    }

    scrollToBottom();
  }

  // Show "Thinking..." loading dots
  function showThinkingIndicator() {
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble assistant thinking-indicator-bubble';
    
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    
    bubble.appendChild(indicator);
    chatMessagesContainer.appendChild(bubble);
    scrollToBottom();
    return bubble;
  }

  // Format content parsing LaTeX and Markdown structure
  function formatTextContent(text) {
    if (typeof marked === 'undefined') return text;
    
    let rendered = text;

    // Render LaTeX equations Block \[ ... \]
    rendered = rendered.replace(/\\\[([\s\S]*?)\\\]/g, (match, equation) => {
      if (typeof katex !== 'undefined') {
        try {
          return '<div class="math-block">' + katex.renderToString(equation.trim(), { displayMode: true }) + '</div>';
        } catch (e) {
          return match;
        }
      }
      return match;
    });

    // Render LaTeX equations Inline \( ... \)
    rendered = rendered.replace(/\\\((.*?)\\\)/g, (match, equation) => {
      if (typeof katex !== 'undefined') {
        try {
          return katex.renderToString(equation.trim(), { displayMode: false });
        } catch (e) {
          return match;
        }
      }
      return match;
    });

    return marked.parse(rendered);
  }

  // Utility to scroll message stream box to bottom
  function scrollToBottom() {
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  }

  // Utility to get current timestamp
  function getFormattedTimestamp() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  }
});
