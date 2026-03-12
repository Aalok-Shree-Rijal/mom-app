let recognition = null;

function setupSpeechRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { alert('Please use Chrome for voice features.'); return null; }
  recognition = new SR();
  recognition.lang = 'ne-NP';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  return recognition;
}

function startListening(onResult, onEnd) {
  if (!recognition) recognition = setupSpeechRecognition();
  if (!recognition) return;
  document.getElementById('micBtn').classList.add('listening');
  document.getElementById('statusBar').textContent = '👂 Listening...';

  recognition.onresult = e => onResult(e.results[0][0].transcript);
  recognition.onend = () => {
    document.getElementById('micBtn').classList.remove('listening');
    if (onEnd) onEnd();
  };
  recognition.onerror = (e) => {
  if (e.error === 'language-not-supported') {
    recognition.lang = 'en-US'; // fallback
    recognition.start();
  } else {
    document.getElementById('micBtn').classList.remove('listening');
    document.getElementById('statusBar').textContent = 'माइक थिचेर फेरि बोल्नुस् 💛';
  }
};
  recognition.start();
}

async function speakWithMyVoice(text) {
  document.getElementById('statusBar').textContent = '💛 बोल्दैछु...';
  
  try {
    const res = await fetch('http://127.0.0.1:5050/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    
    const blob = await res.blob();
    const audio = new Audio(URL.createObjectURL(blob));
    audio.play();
    audio.onended = () => {
      document.getElementById('statusBar').textContent = 'बोल्न माइक थिच्नुस् 🎙️';
    };
  } catch (err) {
    // Fallback to browser TTS
    console.warn('TTS server unavailable, using browser voice:', err);
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
    document.getElementById('statusBar').textContent = 'बोल्न माइक थिच्नुस् 🎙️';
  }
}