/**
 * Geek Mantra AI - Main Application Logic
 * Interactive Demos, ROI Calculator, Audio Wave Simulation, Chat Playground & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCursorGlow();
  init3DCardTilt();
  initServiceCards();
  initLabTabs();
  initChatDemo();
  initVoiceDemo();
  initRoiCalculator();
  initModal();
  initContactForm();
  initAudioToggle();
  initCopyEmail();
});

/* ==========================================================================
   NAVBAR & SCROLL EFFECTS
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-menu-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      if (window.soundFX) window.soundFX.playClick();
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   CURSOR GLOW FOLLOWER
   ========================================================================== */
function initCursorGlow() {
  const glow = document.querySelector('.cursor-glow');
  if (!glow) return;

  let mouseX = -1000, mouseY = -1000;
  let currentX = -1000, currentY = -1000;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function renderCursor() {
    // Smooth lerp
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;
    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();
}

/* ==========================================================================
   3D HERO CARD TILT EFFECT
   ========================================================================== */
function init3DCardTilt() {
  const card = document.querySelector('.hero-hologram-card');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* ==========================================================================
   INTERACTIVE LAB TABS
   ========================================================================== */
function initLabTabs() {
  const tabBtns = document.querySelectorAll('.lab-tab-btn');
  const views = document.querySelectorAll('.lab-view');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      tabBtns.forEach(b => b.classList.remove('active'));
      views.forEach(v => v.classList.remove('active'));

      btn.classList.add('active');
      const targetView = document.getElementById(targetId);
      if (targetView) targetView.classList.add('active');

      if (window.soundFX) window.soundFX.playClick();
    });
  });
}

/* ==========================================================================
   DEMO 1: AI CHAT ASSISTANT PLAYGROUND
   ========================================================================== */
function initChatDemo() {
  const messagesBox = document.getElementById('chat-messages-container');
  const input = document.getElementById('chat-user-input');
  const sendBtn = document.getElementById('chat-submit-btn');
  const typingIndicator = document.getElementById('chat-typing-indicator');
  const quickPromptBtns = document.querySelectorAll('.quick-prompt-btn');

  if (!messagesBox || !input) return;

  const botResponses = {
    'voice': `🎙️ <strong>Our AI Voice Assistants</strong> operate at sub-450ms human latency. They handle both inbound customer inquiries and outbound follow-ups, handle objection management, and directly book qualified meetings into your CRM (HubSpot, Salesforce, Google Calendar) without human intervention!`,
    'ads': `📈 <strong>Smart Ads Automation:</strong> Geek Mantra AI uses autonomous algorithms to generate high-converting ad variations, continuously optimize audience targeting across Meta & Google Ads, and dynamically scale winning ad sets to maintain 5x+ ROAS.`,
    'integrations': `🌐 <strong>Full Ecosystem Mesh:</strong> We integrate natively with WhatsApp Business API, HubSpot, Shopify, Salesforce, Stripe, Slack, Zapier, Make, and custom REST/GraphQL endpoints. Your data stays synchronized 24/7.`,
    'pricing': `💎 <strong>Flexible AI Growth Packages:</strong> We offer custom tiered setups starting from lightweight chatbot and ads setups up to full autonomous multi-agent pipelines with dedicated voice agents. DM us or book a discovery call to get a tailored blueprint!`,
    'audit': `✨ <strong>Free AI Growth Audit:</strong> We analyze your current conversion funnels, response times, and customer touchpoints to show you exactly where AI automation can unlock an immediate 30-50% revenue boost. Click "Schedule Discovery" above to book!`,
    'default': `🤖 <strong>Geek Mantra AI Agent:</strong> Thank you for reaching out! We engineer custom AI agents that attract, engage, and convert your leads autonomously. Would you like to see how our voice agents or smart chat workflows integrate into your business?`
  };

  function addMessage(text, isUser = false) {
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${isUser ? 'message-user' : 'message-bot'}`;
    bubble.innerHTML = text;
    messagesBox.appendChild(bubble);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    if (window.soundFX) {
      if (isUser) window.soundFX.playBlip(540, 0.05);
      else window.soundFX.playBlip(780, 0.08);
    }
  }

  function handleSend(userText) {
    if (!userText.trim()) return;

    addMessage(userText, true);
    input.value = '';

    // Show typing indicator
    if (typingIndicator) {
      typingIndicator.classList.add('active');
      messagesBox.appendChild(typingIndicator);
      messagesBox.scrollTop = messagesBox.scrollHeight;
    }

    setTimeout(() => {
      if (typingIndicator) typingIndicator.classList.remove('active');

      const lower = userText.toLowerCase();
      let reply = botResponses.default;

      if (lower.includes('voice') || lower.includes('call') || lower.includes('phone')) {
        reply = botResponses.voice;
      } else if (lower.includes('ad') || lower.includes('marketing') || lower.includes('roas') || lower.includes('social')) {
        reply = botResponses.ads;
      } else if (lower.includes('whatsapp') || lower.includes('hubspot') || lower.includes('shopify') || lower.includes('integrate')) {
        reply = botResponses.integrations;
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('package')) {
        reply = botResponses.pricing;
      } else if (lower.includes('audit') || lower.includes('book') || lower.includes('meeting') || lower.includes('consult')) {
        reply = botResponses.audit;
      }

      addMessage(reply, false);
    }, 800);
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', () => handleSend(input.value));
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend(input.value);
    }
  });

  quickPromptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.textContent.trim();
      handleSend(prompt);
    });
  });
}

/* ==========================================================================
   DEMO 2: AI VOICE ASSISTANT SIMULATOR
   ========================================================================== */
function initVoiceDemo() {
  const canvas = document.getElementById('voice-wave-canvas');
  const triggerBtn = document.getElementById('voice-trigger-btn');
  const transcriptBox = document.getElementById('voice-transcript-box');
  const statusText = document.getElementById('voice-status-text');
  const personaBtns = document.querySelectorAll('.persona-btn');

  if (!canvas || !triggerBtn) return;

  const ctx = canvas.getContext('2d');
  let isCalling = false;
  let animId = null;
  let persona = 'Alex (Sales Closer)';

  // Persona dialogues
  const dialogues = {
    'Alex (Sales Closer)': [
      "Alex: 'Hey there! This is Alex from Geek Mantra AI. I noticed you were exploring our automated growth workflows.'",
      "Customer: 'Yes! How quickly can your voice agents be integrated with our CRM?'",
      "Alex: 'Usually under 48 hours. We sync directly with HubSpot or Salesforce and qualify every inbound call with sub-450ms latency.'",
      "Customer: 'That sounds incredible. Can you schedule a demo for Thursday?'",
      "Alex: 'Done! I've sent a calendar invite for 2 PM Thursday to your email. Talk soon!'"
    ],
    'Maya (24/7 Concierge)': [
      "Maya: 'Hi! Welcome to Geek Mantra Concierge. How may I assist your business today?'",
      "Customer: 'Do your agents handle multilingual support for global ecommerce?'",
      "Maya: 'Absolutely! Our voice and chat models seamlessly support over 42 languages with natural native inflections.'",
      "Customer: 'Great, can you sync with our Shopify inventory?'",
      "Maya: 'Yes, inventory queries, order tracking, and refund workflows are 100% automated!'"
    ],
    'Liam (Lead Qualifier)': [
      "Liam: 'Hello! Liam here from Geek Mantra AI. Quick question — what is your current monthly inbound lead volume?'",
      "Customer: 'We are generating around 2,500 leads a month, but response times are slow.'",
      "Liam: 'Got it. With our 60-second instant voice callback, clients typically see conversion rates jump by 48%.'",
      "Customer: 'Let us try it out.'",
      "Liam: 'Fantastic. Transferring your profile to our onboarding engineer right now!'"
    ]
  };

  personaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      personaBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      persona = btn.getAttribute('data-persona') || btn.textContent.trim();
      if (window.soundFX) window.soundFX.playClick();
      if (isCalling) {
        stopCall();
        startCall();
      }
    });
  });

  function drawWave(active) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    const bars = 48;
    const barWidth = width / bars - 2;

    const time = performance.now() * 0.005;

    for (let i = 0; i < bars; i++) {
      let amp = 6;
      if (active) {
        amp = 10 + 35 * Math.abs(Math.sin(time + i * 0.28) * Math.cos(time * 0.7 + i * 0.15));
      } else {
        amp = 4 + 4 * Math.sin(time + i * 0.2);
      }

      const grad = ctx.createLinearGradient(0, centerY - amp, 0, centerY + amp);
      grad.addColorStop(0, '#00f0ff');
      grad.addColorStop(1, '#a855f7');

      ctx.fillStyle = grad;
      ctx.fillRect(i * (barWidth + 2), centerY - amp, barWidth, amp * 2);
    }

    animId = requestAnimationFrame(() => drawWave(isCalling));
  }

  drawWave(false);

  let dialogueTimeout = null;

  function startCall() {
    isCalling = true;
    triggerBtn.classList.add('active');
    triggerBtn.innerHTML = '📞';
    statusText.textContent = `CALL IN PROGRESS • ${persona.toUpperCase()}`;
    statusText.style.color = '#ef4444';

    if (window.soundFX) window.soundFX.playSuccess();

    // Stream dialogue
    const lines = dialogues[persona] || dialogues['Alex (Sales Closer)'];
    let lineIdx = 0;

    transcriptBox.innerHTML = `<em>Connecting secure AI voice stream...</em>`;

    function stepDialogue() {
      if (!isCalling) return;
      if (lineIdx < lines.length) {
        transcriptBox.innerHTML = `<strong>${lines[lineIdx]}</strong>`;
        if (window.soundFX) window.soundFX.playBlip(620 + lineIdx * 40, 0.08);
        lineIdx++;
        dialogueTimeout = setTimeout(stepDialogue, 2400);
      } else {
        transcriptBox.innerHTML = `<em>Call concluded with AI agent. Ready for next simulation.</em>`;
        setTimeout(stopCall, 2000);
      }
    }

    dialogueTimeout = setTimeout(stepDialogue, 1000);
  }

  function stopCall() {
    isCalling = false;
    triggerBtn.classList.remove('active');
    triggerBtn.innerHTML = '🎙️';
    statusText.textContent = 'READY TO DEMO VOICE AGENT';
    statusText.style.color = 'var(--cyan-primary)';
    if (dialogueTimeout) clearTimeout(dialogueTimeout);
    transcriptBox.innerHTML = `<em>Click the microphone button to test live speech simulation.</em>`;
  }

  triggerBtn.addEventListener('click', () => {
    if (isCalling) stopCall();
    else startCall();
  });
}

/* ==========================================================================
   ROI & GROWTH CALCULATOR
   ========================================================================== */
function initRoiCalculator() {
  const visitorsSlider = document.getElementById('calc-visitors');
  const conversionSlider = document.getElementById('calc-conversion');
  const dealValueSlider = document.getElementById('calc-deal-value');

  const visitorsVal = document.getElementById('calc-visitors-val');
  const conversionVal = document.getElementById('calc-conversion-val');
  const dealValueVal = document.getElementById('calc-deal-value-val');

  const revenueBoostEl = document.getElementById('calc-revenue-boost');
  const extraLeadsEl = document.getElementById('calc-extra-leads');
  const hoursSavedEl = document.getElementById('calc-hours-saved');

  if (!visitorsSlider || !conversionSlider || !dealValueSlider) return;

  function updateCalculations() {
    const visitors = parseInt(visitorsSlider.value, 10);
    const conv = parseFloat(conversionSlider.value);
    const dealVal = parseInt(dealValueSlider.value, 10);

    visitorsVal.textContent = visitors.toLocaleString() + ' /mo';
    conversionVal.textContent = conv.toFixed(1) + '%';
    dealValueVal.textContent = '$' + dealVal.toLocaleString();

    // AI uplift logic:
    // With Geek Mantra 24/7 instant chat, voice, and automated ads,
    // conversion typically increases by +45% (e.g., 2% -> 2.9%)
    const currentLeads = visitors * (conv / 100);
    const aiConversionMultiplier = 1.48; // +48% increase
    const newLeads = visitors * ((conv * aiConversionMultiplier) / 100);
    const extraLeads = Math.round(newLeads - currentLeads);

    const extraRevenue = Math.round(extraLeads * dealVal);
    const hoursSaved = Math.round(Math.min(520, visitors * 0.015 + extraLeads * 1.2));

    revenueBoostEl.textContent = '+$' + extraRevenue.toLocaleString() + ' /mo';
    extraLeadsEl.textContent = '+' + extraLeads.toLocaleString();
    hoursSavedEl.textContent = hoursSaved.toLocaleString() + ' hrs';
  }

  visitorsSlider.addEventListener('input', () => {
    updateCalculations();
    if (window.soundFX) window.soundFX.playBlip(480, 0.02);
  });

  conversionSlider.addEventListener('input', () => {
    updateCalculations();
    if (window.soundFX) window.soundFX.playBlip(560, 0.02);
  });

  dealValueSlider.addEventListener('input', () => {
    updateCalculations();
    if (window.soundFX) window.soundFX.playBlip(640, 0.02);
  });

  updateCalculations();
}

/* ==========================================================================
   MODAL DIALOG
   ========================================================================== */
/* ==========================================================================
   HIGHLIGHTED SERVICES CARDS & FILTERS
   ========================================================================== */
function initServiceCards() {
  const cards = document.querySelectorAll('.service-card');
  const filterBtns = document.querySelectorAll('.service-filter-btn');

  // 1. Dynamic Cursor Spotlight Effect on every Card
  cards.forEach(card => {
    const cardLink = card.querySelector('.service-btn-primary[href]');

    if (card.hasAttribute('data-card-link') && cardLink) {
      card.addEventListener('click', (event) => {
        if (event.target.closest('a, button, input, select, textarea')) return;
        cardLink.click();
      });

      card.addEventListener('keydown', (event) => {
        if (event.target !== card || (event.key !== 'Enter' && event.key !== ' ')) return;
        event.preventDefault();
        cardLink.click();
      });
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '0%');
    });
  });

  // 2. Category Filtering with Smooth Transition
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetFilter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (targetFilter === 'all' || cat === targetFilter) {
          card.classList.remove('is-hidden');
          card.style.animation = 'fadeInView 0.35s ease';
        } else {
          card.classList.add('is-hidden');
        }
      });

      if (window.soundFX) window.soundFX.playClick();
    });
  });
}

/* ==========================================================================
   MODAL DIALOG
   ========================================================================== */
function initModal() {
  const modal = document.getElementById('discovery-modal');
  const openBtns = document.querySelectorAll('.open-discovery-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!modal) return;

  function openModal(servicePreselect) {
    if (servicePreselect) {
      const selects = modal.querySelectorAll('select');
      selects.forEach(select => {
        if (select.querySelector(`option[value="${servicePreselect}"]`)) {
          select.value = servicePreselect;
        }
      });
    }

    modal.classList.add('open');
    if (window.soundFX) window.soundFX.playClick();
  }

  function closeModal() {
    modal.classList.remove('open');
    if (window.soundFX) window.soundFX.playClick();
  }

  openBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    const service = btn.getAttribute('data-select-service');
    openModal(service);
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   CONTACT FORM & TOAST NOTIFICATION
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;

  toast.innerHTML = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

function initContactForm() {
  const forms = document.querySelectorAll('.enquiry-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Sending Magic... ✨';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '✓ Sent Successfully!';
        if (window.soundFX) window.soundFX.playSuccess();

        showToast('✨ Enquiry received! Our AI Growth team will contact you in &lt;15 mins.');
        form.reset();

        // Close modal if form is inside modal
        const parentModal = form.closest('.modal-overlay');
        if (parentModal) {
          setTimeout(() => parentModal.classList.remove('open'), 1200);
        }

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }, 3000);
      }, 1000);
    });
  });
}

/* ==========================================================================
   AUDIO FX TOGGLE BUTTON
   ========================================================================== */
function initAudioToggle() {
  const toggleBtn = document.getElementById('audio-toggle-btn');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (!window.soundFX) return;
    const enabled = window.soundFX.toggle();
    if (enabled) {
      toggleBtn.classList.add('active');
      toggleBtn.innerHTML = '🔊';
      showToast('🔊 Cyber Sound FX Enabled');
    } else {
      toggleBtn.classList.remove('active');
      toggleBtn.innerHTML = '🔈';
      showToast('🔈 Audio Muted');
    }
  });
}

/* ==========================================================================
   COPY EMAIL TO CLIPBOARD
   ========================================================================== */
function initCopyEmail() {
  const copyBtns = document.querySelectorAll('.copy-email-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'customer.support@geekmantra.com';
      navigator.clipboard.writeText(email).then(() => {
        if (window.soundFX) window.soundFX.playChime();
        showToast('📋 Copied customer.support@geekmantra.com to clipboard!');
      }).catch(() => {
        window.location.href = `mailto:${email}`;
      });
    });
  });
}

