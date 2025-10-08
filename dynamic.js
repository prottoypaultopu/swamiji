// ========== Dynamic Content Loader ==========
(function() {
  let contentData = null;
  let currentLang = localStorage.getItem("lang") || "en";

  // Load content from JSON file
  async function loadContent() {
    try {
      const response = await fetch('content.json');
      contentData = await response.json();
      renderContent();
    } catch (error) {
      console.error('Error loading content:', error);
      // Fallback to default content if JSON fails
      renderDefaultContent();
    }
  }

  // Render meetings dynamically
  function renderMeetings() {
    if (!contentData || !contentData.meetings) return;
    
    const container = document.querySelector('.meeting-info');
    if (!container) return;
    
    // Clear existing dynamic meetings (keep the first static one if you want)
    const staticMeetings = container.querySelectorAll('.meeting-item');
    staticMeetings.forEach((item, index) => {
      if (index > 0) item.remove();
    });
    
    contentData.meetings.forEach(meeting => {
      const meetingDiv = document.createElement('div');
      meetingDiv.className = 'meeting-item';
      meetingDiv.style.opacity = '0';
      meetingDiv.style.transform = 'translateY(30px)';
      
      const iconMap = {
        'Sunday': '☀️',
        'Monday': '🌙',
        'Tuesday': '🌟',
        'Wednesday': '📖',
        'Thursday': '🙏',
        'Friday': '👥',
        'Saturday': '⭐',
        'Football': '⚽',
        'Default': '📅'
      };
      
      const icon = iconMap[meeting.title] || iconMap['Default'];
      
      meetingDiv.innerHTML = `
        <div class="meeting-icon">${icon}</div>
        <div class="meeting-content">
          <h3>${currentLang === 'bn' ? meeting.title_bn : meeting.title}</h3>
          <p class="meeting-time"><strong>${currentLang === 'bn' ? 'সময়:' : 'Time:'}</strong> ${currentLang === 'bn' ? meeting.time_bn : meeting.time}</p>
          <p>${currentLang === 'bn' ? meeting.description_bn : meeting.description}</p>
        </div>
      `;
      
      container.appendChild(meetingDiv);
      
      // Animate in
      setTimeout(() => {
        meetingDiv.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        meetingDiv.style.opacity = '1';
        meetingDiv.style.transform = 'translateY(0)';
      }, 100);
    });
  }

  // Render events dynamically
  function renderEvents() {
    if (!contentData || !contentData.events) return;
    
    const container = document.querySelector('.events-grid');
    if (!container) return;
    
    container.innerHTML = contentData.events.map((event, index) => {
      return `
        <div class="event-card" style="animation-delay: ${index * 0.1}s">
          <div class="event-date">${currentLang === 'bn' ? event.date_bn : event.date}</div>
          <div class="event-details">
            <h3>${currentLang === 'bn' ? event.title_bn : event.title}</h3>
            <p>${currentLang === 'bn' ? event.description_bn : event.description}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render gallery dynamically
  function renderGallery() {
    if (!contentData || !contentData.gallery) return;
    
    const container = document.querySelector('.gallery');
    if (!container) return;
    
    container.innerHTML = contentData.gallery.map((item, index) => {
      const hasImage = item.image && !item.image.includes('placeholder');
      
      if (hasImage) {
        return `
          <div class="gallery-item" style="animation-delay: ${index * 0.05}s">
            <img src="${item.image}" alt="${currentLang === 'bn' ? item.title_bn : item.title}" loading="lazy">
            <span style="position: absolute; bottom: 1rem; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.7); padding: 0.5rem 1rem; border-radius: 8px; color: white; font-weight: 600; white-space: nowrap;">
              ${currentLang === 'bn' ? item.title_bn : item.title}
            </span>
          </div>
        `;
      } else {
        return `
          <div class="gallery-item" style="animation-delay: ${index * 0.05}s; background: linear-gradient(135deg, var(--indigo) 0%, var(--purple) 100%);">
            <span style="color: white; font-weight: 600; padding: 1rem; text-align: center;">
              ${currentLang === 'bn' ? item.title_bn : item.title}
            </span>
          </div>
        `;
      }
    }).join('');
  }

  // Update hero background
  function updateHero() {
    if (!contentData || !contentData.hero) return;
    
    const hero = document.querySelector('.hero');
    if (hero && contentData.hero.backgroundImage) {
      const bgImage = contentData.hero.backgroundImage;
      hero.style.backgroundImage = `linear-gradient(135deg, rgba(21,127,173,0.9) 0%, rgba(118,75,162,0.9) 100%), url('${bgImage}')`;
      hero.style.backgroundSize = 'cover';
      hero.style.backgroundPosition = 'center';
      hero.style.backgroundAttachment = 'fixed';
    }
    
    // Update hero text if provided
    if (contentData.hero.title) {
      const heroTitle = hero.querySelector('h1');
      if (heroTitle) heroTitle.textContent = contentData.hero.title;
    }
    
    if (contentData.hero.subtitle) {
      const heroSubtitle = hero.querySelector('.hero-subtitle');
      if (heroSubtitle) heroSubtitle.innerHTML = contentData.hero.subtitle.replace(/\n/g, '<br>');
    }
  }

  // Render default content if JSON fails
  function renderDefaultContent() {
    console.log('Using default content');
    // Default content is already in HTML, so just apply animations
    applyScrollAnimations();
  }

  // Render all dynamic content
  function renderContent() {
    updateHero();
    renderMeetings();
    renderEvents();
    renderGallery();
    
    // Apply scroll animations to new elements
    setTimeout(() => {
      applyScrollAnimations();
    }, 100);
  }

  // Re-apply scroll animations for dynamically added elements
  function applyScrollAnimations() {
    const elements = document.querySelectorAll('.meeting-item, .event-card, .gallery-item');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => {
      if (!el.style.opacity) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      }
      observer.observe(el);
    });
  }

  document.addEventListener('languageChanged', (e) => {
  currentLang = e.detail.lang;
  document.documentElement.setAttribute('data-lang', currentLang);
  renderContent();
});



  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadContent);
  } else {
    loadContent();
  }

  // Expose reload function globally
  window.reloadContent = loadContent;

  // Auto-refresh content every 5 minutes (optional)
  // setInterval(loadContent, 5 * 60 * 1000);
})();

// ========== Gallery Lightbox (Optional Enhancement) ==========
(function() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.gallery-item img')) {
      const img = e.target.closest('.gallery-item img');
      createLightbox(img.src, img.alt);
    }
  });

  function createLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 2rem;
      cursor: pointer;
      animation: fadeIn 0.3s ease;
    `;

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.cssText = `
      max-width: 90%;
      max-height: 90%;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      animation: zoomIn 0.3s ease;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
      position: absolute;
      top: 2rem;
      right: 2rem;
      background: white;
      border: none;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: transform 0.3s ease;
    `;

    closeBtn.onmouseover = () => closeBtn.style.transform = 'scale(1.1) rotate(90deg)';
    closeBtn.onmouseout = () => closeBtn.style.transform = 'scale(1) rotate(0deg)';

    lightbox.appendChild(img);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);

    lightbox.onclick = (e) => {
      if (e.target === lightbox || e.target === closeBtn) {
        lightbox.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => lightbox.remove(), 300);
      }
    };

    // Add animation styles if not already added
    if (!document.getElementById('lightbox-animations')) {
      const style = document.createElement('style');
      style.id = 'lightbox-animations';
      style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes zoomIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
  }
})();