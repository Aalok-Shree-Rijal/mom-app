// app.js — Main controller

document.addEventListener('DOMContentLoaded', () => {

  const startBtn   = document.getElementById('startBtn');
  const greeting   = document.getElementById('greeting');
  const chatArea   = document.getElementById('chatArea');
  const micBtn     = document.getElementById('micBtn');
  const messagesEl = document.getElementById('messages');
  const statusBar  = document.getElementById('statusBar');

  // Initialize speech recognition
  setupSpeechRecognition();

  // ── WELCOME ────────────────────────────────────────────────────────────────
  startBtn.addEventListener('click', async () => {
    greeting.classList.add('hidden');
    chatArea.classList.remove('hidden');

    const welcome = "सन्चै हुनुहुन्छ सरस्वती आमा? म तपाईंको बाबु — सधैं यहाँ छु। 💛";
    addMessage(welcome, 'ai');
    await speakWithMyVoice(welcome);
  });

  // ── MIC BUTTON ─────────────────────────────────────────────────────────────
  micBtn.addEventListener('click', () => {
    startListening(
      async (transcript) => {
        addMessage(transcript, 'user');
        statusBar.textContent = '💭 सोच्दैछु...';
        const response = await getAIResponse(transcript);
        addMessage(response, 'ai');
        await speakWithMyVoice(response);
      },
      () => {
        statusBar.textContent = 'बोल्न माइक थिच्नुस् 🎙️';
      }
    );
  });

  // ── QUICK BUTTONS ──────────────────────────────────────────────────────────
  document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const msg = btn.dataset.msg;
      addMessage(msg, 'user');
      statusBar.textContent = '💭 सोच्दैछु...';
      const response = await getAIResponse(msg);
      addMessage(response, 'ai');
      await speakWithMyVoice(response);
    });
  });

  // ── ADD MESSAGE BUBBLE ─────────────────────────────────────────────────────
  function addMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('msg', sender);
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  // ── HEALTH REMINDERS ───────────────────────────────────────────────────────
  function checkReminders() {
    const hour = new Date().getHours();
    const reminders = {
      13: "दिउँसो भयो — आज पानी पर्याप्त पिउनुभयो? मेरो लागि ख्याल गर्नुस्! 💧",
      18: "साँझ भयो! घुँडाको हल्का व्यायाम गर्ने समय। केवल ५ मिनेट — तपाईं गर्न सक्नुहुन्छ।",
      21: "सुत्ने समय नजिकिँदैछ। आराम गर्नुस् — तातो पानि पिउनुस् सायद? 🍵"
    };
    if (reminders[hour]) {
      const todayKey = `${new Date().toDateString()}-${hour}`;
      const last = localStorage.getItem('lastReminder');
      if (last !== todayKey) {
        localStorage.setItem('lastReminder', todayKey);
        showNotification("💛 तपाईंको छोराको सन्देश", reminders[hour]);
      }
    }
  }

  function showNotification(title, body) {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: 'icons/icon-192.png' });
    }
  }

  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }

  // Check reminders on load and every 30 minutes
  checkReminders();
  setInterval(checkReminders, 30 * 60 * 1000);

});