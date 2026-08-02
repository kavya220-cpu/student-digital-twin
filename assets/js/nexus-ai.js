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

  // Load chat history on startup
  loadHistory();

  // Load history from API
  function loadHistory() {
    fetch('api/chat')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // Hide welcome screen
          if (chatWelcomeScreen) chatWelcomeScreen.style.display = 'none';
          
          data.forEach(item => {
            // Add user message
            addMessageToDOM('user', item.user_message, false);
            // Add assistant message
            addMessageToDOM('assistant', item.ai_response, false);
            
            // Build memory history array
            chatHistory.push({ role: 'user', content: item.user_message });
            chatHistory.push({ role: 'assistant', content: item.ai_response });
          });
          scrollToBottom();
        }
      })
      .catch(err => {
        console.warn("[NexusAI] Could not load chat history from servlet: ", err);
      });
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
      fetch('api/chat', { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
          chatMessagesContainer.innerHTML = '';
          if (chatWelcomeScreen) chatWelcomeScreen.style.display = 'block';
          chatHistory = [];
          window.toast?.show('info', 'Chat Cleared', 'Conversation history cleared successfully.', 2500);
        })
        .catch(err => {
          console.error("[NexusAI] Failed to clear chat history: ", err);
          window.toast?.show('danger', 'Action Failed', 'Could not clear history. Please try again.', 3000);
        });
    }
  });

  // Submit Query to Groq Backend
  function submitQuery(query) {
    // Hide welcome screen
    if (chatWelcomeScreen) chatWelcomeScreen.style.display = 'none';
    
    // Add User Message
    addMessageToDOM('user', query, false);
    chatInput.value = '';
    scrollToBottom();

    // Prepare history payload for multi-turn contextual tracking
    const historyPayload = JSON.stringify(chatHistory);
    
    // Push user message to local memory
    chatHistory.push({ role: 'user', content: query });
    
    // Render Thinking Dots Indicator
    const thinkingIndicator = showThinkingIndicator();
    isGenerating = true;

    fetch('api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: query,
        history: historyPayload
      })
    })
      .then(res => {
        thinkingIndicator.remove();
        if (!res.ok) throw new Error("Backend server response failed");
        return res.json();
      })
      .then(data => {
        isGenerating = false;
        const responseText = data.response;
        
        // Push assistant response to local memory
        chatHistory.push({ role: 'assistant', content: responseText });
        
        // Render assistant message to DOM with simulated streaming effect
        addMessageToDOM('assistant', responseText, true);
      })
      .catch(err => {
        isGenerating = false;
        if (thinkingIndicator) thinkingIndicator.remove();
        console.error(err);
        
        // Error display
        const errorText = "I'm having trouble connecting to the AI service. Please try again in a few moments.";
        addMessageToDOM('assistant', errorText, false, true);
        window.toast?.show('danger', 'Connection Error', 'Groq service connectivity failed.', 4000);
      });
  }

  // Render Message Bubble to DOM
  function addMessageToDOM(sender, text, animate = false, isError = false) {
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${sender}`;
    
    const timestamp = getFormattedTimestamp();
    const metaHtml = `<div class="message-meta">
      <span class="sender-name">${sender === 'user' ? 'You' : 'NexusAI'}</span>
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
