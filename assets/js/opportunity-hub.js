/* opportunity-hub.js */

document.addEventListener('DOMContentLoaded', () => {
  // Constants & Coordinates Map
  const CITY_COORDS = {
    'Bangalore': { lat: 12.9716, lng: 77.5946 },
    'Silicon Valley': { lat: 37.7749, lng: -122.4194 },
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'New York': { lat: 40.7128, lng: -74.0060 },
    'London': { lat: 51.5074, lng: -0.1278 }
  };

  // Static Local Mock Events Fallback
  const MOCK_EVENTS = [
    {
      id: "evt_seed_1",
      title: "National Hackathon 2026",
      description: "A 36-hour sprint to build innovative solutions for sustainable tech. Join teams of developers to build functional prototypes.",
      organizer: "TechLabs",
      companyLogo: "assets/images/techlabs.png",
      location: "Bangalore, India",
      latitude: 12.9716,
      longitude: 77.5946,
      mode: "Offline",
      eventDate: "2026-08-15",
      registrationDeadline: "2026-08-10",
      category: "Hackathon",
      difficulty: "Intermediate",
      registrationFee: "Free",
      registrationUrl: "https://example.com/hackathon2026",
      agenda: "Day 1: Hacking kicks off. Day 2: Pitching & Judging.",
      eligibility: "Undergraduate Students",
      requiredSkills: "Java, Git, SQL",
      hasCertificate: true,
      source: "Local"
    },
    {
      id: "evt_seed_2",
      title: "Advanced Web Development Workshop",
      description: "A deep dive into advanced reactive architectures, glassmorphic styles, and service workers.",
      organizer: "Vercel Devs",
      companyLogo: "assets/images/vercel.png",
      location: "Online",
      latitude: 0.0,
      longitude: 0.0,
      mode: "Online",
      eventDate: "2026-08-20",
      registrationDeadline: "2026-08-19",
      category: "Workshop",
      difficulty: "Advanced",
      registrationFee: "Paid ($15)",
      registrationUrl: "https://example.com/webworkshop",
      agenda: "10 AM: Service Workers. 1 PM: Edge Rendering.",
      eligibility: "Developers with basic JS experience",
      requiredSkills: "JavaScript, CSS, HTML5",
      hasCertificate: true,
      source: "Local"
    },
    {
      id: "evt_seed_3",
      title: "Java Cloud Native Bootcamp",
      description: "Immersive bootcamp training covering Spring Boot microservices, Docker containers, and AWS deployments.",
      organizer: "Oracle Academy",
      companyLogo: "assets/images/oracle.png",
      location: "Bangalore, India",
      latitude: 12.9716,
      longitude: 77.5946,
      mode: "Hybrid",
      eventDate: "2026-09-01",
      registrationDeadline: "2026-08-28",
      category: "Bootcamp",
      difficulty: "Beginner",
      registrationFee: "Free",
      registrationUrl: "https://example.com/javacloud",
      agenda: "Week 1: Spring Boot. Week 2: Containers & K8s.",
      eligibility: "Computer Science majors",
      requiredSkills: "Java, DBMS",
      hasCertificate: true,
      source: "Local"
    },
    {
      id: "evt_seed_4",
      title: "Global Competitive Coding League",
      description: "Compete with elite algorithms minds globally in a 5-hour contest featuring hard logical puzzles.",
      organizer: "CodeChef Chapter",
      companyLogo: "assets/images/codechef.png",
      location: "Online",
      latitude: 0.0,
      longitude: 0.0,
      mode: "Online",
      eventDate: "2026-08-05",
      registrationDeadline: "2026-08-04",
      category: "Coding Contest",
      difficulty: "Advanced",
      registrationFee: "Free",
      registrationUrl: "https://example.com/contest",
      agenda: "5 PM - 10 PM: 6 Algorithm Problems.",
      eligibility: "Open to all students",
      requiredSkills: "Java, Python, C++",
      hasCertificate: false,
      source: "Local"
    },
    {
      id: "evt_seed_5",
      title: "Silicon Valley AI Accelerator Meetup",
      description: "Connect with tech leaders and developers in San Francisco. Pitch ideas and explore LLM agent architectures.",
      organizer: "YCombinator Circle",
      companyLogo: "",
      location: "Silicon Valley, CA",
      latitude: 37.7749,
      longitude: -122.4194,
      mode: "Offline",
      eventDate: "2026-08-25",
      registrationDeadline: "2026-08-22",
      category: "Tech Meetup",
      difficulty: "Intermediate",
      registrationFee: "Free",
      registrationUrl: "https://example.com/svmeetup",
      agenda: "6 PM: Keynotes. 7 PM: Roundtables. 8 PM: Networking.",
      eligibility: "Founders & Developers",
      requiredSkills: "AI, Python",
      hasCertificate: false,
      source: "Eventbrite"
    }
  ];

  // Resolve base API URL (handles ports mismatch on Live Server)
  const API_BASE = window.location.port === '5500' ? 'http://localhost:8080' : '';

  // State Variables
  let currentLat = 12.9716; // default Bangalore
  let currentLng = 77.5946;
  let activeTab = 'all'; // 'all', 'saved', 'registered'
  let opportunitiesList = [];
  let recommendedList = [];

  // DOM Elements
  const searchBox = document.getElementById('search-box');
  const locationSelect = document.getElementById('location-select');
  const gpsBtn = document.getElementById('gps-btn');
  const tabAll = document.getElementById('tab-all');
  const tabSaved = document.getElementById('tab-saved');
  const tabRegistered = document.getElementById('tab-registered');
  const syncPill = document.getElementById('sync-pill');
  const syncIcon = document.getElementById('sync-icon');
  const syncText = document.getElementById('sync-text');
  
  // Filters
  const filterType = document.getElementById('filter-type');
  const filterMode = document.getElementById('filter-mode');
  const filterDifficulty = document.getElementById('filter-difficulty');
  const filterFee = document.getElementById('filter-fee');
  const filterDate = document.getElementById('filter-date');
  const btnResetFilters = document.getElementById('btn-reset-filters');
  
  // Grids & Loading States
  const opportunitiesGrid = document.getElementById('opportunities-grid');
  const recommendationsGrid = document.getElementById('recommendations-grid');
  const recommendationsSection = document.getElementById('rec-section');
  const skeletonsContainer = document.getElementById('skeletons-container');
  const emptyState = document.getElementById('empty-state');
  const resultsCount = document.getElementById('results-count');

  // Modal Elements
  const detailsModal = document.getElementById('details-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBanner = document.getElementById('modal-banner');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalCompanyLogo = document.getElementById('modal-company-logo');
  const modalOrganizer = document.getElementById('modal-organizer');
  const modalDifficulty = document.getElementById('modal-difficulty');
  const modalDescription = document.getElementById('modal-description');
  const modalAgenda = document.getElementById('modal-agenda');
  const modalEligibility = document.getElementById('modal-eligibility');
  const modalDate = document.getElementById('modal-date');
  const modalDeadline = document.getElementById('modal-deadline');
  const modalVenue = document.getElementById('modal-venue');
  const modalFee = document.getElementById('modal-fee');
  const modalCertificate = document.getElementById('modal-certificate');
  const modalSkills = document.getElementById('modal-skills');
  const modalMapIframe = document.getElementById('modal-map-iframe');
  const modalRegisterBtn = document.getElementById('modal-register-btn');
  const modalBookmarkBtn = document.getElementById('modal-bookmark-btn');

  // 1. Initialize location detection
  detectUserLocation();

  // 2. Bind Filter & Tab Events
  gpsBtn.addEventListener('click', detectUserLocation);
  locationSelect.addEventListener('change', handleCitySelect);
  searchBox.addEventListener('input', debounce(loadOpportunities, 400));
  
  [filterType, filterMode, filterDifficulty, filterFee, filterDate].forEach(el => {
    el.addEventListener('change', loadOpportunities);
  });

  btnResetFilters.addEventListener('click', resetAllFilters);

  tabAll.addEventListener('click', () => switchTab('all'));
  tabSaved.addEventListener('click', () => switchTab('saved'));
  tabRegistered.addEventListener('click', () => switchTab('registered'));

  modalCloseBtn.addEventListener('click', closeModal);
  detailsModal.addEventListener('click', (e) => {
    if (e.target === detailsModal) closeModal();
  });

  // Reset Filters logic
  function resetAllFilters() {
    searchBox.value = '';
    filterType.value = '';
    filterMode.value = '';
    filterDifficulty.value = '';
    filterFee.value = '';
    filterDate.value = '';
    loadOpportunities();
  }

  // switch view tabs
  function switchTab(tab) {
    activeTab = tab;
    [tabAll, tabSaved, tabRegistered].forEach(btn => btn.classList.remove('active'));
    
    if (tab === 'all') {
      tabAll.classList.add('active');
      recommendationsSection.style.display = 'block';
      document.getElementById('feed-title').textContent = 'All Opportunities';
    } else if (tab === 'saved') {
      tabSaved.classList.add('active');
      recommendationsSection.style.display = 'none';
      document.getElementById('feed-title').textContent = 'Saved Opportunities';
    } else {
      tabRegistered.classList.add('active');
      recommendationsSection.style.display = 'none';
      document.getElementById('feed-title').textContent = 'My Registrations';
    }
    loadOpportunities();
  }

  // Detect location
  function detectUserLocation() {
    updateSyncPill('locating', 'Requesting GPS coordinate access...');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          currentLat = pos.coords.latitude;
          currentLng = pos.coords.longitude;
          updateSyncPill('success', `Detected Location: ${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`);
          
          // Update city selector to default or Custom
          locationSelect.value = "";
          locationSelect.options[0].textContent = "My Location (GPS)";
          
          if (window.toast) {
            window.toast.show('success', 'Location Synced', 'Successfully detected your live coordinates.', 2000);
          }
          loadOpportunities();
        },
        (err) => {
          console.warn("Geolocation permission denied: " + err.message);
          updateSyncPill('error', 'Location Access Denied. Defaulting to Bangalore.');
          
          if (window.toast) {
            window.toast.show('info', 'GPS Access Denied', 'Please select your city manually in the dropdown.', 3000);
          }
          
          locationSelect.value = "Bangalore";
          handleCitySelect();
        }
      );
    } else {
      locationSelect.value = "Bangalore";
      handleCitySelect();
    }
  }

  // Handle manual city selection
  function handleCitySelect() {
    const city = locationSelect.value;
    if (CITY_COORDS[city]) {
      currentLat = CITY_COORDS[city].lat;
      currentLng = CITY_COORDS[city].lng;
      updateSyncPill('success', `Location: ${city}`);
      loadOpportunities();
    }
  }

  // Load Opportunities from API (with local fallback mapping)
  function loadOpportunities() {
    showLoading(true);
    
    let url = `${API_BASE}/api/opportunities?lat=${currentLat}&lng=${currentLng}&userId=1`;
    
    if (activeTab === 'saved') {
      url += '&type=saved';
    } else if (activeTab === 'registered') {
      url += '&type=registered';
    }

    // append query filters
    if (searchBox.value.trim() !== '') {
      url += `&search=${encodeURIComponent(searchBox.value.trim())}`;
    }
    if (filterType.value !== '') {
      url += `&category=${filterType.value}`;
    }
    if (filterMode.value !== '') {
      url += `&mode=${filterMode.value}`;
    }
    if (filterDifficulty.value !== '') {
      url += `&difficulty=${filterDifficulty.value}`;
    }
    if (filterFee.value !== '') {
      url += `&fee=${filterFee.value}`;
    }
    if (filterDate.value !== '') {
      url += `&date=${filterDate.value}`;
    }

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Server responded with error status.");
        return res.json();
      })
      .then(data => {
        opportunitiesList = data.events || [];
        recommendedList = data.recommended || [];
        
        // Update Sync Status Text
        if (data.syncStatus === 'live') {
          updateSyncPill('success', 'Synced with Eventbrite');
        } else {
          updateSyncPill('cached', 'Showing recently synced opportunities');
        }

        renderOpportunities();
        showLoading(false);
      })
      .catch(err => {
        console.warn("[OpportunityHub] Servlet offline. Executing client-side localStorage fallback logic.", err);
        updateSyncPill('cached', 'Showing recently synced opportunities');
        
        // Load mock fallback data
        loadFallbackMockOpportunities();
        showLoading(false);
      });
  }

  // Local storage mock fallback loader
  function loadFallbackMockOpportunities() {
    const savedIds = JSON.parse(localStorage.getItem('nexusED_saved_events') || '[]');
    const registeredIds = JSON.parse(localStorage.getItem('nexusED_registered_events') || '[]');

    // 1. Sync bookmark & registration states in mock list
    let list = MOCK_EVENTS.map(e => ({
      ...e,
      bookmarked: savedIds.includes(e.id),
      registered: registeredIds.includes(e.id)
    }));

    // 2. Apply coordinates filter (approximate bounding box check for 50km radius)
    // Only apply location filter for offline items
    list = list.filter(e => {
      if (e.mode === 'Online') return true;
      const dLat = Math.abs(e.latitude - currentLat);
      const dLng = Math.abs(e.longitude - currentLng);
      return (dLat <= 0.6 && dLng <= 0.6); // within ~60km box
    });

    // 3. Apply manual filters
    if (searchBox.value.trim() !== '') {
      const term = searchBox.value.trim().toLowerCase();
      list = list.filter(e => 
        e.title.toLowerCase().contains(term) || 
        e.description.toLowerCase().contains(term) ||
        e.organizer.toLowerCase().contains(term) ||
        e.requiredSkills.toLowerCase().contains(term)
      );
    }
    if (filterType.value !== '') {
      list = list.filter(e => e.category.equalsIgnoreCase(filterType.value));
    }
    if (filterMode.value !== '') {
      list = list.filter(e => e.mode.equalsIgnoreCase(filterMode.value));
    }
    if (filterDifficulty.value !== '') {
      list = list.filter(e => e.difficulty.equalsIgnoreCase(filterDifficulty.value));
    }
    if (filterFee.value !== '') {
      const isFreeFilter = filterFee.value === 'free';
      list = list.filter(e => {
        const isFree = e.registrationFee.toLowerCase().contains("free") || e.registrationFee.equals("0");
        return isFreeFilter ? isFree : !isFree;
      });
    }

    // 4. Tab filters
    if (activeTab === 'saved') {
      list = list.filter(e => e.bookmarked);
    } else if (activeTab === 'registered') {
      list = list.filter(e => e.registered);
    }

    opportunitiesList = list;

    // 5. Build mock recommendations (rank by skill matching and career readiness)
    recommendedList = list.filter(e => !e.registered).slice(0, 3); // simple recommend

    renderOpportunities();
  }

  // Helper strings contains/equals checks
  String.prototype.contains = function(str) { return this.indexOf(str) !== -1; };
  String.prototype.equalsIgnoreCase = function(str) { return this.toLowerCase() === str.toLowerCase(); };

  // Render Opportunities list
  function renderOpportunities() {
    opportunitiesGrid.innerHTML = '';
    recommendationsGrid.innerHTML = '';
    
    // 1. Render Recommendations (only on main Tab)
    if (activeTab === 'all' && recommendedList.length > 0) {
      recommendationsSection.style.display = 'block';
      recommendedList.forEach(e => {
        recommendationsGrid.appendChild(createOpportunityCard(e, true));
      });
    } else {
      recommendationsSection.style.display = 'none';
    }

    // 2. Render Main opportunities Feed
    if (opportunitiesList.length === 0) {
      renderEmptyState(true);
      resultsCount.textContent = '0 items found';
    } else {
      renderEmptyState(false);
      resultsCount.textContent = `${opportunitiesList.length} items found`;
      
      opportunitiesList.forEach(e => {
        opportunitiesGrid.appendChild(createOpportunityCard(e, false));
      });

      // Animate Card entrance using GSAP (using fromTo to prevent animation state capture bugs)
      gsap.killTweensOf('.opportunity-card');
      gsap.fromTo('.opportunity-card', 
        { y: 30, opacity: 0 },
        {
          duration: 0.5,
          y: 0,
          opacity: 1,
          stagger: 0.1,
          ease: 'power2.out'
        }
      );
    }
  }

  // Create Opportunity Card element
  function createOpportunityCard(e, isRecommended) {
    const col = document.createElement('div');
    col.className = isRecommended ? 'col-md-6 col-lg-3' : 'col-md-6 col-lg-4';
    
    const bannerUrl = e.companyLogo || 'assets/images/hackathon-banner.jpg';
    const isBookmarked = e.bookmarked ? 'active' : '';

    const content = `
      <div class="opportunity-card">
        <div class="card-banner" style="background-image: url('${bannerUrl}');">
          <div class="card-banner-overlay"></div>
          <span class="card-badge badge-${e.category.toLowerCase().replace(' ', '-')}">${e.category}</span>
          <button type="button" class="bookmark-icon-btn ${isBookmarked}" data-id="${e.id}" title="Bookmark event">
            <i data-lucide="bookmark" style="fill: ${e.bookmarked ? 'currentColor' : 'none'}"></i>
          </button>
          <div class="card-company-logo">
            ${e.organizer.substring(0, 1).toUpperCase()}
          </div>
        </div>

        <div class="card-body-content">
          <h3 class="card-title">${e.title}</h3>
          <span class="card-organizer">by ${e.organizer}</span>
          
          <div class="card-meta-list">
            <div class="meta-item">
              <i data-lucide="map-pin"></i>
              <span>${e.location} (${e.mode})</span>
            </div>
            <div class="meta-item">
              <i data-lucide="calendar"></i>
              <span>${e.eventDate}</span>
            </div>
            <div class="meta-item">
              <i data-lucide="credit-card"></i>
              <span>Registration Fee: <b>${e.registrationFee}</b></span>
            </div>
          </div>

          <div class="card-tags-list">
            ${e.requiredSkills.split(',').slice(0, 3).map(s => `<span class="skill-tag">${s.trim()}</span>`).join('')}
          </div>

          <div class="card-actions-wrapper">
            <button type="button" class="btn-card-action btn-action-primary register-trigger" data-id="${e.id}">
              ${e.registered ? 'Registered ✓' : 'Register'}
            </button>
            <button type="button" class="btn-card-action btn-action-secondary details-trigger" data-id="${e.id}">View Details</button>
          </div>
        </div>
      </div>
    `;
    col.innerHTML = content;

    // Attach local listeners to buttons inside card
    col.querySelector('.bookmark-icon-btn').addEventListener('click', (ev) => {
      ev.stopPropagation();
      toggleBookmark(e.id, !e.bookmarked);
    });

    const regBtn = col.querySelector('.register-trigger');
    regBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (!e.registered) {
        registerForEvent(e.id);
      } else {
        if (window.toast) window.toast.show('info', 'Already Registered', 'You have already registered for this event.', 2000);
      }
    });

    col.querySelector('.details-trigger').addEventListener('click', (ev) => {
      ev.stopPropagation();
      openDetailsModal(e);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons({ node: col });
    return col;
  }

  // Toggle sync info UI
  function updateSyncPill(state, message) {
    syncText.textContent = message;
    syncPill.className = 'sync-status-pill';
    syncIcon.className = '';

    if (state === 'locating') {
      syncIcon.className = 'spinning-icon';
      syncIcon.setAttribute('data-lucide', 'refresh-cw');
      syncPill.style.borderColor = 'var(--border-color)';
    } else if (state === 'success') {
      syncIcon.setAttribute('data-lucide', 'check-circle-2');
      syncPill.style.borderColor = 'var(--success)';
      syncPill.style.color = 'var(--success)';
    } else if (state === 'cached') {
      syncIcon.setAttribute('data-lucide', 'database');
      syncPill.style.borderColor = 'var(--warning)';
      syncPill.style.color = 'var(--warning)';
    } else if (state === 'error') {
      syncIcon.setAttribute('data-lucide', 'alert-circle');
      syncPill.style.borderColor = 'var(--danger)';
      syncPill.style.color = 'var(--danger)';
    }

    if (typeof lucide !== 'undefined') lucide.createIcons({ node: syncPill });
  }

  // Show skeleton loading animations
  function showLoading(loading) {
    if (loading) {
      skeletonsContainer.classList.remove('d-none');
      opportunitiesGrid.classList.add('d-none');
      emptyState.classList.add('d-none');
    } else {
      skeletonsContainer.classList.add('d-none');
      opportunitiesGrid.classList.remove('d-none');
    }
  }

  // Show Empty State UI
  function renderEmptyState(show) {
    if (show) {
      emptyState.classList.remove('d-none');
      opportunitiesGrid.classList.add('d-none');
    } else {
      emptyState.classList.add('d-none');
      opportunitiesGrid.classList.remove('d-none');
    }
  }

  // Toggle bookmark / save status (handles local storage and servlet update)
  function toggleBookmark(eventId, shouldSave) {
    const url = `${API_BASE}/api/opportunities?action=bookmark&eventId=${eventId}&save=${shouldSave}&userId=1`;
    fetch(url, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (window.toast) window.toast.show('success', shouldSave ? 'Event Saved' : 'Removed', data.message, 2000);
          loadOpportunities();
        }
      })
      .catch(err => {
        // Local fallback handler
        let savedIds = JSON.parse(localStorage.getItem('nexusED_saved_events') || '[]');
        if (shouldSave) {
          if (!savedIds.includes(eventId)) savedIds.push(eventId);
        } else {
          savedIds = savedIds.filter(id => id !== eventId);
        }
        localStorage.setItem('nexusED_saved_events', JSON.stringify(savedIds));
        
        if (window.toast) {
          window.toast.show('success', shouldSave ? 'Event Saved (Local)' : 'Removed (Local)', shouldSave ? 'Event bookmarked locally.' : 'Removed from local bookmarks.', 2000);
        }
        loadOpportunities();
      });
  }

  // Register action (handles local storage and servlet update)
  function registerForEvent(eventId) {
    const url = `${API_BASE}/api/opportunities?action=register&eventId=${eventId}&userId=1`;
    fetch(url, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (window.toast) window.toast.show('success', 'Registered!', data.message, 2500);
          loadOpportunities();
        }
      })
      .catch(err => {
        // Local fallback handler
        let registeredIds = JSON.parse(localStorage.getItem('nexusED_registered_events') || '[]');
        if (!registeredIds.includes(eventId)) {
          registeredIds.push(eventId);
        }
        localStorage.setItem('nexusED_registered_events', JSON.stringify(registeredIds));

        if (window.toast) {
          window.toast.show('success', 'Registered! (Local)', 'Successfully registered for event locally.', 2500);
        }
        loadOpportunities();
      });
  }

  // Open Details Modal
  function openDetailsModal(e) {
    modalCategory.textContent = e.category;
    modalCategory.className = `modal-banner-badge badge-${e.category.toLowerCase().replace(' ', '-')}`;
    modalTitle.textContent = e.title;
    modalOrganizer.textContent = `by ${e.organizer}`;
    modalDifficulty.textContent = `${e.difficulty} Level`;
    modalDescription.textContent = e.description;
    
    // Set company logo initials
    modalCompanyLogo.textContent = e.organizer.substring(0, 1).toUpperCase();

    // Map skills required
    modalSkills.innerHTML = e.requiredSkills.split(',').map(s => `<span class="skill-tag">${s.trim()}</span>`).join('');

    // Map agenda items
    modalAgenda.innerHTML = e.agenda.split('.').filter(item => item.trim() !== '').map(item => `
      <div class="agenda-item">
        <div class="agenda-bullet"></div>
        <span class="agenda-text">${item.trim()}</span>
      </div>
    `).join('');

    // Eligibility, Date, Deadline, Venue, Fee
    modalEligibility.textContent = e.eligibility;
    modalDate.textContent = e.eventDate;
    modalDeadline.textContent = e.registrationDeadline;
    modalVenue.textContent = `${e.location} (${e.mode})`;
    modalFee.textContent = e.registrationFee;
    
    // Certificate pill
    modalCertificate.textContent = e.hasCertificate ? "Certificate Available on Completion" : "Participation Recognition Only";

    // Set Map Source using OpenStreetMap Embed
    const lat = e.latitude || 12.9716;
    const lng = e.longitude || 77.5946;
    modalMapIframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01}%2C${lat-0.01}%2C${lng+0.01}%2C${lat+0.01}&layer=mapnik&marker=${lat}%2C${lng}`;

    // Setup action buttons inside modal
    modalRegisterBtn.textContent = e.registered ? 'Registered ✓' : 'Register Now';
    modalRegisterBtn.className = e.registered ? 'btn-premium btn-premium-secondary flex-grow-1' : 'btn-premium btn-premium-primary flex-grow-1';
    
    modalRegisterBtn.onclick = () => {
      if (!e.registered) {
        registerForEvent(e.id);
        closeModal();
      }
    };

    modalBookmarkBtn.className = e.bookmarked ? 'btn-modal-bookmark active' : 'btn-modal-bookmark';
    modalBookmarkBtn.onclick = () => {
      toggleBookmark(e.id, !e.bookmarked);
      closeModal();
    };

    detailsModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // block main page scroll
    
    if (typeof lucide !== 'undefined') lucide.createIcons({ node: detailsModal });
  }

  // Close Details Modal
  function closeModal() {
    detailsModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Debouncing Utility
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
});
