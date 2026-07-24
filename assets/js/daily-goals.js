/* daily-goals.js */

document.addEventListener('DOMContentLoaded', () => {
  // Fetch Local Storage Profile just for header names sync
  const profileData = localStorage.getItem('nexusED_profile');
  let fallbackName = "Student";
  let fallbackCareer = "AI Student";
  let fallbackAvatarInitials = "ST";

  if (profileData) {
    const profileObj = JSON.parse(profileData);
    fallbackName = profileObj.name || fallbackName;
    fallbackCareer = profileObj.selectedCareer || fallbackCareer;
    fallbackAvatarInitials = fallbackName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    // Populate sidebar user details
    const sidebarRole = document.getElementById('sidebar-user-career');
    if (sidebarRole) sidebarRole.textContent = fallbackCareer;
    
    const sidebarName = document.getElementById('sidebar-user-name');
    if (sidebarName) sidebarName.textContent = fallbackName;

    const sidebarAvatar = document.getElementById('sidebar-user-avatar');
    if (sidebarAvatar) {
      if (profileObj.photo) {
        sidebarAvatar.innerHTML = `<img src="${profileObj.photo}" alt="Student Profile picture">`;
      } else {
        sidebarAvatar.textContent = fallbackAvatarInitials;
      }
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

  // State Management
  let dailyGoals = [];
  let currentStreak = 5;

  const listContainer = document.getElementById('goals-list-container');
  const streakBadge = document.getElementById('goals-streak-badge');
  const progressRing = document.getElementById('goal-progress-ring');
  const percentText = document.getElementById('goal-progress-percent');
  const completedLabel = document.getElementById('label-completed-count');
  const pendingLabel = document.getElementById('label-pending-count');

  // Load from Dashboard Servlet
  loadGoalsData();

  function loadGoalsData() {
    fetch('/api/dashboard')
      .then(res => {
        if (!res.ok) throw new Error("Servlet server not active");
        return res.json();
      })
      .then(data => {
        dailyGoals = data.goals || [];
        currentStreak = data.coding.streak || 5;
        renderGoals();
      })
      .catch(err => {
        console.warn("[DailyGoals] Servlet offline. Loading fallback mocks:", err);
        // Fallback standard checklist matching seed
        dailyGoals = [
          { id: 1, text: "Solve 2 DSA questions in Coding Tracker", completed: true },
          { id: 2, text: "Update Voice Assistant project details in Projects", completed: false },
          { id: 3, text: "Run an AI Mock Interview trial", completed: false }
        ];
        renderGoals();
      });
  }

  function renderGoals() {
    listContainer.innerHTML = '';
    
    if (dailyGoals.length === 0) {
      listContainer.innerHTML = `
        <div class="text-center py-5">
          <i data-lucide="smile" class="text-success mb-2" style="width:36px; height:36px; display:block; margin: 0 auto;"></i>
          <p class="text-success fw-semibold">Awesome! You have completed all today's target goals!</p>
        </div>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons();
      updateProgressDisplay();
      return;
    }

    dailyGoals.forEach(g => {
      const item = document.createElement('div');
      item.className = `goal-item ${g.completed ? 'completed' : ''} animate__animated animate__fadeInUp`;
      
      item.innerHTML = `
        <div class="goal-checkbox-wrapper">
          <i data-lucide="check"></i>
        </div>
        <span class="goal-text-display">${g.text}</span>
      `;

      item.addEventListener('click', () => toggleGoalStatus(g.id));
      listContainer.appendChild(item);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
    updateProgressDisplay();
  }

  function toggleGoalStatus(id) {
    const goal = dailyGoals.find(item => item.id === id);
    if (!goal) return;

    const newCompletedState = !goal.completed;

    // Trigger servlet POST request
    const params = new URLSearchParams();
    params.append('goalId', id);
    params.append('completed', newCompletedState);

    fetch('/api/daily-goals', {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        goal.completed = newCompletedState;
        window.toast.show(
          newCompletedState ? 'success' : 'info',
          newCompletedState ? 'Goal Completed!' : 'Goal Updated',
          newCompletedState ? 'Awesome progress! Streak maintained.' : 'Task marked as pending.',
          2000
        );
        renderGoals();
      } else {
        throw new Error(result.message);
      }
    })
    .catch(err => {
      console.warn("[DailyGoals] POST failed. Toggling locally for client simulation:", err);
      // Client-side simulation fallback
      goal.completed = newCompletedState;
      window.toast.show(
        newCompletedState ? 'success' : 'info',
        newCompletedState ? 'Goal Completed! (Simulated)' : 'Goal Updated (Simulated)',
        newCompletedState ? 'Task checked off.' : 'Task unchecked.',
        1500
      );
      renderGoals();
    });
  }

  function updateProgressDisplay() {
    const total = dailyGoals.length;
    const completed = dailyGoals.filter(g => g.completed).length;
    const pending = total - completed;

    completedLabel.textContent = completed;
    pendingLabel.textContent = pending;

    const pct = total === 0 ? 100 : Math.round((completed / total) * 100);
    percentText.textContent = `${pct}%`;

    // Circular Dash Offset calculation (dasharray: 377)
    const offset = 377 - (pct / 100) * 377;
    if (progressRing) {
      setTimeout(() => {
        progressRing.style.strokeDashoffset = offset;
      }, 100);
    }

    // Streak badge display
    if (streakBadge) {
      const finalStreak = pct === 100 ? currentStreak + 1 : currentStreak;
      streakBadge.innerHTML = `<i data-lucide="flame"></i> ${finalStreak} Day${finalStreak !== 1 ? 's' : ''} Streak`;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }
});
