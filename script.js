// ========== Smooth Scrolling ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile menu if open
      const menu = document.getElementById('primary-menu');
      if (menu.classList.contains('nav__open')) {
        menu.classList.remove('nav__open');
        document.querySelector('.nav__toggle').setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// ========== Mobile Navigation ==========
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('primary-menu');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('nav__open');
    
    // Animate hamburger
    const hamburger = toggle.querySelector('.nav__hamburger');
    hamburger.style.transform = expanded ? 'rotate(0deg)' : 'rotate(90deg)';
  });
}

// ========== Active Link Highlighting ==========
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const observerOptions = {
  threshold: 0.3,
  rootMargin: '-80px 0px -40% 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
      });
    }
  });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

// ========== Scroll Progress Bar ==========
const scrollProgress = document.querySelector('.scroll-progress');

window.addEventListener('scroll', () => {
  const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (window.scrollY / windowHeight) * 100;
  scrollProgress.style.width = scrolled + '%';
});

// ========== Back to Top Button ==========
const backToTopBtn = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========== Section Scroll Animations ==========
const animatedSections = document.querySelectorAll('.section-animate');

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      animationObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

animatedSections.forEach(section => animationObserver.observe(section));

// ========== Card Animations ==========
const animateElements = document.querySelectorAll('.goal-card, .event-card, .meeting-item, .contact-card, .gallery-item');

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, index * 100);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

animateElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  cardObserver.observe(el);
});

// ========== Current Year ==========
document.getElementById('year').textContent = new Date().getFullYear();

// ========== EmailJS Configuration ==========
const EMAILJS_CONFIG = {
  serviceID: 'service_nuyvv1s',
  templateID: 'template_1h93lcp',
  publicKey: 'yJsmHsAxGXBt04WXi'
};

// Load EmailJS SDK
(function() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
  script.onload = function() {
    emailjs.init(EMAILJS_CONFIG.publicKey);
  };
  document.head.appendChild(script);
})();

// ========== Contact Form Handler ==========
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector(".submit-btn");
  const originalText = btn.textContent;

  // Disable button and show loading state
  btn.disabled = true;
  btn.textContent = "Sending...";
  btn.style.opacity = "0.7";

  // Get form data
  const templateParams = {
    from_name: form.name.value,
    from_email: form.email.value,
    subject: form.subject.value,
    message: form.message.value,
    to_email: 'prottoypaul77@gmail.com'
  };

  // Send email using EmailJS
  emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, templateParams)
    .then(function(response) {
      console.log('SUCCESS!', response.status, response.text);
      
      // Success feedback
      btn.textContent = "✓ Message Sent!";
      btn.style.background = "#10b981";
      btn.style.opacity = "1";
      
      // Reset form
      form.reset();
      
      // Show success notification
      showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
      
      // Reset button after 3 seconds
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "";
        btn.disabled = false;
      }, 3000);
    })
    .catch(function(error) {
      console.error('FAILED...', error);
      
      // Error feedback
      btn.textContent = "✗ Failed to Send";
      btn.style.background = "#ef4444";
      btn.style.opacity = "1";
      
      // Show error notification
      showNotification('Failed to send message. Please try again or contact us directly.', 'error');
      
      // Reset button after 3 seconds
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "";
        btn.disabled = false;
        btn.style.opacity = "1";
      }, 3000);
    });
}

// ========== Notification System ==========
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 1.25rem 1.75rem;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideInRight 0.4s ease-out;
    max-width: 400px;
    font-weight: 500;
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.4s ease-out';
    setTimeout(() => notification.remove(), 400);
  }, 5000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`;
document.head.appendChild(style);

const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", handleSubmit);
}

// ========== Internationalization (i18n) ==========
(function(){
  const dict = {
    en: {
      "site.title":"VIVEK",
      "skip":"Skip to content",
      "nav.home":"Home","nav.about":"About","nav.meetings":"Meetings","nav.events":"Events",
      "nav.scholarship":"Scholarship","nav.gallery":"Gallery","nav.contact":"Contact",
      "hero.badge":"Vivekananda Vedanta Centre",
      "hero.title":"VIVEK",
      "hero.subtitle":"Vivekananda Vedanta Centre<br>Born to be good, to do good.",
      "about.badge":"Who We Are",
      "about.heading":"About Us",
      "about.lead":"Vivekananda Vedanta Centre is dedicated to spiritual growth, meaningful relationships, and compassionate service to humanity.",
      "about.worship.title":"Worship Together",
      "about.worship.body":"Inspirational worship will strengthen your faith. Together we celebrate, pray, and draw closer to God and each other.",
      "about.fellowship.title":"Fellowship & Growth",
      "about.fellowship.body":"Build lasting relationships through study groups, spiritual discussions, and community events. We believe in walking together on our spiritual journey.",
      "about.service.title":"Serve with Love",
      "about.service.body":"Make a difference through outreach programs, volunteer opportunities, and acts of compassion that reflect universal love.",
      "meetings.badge":"Join Us",
      "meetings.heading":"Our Meetings",
      "label.time":"Time:",
      "meetings.sun.title":"Sunday Worship Service",
      "meetings.sun.time":"10:00 AM - 11:00 AM",
      "meetings.sun.body":"Join us for our main worship service with inspiring messages, uplifting music, and fellowship.",
      "events.badge":"What's Happening",
      "events.heading":"Upcoming Events",
      "scholarship.heading":"Scholarship Program",
      "scholarship.subhead":"Empowering Future Leaders",
      "scholarship.p1":"Our scholarship program supports promising students who demonstrate academic excellence, leadership potential, and commitment to service.",
      "scholarship.amount.label":"Award Amount:",
      "scholarship.amount.value":"Up to ---- BDT per academic year",
      "scholarship.deadline.label":"Application Deadline:",
      "scholarship.deadline.value":"------",
      "scholarship.apply":"Apply Now",
      "scholarship.alert":"Application portal opening soon! Check back in January 2026.",
      "gallery.badge":"Memories",
      "gallery.heading":"Gallery",
      "contact.badge":"Get in Touch",
      "contact.heading":"Contact Us",
      "contact.name":"Name","contact.email":"Email","contact.subject":"Subject","contact.message":"Message",
      "contact.name_ph":"Your full name","contact.email_ph":"your.email@example.com",
      "contact.subject_ph":"How can we help you?","contact.message_ph":"Tell us more...",
      "contact.send":"Send Message",
      "contact.visit.title":"Visit Us","contact.visit.addr":"Local office<br>Dhaka, Bangladesh",
      "contact.call.title":"Call Us","contact.call.num":"xxxxxxxxx",
      "contact.email.title":"Email Us","contact.email.addr":"xxxxxxxxxxxx",
      "contact.hours.title":"Office Hours","contact.hours.value":"xxxxxx<br>xxxxxxx am",
      "footer.brand":"VIVEK","footer.tag":"Growing together in faith and love",
      "footer.quick":"Quick Links","footer.getinvolved":"Get Involved","footer.connect":"Connect",
      "footer.copyright.name":"VIVEK","footer.copyright":"All rights reserved.","footer.built":"Built with love and faith."
    },
    bn: {
      "site.title":"বিবেক",
      "skip":"মূল কন্টেন্টে যান",
      "nav.home":"হোম","nav.about":"আমাদের সম্পর্কে","nav.meetings":"সভা","nav.events":"ইভেন্ট",
      "nav.scholarship":"স্কলারশিপ","nav.gallery":"গ্যালারি","nav.contact":"যোগাযোগ",
      "hero.badge":"বিবেকানন্দ বেদান্ত কেন্দ্র",
      "hero.title":"বিবেক",
      "hero.subtitle":"বিবেকানন্দ বেদান্ত কেন্দ্র<br>ভালো থাকার জন্য, ভালো করার জন্য জন্ম।",
      "about.badge":"আমরা কারা",
      "about.heading":"আমাদের সম্পর্কে",
      "about.lead":"বিবেক আধ্যাত্মিক বিকাশ, অর্থবহ সম্পর্ক এবং সহমমির্তার সঙ্গে সমাজের সেবা দেওয়ার জন্য অঙ্গীকারবদ্ধ।",
      "about.worship.title":"একসাথে উপাসনা",
      "about.worship.body":"উদ্দীপনামযয় উপাসনা আপনার বিশ্বাসকে দৃঢ় করবে। আমরা একসাথে উদযাপন করি, প্রার্থনা করি এবং ঈশ্বর ও একে অপরের কাছাকাছি হই।",
      "about.fellowship.title":"সখ্যতা ও বিকাশ",
      "about.fellowship.body":"ছোট ছোট গ্রুপ, বিবেকানন্দ স্টাডি ও সম্প্রীতির মাধ্যমে দীর্ঘস্থায়ী সম্পর্ক গড়ে তুলুন।",
      "about.service.title":"ভালবাসায় সেবা",
      "about.service.body":"স্বেচ্ছাসেবা ও সহমমির্তার কাজের মাধ্যমে আমাদের কমিউনিটিতে পরিবর্তন আনুন।",
      "meetings.badge":"আমাদের সাথে যোগ দিন",
      "meetings.heading":"আমাদের সভা",
      "label.time":"সময়:",
      "meetings.sun.title":"রবিবারের উপাসনা",
      "meetings.sun.time":"১০:০০ পূর্বাহ্ণ - ১১:০০ পূর্বাহ্ণ",
      "meetings.sun.body":"প্রেরণাদায়ক বার্তা, সঙ্গীত ও মিলনমেলায় ভরা প্রধান উপাসনায় যোগ দিন।",
      "events.badge":"কী ঘটছে",
      "events.heading":"আসন্ন ইভেন্ট",
      "scholarship.heading":"বিবেক বৃত্তি",
      "scholarship.subhead":"ভবিষ্যৎ নেতাদের ক্ষমতায়ন",
      "scholarship.p1":"আমাদের স্কলারশিপ কমিউনিটির মেধাবী শিক্ষার্থীদের সহায়তা করে যারা পড়াশোনায় সাফল্য, নেতৃত্বের সম্ভাবনা ও সেবার মনোভাব দেখায়।",
      "scholarship.amount.label":"পুরস্কারের পরিমাণ:",
      "scholarship.amount.value":"প্রতি academic বর্ষে সর্বোচ্চ -----",
      "scholarship.deadline.label":"আবেদনের শেষ তারিখ:",
      "scholarship.deadline.value":"---------",
      "scholarship.apply":"এখনই আবেদন করুন",
      "scholarship.alert":"আবেদন পোর্টাল শীঘ্রই খোলা হবে! ২০২৬ জানুয়ারিতে দেখে নিন।",
      "gallery.badge":"স্মৃতি",
      "gallery.heading":"গ্যালারি",
      "contact.badge":"যোগাযোগ করুন",
      "contact.heading":"যোগাযোগ করুন",
      "contact.name":"নাম","contact.email":"ইমেইল","contact.subject":"বিষয়","contact.message":"বার্তা",
      "contact.name_ph":"আপনার পূর্ণ নাম","contact.email_ph":"your.email@example.com",
      "contact.subject_ph":"আমরা কীভাবে সাহায্য করতে পারি?","contact.message_ph":"আরো জানান...",
      "contact.send":"বার্তা পাঠান",
      "contact.visit.title":"আমাদের ঠিকানা","contact.visit.addr":"ঠিকানা<br>ঢাকা, বাংলাদেশ",
      "contact.call.title":"ফোন","contact.call.num":"+৮৮০ xxxxxxxxx",
      "contact.email.title":"ইমেইল","contact.email.addr":"xxxxxxxxxxx",
      "contact.hours.title":"অফিস সময়","contact.hours.value":"দিন<br> সময়",
      "footer.brand":"বিবেক","footer.tag":"বিশ্বাস ও ভালবাসায় একসাথে বেড়ে উঠি",
      "footer.quick":"দ্রুত লিংক","footer.getinvolved":"যুক্ত হোন","footer.connect":"কানেক্ট",
      "footer.copyright.name":"বিবেক","footer.copyright":"সমস্ত অধিকার সংরক্ষিত।","footer.built":"ভালবাসা ও বিশ্বাসে নির্মিত।"
    }
  };

  function applyI18n(lang){
    const t = (key)=> (dict[lang] && dict[lang][key]) || key;
    
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const key = el.getAttribute("data-i18n");
      const val = t(key);
      if(val){
        if(el.tagName === "INPUT" || el.tagName === "TEXTAREA"){
          // Don't change input values, only placeholders
        } else {
          el.innerHTML = val;
        }
      }
    });
    
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{
      const key = el.getAttribute("data-i18n-placeholder");
      const val = t(key);
      if(val) el.setAttribute("placeholder", val);
    });
    
    document.documentElement.setAttribute("lang", lang === "bn" ? "bn" : "en");
    document.documentElement.setAttribute("data-lang", lang);
    localStorage.setItem("lang", lang);
    
    // Trigger custom event for dynamic content
    const event = new CustomEvent('languageChanged', { 
      detail: { lang: lang } 
    });
    document.dispatchEvent(event);
  }

  function setupSwitcher(){
    const sel = document.getElementById("lang");
    if(!sel) return;
    const saved = localStorage.getItem("lang") || "en";
    sel.value = saved;
    applyI18n(saved);
    sel.addEventListener("change", ()=> applyI18n(sel.value));
  }

  // Expose translation function globally
  window.__i18n = {
    t:(k)=>{
      const lang = localStorage.getItem("lang") || "en";
      return (dict[lang] && dict[lang][k]) || k;
    }
  };

  document.addEventListener("DOMContentLoaded", setupSwitcher);
})();

// ========== Parallax Effect on Hero ==========
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const hero = document.querySelector('.hero');
  if (hero && scrolled < window.innerHeight) {
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    hero.style.opacity = 1 - (scrolled / window.innerHeight);
  }
});

// ========== Loading Animation ==========
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

// ========== Console Message ==========
console.log('%c🕉️ VIVEK - Vivekananda Vedanta Centre', 'font-size: 20px; font-weight: bold; color: #157fad;');
console.log('%cBorn to be good, to do good.', 'font-size: 14px; color: #764ba2;');
console.log('%cWebsite built with ❤️', 'font-size: 12px; color: #666;');