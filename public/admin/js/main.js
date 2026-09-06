document.addEventListener('DOMContentLoaded', () => {
  // Mobile Sidebar Toggle
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  window.toggleSidebar = () => {
    if (sidebar) {
      sidebar.classList.toggle('-translate-x-full');
      sidebar.classList.toggle('sidebar-open');
    }
    if (sidebarOverlay) {
      sidebarOverlay.classList.toggle('hidden');
    }
  };

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', window.toggleSidebar);
  }
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', window.toggleSidebar);
  }

  // Dropdown System
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!target) return;

    // Check if clicked inside a dropdown toggle
    const toggleBtn = target.closest('[data-dropdown-toggle]');
    if (toggleBtn) {
      const targetId = toggleBtn.getAttribute('data-dropdown-toggle');
      if (targetId) {
        const dropdownTarget = document.getElementById(targetId);
        if (dropdownTarget) {
          dropdownTarget.classList.toggle('hidden');
        }
      }
    }

    // Close all other dropdowns
    document.querySelectorAll('[data-dropdown-toggle]').forEach((btn) => {
      const tId = btn.getAttribute('data-dropdown-toggle');
      if (tId) {
        const t = document.getElementById(tId);
        if (t && !btn.contains(target) && !t.contains(target)) {
          t.classList.add('hidden');
        }
      }
    });
  });

  // Modal System
  window.openModal = function (id) {
    const modal = document.getElementById(`modal-${id}`);
    if (modal) {
      modal.classList.remove('hidden');
      document.body.classList.add('modal-open');

      // Check if backdrop exists, if not create
      if (!modal.querySelector('.modal-backdrop')) {
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        backdrop.addEventListener('click', () => window.closeModal(id));
        modal.insertBefore(backdrop, modal.firstChild);
      }
    }
  };

  window.closeModal = function (id) {
    const modal = document.getElementById(`modal-${id}`);
    if (modal) {
      modal.classList.add('hidden');
      document.body.classList.remove('modal-open');
    }
  };

  document.querySelectorAll('[data-modal-open]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-modal-open');
      if (id) {
        window.openModal(id);
      }
    });
  });

  document.querySelectorAll('[data-modal-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('[id^="modal-"]');
      if (modal) {
        const id = modal.id.replace('modal-', '');
        window.closeModal(id);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('[id^="modal-"]:not(.hidden)').forEach((modal) => {
        const id = modal.id.replace('modal-', '');
        window.closeModal(id);
      });
    }
  });

  // Toast System
  window.showToast = function (message, type = 'success', duration = 4000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-enter pointer-events-auto flex items-center justify-between p-4 rounded-lg shadow-lg min-w-[250px] glass';

    // Determine colors/icons based on type
    let colorClass = 'border-l-4 ';
    let icon = '';
    switch (type) {
      case 'success':
        colorClass += 'border-green-500 bg-gray-900/90 text-white';
        icon = '✅';
        break;
      case 'error':
        colorClass += 'border-red-500 bg-gray-900/90 text-white';
        icon = '❌';
        break;
      case 'warning':
        colorClass += 'border-yellow-500 bg-gray-900/90 text-white';
        icon = '⚠️';
        break;
      default:
        colorClass += 'border-blue-500 bg-gray-900/90 text-white';
        icon = 'ℹ️';
        break;
    }
    toast.className += ` ${colorClass}`;

    toast.innerHTML = `
      <div class="flex items-center gap-3">
        <span>${icon}</span>
        <span class="text-sm font-medium">${message}</span>
      </div>
      <button type="button" class="text-gray-400 hover:text-white transition-colors" data-toast-close>
        ✕
      </button>
    `;

    const closeBtn = toast.querySelector('[data-toast-close]');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => toast.remove());
    }

    container.appendChild(toast);

    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.classList.replace('toast-enter', 'toast-exit');
        toast.addEventListener('animationend', () => toast.remove());
      }
    }, duration);
  };

  // Mobile Menu Toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
        });
      }
    });
  });
});