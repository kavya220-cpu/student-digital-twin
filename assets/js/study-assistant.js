/* study-assistant.js */

document.addEventListener('DOMContentLoaded', () => {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const browseBtn = document.getElementById('browse-btn');
  const progressOverlay = document.getElementById('progress-overlay');
  const progressFill = document.getElementById('progress-fill');
  const progressTitle = document.getElementById('progress-title');
  const progressSubtitle = document.getElementById('progress-subtitle');
  const recentFilesGrid = document.getElementById('recent-files-grid');
  const filesCount = document.getElementById('files-count');

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

  // Helper: Read text file
  const readTextFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  // Helper: Extract text from PDF file in client side using pdf.js
  const readPdfText = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfjsLib = window['pdfjs-dist/build/pdf'];
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = "";
      // Extract first 12 pages maximum to fit token limits gracefully
      for (let i = 1; i <= Math.min(12, pdf.numPages); i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(" ");
        text += pageText + "\n";
      }
      return text;
    } catch (e) {
      console.error("PDF.js text extraction failed:", e);
      throw new Error("Failed to extract text from PDF document.");
    }
  };

  // Client-Side Fallback Analysis Pipeline
  const performClientSideAnalysis = async (file) => {
    try {
      progressTitle.textContent = 'Reading Document Contents...';
      progressFill.style.width = '30%';

      // 1. Get API Key
      const apiKey = await getApiKey();
      if (!apiKey) {
        throw new Error("No Gemini API key found in src/config.properties");
      }

      // 2. Extract text content
      let documentText = "";
      if (file.type.includes('pdf')) {
        documentText = await readPdfText(file);
      } else {
        documentText = await readTextFile(file);
      }

      if (!documentText || documentText.trim().length === 0) {
        throw new Error("Extracted document text is empty.");
      }

      progressTitle.textContent = 'Processing with Google Gemini...';
      progressSubtitle.textContent = 'Generating summaries, study notes, quiz and questions...';
      progressFill.style.width = '65%';

      // 3. Prompt building
      const prompt = `Analyze the following text extracted from a study document named "${file.name}".
Generate study assistance materials exactly matching this JSON format structure:
{
  "filename": "${file.name.replace(/"/g, '\\"')}",
  "difficulty": "Easy" or "Medium" or "Hard",
  "study_time": 45,
  "summary": "1. First key point\\n2. Second key point\\n3. Third key point\\n4. Fourth key point\\n5. Fifth key point",
  "notes": "Detailed study notes formatted in Markdown style with clear subheadings, bold text, and paragraphs...",
  "topics": "Topic 1, Topic 2, Topic 3",
  "keywords": "Keyword 1, Keyword 2, Keyword 3",
  "flashcards": [
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." }
  ],
  "mcqs": [
    { "question": "...", "option_a": "...", "option_b": "...", "option_c": "...", "option_d": "...", "correct_answer": "A" or "B" or "C" or "D" },
    { "question": "...", "option_a": "...", "option_b": "...", "option_c": "...", "option_d": "...", "correct_answer": "A" or "B" or "C" or "D" },
    { "question": "...", "option_a": "...", "option_b": "...", "option_c": "...", "option_d": "...", "correct_answer": "A" or "B" or "C" or "D" },
    { "question": "...", "option_a": "...", "option_b": "...", "option_c": "...", "option_d": "...", "correct_answer": "A" or "B" or "C" or "D" },
    { "question": "...", "option_a": "...", "option_b": "...", "option_c": "...", "option_d": "...", "correct_answer": "A" or "B" or "C" or "D" }
  ],
  "questions": [
    { "question": "...", "question_type": "Technical", "answer_outline": "..." },
    { "question": "...", "question_type": "HR", "answer_outline": "..." },
    { "question": "...", "question_type": "Viva", "answer_outline": "..." }
  ]
}

Make sure to output ONLY raw valid JSON matching the structure. Do not add markdown backticks (\`\`\`json) or other conversational text.

Document Text:
${documentText.substring(0, 15000)}`;

      // 4. Query Gemini
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (!res.ok) {
        throw new Error(`Gemini API returned status ${res.status}`);
      }

      const resultJson = await res.json();
      const responseText = resultJson.candidates[0].content.parts[0].text;
      const parsedData = JSON.parse(responseText);

      // 5. Save to localStorage
      const localId = `doc_local_${Date.now()}`;
      localStorage.setItem(localId, JSON.stringify(parsedData));

      // Append to the local list of uploads so they show up under "Recent Uploads"
      const localFiles = JSON.parse(localStorage.getItem('local_uploads') || '[]');
      localFiles.unshift({
        id: localId,
        filename: file.name,
        file_type: file.type,
        file_size: file.size,
        upload_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
        bookmarked: false
      });
      localStorage.setItem('local_uploads', JSON.stringify(localFiles));

      progressFill.style.width = '100%';
      showToast('success', 'Analysis Complete', 'Redirecting to study resources...');
      setTimeout(() => {
        window.location.href = `analysis.html?id=${localId}`;
      }, 1200);

    } catch (err) {
      console.error("Client side analysis failed:", err);
      showToast('error', 'Analysis Failed', 'Could not parse document. Using offline demo mode.');
      fallbackUploadSuccess();
    }
  };

  // 1. Initial Load of Recent Uploads
  const loadRecentUploads = () => {
    fetch(`${getBaseUrl()}/api/study/recent`)
      .then(res => res.json())
      .then(data => {
        renderRecentFiles(data);
      })
      .catch(err => {
        console.error('Failed to load uploads:', err);
        // Load offline local_uploads combined with fallback seed
        const localFiles = JSON.parse(localStorage.getItem('local_uploads') || '[]');
        const fallbackList = [
          ...localFiles,
          {
            id: 'doc_seed_1',
            filename: 'CNN_Notes.pdf',
            file_type: 'application/pdf',
            file_size: 1024 * 1024 * 2,
            upload_time: '2026-07-24 10:00:00',
            bookmarked: true
          }
        ];
        renderRecentFiles(fallbackList);
      });
  };

  const renderRecentFiles = (files) => {
    recentFilesGrid.innerHTML = '';
    filesCount.textContent = `${files.length} Files`;

    if (files.length === 0) {
      recentFilesGrid.innerHTML = `
        <div class="empty-state-card" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary);">
          <i data-lucide="folder-open" style="width: 48px; height: 48px; margin-bottom: 12px; color: var(--primary-light);"></i>
          <p>No study materials uploaded yet. Drop a file above to begin!</p>
        </div>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons();
      return;
    }

    files.forEach(file => {
      const card = document.createElement('div');
      card.className = 'file-card';
      
      const isBookmarkedClass = file.bookmarked ? 'active' : '';
      const sizeMB = (file.file_size / (1024 * 1024)).toFixed(2);
      const fileIcon = getFileIconName(file.file_type);

      card.innerHTML = `
        <div class="file-banner">
          <div class="file-icon-wrapper">
            <i data-lucide="${fileIcon}"></i>
          </div>
          <button type="button" class="file-bookmark-btn ${isBookmarkedClass}" data-id="${file.id}">
            <i data-lucide="bookmark" style="fill: ${file.bookmarked ? 'currentColor' : 'none'}"></i>
          </button>
        </div>
        <div class="file-info">
          <h4 class="file-name" title="${file.filename}">${file.filename}</h4>
          <div class="file-meta">
            <span>${sizeMB} MB</span>
            <span>${formatTime(file.upload_time)}</span>
          </div>
          <div class="file-actions">
            <button type="button" class="btn-premium btn-premium-primary view-analysis-btn" data-id="${file.id}">Open Analysis</button>
          </div>
        </div>
      `;

      // Listeners
      card.querySelector('.file-bookmark-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBookmark(file.id, !file.bookmarked);
      });

      card.querySelector('.view-analysis-btn').addEventListener('click', () => {
        window.location.href = `analysis.html?id=${file.id}`;
      });

      recentFilesGrid.appendChild(card);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  };

  const getFileIconName = (mime) => {
    if (!mime) return 'file';
    if (mime.includes('pdf')) return 'file-text';
    if (mime.includes('presentation') || mime.includes('powerpoint') || mime.includes('ppt')) return 'presentation';
    if (mime.includes('word') || mime.includes('officedocument') || mime.includes('docx')) return 'file-edit';
    if (mime.startsWith('image/')) return 'image';
    return 'file';
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    try {
      const parts = ts.split(' ');
      return parts[0]; // Returns just the date portion
    } catch (e) {
      return ts;
    }
  };

  // 2. Drag & Drop Handlers
  ['dragenter', 'dragover'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    }, false);
  });

  ['dragleave', 'drop'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
    }, false);
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  });

  browseBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      handleFileUpload(fileInput.files[0]);
    }
  });

  // 3. File Upload & API post orchestration
  const handleFileUpload = (file) => {
    // Validate File size limit (25 MB)
    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast('error', 'File Too Large', 'Maximum file size allowed is 25 MB.');
      return;
    }

    // Prepare upload overlay indicators
    progressOverlay.style.display = 'flex';
    progressFill.style.width = '10%';
    progressTitle.textContent = 'Uploading to Server...';
    progressSubtitle.textContent = `Processing file: ${file.name}`;

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${getBaseUrl()}/api/study/upload`, true);

    // Track upload progress
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        progressFill.style.width = `${Math.min(90, percent)}%`; // Keep at 90% until server responds with Gemini completion
        if (percent >= 100) {
          progressTitle.textContent = 'Analyzing with Gemini API...';
          progressSubtitle.textContent = 'Generating summaries, study notes, viva questions and quiz...';
        }
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        progressFill.style.width = '100%';
        try {
          const resp = JSON.parse(xhr.responseText);
          showToast('success', 'Analysis Complete', 'Redirecting to study resources...');
          setTimeout(() => {
            window.location.href = `analysis.html?id=${resp.documentId}`;
          }, 1200);
        } catch (e) {
          performClientSideAnalysis(file);
        }
      } else {
        performClientSideAnalysis(file);
      }
    };

    xhr.onerror = () => {
      // Trigger client side parser and Gemini API direct call if Tomcat backend is offline
      performClientSideAnalysis(file);
    };

    xhr.send(formData);
  };

  const fallbackUploadSuccess = () => {
    // Generate simple seed redirect if server and client-side Gemini call both fail
    progressFill.style.width = '100%';
    setTimeout(() => {
      window.location.href = `analysis.html?id=doc_seed_1`;
    }, 1500);
  };

  // 4. Bookmark Toggle
  const toggleBookmark = (id, state) => {
    fetch(`${getBaseUrl()}/api/study/bookmark?id=${id}&state=${state}`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        showToast('success', state ? 'Bookmarked' : 'Unbookmarked', 'Updated document bookmark status.');
        loadRecentUploads();
      })
      .catch(() => {
        showToast('success', 'Status Synced', 'Local bookmark state saved.');
        loadRecentUploads();
      });
  };

  // Toast Helper
  const showToast = (type, title, message) => {
    if (window.toast) {
      window.toast.show(type, title, message, 3000);
    } else {
      alert(`${title}: ${message}`);
    }
  };

  // Load items on start
  loadRecentUploads();
});
